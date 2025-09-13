import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, BarChart3, Clock, DollarSign, Target, Bot, MessageSquare, FileText, Calculator, ShoppingCart, Headphones, Database, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Solution {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  useCases: string[];
  roi: string;
  implementation: string;
}

interface IndustryScenario {
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  icon: React.ReactNode;
}

interface AIAgent {
  name: string;
  description: string;
  capabilities: string[];
  industries: string[];
  icon: React.ReactNode;
  color: string;
}

export default function Solutions() {
  const { t } = useTranslation();
  
  const solutions: Solution[] = [
    {
      id: 'customer-service',
      title: 'AI Customer Service Automation',
      description: 'Transform your customer support with intelligent chatbots and automated response systems that provide 24/7 assistance.',
      icon: <Headphones className="w-8 h-8" />,
      benefits: [
        '24/7 customer support availability',
        'Reduce response time by 90%',
        'Handle 80% of inquiries automatically',
        'Improve customer satisfaction scores'
      ],
      useCases: [
        'Live chat automation',
        'Email response automation',
        'FAQ and knowledge base integration',
        'Ticket routing and prioritization'
      ],
      roi: '300% ROI within 6 months',
      implementation: '2-4 weeks'
    },
    {
      id: 'data-analysis',
      title: 'Intelligent Data Analytics',
      description: 'Automate data processing, analysis, and reporting to uncover insights and drive data-driven decision making.',
      icon: <BarChart3 className="w-8 h-8" />,
      benefits: [
        'Real-time data processing',
        'Automated report generation',
        'Predictive analytics capabilities',
        'Reduce manual analysis time by 85%'
      ],
      useCases: [
        'Sales performance analysis',
        'Customer behavior insights',
        'Financial reporting automation',
        'Market trend analysis'
      ],
      roi: '250% ROI within 4 months',
      implementation: '3-6 weeks'
    },
    {
      id: 'workflow-automation',
      title: 'Business Process Automation',
      description: 'Streamline repetitive tasks and workflows with intelligent automation that adapts to your business needs.',
      icon: <Zap className="w-8 h-8" />,
      benefits: [
        'Eliminate manual repetitive tasks',
        'Reduce processing time by 70%',
        'Minimize human errors',
        'Improve operational efficiency'
      ],
      useCases: [
        'Invoice processing',
        'Employee onboarding',
        'Inventory management',
        'Quality assurance workflows'
      ],
      roi: '400% ROI within 3 months',
      implementation: '1-3 weeks'
    },
    {
      id: 'content-generation',
      title: 'AI Content & Communication',
      description: 'Generate high-quality content, emails, and communications automatically while maintaining your brand voice.',
      icon: <FileText className="w-8 h-8" />,
      benefits: [
        'Generate content 10x faster',
        'Maintain consistent brand voice',
        'Personalize communications at scale',
        'Reduce content creation costs by 60%'
      ],
      useCases: [
        'Marketing content creation',
        'Email campaign automation',
        'Social media management',
        'Documentation generation'
      ],
      roi: '200% ROI within 2 months',
      implementation: '1-2 weeks'
    }
  ];

  const industryScenarios: IndustryScenario[] = [
    {
      industry: 'retail',
      challenge: 'Managing thousands of customer inquiries and order processing manually',
      solution: 'AI-powered customer service and order automation system',
      results: [
        '90% reduction in response time',
        '75% decrease in support tickets',
        '$500K annual savings in operational costs',
        '40% increase in customer satisfaction'
      ],
      icon: <ShoppingCart className="w-6 h-6" />
    },
    {
      industry: 'healthcare',
      challenge: 'Time-consuming patient data analysis and appointment scheduling',
      solution: 'Intelligent patient management and diagnostic assistance system',
      results: [
        '60% faster patient data processing',
        '85% reduction in scheduling conflicts',
        '30% improvement in diagnostic accuracy',
        '$2M annual cost savings'
      ],
      icon: <Shield className="w-6 h-6" />
    },
    {
      industry: 'finance',
      challenge: 'Manual fraud detection and risk assessment processes',
      solution: 'AI-driven fraud detection and automated risk analysis',
      results: [
        '95% fraud detection accuracy',
        '80% reduction in false positives',
        '$10M prevented in fraudulent transactions',
        '50% faster loan approval process'
      ],
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      industry: 'manufacturing',
      challenge: 'Inefficient quality control and predictive maintenance',
      solution: 'AI-powered quality assurance and maintenance prediction',
      results: [
        '70% reduction in defective products',
        '60% decrease in unplanned downtime',
        '$5M savings in maintenance costs',
        '45% improvement in production efficiency'
      ],
      icon: <Target className="w-6 h-6" />
    }
  ];

  const aiAgents: AIAgent[] = [
    {
      name: 'customerservicebot',
      description: 'Handles customer inquiries, resolves issues, and escalates complex cases to human agents.',
      capabilities: [
        'Natural language understanding',
        'Multi-channel support (chat, email, phone)',
        'Knowledge base integration',
        'Sentiment analysis',
        'Automated ticket routing'
      ],
      industries: ['E-commerce', 'SaaS', 'Retail', 'Healthcare'],
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      name: 'dataanalyst',
      description: 'Processes large datasets, generates insights, and creates automated reports for decision-making.',
      capabilities: [
        'Real-time data processing',
        'Predictive analytics',
        'Automated reporting',
        'Anomaly detection',
        'Visualization generation'
      ],
      industries: ['Finance', 'Marketing', 'Operations', 'Sales'],
      icon: <Database className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      name: 'salesassistant',
      description: 'Qualifies leads, schedules meetings, and provides personalized product recommendations.',
      capabilities: [
        'Lead qualification',
        'Meeting scheduling',
        'CRM integration',
        'Personalized recommendations',
        'Follow-up automation'
      ],
      industries: ['B2B Sales', 'Real Estate', 'Insurance', 'Technology'],
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      name: 'contentcreator',
      description: 'Generates marketing content, emails, and documentation while maintaining brand consistency.',
      capabilities: [
        'Content generation',
        'Brand voice consistency',
        'Multi-format output',
        'SEO optimization',
        'Personalization at scale'
      ],
      industries: ['Marketing', 'Media', 'E-commerce', 'Education'],
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-orange-500'
    },
    {
      name: 'processautomator',
      description: 'Automates repetitive business processes and workflows across different departments.',
      capabilities: [
        'Workflow automation',
        'Document processing',
        'System integration',
        'Error handling',
        'Performance monitoring'
      ],
      industries: ['Operations', 'HR', 'Finance', 'Manufacturing'],
      icon: <Bot className="w-6 h-6" />,
      color: 'bg-red-500'
    },
    {
      name: 'qualitycontroller',
      description: 'Analyzes financial data, detects anomalies, and provides investment recommendations.',
      capabilities: [
        'Financial modeling',
        'Risk assessment',
        'Fraud detection',
        'Investment analysis',
        'Compliance monitoring'
      ],
      industries: ['Banking', 'Investment', 'Insurance', 'Fintech'],
      icon: <Calculator className="w-6 h-6" />,
      color: 'bg-indigo-500'
    }
  ];

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
              {t('solutions.hero.title')}
              <span className="text-blue-600"> {t('solutions.hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('solutions.hero.subtitle')}
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
              {t('solutions.hero.exploreButton')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Core Solutions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('solutions.coreSolutions.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('solutions.coreSolutions.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
                    {solution.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t(`solutions.coreSolutions.${solution.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.title`)}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{t(`solutions.coreSolutions.${solution.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.description`)}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('solutions.coreSolutions.benefits')}</h4>
                    <ul className="space-y-2">
                      {solution.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {t(`solutions.coreSolutions.${solution.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.benefits.${idx}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('solutions.coreSolutions.useCases')}</h4>
                    <ul className="space-y-2">
                      {solution.useCases.map((useCase, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <ArrowRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          {t(`solutions.coreSolutions.${solution.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.useCases.${idx}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      {t('solutions.coreSolutions.roiImpact')}
                    </h4>
                    <p className="text-green-700">{t(`solutions.coreSolutions.${solution.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.roi`)}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      {t('solutions.coreSolutions.implementation')}
                    </h4>
                    <p className="text-blue-700">{t(`solutions.coreSolutions.${solution.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.implementation`)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Scenarios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('solutions.industryStories.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('solutions.industryStories.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industryScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.industry}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-600 text-white rounded-lg mr-3">
                    {scenario.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t(`solutions.industryStories.${scenario.industry.toLowerCase().replace(/[^a-z0-9]/g, '')}.industry`)}</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-red-600 mb-2">{t('solutions.industryStories.challenge')}:</h4>
                  <p className="text-gray-600 text-sm">{t(`solutions.industryStories.${scenario.industry.toLowerCase().replace(/[^a-z0-9]/g, '')}.challenge`)}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-blue-600 mb-2">{t('solutions.industryStories.solution')}:</h4>
                  <p className="text-gray-600 text-sm">{t(`solutions.industryStories.${scenario.industry.toLowerCase().replace(/[^a-z0-9]/g, '')}.solution`)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">{t('solutions.industryStories.results')}:</h4>
                  <ul className="space-y-1">
                    {scenario.results.map((result, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {t(`solutions.industryStories.${scenario.industry.toLowerCase().replace(/[^a-z0-9]/g, '')}.results.${idx}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('solutions.aiWorkforce.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('solutions.aiWorkforce.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiAgents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${agent.color} text-white rounded-lg mr-3`}>
                    {agent.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{t(`solutions.aiWorkforce.${agent.name}.name`)}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{t(`solutions.aiWorkforce.${agent.name}.description`)}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">{t('solutions.aiWorkforce.capabilities')}:</h4>
                  <ul className="space-y-1">
                    {agent.capabilities.slice(0, 3).map((capability, idx) => (
                      <li key={idx} className="flex items-start text-xs text-gray-600">
                        <Zap className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        {t(`solutions.aiWorkforce.${agent.name}.capabilities.${idx}`)}
                      </li>
                    ))}
                  </ul>
                  {agent.capabilities.length > 3 && (
                    <p className="text-xs text-gray-500 mt-1">+{agent.capabilities.length - 3} more capabilities</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Industries:</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.industries.map((industry, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {industry}
                      </span>
                    ))}
                  </div>
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
            <h2 className="text-4xl font-bold mb-4">{t('solutions.cta.title')}</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {t('solutions.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                {t('solutions.cta.auditButton')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                {t('solutions.cta.consultationButton')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}