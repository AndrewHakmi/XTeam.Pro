import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, Tag, Clock, TrendingUp, BookOpen, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  views: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function Blog() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const categories: Category[] = [
    { id: 'all', name: t('blog.categories.all'), count: 24 },
    { id: 'ai-strategy', name: t('blog.categories.aiStrategy'), count: 8 },
    { id: 'automation', name: t('blog.categories.automation'), count: 6 },
    { id: 'case-studies', name: t('blog.categories.caseStudies'), count: 5 },
    { id: 'industry-insights', name: t('blog.categories.industryInsights'), count: 3 },
    { id: 'tutorials', name: t('blog.categories.tutorials'), count: 2 }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 'ai-transformation-manufacturing',
      title: 'How AI Transformed Manufacturing Operations at TechCorp: A Complete Case Study',
      excerpt: 'Discover how TechCorp reduced production costs by 35% and increased efficiency by 50% through strategic AI implementation in their manufacturing processes.',
      content: 'Full article content would go here...',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20headshot%20of%20Asian%20woman%20CEO%20in%20business%20attire%2C%20confident%20smile&image_size=square',
        role: 'CEO & Co-Founder'
      },
      publishedAt: '2024-01-15',
      readTime: 8,
      category: 'case-studies',
      tags: ['Manufacturing', 'AI Implementation', 'ROI', 'Process Optimization'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20manufacturing%20facility%20with%20AI%20robots%20and%20automated%20systems%2C%20high%20tech%20industrial%20setting&image_size=landscape_16_9',
      featured: true,
      views: 2847
    },
    {
      id: 'future-of-ai-business',
      title: 'The Future of AI in Business: 10 Trends That Will Shape 2024',
      excerpt: 'Explore the emerging AI trends that will revolutionize business operations, from autonomous decision-making to predictive analytics.',
      content: 'Full article content would go here...',
      author: {
        name: 'Dr. Michael Rodriguez',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20headshot%20of%20Hispanic%20male%20CTO%20with%20glasses%2C%20friendly%20expression&image_size=square',
        role: 'CTO & Co-Founder'
      },
      publishedAt: '2024-01-12',
      readTime: 6,
      category: 'ai-strategy',
      tags: ['AI Trends', 'Business Strategy', 'Future Tech', 'Innovation'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Futuristic%20business%20office%20with%20AI%20holographic%20displays%20and%20data%20visualizations%2C%20modern%20technology&image_size=landscape_16_9',
      featured: true,
      views: 1923
    },
    {
      id: 'automation-roi-calculator',
      title: 'Building an ROI Calculator for Process Automation: A Step-by-Step Guide',
      excerpt: 'Learn how to create a comprehensive ROI calculator that helps businesses understand the financial impact of automation initiatives.',
      content: 'Full article content would go here...',
      author: {
        name: 'Jennifer Walsh',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20headshot%20of%20Caucasian%20woman%20VP%20in%20business%20suit%2C%20warm%20smile&image_size=square',
        role: 'VP of Customer Success'
      },
      publishedAt: '2024-01-10',
      readTime: 12,
      category: 'tutorials',
      tags: ['ROI', 'Automation', 'Business Analysis', 'Financial Planning'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Business%20dashboard%20with%20ROI%20calculations%20and%20financial%20charts%2C%20professional%20analytics%20interface&image_size=landscape_16_9',
      featured: false,
      views: 1456
    },
    {
      id: 'ai-customer-service',
      title: 'Revolutionizing Customer Service with AI: Best Practices and Implementation',
      excerpt: 'Discover how leading companies are using AI to enhance customer experiences while reducing operational costs.',
      content: 'Full article content would go here...',
      author: {
        name: 'David Kim',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20headshot%20of%20Korean%20male%20engineer%20in%20casual%20business%20attire%2C%20confident%20look&image_size=square',
        role: 'Head of AI Engineering'
      },
      publishedAt: '2024-01-08',
      readTime: 7,
      category: 'automation',
      tags: ['Customer Service', 'AI Chatbots', 'CX Optimization', 'Implementation'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Modern%20customer%20service%20center%20with%20AI%20chatbot%20interfaces%20and%20support%20agents&image_size=landscape_16_9',
      featured: false,
      views: 1789
    },
    {
      id: 'data-driven-decisions',
      title: 'Making Data-Driven Decisions: How AI Analytics Transform Business Intelligence',
      excerpt: 'Learn how AI-powered analytics platforms are helping businesses make smarter, faster decisions based on real-time data insights.',
      content: 'Full article content would go here...',
      author: {
        name: 'Amanda Foster',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20headshot%20of%20African%20American%20woman%20product%20manager%2C%20bright%20smile&image_size=square',
        role: 'Head of Product'
      },
      publishedAt: '2024-01-05',
      readTime: 9,
      category: 'ai-strategy',
      tags: ['Data Analytics', 'Business Intelligence', 'Decision Making', 'AI Insights'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Advanced%20data%20analytics%20dashboard%20with%20AI%20insights%20and%20business%20intelligence%20charts&image_size=landscape_16_9',
      featured: false,
      views: 2134
    },
    {
      id: 'small-business-ai',
      title: 'AI for Small Businesses: Affordable Solutions That Drive Growth',
      excerpt: 'Explore cost-effective AI solutions specifically designed for small and medium businesses looking to compete with larger enterprises.',
      content: 'Full article content would go here...',
      author: {
        name: 'Robert Johnson',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20headshot%20of%20Caucasian%20male%20VP%20sales%20in%20navy%20suit%2C%20professional%20smile&image_size=square',
        role: 'VP of Sales'
      },
      publishedAt: '2024-01-03',
      readTime: 5,
      category: 'industry-insights',
      tags: ['Small Business', 'Affordable AI', 'Growth Strategy', 'SMB Solutions'],
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Small%20business%20office%20with%20modern%20AI%20technology%20and%20digital%20tools%2C%20entrepreneurial%20setting&image_size=landscape_16_9',
      featured: false,
      views: 987
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'oldest':
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      default: // latest
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              {t('blog.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('blog.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {post.category.replace('-', ' ')}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime} min read
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <Link to={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{post.author.name}</p>
                            <p className="text-sm text-gray-500">{formatDate(post.publishedAt)}</p>
                          </div>
                        </div>
                        
                        <Link
                          to={`/blog/${post.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Search and Filters */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                {/* Search */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Articles</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={t('blog.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <span className={`text-sm ${
                            selectedCategory === category.id ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {category.count}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="latest">{t('blog.sortBy.latest')}</option>
                    <option value="oldest">{t('blog.sortBy.oldest')}</option>
                    <option value="popular">{t('blog.sortBy.popular')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  All Articles
                  <span className="text-lg font-normal text-gray-500 ml-2">
                    ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'})
                  </span>
                </h2>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        {post.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                            {post.category.replace('-', ' ')}
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {post.views.toLocaleString()} views
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          <Link to={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{post.author.name}</p>
                              <div className="flex items-center text-gray-500 text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(post.publishedAt)}
                                <span className="mx-2">•</span>
                                <Clock className="w-3 h-3 mr-1" />
                                {post.readTime} min
                              </div>
                            </div>
                          </div>
                          
                          <Link
                            to={`/blog/${post.id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Read
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Stay Updated with AI Insights</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest AI trends, case studies, and implementation guides delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}