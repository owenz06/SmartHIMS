import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  Search,
  ChevronRight,
  ExternalLink,
  Send,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

const HelpSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      questions: [
        {
          q: 'How do I add new inventory items?',
          a: 'Navigate to Inventory Management and click the "Add Item" button. Fill in the required details including item name, SKU, category, quantity, and reorder level.',
        },
        {
          q: 'How do I create a purchase order?',
          a: 'Go to Purchase Orders section and click "Create Purchase Order". Select the supplier, add items, specify quantities, and submit for approval.',
        },
        {
          q: 'What are the different user roles?',
          a: 'The system has 5 roles: Super Admin (full access), Admin (management access), Manager (approval authority), Pharmacist (inventory operations), and Procurement Officer (purchasing operations).',
        },
      ],
    },
    {
      id: 'inventory',
      title: 'Inventory Management',
      icon: FileText,
      questions: [
        {
          q: 'How do I track stock levels?',
          a: 'The Inventory page shows real-time stock levels for all items. Items below reorder level are highlighted with a warning icon. You can also set up low stock alerts in notifications.',
        },
        {
          q: 'How do I record stock in/out transactions?',
          a: 'Use the Stock In page to record received items and Stock Out page to record dispensed items. All transactions are logged in the audit trail.',
        },
        {
          q: 'Can I export inventory reports?',
          a: 'Yes, go to Reports & Analytics and use the export feature to download inventory data in CSV or PDF format.',
        },
      ],
    },
    {
      id: 'requisitions',
      title: 'Requisitions & Orders',
      icon: MessageCircle,
      questions: [
        {
          q: 'How do I submit a requisition?',
          a: 'Go to Requisitions, click "Create Requisition", select your department, add required items with quantities, and submit. Managers will be notified for approval.',
        },
        {
          q: 'How long does approval take?',
          a: 'Approval times vary by organization policy. You can track the status of your requisition in real-time and receive notifications when approved or rejected.',
        },
        {
          q: 'Can I edit a submitted requisition?',
          a: 'Pending requisitions can be edited before approval. Once approved, requisitions cannot be modified to maintain audit integrity.',
        },
      ],
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: FileText,
      questions: [
        {
          q: 'What reports are available?',
          a: 'The system provides stock movement reports, item usage analytics, low stock alerts, reorder suggestions, purchase order summaries, and requisition statistics.',
        },
        {
          q: 'How do I filter reports by date?',
          a: 'Use the date range picker at the top of the Reports page to select your desired time period. The default range is from the start of the current year.',
        },
        {
          q: 'Can I schedule automated reports?',
          a: 'Automated report scheduling is coming soon. Currently, you can manually generate and export reports as needed.',
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: 'User Guide',
      description: 'Complete documentation for all features',
      icon: Book,
      link: '/help/user-guide',
      external: false,
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      link: '/help/tutorials',
      external: false,
    },
    {
      title: 'API Documentation',
      description: 'For developers and integrations',
      icon: FileText,
      link: '/help/api-docs',
      external: false,
    },
    {
      title: 'Release Notes',
      description: 'Latest updates and features',
      icon: ExternalLink,
      link: '/help/release-notes',
      external: false,
    },
  ];

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'support@shims.com',
      icon: Mail,
      action: 'mailto:support@shims.com',
    },
    {
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      icon: Phone,
      action: 'tel:+15551234567',
    },
    {
      title: 'Live Chat',
      description: 'Available 9 AM - 5 PM EST',
      icon: MessageCircle,
      action: '#',
    },
  ];

  const handleContactSubmit = () => {
    if (!contactForm.subject || !contactForm.message) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactForm({ subject: '', message: '' });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  const filteredCategories = faqCategories.filter(category =>
    searchQuery === '' ||
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.questions.some(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <DashboardLayout
      title="Help & Support"
      subtitle="Get help and find answers to your questions"
      showSearch={false}
    >
      <div className="space-y-6 max-w-6xl">
        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link key={index} to={link.link}>
                <Card className="hover:shadow-lg dark:hover:shadow-primary/5 transition-shadow cursor-pointer border-border h-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;

                return (
                  <div key={category.id} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        setActiveCategory(isActive ? null : category.id)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">
                          {category.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({category.questions.length} questions)
                        </span>
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          isActive ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {isActive && (
                      <div className="border-t border-border p-4 space-y-4 bg-muted/20 dark:bg-muted/10">
                        {category.questions.map((item, idx) => (
                          <div key={idx} className="space-y-2">
                            <p className="font-medium text-foreground">{item.q}</p>
                            <p className="text-sm text-muted-foreground pl-4 border-l-2 border-primary">
                              {item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <a
                    key={index}
                    href={method.action}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors bg-card"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{method.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </a>
                );
              })}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <Input
                      placeholder="What do you need help with?"
                      value={contactForm.subject}
                      onChange={(e) =>
                        setContactForm(prev => ({ ...prev, subject: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Describe your issue or question..."
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm(prev => ({ ...prev, message: e.target.value }))
                      }
                      rows={6}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <Button
                    onClick={handleContactSubmit}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Version</p>
                <p className="font-semibold text-foreground">v1.0.0</p>
              </div>
              <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="font-semibold text-foreground">April 2026</p>
              </div>
              <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  All Systems Operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HelpSupport;
