import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Clock, DollarSign, Target, CheckCircle, ExternalLink, Filter, Search } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  implementation: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
  };
  tags: string[];
  timeline: string;
  investment: string;
  roi: string;
  featured: boolean;
}

export default function CaseStudies() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const caseStudies: CaseStudy[] = [
    {
      id: 'ecommerce-automation',
      title: 'E-commerce Customer Service Revolution',
      company: 'TechMart Solutions',
      industry: 'E-commerce',
      challenge: 'TechMart was struggling with 10,000+ daily customer inquiries, leading to 48-hour response times and declining customer satisfaction. Their support team was overwhelmed, and operational costs were skyrocketing.',
      solution: 'Implemented a comprehensive AI customer service system with intelligent chatbots, automated email responses, and smart ticket routing. The system integrated with their existing CRM and knowledge base.',
      implementation: 'Deployed in phases over 6 weeks with staff training and gradual rollout to ensure smooth transition.',
      results: [
        { metric: 'Response Time', value: '2 minutes', improvement: '95% faster' },
        { metric: 'Customer Satisfaction', value: '94%', improvement: '+40%' },
        { metric: 'Support Tickets Resolved', value: '85%', improvement: 'Automated' },
        { metric: 'Annual Cost Savings', value: '$750K', improvement: '60% reduction' }
      ],
      testimonial: {
        quote: "The AI system transformed our customer service completely. We went from drowning in tickets to providing instant, accurate responses. Our customers love it, and our team can focus on complex issues that truly need human attention.",
        author: 'Sarah Chen',
        position: 'VP of Customer Experience'
      },
      tags: ['Customer Service', 'Automation', 'Cost Reduction'],
      timeline: '6 weeks',
      investment: '$150K',
      roi: '500% in 8 months',
      featured: true
    },
    {
      id: 'healthcare-analytics',
      title: 'Healthcare Data Analytics Transformation',
      company: 'MedCare Regional',
      industry: 'Healthcare',
      challenge: 'Manual patient data analysis was taking 4-6 hours per case, delaying treatment decisions and increasing administrative burden on medical staff.',
      solution: 'Deployed AI-powered analytics system for patient data processing, diagnostic assistance, and automated reporting with integration to existing EMR systems.',
      implementation: 'Phased implementation over 8 weeks with comprehensive staff training and compliance validation.',
      results: [
        { metric: 'Data Processing Time', value: '15 minutes', improvement: '85% faster' },
        { metric: 'Diagnostic Accuracy', value: '96%', improvement: '+25%' },
        { metric: 'Administrative Time', value: '3 hours/day', improvement: '70% reduction' },
        { metric: 'Annual Savings', value: '$2.1M', improvement: '45% cost reduction' }
      ],
      testimonial: {
        quote: "This AI system has revolutionized how we handle patient data. What used to take hours now takes minutes, and the accuracy improvements have directly impacted patient outcomes. It's been a game-changer for our entire organization.",
        author: 'Dr. Michael Rodriguez',
        position: 'Chief Medical Officer'
      },
      tags: ['Healthcare', 'Data Analytics', 'Efficiency'],
      timeline: '8 weeks',
      investment: '$300K',
      roi: '700% in 12 months',
      featured: true
    },
    {
      id: 'financial-fraud-detection',
      title: 'Advanced Fraud Detection System',
      company: 'SecureBank Corp',
      industry: 'Financial Services',
      challenge: 'Traditional fraud detection was catching only 60% of fraudulent transactions, resulting in $5M annual losses and numerous false positives affecting customer experience.',
      solution: 'Implemented AI-driven fraud detection with real-time transaction analysis, behavioral pattern recognition, and automated risk scoring.',
      implementation: 'Gradual rollout over 10 weeks with extensive testing and regulatory compliance validation.',
      results: [
        { metric: 'Fraud Detection Rate', value: '98.5%', improvement: '+38.5%' },
        { metric: 'False Positives', value: '2%', improvement: '80% reduction' },
        { metric: 'Processing Speed', value: '50ms', improvement: '95% faster' },
        { metric: 'Annual Loss Prevention', value: '$12M', improvement: '85% reduction' }
      ],
      testimonial: {
        quote: "The AI fraud detection system has exceeded all our expectations. We're catching fraud we never could before while dramatically improving the customer experience by reducing false alarms.",
        author: 'Jennifer Walsh',
        position: 'Head of Risk Management'
      },
      tags: ['Financial Services', 'Fraud Detection', 'Risk Management'],
      timeline: '10 weeks',
      investment: '$500K',
      roi: '2400% in 6 months',
      featured: false
    },
    {
      id: 'manufacturing-optimization',
      title: 'Smart Manufacturing Optimization',
      company: 'AutoParts Industries',
      industry: 'Manufacturing',
      challenge: 'Frequent equipment breakdowns and quality control issues were causing 20% production downtime and $3M annual losses in defective products.',
      solution: 'Deployed predictive maintenance AI and automated quality control systems with IoT sensor integration and real-time monitoring.',
      implementation: 'Phased deployment across 3 production lines over 12 weeks with minimal disruption to operations.',
      results: [
        { metric: 'Production Downtime', value: '4%', improvement: '80% reduction' },
        { metric: 'Defect Rate', value: '0.5%', improvement: '90% improvement' },
        { metric: 'Maintenance Costs', value: '$800K', improvement: '60% reduction' },
        { metric: 'Overall Efficiency', value: '94%', improvement: '+35%' }
      ],
      testimonial: {
        quote: "The predictive maintenance system has transformed our operations. We now fix issues before they become problems, and our quality has never been better. The ROI was evident within the first quarter.",
        author: 'Robert Kim',
        position: 'Operations Director'
      },
      tags: ['Manufacturing', 'Predictive Maintenance', 'Quality Control'],
      timeline: '12 weeks',
      investment: '$400K',
      roi: '650% in 10 months',
      featured: false
    },
    {
      id: 'retail-personalization',
      title: 'AI-Powered Retail Personalization',
      company: 'FashionForward',
      industry: 'Retail',
      challenge: 'Low conversion rates (2.1%) and high cart abandonment (78%) due to generic shopping experiences and poor product recommendations.',
      solution: 'Implemented AI personalization engine with real-time recommendation system, dynamic pricing, and personalized marketing automation.',
      implementation: 'Integrated over 8 weeks with A/B testing and gradual feature rollout to optimize performance.',
      results: [
        { metric: 'Conversion Rate', value: '6.8%', improvement: '+224%' },
        { metric: 'Cart Abandonment', value: '45%', improvement: '42% reduction' },
        { metric: 'Average Order Value', value: '$127', improvement: '+85%' },
        { metric: 'Revenue Growth', value: '$4.2M', improvement: '340% increase' }
      ],
      testimonial: {
        quote: "The personalization AI has completely transformed our customer experience. Sales have tripled, and customers are genuinely excited about the recommendations they receive. It's like having a personal shopper for every customer.",
        author: 'Amanda Foster',
        position: 'Chief Marketing Officer'
      },
      tags: ['Retail', 'Personalization', 'Revenue Growth'],
      timeline: '8 weeks',
      investment: '$200K',
      roi: '2100% in 6 months',
      featured: true
    },
    {
      id: 'logistics-optimization',
      title: 'Supply Chain Intelligence System',
      company: 'GlobalLogistics Pro',
      industry: 'Logistics',
      challenge: 'Inefficient route planning and inventory management were causing 25% higher delivery costs and frequent stockouts affecting customer satisfaction.',
      solution: 'Deployed AI-powered supply chain optimization with predictive analytics, dynamic routing, and automated inventory management.',
      implementation: 'Rolled out across 15 distribution centers over 14 weeks with comprehensive staff training.',
      results: [
        { metric: 'Delivery Costs', value: '$2.1M', improvement: '35% reduction' },
        { metric: 'On-time Delivery', value: '97%', improvement: '+22%' },
        { metric: 'Inventory Turnover', value: '12x', improvement: '+50%' },
        { metric: 'Customer Satisfaction', value: '92%', improvement: '+28%' }
      ],
      testimonial: {
        quote: "The AI system has revolutionized our supply chain operations. We're delivering faster, cheaper, and more reliably than ever before. Our customers notice the difference, and our bottom line reflects it.",
        author: 'Carlos Martinez',
        position: 'VP of Operations'
      },
      tags: ['Logistics', 'Supply Chain', 'Optimization'],
      timeline: '14 weeks',
      investment: '$350K',
      roi: '600% in 8 months',
      featured: false
    }
  ];

  const industries = ['All', ...Array.from(new Set(caseStudies.map(study => study.industry)))];

  const filteredStudies = caseStudies.filter(study => {
    const matchesIndustry = selectedIndustry === 'All' || study.industry === selectedIndustry;
    const matchesSearch = searchTerm === '' || 
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesIndustry && matchesSearch;
  });

  const featuredStudies = caseStudies.filter(study => study.featured);

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
              Real Results from
              <span className="text-blue-600"> Real Businesses</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover how companies across industries have transformed their operations, 
              reduced costs, and accelerated growth with our AI automation solutions.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Successful Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">$50M+</div>
              <div className="text-gray-600">Cost Savings Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Average Efficiency Gain</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">6 Months</div>
              <div className="text-gray-600">Average ROI Timeline</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Highlighted case studies showcasing transformational results across different industries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredStudies.slice(0, 2).map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {study.industry}
                  </span>
                  <span className="text-sm text-gray-500">{study.timeline}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{study.title}</h3>
                <p className="text-lg font-semibold text-blue-600 mb-4">{study.company}</p>
                
                <p className="text-gray-600 mb-6 line-clamp-3">{study.challenge}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {study.results.slice(0, 4).map((result, idx) => (
                    <div key={idx} className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-green-600">{result.value}</div>
                      <div className="text-xs text-gray-600">{result.metric}</div>
                      <div className="text-xs text-green-500">{result.improvement}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">ROI: </span>
                    <span className="font-semibold text-green-600">{study.roi}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                    Read Full Story
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">All Case Studies</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our complete portfolio of successful AI implementations across various industries.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {study.industry}
                  </span>
                  {study.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h3>
                <p className="text-blue-600 font-semibold mb-3">{study.company}</p>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{study.challenge}</p>
                
                <div className="space-y-2 mb-4">
                  {study.results.slice(0, 2).map((result, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{result.metric}:</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{result.value}</div>
                        <div className="text-green-600 text-xs">{result.improvement}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {study.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-600">ROI: </span>
                    <span className="font-semibold text-green-600">{study.roi}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                    Details
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join the growing list of companies transforming their operations with AI. 
              Let's discuss how we can help you achieve similar results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                Start Your AI Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Download Case Study PDF
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}