from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.config import Base


class Audit(Base):
    __tablename__ = "audits"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=False)
    company_size = Column(String(50), nullable=False)
    current_challenges = Column(JSON, nullable=False)  # List of challenges
    business_processes = Column(JSON, nullable=False)  # List of processes
    automation_goals = Column(JSON, nullable=False)  # List of goals
    budget_range = Column(String(50), nullable=False)
    timeline = Column(String(50), nullable=False)
    contact_email = Column(String(255), nullable=False)
    contact_name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    
    # Audit metadata
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    results = relationship("AuditResult", back_populates="audit", cascade="all, delete-orphan")
    pdf_reports = relationship("PDFReport", back_populates="audit", cascade="all, delete-orphan")


class AuditResult(Base):
    __tablename__ = "audit_results"
    
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audits.id"), nullable=False)
    
    # AI Analysis Results
    maturity_score = Column(Integer, nullable=False)  # 0-100
    automation_potential = Column(Integer, nullable=False)  # 0-100
    roi_projection = Column(Float, nullable=False)  # Projected ROI percentage
    implementation_timeline = Column(String(100), nullable=False)
    
    # Detailed Analysis
    strengths = Column(JSON, nullable=False)  # List of strengths
    weaknesses = Column(JSON, nullable=False)  # List of weaknesses
    opportunities = Column(JSON, nullable=False)  # List of opportunities
    recommendations = Column(JSON, nullable=False)  # List of recommendations
    
    # Process-specific scores
    process_scores = Column(JSON, nullable=False)  # Dict of process: score
    priority_areas = Column(JSON, nullable=False)  # List of priority areas
    
    # Cost-benefit analysis
    estimated_savings = Column(Float, nullable=True)  # Annual savings
    implementation_cost = Column(Float, nullable=True)  # Implementation cost
    payback_period = Column(Float, nullable=True)  # Months to payback
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    audit = relationship("Audit", back_populates="results")


class PDFReport(Base):
    __tablename__ = "pdf_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audits.id"), nullable=False)
    
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)  # Size in bytes
    
    # Report metadata
    report_type = Column(String(50), default="audit_report")  # audit_report, executive_summary
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    download_count = Column(Integer, default=0)
    
    # Relationships
    audit = relationship("Audit", back_populates="pdf_reports")