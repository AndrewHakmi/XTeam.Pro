import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Zap, Target, TrendingUp, CheckCircle, Users } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: t('home.features.aiAudit.title'),
      description: t('home.features.aiAudit.description')
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: t('home.features.processAutomation.title'),
      description: t('home.features.processAutomation.description')
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: t('home.features.roiOptimization.title'),
      description: t('home.features.roiOptimization.description')
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: t('home.features.scalableGrowth.title'),
      description: t('home.features.scalableGrowth.description')
    }
  ];

  const stats = [
    { number: "500+", label: t('home.stats.businessesTransformed') },
    { number: "300%", label: t('home.stats.averageROI') },
    { number: "75%", label: t('home.stats.processingTime') },
    { number: "99%", label: t('home.stats.clientSatisfaction') }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                {t('home.hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                {t('home.hero.ctaSecondary')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('home.benefits.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('home.benefits.subtitle')}
              </p>
              
              <div className="space-y-4">
                {[
                  t('home.benefits.list.automation'),
                  t('home.benefits.list.roi'),
                  t('home.benefits.list.roadmaps'),
                  t('home.benefits.list.support')
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
              <div className="text-center">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('home.benefits.cta.title')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('home.benefits.cta.subtitle')}
                </p>
                <Button size="lg" className="w-full">
                  {t('home.benefits.cta.button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.finalCta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('home.finalCta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              {t('home.finalCta.consultation')}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
              {t('home.finalCta.caseStudies')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}