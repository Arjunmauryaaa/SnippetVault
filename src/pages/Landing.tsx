import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Search, Copy, Tag, Shield, Zap, ArrowRight, Github, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
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
    icon: Code2,
    title: 'Syntax Highlighting',
    description: 'Beautiful code highlighting for 15+ languages with dark theme optimized colors.'
  },
  {
    icon: Search,
    title: 'Instant Search',
    description: 'Find any snippet in milliseconds. Search by title, tags, or language.'
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description: 'Copy code snippets to clipboard instantly with a single click.'
  },
  {
    icon: Tag,
    title: 'Smart Organization',
    description: 'Organize with tags and categories. Filter by language or custom tags.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your snippets are encrypted and only accessible by you.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed. Instant loading and real-time sync across devices.'
  }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-hero-gradient" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />
      
      {/* Floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">SnippetVault</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {user ? (
                <Button asChild variant="hero" size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button asChild variant="hero">
                    <Link to="/auth?mode=signup">Get Started</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-32">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
              variants={fadeInUp}
            >
              <Zap className="w-4 h-4" />
              <span>The developer's code companion</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              variants={fadeInUp}
            >
              Your Code Snippets,{' '}
              <span className="gradient-text">Organized & Secured</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Save, organize, and access your code snippets from anywhere. 
              Built for developers who value speed and simplicity.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button asChild variant="hero" size="xl">
                <Link to="/auth?mode=signup">
                  Start For Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="hero-secondary" size="xl">
                <Link to="/auth">
                  <Github className="w-5 h-5 mr-2" />
                  View Demo
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Code Preview */}
          <motion.div 
            className="mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="glass-card p-1 glow">
              <div className="bg-card rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-sm text-muted-foreground ml-4 font-mono">snippet-manager.tsx</span>
                </div>
                <pre className="p-6 font-mono text-sm overflow-x-auto">
                  <code>
                    <span className="text-code-keyword">const</span>{' '}
                    <span className="text-code-function">useSnippets</span>{' '}
                    <span className="text-foreground">=</span>{' '}
                    <span className="text-foreground">()</span>{' '}
                    <span className="text-code-keyword">=&gt;</span>{' '}
                    <span className="text-foreground">{'{'}</span>
                    {'\n'}
                    <span className="text-code-comment">  // Fetch and manage your code snippets</span>
                    {'\n'}
                    <span className="text-code-keyword">  const</span>{' '}
                    <span className="text-foreground">[snippets, setSnippets]</span>{' '}
                    <span className="text-foreground">=</span>{' '}
                    <span className="text-code-function">useState</span>
                    <span className="text-foreground">([])</span>
                    {'\n'}
                    {'\n'}
                    <span className="text-code-keyword">  return</span>{' '}
                    <span className="text-foreground">{'{ snippets, create, update, delete }'}</span>
                    {'\n'}
                    <span className="text-foreground">{'}'}</span>
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-24">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to make code management effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card-hover p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <motion.div 
            className="glass-card p-12 text-center glow"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join developers who trust SnippetVault for their code management needs.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to="/auth?mode=signup">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">SnippetVault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SnippetVault.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
