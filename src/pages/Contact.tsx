import { useState } from 'react';
import { motion } from 'framer-motion';
import { apiCall } from '../utils/api';
import { Mail, Phone, MapPin, Clock, Send, Calendar, MessageSquare, Users, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  position: string;
  inquiryType: string;
  subject: string;
  message: string;
  budget: string;
  timeline: string;
  services: string[];
  marketingConsent: boolean;
}

interface ContactResponse {
  inquiry_id: string;
  status: string;
  message: string;
  estimated_response_time: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  action?: {
    text: string;
    href: string;
  };
}

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    position: '',
    inquiryType: 'consultation',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
    services: [],
    marketingConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<ContactResponse | null>(null);

  const contactInfo: ContactInfo[] = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contact.info.email'),
      details: ['hello@xteam.pro', 'support@xteam.pro'],
      action: {
        text: 'Send Email',
        href: 'mailto:hello@xteam.pro'
      }
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('contact.info.phone'),
      details: ['+1 (555) 123-4567', 'Available 24/7'],
      action: {
        text: 'Call Now',
        href: 'tel:+15551234567'
      }
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('contact.info.address'),
      details: ['123 Innovation Drive', 'San Francisco, CA 94105'],
      action: {
        text: 'Get Directions',
        href: 'https://maps.google.com/?q=123+Innovation+Drive+San+Francisco+CA'
      }
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('contact.info.hours'),
      details: ['Mon-Fri: 9:00 AM - 6:00 PM PST', 'Emergency support: 24/7']
    }
  ];

  const inquiryTypes = [
    { value: 'consultation', label: t('contact.form.inquiryType.consultation') },
    { value: 'demo', label: t('contact.form.inquiryType.demo') },
    { value: 'partnership', label: t('contact.form.inquiryType.partnership') },
    { value: 'support', label: t('contact.form.inquiryType.support') },
    { value: 'other', label: t('contact.form.inquiryType.other') }
  ];

  const serviceOptions = [
    t('contact.form.services.strategy'),
    t('contact.form.services.automation'),
    t('contact.form.services.development'),
    t('contact.form.services.analytics'),
    t('contact.form.services.training'),
    t('contact.form.services.transformation')
  ];

  const budgetRanges = [
    t('contact.form.budget.under50k'),
    t('contact.form.budget.50k-100k'),
    t('contact.form.budget.100k-250k'),
    t('contact.form.budget.250k-500k'),
    t('contact.form.budget.over500k'),
    t('contact.form.budget.notSure')
  ];

  const timelineOptions = [
    t('contact.form.timeline.asap'),
    t('contact.form.timeline.quarter'),
    t('contact.form.timeline.halfYear'),
    t('contact.form.timeline.year'),
    t('contact.form.timeline.longTerm'),
    t('contact.form.timeline.exploring')
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const validateContactData = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = t('contact.form.validation.nameRequired');
    } else if (formData.name.trim().length > 100) {
      errors.name = t('contact.form.validation.nameTooLong');
    }
    
    if (!formData.email.trim()) {
      errors.email = t('contact.form.validation.emailRequired');
    } else {
      const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = t('contact.form.validation.emailInvalid');
      }
    }
    
    if (!formData.company.trim()) {
      errors.company = t('contact.form.validation.companyRequired');
    } else if (formData.company.trim().length > 200) {
      errors.company = t('contact.form.validation.companyTooLong');
    }
    
    if (!formData.subject.trim()) {
      errors.subject = t('contact.form.validation.subjectRequired');
    } else if (formData.subject.trim().length > 200) {
      errors.subject = t('contact.form.validation.subjectTooLong');
    }
    
    if (!formData.message.trim()) {
      errors.message = t('contact.form.validation.messageRequired');
    } else if (formData.message.trim().length < 10) {
      errors.message = t('contact.form.validation.messageTooShort');
    } else if (formData.message.trim().length > 2000) {
      errors.message = t('contact.form.validation.messageTooLong');
    }
    
    // Optional field validation
    if (formData.phone && formData.phone.length > 20) {
      errors.phone = t('contact.form.validation.phoneTooLong');
    }
    
    if (formData.position && formData.position.length > 100) {
      errors.position = t('contact.form.validation.positionTooLong');
    }
    
    return errors;
  };

  const transformContactData = (data: ContactForm) => {
    return {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      company: data.company.trim(),
      position: data.position?.trim() || null,
      subject: data.subject.trim(),
      message: data.message.trim(),
      inquiry_type: data.inquiryType,
      budget_range: data.budget || null,
      timeline: data.timeline || null,
      services_interested: data.services.length > 0 ? data.services : [],
      marketing_consent: data.marketingConsent
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationErrors({});
    setSubmitError('');
    
    // Validate form data
    const errors = validateContactData();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const transformedData = transformContactData(formData);
      
      const response = await fetch('/api/contact/contact-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmitSuccess(data);
        setIsSubmitted(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          position: '',
          subject: '',
          message: '',
          budget: '',
          timeline: '',
          services: [],
          inquiryType: 'consultation',
          marketingConsent: false
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle validation errors (422)
        if (response.status === 422 && errorData.errors) {
          setValidationErrors(errorData.errors);
          setSubmitError('Please correct the errors below.');
        }
        // Handle server errors (500+)
        else if (response.status >= 500) {
          setSubmitError('Server error. Please try again later.');
        }
        // Handle other errors
        else {
          setSubmitError(errorData.error || errorData.message || 'Failed to send message. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setSubmitError('Network error. Please check your connection and try again.');
      } else if (error.status === 422) {
        setSubmitError('Please check your input data and try again.');
      } else if (error.status >= 500) {
        setSubmitError('Server error. Please try again later.');
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error display component
  const ErrorMessage = ({ error }: { error: string }) => (
    <div className="flex items-center mt-1 text-red-600 text-sm">
      <AlertCircle className="w-4 h-4 mr-1" />
      <span>{error}</span>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contact.success.title')}</h2>
          <p className="text-gray-600 mb-4">
            {t('contact.success.message')}
          </p>
          {submitSuccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>{t('contact.success.referenceId')}:</strong> {submitSuccess.inquiry_id}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {t('contact.success.status')}: {submitSuccess.status}
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setIsSubmitted(false);
              setSubmitSuccess(null);
              setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                position: '',
                inquiryType: 'consultation',
                subject: '',
                message: '',
                budget: '',
                timeline: '',
                services: [],
                marketingConsent: false
              });
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('contact.success.sendAnother')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-1 mb-4">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
                {info.action && (
                  <a
                    href={info.action.href}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    {info.action.text}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.form.title')}</h2>
                <p className="text-gray-600">
                  {t('contact.form.description')}
                </p>
              </div>

              {/* Display submission errors */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800 font-medium">{t('contact.form.error')}</p>
                  </div>
                  <p className="text-red-700 mt-1">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.fullName')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.name')}
                    />
                    {validationErrors.name && <ErrorMessage error={validationErrors.name} />}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.emailAddress')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.email')}
                    />
                    {validationErrors.email && <ErrorMessage error={validationErrors.email} />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.companyName')} *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.company ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={t('contact.form.company')}
                      />
                      {validationErrors.company && <ErrorMessage error={validationErrors.company} />}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.form.phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={t('contact.form.phone')}
                      />
                      {validationErrors.phone && <ErrorMessage error={validationErrors.phone} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Position
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.position ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="CEO, CTO, Manager, etc."
                      />
                      {validationErrors.position && <ErrorMessage error={validationErrors.position} />}
                    </div>
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.subject')}
                    />
                  {validationErrors.subject && <ErrorMessage error={validationErrors.subject} />}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services Interested In
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceOptions.map((service) => (
                      <label key={service} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map((timeline) => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} * <span className="text-sm text-gray-500">({formData.message.length}/2000)</span>
                  </label>
                  <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      maxLength={2000}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        validationErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.message')}
                    />
                  {validationErrors.message && <ErrorMessage error={validationErrors.message} />}
                </div>

                {/* Marketing consent checkbox */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketingConsent" className="text-sm text-gray-600">
                    I agree to receive marketing communications and updates about XTeam.Pro services. 
                    You can unsubscribe at any time.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Sending Message...
                    </div>
                  ) : (
                    t('contact.form.sendMessage')
                  )}
                </button>
              </form>
            </motion.div>

            {/* Calendar & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Schedule Consultation */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule a Free Consultation</h3>
                  <p className="text-gray-600">
                    Book a 30-minute strategy session with our AI experts. No commitment required.
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Free 30-minute consultation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Custom AI strategy roadmap</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">ROI projections & timeline</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">No sales pressure</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors inline-flex items-center justify-center">
                  Book Free Consultation
                  <Calendar className="w-5 h-5 ml-2" />
                </button>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">How quickly can you start a project?</h4>
                    <p className="text-gray-600 text-sm">We can typically begin discovery within 1-2 weeks of signing the agreement.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Do you work with small businesses?</h4>
                    <p className="text-gray-600 text-sm">Yes! We have solutions for businesses of all sizes, from startups to Fortune 500 companies.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What's included in the consultation?</h4>
                    <p className="text-gray-600 text-sm">A comprehensive assessment of your current processes, AI opportunities, and a custom roadmap.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Do you provide ongoing support?</h4>
                    <p className="text-gray-600 text-sm">Yes, we offer 24/7 support, training, and continuous optimization services.</p>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Prefer to Talk Directly?</h3>
                <p className="mb-6 opacity-90">
                  Our team is available 24/7 to answer your questions and discuss your AI transformation needs.
                </p>
                
                <div className="space-y-4">
                  <a href="tel:+15551234567" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <Phone className="w-5 h-5" />
                    <span>+1 (555) 123-4567</span>
                  </a>
                  <a href="mailto:hello@xteam.pro" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <Mail className="w-5 h-5" />
                    <span>hello@xteam.pro</span>
                  </a>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>Live chat available on our website</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}