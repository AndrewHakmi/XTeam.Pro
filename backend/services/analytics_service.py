from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy import func, and_, or_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.config import get_async_db
from models.audit import Audit, AuditResult, PDFReport
from models.contact import ContactInquiry
from models.blog import BlogPost
from models.admin import AdminUser

class AnalyticsService:
    def __init__(self):
        pass
    
    async def get_dashboard_stats(self, db: AsyncSession) -> Dict[str, Any]:
        """
        Get comprehensive dashboard statistics
        """
        try:
            # Time periods
            now = datetime.utcnow()
            last_30_days = now - timedelta(days=30)
            last_7_days = now - timedelta(days=7)
            last_24_hours = now - timedelta(hours=24)
            
            # Audit statistics
            audit_stats = await self._get_audit_statistics(db, now, last_30_days, last_7_days)
            
            # Contact statistics
            contact_stats = await self._get_contact_statistics(db, now, last_30_days, last_7_days)
            
            # Content statistics
            content_stats = await self._get_content_statistics(db)
            
            # Performance metrics
            performance_stats = await self._get_performance_metrics(db, last_30_days)
            
            # Trend analysis
            trends = await self._get_trend_analysis(db, last_30_days)
            
            return {
                "overview": {
                    "total_audits": audit_stats["total"],
                    "total_contacts": contact_stats["total"],
                    "total_reports": audit_stats["total_reports"],
                    "active_users": content_stats["active_admins"]
                },
                "recent_activity": {
                    "audits_last_24h": audit_stats["last_24h"],
                    "contacts_last_24h": contact_stats["last_24h"],
                    "audits_last_7d": audit_stats["last_7d"],
                    "contacts_last_7d": contact_stats["last_7d"]
                },
                "monthly_stats": {
                    "audits_this_month": audit_stats["this_month"],
                    "contacts_this_month": contact_stats["this_month"],
                    "completion_rate": audit_stats["completion_rate"],
                    "response_rate": contact_stats["response_rate"]
                },
                "performance": performance_stats,
                "trends": trends,
                "content": content_stats
            }
            
        except Exception as e:
            print(f"Error getting dashboard stats: {str(e)}")
            return self._get_default_stats()
    
    async def _get_audit_statistics(self, db: AsyncSession, now: datetime, last_30_days: datetime, last_7_days: datetime) -> Dict[str, Any]:
        """
        Get audit-related statistics
        """
        try:
            # Total audits
            total_audits = await db.scalar(
                func.count(Audit.id)
            )
            
            # Audits in different time periods
            audits_last_24h = await db.scalar(
                func.count(Audit.id).filter(
                    Audit.created_at >= now - timedelta(hours=24)
                )
            )
            
            audits_last_7d = await db.scalar(
                func.count(Audit.id).filter(
                    Audit.created_at >= last_7_days
                )
            )
            
            audits_this_month = await db.scalar(
                func.count(Audit.id).filter(
                    Audit.created_at >= last_30_days
                )
            )
            
            # Completed audits
            completed_audits = await db.scalar(
                func.count(Audit.id).filter(
                    Audit.status == 'completed'
                )
            )
            
            # Total reports generated
            total_reports = await db.scalar(
                func.count(PDFReport.id)
            )
            
            # Completion rate
            completion_rate = (completed_audits / total_audits * 100) if total_audits > 0 else 0
            
            # Average maturity score
            avg_maturity = await db.scalar(
                func.avg(AuditResult.maturity_score).filter(
                    AuditResult.created_at >= last_30_days
                )
            ) or 0
            
            return {
                "total": total_audits or 0,
                "last_24h": audits_last_24h or 0,
                "last_7d": audits_last_7d or 0,
                "this_month": audits_this_month or 0,
                "completed": completed_audits or 0,
                "total_reports": total_reports or 0,
                "completion_rate": round(completion_rate, 2),
                "avg_maturity_score": round(float(avg_maturity), 2)
            }
            
        except Exception as e:
            print(f"Error getting audit statistics: {str(e)}")
            return {
                "total": 0, "last_24h": 0, "last_7d": 0, "this_month": 0,
                "completed": 0, "total_reports": 0, "completion_rate": 0,
                "avg_maturity_score": 0
            }
    
    async def _get_contact_statistics(self, db: AsyncSession, now: datetime, last_30_days: datetime, last_7_days: datetime) -> Dict[str, Any]:
        """
        Get contact-related statistics
        """
        try:
            # Total contacts
            total_contacts = await db.scalar(
                func.count(ContactInquiry.id)
            )
            
            # Contacts in different time periods
            contacts_last_24h = await db.scalar(
                func.count(ContactInquiry.id).filter(
                    ContactInquiry.created_at >= now - timedelta(hours=24)
                )
            )
            
            contacts_last_7d = await db.scalar(
                func.count(ContactInquiry.id).filter(
                    ContactInquiry.created_at >= last_7_days
                )
            )
            
            contacts_this_month = await db.scalar(
                func.count(ContactInquiry.id).filter(
                    ContactInquiry.created_at >= last_30_days
                )
            )
            
            # Responded contacts
            responded_contacts = await db.scalar(
                func.count(ContactInquiry.id).filter(
                    ContactInquiry.status.in_(['responded', 'resolved'])
                )
            )
            
            # Response rate
            response_rate = (responded_contacts / total_contacts * 100) if total_contacts > 0 else 0
            
            # Urgent inquiries
            urgent_inquiries = await db.scalar(
                func.count(ContactInquiry.id).filter(
                    and_(
                        ContactInquiry.is_urgent == True,
                        ContactInquiry.status == 'new'
                    )
                )
            )
            
            return {
                "total": total_contacts or 0,
                "last_24h": contacts_last_24h or 0,
                "last_7d": contacts_last_7d or 0,
                "this_month": contacts_this_month or 0,
                "responded": responded_contacts or 0,
                "response_rate": round(response_rate, 2),
                "urgent_pending": urgent_inquiries or 0
            }
            
        except Exception as e:
            print(f"Error getting contact statistics: {str(e)}")
            return {
                "total": 0, "last_24h": 0, "last_7d": 0, "this_month": 0,
                "responded": 0, "response_rate": 0, "urgent_pending": 0
            }
    
    async def _get_content_statistics(self, db: AsyncSession) -> Dict[str, Any]:
        """
        Get content-related statistics
        """
        try:
            # Blog posts
            total_posts = await db.scalar(
                func.count(BlogPost.id)
            )
            
            published_posts = await db.scalar(
                func.count(BlogPost.id).filter(
                    BlogPost.status == 'published'
                )
            )
            
            draft_posts = await db.scalar(
                func.count(BlogPost.id).filter(
                    BlogPost.status == 'draft'
                )
            )
            
            # Active admins
            active_admins = await db.scalar(
                func.count(AdminUser.id).filter(
                    AdminUser.is_active == True
                )
            )
            
            return {
                "total_posts": total_posts or 0,
                "published_posts": published_posts or 0,
                "draft_posts": draft_posts or 0,
                "active_admins": active_admins or 0
            }
            
        except Exception as e:
            print(f"Error getting content statistics: {str(e)}")
            return {
                "total_posts": 0, "published_posts": 0,
                "draft_posts": 0, "active_admins": 0
            }
    
    async def _get_performance_metrics(self, db: AsyncSession, since_date: datetime) -> Dict[str, Any]:
        """
        Get performance metrics
        """
        try:
            # Average processing time for audits
            avg_processing_time = await db.scalar(
                func.avg(
                    func.extract('epoch', AuditResult.created_at - Audit.created_at)
                ).filter(
                    and_(
                        Audit.status == 'completed',
                        Audit.created_at >= since_date
                    )
                )
            )
            
            # Convert to minutes
            avg_processing_minutes = (avg_processing_time / 60) if avg_processing_time else 0
            
            # Success rate
            total_attempts = await db.scalar(
                func.count(Audit.id).filter(
                    Audit.created_at >= since_date
                )
            )
            
            successful_attempts = await db.scalar(
                func.count(Audit.id).filter(
                    and_(
                        Audit.status == 'completed',
                        Audit.created_at >= since_date
                    )
                )
            )
            
            success_rate = (successful_attempts / total_attempts * 100) if total_attempts > 0 else 0
            
            # Error rate
            failed_attempts = await db.scalar(
                func.count(Audit.id).filter(
                    and_(
                        Audit.status == 'failed',
                        Audit.created_at >= since_date
                    )
                )
            )
            
            error_rate = (failed_attempts / total_attempts * 100) if total_attempts > 0 else 0
            
            return {
                "avg_processing_time_minutes": round(avg_processing_minutes, 2),
                "success_rate": round(success_rate, 2),
                "error_rate": round(error_rate, 2),
                "total_attempts": total_attempts or 0,
                "successful_attempts": successful_attempts or 0,
                "failed_attempts": failed_attempts or 0
            }
            
        except Exception as e:
            print(f"Error getting performance metrics: {str(e)}")
            return {
                "avg_processing_time_minutes": 0,
                "success_rate": 0,
                "error_rate": 0,
                "total_attempts": 0,
                "successful_attempts": 0,
                "failed_attempts": 0
            }
    
    async def _get_trend_analysis(self, db: AsyncSession, since_date: datetime) -> Dict[str, Any]:
        """
        Get trend analysis data
        """
        try:
            # Daily audit submissions for the last 30 days
            daily_audits = await db.execute(
                func.date_trunc('day', Audit.created_at).label('date'),
                func.count(Audit.id).label('count')
            ).filter(
                Audit.created_at >= since_date
            ).group_by(
                func.date_trunc('day', Audit.created_at)
            ).order_by(
                func.date_trunc('day', Audit.created_at)
            )
            
            # Daily contact submissions
            daily_contacts = await db.execute(
                func.date_trunc('day', ContactInquiry.created_at).label('date'),
                func.count(ContactInquiry.id).label('count')
            ).filter(
                ContactInquiry.created_at >= since_date
            ).group_by(
                func.date_trunc('day', ContactInquiry.created_at)
            ).order_by(
                func.date_trunc('day', ContactInquiry.created_at)
            )
            
            # Industry distribution
            industry_distribution = await db.execute(
                ContactInquiry.industry.label('industry'),
                func.count(ContactInquiry.id).label('count')
            ).filter(
                ContactInquiry.created_at >= since_date
            ).group_by(
                ContactInquiry.industry
            ).order_by(
                desc(func.count(ContactInquiry.id))
            ).limit(10)
            
            # Company size distribution
            company_size_distribution = await db.execute(
                ContactInquiry.company_size.label('size'),
                func.count(ContactInquiry.id).label('count')
            ).filter(
                ContactInquiry.created_at >= since_date
            ).group_by(
                ContactInquiry.company_size
            ).order_by(
                desc(func.count(ContactInquiry.id))
            )
            
            return {
                "daily_audits": [
                    {"date": row.date.isoformat(), "count": row.count}
                    for row in daily_audits.fetchall()
                ],
                "daily_contacts": [
                    {"date": row.date.isoformat(), "count": row.count}
                    for row in daily_contacts.fetchall()
                ],
                "industry_distribution": [
                    {"industry": row.industry, "count": row.count}
                    for row in industry_distribution.fetchall()
                ],
                "company_size_distribution": [
                    {"size": row.size, "count": row.count}
                    for row in company_size_distribution.fetchall()
                ]
            }
            
        except Exception as e:
            print(f"Error getting trend analysis: {str(e)}")
            return {
                "daily_audits": [],
                "daily_contacts": [],
                "industry_distribution": [],
                "company_size_distribution": []
            }
    
    async def get_audit_analytics(self, db: AsyncSession, days: int = 30) -> Dict[str, Any]:
        """
        Get detailed audit analytics
        """
        try:
            since_date = datetime.utcnow() - timedelta(days=days)
            
            # Maturity score distribution
            maturity_distribution = await db.execute(
                func.floor(AuditResult.maturity_score / 10).label('score_range'),
                func.count(AuditResult.id).label('count')
            ).filter(
                AuditResult.created_at >= since_date
            ).group_by(
                func.floor(AuditResult.maturity_score / 10)
            ).order_by(
                func.floor(AuditResult.maturity_score / 10)
            )
            
            # ROI projection distribution
            roi_distribution = await db.execute(
                func.case(
                    (AuditResult.roi_projection < 100, '0-100%'),
                    (AuditResult.roi_projection < 200, '100-200%'),
                    (AuditResult.roi_projection < 300, '200-300%'),
                    (AuditResult.roi_projection < 500, '300-500%'),
                    else_='500%+'
                ).label('roi_range'),
                func.count(AuditResult.id).label('count')
            ).filter(
                AuditResult.created_at >= since_date
            ).group_by(
                func.case(
                    (AuditResult.roi_projection < 100, '0-100%'),
                    (AuditResult.roi_projection < 200, '100-200%'),
                    (AuditResult.roi_projection < 300, '200-300%'),
                    (AuditResult.roi_projection < 500, '300-500%'),
                    else_='500%+'
                )
            )
            
            # Average scores by industry (from contact inquiries linked to audits)
            industry_scores = await db.execute(
                ContactInquiry.industry.label('industry'),
                func.avg(AuditResult.maturity_score).label('avg_score'),
                func.count(AuditResult.id).label('count')
            ).join(
                Audit, ContactInquiry.id == Audit.contact_inquiry_id
            ).join(
                AuditResult, Audit.id == AuditResult.audit_id
            ).filter(
                AuditResult.created_at >= since_date
            ).group_by(
                ContactInquiry.industry
            ).order_by(
                desc(func.avg(AuditResult.maturity_score))
            )
            
            return {
                "maturity_distribution": [
                    {
                        "range": f"{int(row.score_range * 10)}-{int(row.score_range * 10 + 9)}",
                        "count": row.count
                    }
                    for row in maturity_distribution.fetchall()
                ],
                "roi_distribution": [
                    {"range": row.roi_range, "count": row.count}
                    for row in roi_distribution.fetchall()
                ],
                "industry_performance": [
                    {
                        "industry": row.industry,
                        "avg_score": round(float(row.avg_score), 2),
                        "count": row.count
                    }
                    for row in industry_scores.fetchall()
                ]
            }
            
        except Exception as e:
            print(f"Error getting audit analytics: {str(e)}")
            return {
                "maturity_distribution": [],
                "roi_distribution": [],
                "industry_performance": []
            }
    
    def _get_default_stats(self) -> Dict[str, Any]:
        """
        Return default statistics when database query fails
        """
        return {
            "overview": {
                "total_audits": 0,
                "total_contacts": 0,
                "total_reports": 0,
                "active_users": 0
            },
            "recent_activity": {
                "audits_last_24h": 0,
                "contacts_last_24h": 0,
                "audits_last_7d": 0,
                "contacts_last_7d": 0
            },
            "monthly_stats": {
                "audits_this_month": 0,
                "contacts_this_month": 0,
                "completion_rate": 0,
                "response_rate": 0
            },
            "performance": {
                "avg_processing_time_minutes": 0,
                "success_rate": 0,
                "error_rate": 0,
                "total_attempts": 0,
                "successful_attempts": 0,
                "failed_attempts": 0
            },
            "trends": {
                "daily_audits": [],
                "daily_contacts": [],
                "industry_distribution": [],
                "company_size_distribution": []
            },
            "content": {
                "total_posts": 0,
                "published_posts": 0,
                "draft_posts": 0,
                "active_admins": 0
            }
        }