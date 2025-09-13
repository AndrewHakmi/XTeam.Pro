from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid

from database.config import get_async_db
from models.admin import AdminUser, AuditConfiguration
from models.audit import Audit, AuditResult
from models.contact import ContactInquiry
from models.blog import BlogPost
from services.auth_service import AuthService
from services.analytics_service import AnalyticsService

router = APIRouter(tags=["admin"])
security = HTTPBearer()

# Pydantic models for request/response
class AdminLoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user_info: Dict[str, Any]

class AdminUserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    last_login: Optional[datetime]
    created_at: datetime

class AuditConfigurationRequest(BaseModel):
    ai_model: str = Field(..., max_length=50)
    analysis_depth: str = Field(..., max_length=20)  # basic, standard, comprehensive
    include_roi_analysis: bool = Field(True)
    include_risk_assessment: bool = Field(True)
    include_implementation_roadmap: bool = Field(True)
    pdf_template: str = Field(..., max_length=50)
    auto_generate_pdf: bool = Field(True)
    notification_settings: Dict[str, bool] = Field(default_factory=dict)
    custom_prompts: Optional[Dict[str, str]] = Field(None)

class DashboardStatsResponse(BaseModel):
    total_audits: int
    audits_this_month: int
    total_contacts: int
    contacts_this_month: int
    total_blog_posts: int
    published_posts: int
    average_audit_score: float
    conversion_rate: float
    recent_activities: List[Dict[str, Any]]

class AuditManagementResponse(BaseModel):
    audit_id: str
    company_name: str
    status: str
    maturity_score: Optional[int]
    created_at: datetime
    contact_email: str
    industry: str

