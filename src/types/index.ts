// XTeam.Pro Type Definitions

// Audit Types
export interface AuditSubmission {
  industry: string;
  companySize: string;
  painPoints: string[];
  currentSystems: string[];
  kpis: string[];
  contactInfo: {
    email: string;
    phone?: string;
    company?: string;
  };
}

export interface AuditResult {
  auditId: string;
  maturityScore: number;
  roiForecast: {
    potentialSavings: number;
    implementationCost: number;
    paybackPeriod: number;
    efficiency: number;
  };
  recommendations: string[];
  reportUrl: string;
}

export interface AuditAnalysis {
  auditData: AuditSubmission;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  visualData: {
    radarChart: {
      labels: string[];
      data: number[];
    };
    metrics: {
      automation: number;
      integration: number;
      efficiency: number;
      scalability: number;
      dataQuality: number;
    };
  };
  pdfUrl: string;
}

// Contact Types
export interface ContactInquiry {
  name: string;
  email: string;
  company?: string;
  inquiryType: 'consultation' | 'demo' | 'partnership' | 'support' | 'other';
  message: string;
}

// ROI Calculator Types
export interface ROICalculation {
  employees: number;
  processes: string[];
  timeSpent: {
    [key: string]: number; // hours per week
  };
}

export interface ROIResult {
  potentialSavings: number;
  implementationCost: number;
  paybackPeriod: number;
  efficiency: number;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

// Case Study Types
export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }[];
  timeline: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  featured: boolean;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  items?: NavItem[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}