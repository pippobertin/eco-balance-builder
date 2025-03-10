
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Update scrolled state on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links with active state
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Report', path: '/report' },
    { name: 'About', path: '/about' },
  ];
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300',
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div 
            className="w-10 h-10 bg-esg-blue rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-medium text-lg">ESG</span>
          </motion.div>
          <span className="text-xl font-medium hidden sm:block">V-SME Reporter</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className="relative group"
            >
              <span className={cn(
                'text-sm font-medium transition-colors',
                location.pathname === link.path 
                  ? 'text-esg-blue' 
                  : 'text-foreground hover:text-esg-blue'
              )}>
                {link.name}
              </span>
              {location.pathname === link.path && (
                <motion.div 
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-esg-blue rounded-full"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          ))}
        </nav>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg px-5 py-2 text-sm font-medium bg-esg-blue text-white hover:bg-esg-blue/90 transition-colors"
        >
          Get Started
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Navbar;
