from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database.config import Base


class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Contact information
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True)
    position = Column(String(100), nullable=True)
    
    # Inquiry details
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    inquiry_type = Column(String(50), nullable=False)  # consultation, support, partnership, other
    
    # Preferences
    preferred_contact_method = Column(String(50), default="email")  # email, phone, both
    budget_range = Column(String(50), nullable=True)
    timeline = Column(String(50), nullable=True)
    
    # Status tracking
    status = Column(String(50), default="new")  # new, contacted, qualified, converted, closed
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    assigned_to = Column(String(255), nullable=True)  # Staff member assigned
    
    # Metadata
    source = Column(String(100), default="website")  # website, referral, social, etc.
    utm_source = Column(String(100), nullable=True)
    utm_medium = Column(String(100), nullable=True)
    utm_campaign = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    contacted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Flags
    is_newsletter_subscribed = Column(Boolean, default=False)
    is_gdpr_compliant = Column(Boolean, default=True)
    is_spam = Column(Boolean, default=False)