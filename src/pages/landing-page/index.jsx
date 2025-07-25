import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: "Building2",
      title: "Crypto Exchanges & DEXes",
      description: "Want to show regulators they care"
    },
    {
      icon: "Hammer",
      title: "DeFi & Wallet Projects",
      description: "Need better ops monitoring"
    },
    {
      icon: "Code",
      title: "Hackers & Builders",
      description: "Looking for real projects with impact"
    },
    {
      icon: "BarChart3",
      title: "Risk Analysts",
      description: "No-code YAML config for alerts"
    }
  ];

  const workSteps = [
    {
      step: "1",
      title: "Connect Wallets & APIs",
      description: "Fireblocks, RPC, and more",
      icon: "Wallet"
    },
    {
      step: "2",
      title: "Set Monitoring Rules",
      description: "Use templates or build your own",
      icon: "Settings"
    },
    {
      step: "3",
      title: "Get Alerts",
      description: "Via Telegram, Slack, or custom Webhooks",
      icon: "Bell"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Helmet>
        <title>VaultScope - Build Trust in Web3, One Alert at a Time</title>
        <meta name="description" content="Open-source modular toolkit for real-time risk monitoring, market surveillance, and wallet health tracking. Designed by compliance minds, built by devs who vibe." />
      </Helmet>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={32} className="text-primary" />
              <span className="text-xl font-bold text-foreground">VaultScope</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
              >
                Build Trust in Web3 —{' '}
                <span className="text-primary">One Alert at a Time</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"
              >
                An open-source modular toolkit for real-time risk monitoring, market surveillance, and wallet health tracking.
                Designed by compliance minds, built by devs who vibe.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link 
                  to="/dashboard" 
                  className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon name="Play" size={20} />
                  <span>Try Demo</span>
                </Link>
                <a 
                  href="#" 
                  className="px-8 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon name="Github" size={20} />
                  <span>Get Started on GitHub</span>
                </a>
                <a 
                  href="#" 
                  className="px-8 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon name="Users" size={20} />
                  <span>Join Community</span>
                </a>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1645731504293-ad4d5da42a10?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG98ZW58MHx8fGJsdWV8MTc1MzQ0ODA5M3ww&ixlib=rb-4.1.0&q=85"
                  alt="Crypto monitoring dashboard"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who is it for Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Who is it for?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              VaultScope is designed for professionals and organizations who need robust crypto monitoring and compliance tools.
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature.icon} size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
            >
              Get started with VaultScope in three simple steps. Our modular approach makes it easy to integrate with your existing systems.
            </motion.p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {workSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxibG9ja2NoYWlufGVufDB8fHxibHVlfDE3NTM0NDgxMDB8MA&ixlib=rb-4.1.0&q=85"
                  alt="Network monitoring diagram"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Ready to Secure Your Web3 Operations?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8"
            >
              Join thousands of organizations already using VaultScope for their crypto compliance and monitoring needs.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/dashboard" 
                className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
              >
                <Icon name="ArrowRight" size={20} />
                <span>Start Monitoring Now</span>
              </Link>
              <Link 
                to="/register" 
                className="px-8 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center space-x-2"
              >
                <Icon name="UserPlus" size={20} />
                <span>Create Account</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Icon name="Shield" size={24} className="text-primary" />
              <span className="text-lg font-semibold text-foreground">VaultScope</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Github" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="MessageCircle" size={20} />
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 VaultScope. Built for the Web3 community.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;