import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiCall } from '../utils/api';

interface AuditData {
  industry: string;
  companySize: string;
  painPoints: string[];
  currentSystems: string[];
  kpis: string[];
  contactInfo: {
    email: string;
    phone?: string;
    company?: string;
    name?: string;
  };
}

interface AuditSubmissionRequest {
  company_name: string;
  industry: string;
  company_size: string;
  current_processes: string[];
  pain_points: string[];
  automation_goals: string[];
  contact_email: string;
  contact_name: string;
  contact_phone?: string;
}

interface AuditStep {
  id: string;
  title: string;
  question: string;
  type: 'select' | 'multiselect' | 'input' | 'contact';
  options?: string[];
  required: boolean;
}



export default function Audit() {
  const [currentStep, setCurrentStep] = useState(0);
  const [auditData, setAuditData] = useState<Partial<AuditData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const auditSteps: AuditStep[] = [
    {
      id: 'businessType',
      title: t('audit.steps.businessType.title'),
      question: t('audit.steps.businessType.question'),
      type: 'select',
      options: [
        t('audit.steps.businessType.options.ecommerce'),
        t('audit.steps.businessType.options.saas'),
        t('audit.steps.businessType.options.manufacturing'),
        t('audit.steps.businessType.options.healthcare'),
        t('audit.steps.businessType.options.finance'),
        t('audit.steps.businessType.options.retail'),
        t('audit.steps.businessType.options.consulting'),
        t('audit.steps.businessType.options.other')
      ],
      required: true
    },
    {
      id: 'companySize',
      title: t('audit.steps.companySize.title'),
      question: t('audit.steps.companySize.question'),
      type: 'select',
      options: [
        t('audit.steps.companySize.options.startup'),
        t('audit.steps.companySize.options.small'),
        t('audit.steps.companySize.options.medium'),
        t('audit.steps.companySize.options.large'),
        t('audit.steps.companySize.options.enterprise')
      ],
      required: true
    },
    {
      id: 'currentChallenges',
      title: t('audit.steps.currentChallenges.title'),
      question: t('audit.steps.currentChallenges.question'),
      type: 'multiselect',
      options: [
        t('audit.steps.currentChallenges.options.manualProcesses'),
        t('audit.steps.currentChallenges.options.dataAnalysis'),
        t('audit.steps.currentChallenges.options.customerService'),
        t('audit.steps.currentChallenges.options.inventoryManagement'),
        t('audit.steps.currentChallenges.options.qualityControl'),
        t('audit.steps.currentChallenges.options.costReduction'),
        t('audit.steps.currentChallenges.options.scalingIssues'),
        t('audit.steps.currentChallenges.options.competitiveAdvantage')
      ],
      required: true
    },
    {
      id: 'aiExperience',
      title: t('audit.steps.aiExperience.title'),
      question: t('audit.steps.aiExperience.question'),
      type: 'select',
      options: [
        t('audit.steps.aiExperience.options.none'),
        t('audit.steps.aiExperience.options.basic'),
        t('audit.steps.aiExperience.options.some'),
        t('audit.steps.aiExperience.options.advanced'),
        t('audit.steps.aiExperience.options.expert')
      ],
      required: true
    },
    {
      id: 'budget',
      title: t('audit.steps.budget.title'),
      question: t('audit.steps.budget.question'),
      type: 'select',
      options: [
        t('audit.steps.budget.options.under10k'),
        t('audit.steps.budget.options.10k-50k'),
        t('audit.steps.budget.options.50k-100k'),
        t('audit.steps.budget.options.100k-500k'),
        t('audit.steps.budget.options.over500k')
      ],
      required: true
    },
    {
      id: 'timeline',
      title: t('audit.steps.timeline.title'),
      question: t('audit.steps.timeline.question'),
      type: 'select',
      options: [
        t('audit.steps.timeline.options.immediately'),
        t('audit.steps.timeline.options.1-3months'),
        t('audit.steps.timeline.options.3-6months'),
        t('audit.steps.timeline.options.6-12months'),
        t('audit.steps.timeline.options.exploring')
      ],
      required: true
    },
    {
      id: 'contact',
      title: t('audit.steps.contact.title'),
      question: t('audit.steps.contact.question'),
      type: 'contact',
      required: true
    }
  ];

  const handleStepData = (stepId: string, value: any) => {
    setAuditData(prev => ({
      ...prev,
      [stepId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < auditSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateAuditData = (): string | null => {
    if (!auditData.industry) return 'Industry is required';
    if (!auditData.companySize) return 'Company size is required';
    if (!auditData.painPoints || auditData.painPoints.length === 0) return 'At least one pain point is required';
    if (!auditData.currentSystems || auditData.currentSystems.length === 0) return 'At least one current system is required';
    if (!auditData.kpis || auditData.kpis.length === 0) return 'At least one KPI is required';
    if (!auditData.contactInfo?.email) return 'Email is required';
    if (!auditData.contactInfo.email.includes('@')) return 'Valid email is required';
    return null;
  };

  const transformAuditData = (): AuditSubmissionRequest => {
    return {
      company_name: auditData.contactInfo?.company || 'Not specified',
      industry: auditData.industry!,
      company_size: auditData.companySize!,
      current_processes: auditData.currentSystems!,
      pain_points: auditData.painPoints!,
      automation_goals: auditData.kpis!,
      contact_email: auditData.contactInfo!.email,
      contact_name: auditData.contactInfo?.name || 'Anonymous',
      contact_phone: auditData.contactInfo?.phone
    };
  };

  const validateSubmissionData = (data: AuditSubmissionRequest): string | null => {
    if (!data.company_name || data.company_name.trim() === '') {
      return 'Company name is required';
    }
    if (!data.industry || data.industry.trim() === '') {
      return 'Industry is required';
    }
    if (!data.company_size || data.company_size.trim() === '') {
      return 'Company size is required';
    }
    if (!data.current_processes || data.current_processes.length === 0) {
      return 'At least one current process/system is required';
    }
    if (!data.pain_points || data.pain_points.length === 0) {
      return 'At least one pain point is required';
    }
    if (!data.automation_goals || data.automation_goals.length === 0) {
      return 'At least one automation goal/KPI is required';
    }
    if (!data.contact_email || !data.contact_email.includes('@')) {
      return 'Valid contact email is required';
    }
    if (!data.contact_name || data.contact_name.trim() === '') {
      return 'Contact name is required';
    }
    return null;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate basic audit data first
      const basicValidationError = validateAuditData();
      if (basicValidationError) {
        alert(basicValidationError);
        return;
      }

      // Transform data to match FastAPI backend structure
      const submissionData = transformAuditData();
      
      // Validate transformed submission data
      const submissionValidationError = validateSubmissionData(submissionData);
      if (submissionValidationError) {
        alert(submissionValidationError);
        return;
      }
      
      const response = await apiCall('/api/audit/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Check if audit was successfully submitted using audit_id (FastAPI response)
        if (result.audit_id && (result.status === 'processing' || result.status === 'submitted')) {
          setIsCompleted(true);
          
          // Redirect to results page after a short delay
          setTimeout(() => {
            navigate(`/audit/results/${result.audit_id}`);
          }, 2000);
        } else {
          throw new Error(`Unexpected response format: ${result.message || 'Missing audit_id or invalid status'}`);
        }
      } else {
        // Enhanced error handling for different HTTP status codes
        let errorMessage = 'Unknown error occurred';
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            // FastAPI validation error format
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((err: any) => `${err.loc?.join('.')} - ${err.msg}`).join(', ');
            } else {
              errorMessage = errorData.detail;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Audit submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // More user-friendly error messages
      let displayMessage = errorMessage;
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        displayMessage = 'Network error: Please check your internet connection and try again.';
      } else if (errorMessage.includes('422')) {
        displayMessage = 'Validation error: Please check all required fields are filled correctly.';
      } else if (errorMessage.includes('500')) {
        displayMessage = 'Server error: Please try again later or contact support.';
      }
      
      alert(`Audit submission failed: ${displayMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: AuditStep) => {
    const value = auditData[step.id as keyof AuditData];
    if (!step.required) return true;
    
    if (step.type === 'multiselect') {
      return Array.isArray(value) && value.length > 0;
    }
    
    if (step.type === 'contact') {
      const contact = auditData.contactInfo;
      return contact?.email && contact.email.includes('@');
    }
    
    return value && value !== '';
  };

  const currentStepData = auditSteps[currentStep];
  const progress = ((currentStep + 1) / auditSteps.length) * 100;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Complete!</h2>
          <p className="text-gray-600 mb-4">
            Your AI automation audit has been processed. Redirecting to your personalized results...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-full h-3 shadow-inner">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{t('audit.progress.step', { current: currentStep + 1, total: auditSteps.length })}</span>
            <span>{t('audit.progress.complete', { percent: Math.round(progress) })}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentStepData.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {currentStepData.question}
                </p>
              </div>

              <StepContent
                step={currentStepData}
                value={auditData[currentStepData.id as keyof AuditData]}
                onChange={(value) => handleStepData(currentStepData.id, value)}
              />

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {t('audit.buttons.previous')}
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepValid(currentStepData) || isSubmitting}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('audit.buttons.processing')}
                    </>
                  ) : currentStep === auditSteps.length - 1 ? (
                    t('audit.buttons.complete')
                  ) : (
                    <>
                      {t('audit.buttons.next')}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface StepContentProps {
  step: AuditStep;
  value: any;
  onChange: (value: any) => void;
}

function StepContent({ step, value, onChange }: StepContentProps) {
  if (step.type === 'select') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {step.options?.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              value === option
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    );
  }

  if (step.type === 'multiselect') {
    const selectedValues = Array.isArray(value) ? value : [];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {step.options?.map((option) => {
          const isSelected = selectedValues.includes(option);
          
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const newValues = isSelected
                  ? selectedValues.filter(v => v !== option)
                  : [...selectedValues, option];
                onChange(newValues);
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                {option}
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (step.type === 'contact') {
    const contactInfo = value || {};
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={contactInfo.name || ''}
            onChange={(e) => onChange({ ...contactInfo, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Full Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={contactInfo.email || ''}
            onChange={(e) => onChange({ ...contactInfo, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@company.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={contactInfo.company || ''}
            onChange={(e) => onChange({ ...contactInfo, company: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Company Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={contactInfo.phone || ''}
            onChange={(e) => onChange({ ...contactInfo, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Privacy Notice:</strong> Your information will only be used to generate and deliver your personalized audit report. We respect your privacy and will not share your data with third parties.
          </p>
        </div>
      </div>
    );
  }

  return null;
}