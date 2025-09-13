from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from database.config import Base


class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Authentication
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(String(50), default="admin")  # admin, super_admin, analyst
    
    # Permissions
    can_manage_audits = Column(Boolean, default=True)
    can_manage_users = Column(Boolean, default=False)
    can_view_analytics = Column(Boolean, default=True)
    can_export_data = Column(Boolean, default=True)
    can_manage_content = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(Integer, nullable=True)  # ID of admin who created this user
    
    # Security
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expires = Column(DateTime(timezone=True), nullable=True)


class AuditConfiguration(Base):
    __tablename__ = "audit_configurations"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Configuration name and description
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # AI Model settings
    openai_model = Column(String(100), default="gpt-4")
    temperature = Column(String(10), default="0.7")
    max_tokens = Column(Integer, default=2000)
    
    # Scoring weights (0.0 to 1.0)
    process_automation_weight = Column(String(10), default="0.25")
    data_integration_weight = Column(String(10), default="0.20")
    workflow_efficiency_weight = Column(String(10), default="0.20")
    cost_optimization_weight = Column(String(10), default="0.15")
    scalability_weight = Column(String(10), default="0.10")
    security_compliance_weight = Column(String(10), default="0.10")
    
    # Report settings
    include_executive_summary = Column(Boolean, default=True)
    include_detailed_analysis = Column(Boolean, default=True)
    include_roi_projections = Column(Boolean, default=True)
    include_implementation_roadmap = Column(Boolean, default=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(Integer, nullable=False)  # Admin user ID