# Authentication dependency
async def get_current_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_db)
) -> AdminUser:
    """
    Verify JWT token and return current admin user
    """
    auth_service = AuthService()
    try:
        payload = auth_service.verify_token(credentials.credentials)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        user = await db.get(AdminUser, user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(
    login_data: AdminLoginRequest,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Admin user login
    """
    try:
        auth_service = AuthService()
        
        # Find user by username
        query = select(AdminUser).where(AdminUser.username == login_data.username)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        
        if not user or not auth_service.verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is disabled"
            )
        
        # Update last login
        user.last_login = datetime.utcnow()
        await db.commit()
        
        # Generate JWT token
        access_token = auth_service.create_access_token(
            data={"sub": user.id, "username": user.username, "role": user.role}
        )
        
        return AdminLoginResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=3600,  # 1 hour
            user_info={
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/dashboard", response_model=DashboardStatsResponse)
async def get_dashboard_stats(
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get dashboard statistics
    """
    try:
        analytics_service = AnalyticsService(db)
        
        # Calculate date ranges
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Get audit statistics
        total_audits_query = select(func.count(Audit.id))
        total_audits_result = await db.execute(total_audits_query)
        total_audits = total_audits_result.scalar()
        
        audits_this_month_query = select(func.count(Audit.id)).where(Audit.created_at >= month_start)
        audits_this_month_result = await db.execute(audits_this_month_query)
        audits_this_month = audits_this_month_result.scalar()
        
        # Get contact statistics
        total_contacts_query = select(func.count(ContactInquiry.id))
        total_contacts_result = await db.execute(total_contacts_query)
        total_contacts = total_contacts_result.scalar()
        
        contacts_this_month_query = select(func.count(ContactInquiry.id)).where(ContactInquiry.created_at >= month_start)
        contacts_this_month_result = await db.execute(contacts_this_month_query)
        contacts_this_month = contacts_this_month_result.scalar()
        
        # Get blog statistics
        total_blog_posts_query = select(func.count(BlogPost.id))
        total_blog_posts_result = await db.execute(total_blog_posts_query)
        total_blog_posts = total_blog_posts_result.scalar()
        
        published_posts_query = select(func.count(BlogPost.id)).where(BlogPost.status == "published")
        published_posts_result = await db.execute(published_posts_query)
        published_posts = published_posts_result.scalar()
        
        # Calculate average audit score
        avg_score_query = select(func.avg(AuditResult.maturity_score))
        avg_score_result = await db.execute(avg_score_query)
        average_audit_score = avg_score_result.scalar() or 0
        
        # Calculate conversion rate (audits to contacts)
        conversion_rate = (total_contacts / total_audits * 100) if total_audits > 0 else 0
        
        # Get recent activities
        recent_activities = await analytics_service.get_recent_activities(limit=10)
        
        return DashboardStatsResponse(
            total_audits=total_audits,
            audits_this_month=audits_this_month,
            total_contacts=total_contacts,
            contacts_this_month=contacts_this_month,
            total_blog_posts=total_blog_posts,
            published_posts=published_posts,
            average_audit_score=round(average_audit_score, 1),
            conversion_rate=round(conversion_rate, 2),
            recent_activities=recent_activities
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard stats: {str(e)}"
        )

@router.get("/audits", response_model=List[AuditManagementResponse])
async def get_audits_management(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get audits for management with filtering and search
    """
    try:
        query = select(Audit)
        
        # Apply filters
        if status_filter:
            query = query.where(Audit.status == status_filter)
        
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Audit.company_name.ilike(search_term),
                    Audit.contact_email.ilike(search_term),
                    Audit.industry.ilike(search_term)
                )
            )
        
        query = query.offset(skip).limit(limit).order_by(Audit.created_at.desc())
        
        result = await db.execute(query)
        audits = result.scalars().all()
        
        # Get audit results for maturity scores
        audit_results = {}
        if audits:
            audit_ids = [audit.id for audit in audits]
            results_query = select(AuditResult).where(AuditResult.audit_id.in_(audit_ids))
            results_result = await db.execute(results_query)
            for result in results_result.scalars().all():
                audit_results[result.audit_id] = result.maturity_score
        
        return [
            AuditManagementResponse(
                audit_id=audit.id,
                company_name=audit.company_name,
                status=audit.status,
                maturity_score=audit_results.get(audit.id),
                created_at=audit.created_at,
                contact_email=audit.contact_email,
                industry=audit.industry
            )
            for audit in audits
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get audits: {str(e)}"
        )

@router.get("/contacts")
async def get_contacts_management(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    inquiry_type_filter: Optional[str] = Query(None),
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get contact inquiries for management
    """
    try:
        query = select(ContactInquiry)
        
        if status_filter:
            query = query.where(ContactInquiry.status == status_filter)
        
        if inquiry_type_filter:
            query = query.where(ContactInquiry.inquiry_type == inquiry_type_filter)
        
        query = query.offset(skip).limit(limit).order_by(ContactInquiry.created_at.desc())
        
        result = await db.execute(query)
        contacts = result.scalars().all()
        
        return [
            {
                "inquiry_id": contact.id,
                "name": contact.name,
                "email": contact.email,
                "company": contact.company,
                "inquiry_type": contact.inquiry_type,
                "subject": contact.subject,
                "status": contact.status,
                "priority": contact.priority,
                "created_at": contact.created_at,
                "response_sent": contact.response_sent
            }
            for contact in contacts
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get contacts: {str(e)}"
        )

@router.get("/configuration")
async def get_audit_configuration(
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get current audit configuration
    """
    try:
        query = select(AuditConfiguration).where(AuditConfiguration.is_active == True)
        result = await db.execute(query)
        config = result.scalar_one_or_none()
        
        if not config:
            # Return default configuration
            return {
                "ai_model": "gpt-4",
                "analysis_depth": "standard",
                "include_roi_analysis": True,
                "include_risk_assessment": True,
                "include_implementation_roadmap": True,
                "pdf_template": "default",
                "auto_generate_pdf": True,
                "notification_settings": {
                    "email_on_completion": True,
                    "slack_notifications": False
                }
            }
        
        return {
            "ai_model": config.ai_model,
            "analysis_depth": config.analysis_depth,
            "include_roi_analysis": config.include_roi_analysis,
            "include_risk_assessment": config.include_risk_assessment,
            "include_implementation_roadmap": config.include_implementation_roadmap,
            "pdf_template": config.pdf_template,
            "auto_generate_pdf": config.auto_generate_pdf,
            "notification_settings": config.notification_settings,
            "custom_prompts": config.custom_prompts
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get configuration: {str(e)}"
        )

@router.put("/configuration")
async def update_audit_configuration(
    config_data: AuditConfigurationRequest,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Update audit configuration
    """
    try:
        # Deactivate current configuration
        deactivate_query = select(AuditConfiguration).where(AuditConfiguration.is_active == True)
        result = await db.execute(deactivate_query)
        current_configs = result.scalars().all()
        
        for config in current_configs:
            config.is_active = False
        
        # Create new configuration
        new_config = AuditConfiguration(
            id=str(uuid.uuid4()),
            ai_model=config_data.ai_model,
            analysis_depth=config_data.analysis_depth,
            include_roi_analysis=config_data.include_roi_analysis,
            include_risk_assessment=config_data.include_risk_assessment,
            include_implementation_roadmap=config_data.include_implementation_roadmap,
            pdf_template=config_data.pdf_template,
            auto_generate_pdf=config_data.auto_generate_pdf,
            notification_settings=config_data.notification_settings,
            custom_prompts=config_data.custom_prompts,
            is_active=True,
            created_by=current_user.id
        )
        
        db.add(new_config)
        await db.commit()
        
        return {
            "message": "Configuration updated successfully",
            "config_id": new_config.id
        }
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update configuration: {str(e)}"
        )

@router.get("/submissions")
async def get_submissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get audit submissions for admin panel
    """
    try:
        query = select(Audit)
        
        # Apply filters
        if status_filter:
            query = query.where(Audit.status == status_filter)
        
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Audit.company_name.ilike(search_term),
                    Audit.contact_email.ilike(search_term),
                    Audit.industry.ilike(search_term)
                )
            )
        
        query = query.offset(skip).limit(limit).order_by(Audit.created_at.desc())
        
        result = await db.execute(query)
        audits = result.scalars().all()
        
        # Get audit results for maturity scores
        audit_results = {}
        if audits:
            audit_ids = [audit.id for audit in audits]
            results_query = select(AuditResult).where(AuditResult.audit_id.in_(audit_ids))
            results_result = await db.execute(results_query)
            for result in results_result.scalars().all():
                audit_results[result.audit_id] = result
        
        submissions = []
        for audit in audits:
            audit_result = audit_results.get(audit.id)
            submissions.append({
                "id": audit.id,
                "companyName": audit.company_name,
                "contactName": audit.contact_name or "Anonymous",
                "email": audit.contact_email,
                "industry": audit.industry,
                "status": audit.status,
                "maturityScore": audit_result.maturity_score if audit_result else None,
                "estimatedROI": audit_result.estimated_roi if audit_result else None,
                "createdAt": audit.created_at.isoformat(),
                "completedAt": audit_result.created_at.isoformat() if audit_result else None
            })
        
        return {"submissions": submissions}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get submissions: {str(e)}"
        )

@router.get("/analytics")
async def get_analytics(
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get analytics data for admin dashboard
    """
    try:
        # Calculate date ranges
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Get total submissions
        total_submissions_query = select(func.count(Audit.id))
        total_submissions_result = await db.execute(total_submissions_query)
        total_submissions = total_submissions_result.scalar()
        
        # Get completed audits
        completed_audits_query = select(func.count(Audit.id)).where(Audit.status == "completed")
        completed_audits_result = await db.execute(completed_audits_query)
        completed_audits = completed_audits_result.scalar()
        
        # Get average maturity score
        avg_score_query = select(func.avg(AuditResult.maturity_score))
        avg_score_result = await db.execute(avg_score_query)
        avg_maturity_score = avg_score_result.scalar() or 0
        
        # Get total estimated ROI
        total_roi_query = select(func.sum(AuditResult.estimated_roi))
        total_roi_result = await db.execute(total_roi_query)
        total_estimated_roi = total_roi_result.scalar() or 0
        
        # Calculate conversion rate
        conversion_rate = (completed_audits / total_submissions * 100) if total_submissions > 0 else 0
        
        # Get monthly data for charts
        monthly_submissions = []
        for i in range(12):
            month_date = now.replace(month=((now.month - i - 1) % 12) + 1)
            if month_date.month > now.month:
                month_date = month_date.replace(year=now.year - 1)
            
            month_end = month_date.replace(day=28) + timedelta(days=4)
            month_end = month_end - timedelta(days=month_end.day)
            
            month_query = select(func.count(Audit.id)).where(
                and_(Audit.created_at >= month_date, Audit.created_at <= month_end)
            )
            month_result = await db.execute(month_query)
            count = month_result.scalar()
            
            monthly_submissions.append({
                "month": month_date.strftime("%b %Y"),
                "submissions": count
            })
        
        monthly_submissions.reverse()
        
        return {
            "totalSubmissions": total_submissions,
            "completedAudits": completed_audits,
            "averageMaturityScore": round(avg_maturity_score, 1),
            "totalEstimatedROI": int(total_estimated_roi),
            "conversionRate": round(conversion_rate, 1),
            "monthlySubmissions": monthly_submissions
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analytics: {str(e)}"
        )

@router.get("/analytics/overview")
async def get_analytics_overview(
    days: int = Query(30, ge=1, le=365),
    current_user: AdminUser = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get analytics overview for specified period
    """
    try:
        analytics_service = AnalyticsService(db)
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        analytics_data = await analytics_service.get_analytics_overview(
            start_date=start_date,
            end_date=end_date
        )
        
        return analytics_data
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analytics: {str(e)}"
        )