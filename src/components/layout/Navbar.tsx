
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Building2, LayoutDashboard, FileText, Info, Home, Shield, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = user ? [{
    name: 'Home',
    path: '/',
    icon: Home
  }, {
    name: 'Companies',
    path: '/companies',
    icon: Building
  }, {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  }, {
    name: 'Report',
    path: '/report',
    icon: FileText
  }] : [{
    name: 'Home',
    path: '/',
    icon: Home
  }, {
    name: 'About',
    path: '/about',
    icon: Info
  }];

  return (
    <motion.header 
      initial={{
        opacity: 0,
        y: -20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.5
      }} 
      className={cn('fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300', scrolled ? 'glass shadow-sm' : 'bg-transparent')}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div 
            whileHover={{
              scale: 1.05
            }} 
            whileTap={{
              scale: 0.95
            }} 
            className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500"
          >
            <span className="text-white font-medium text-lg">ESG</span>
          </motion.div>
          <span className="text-xl font-medium hidden sm:block">V-SME Reporter</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="relative group">
              <span className={cn('text-sm font-medium transition-colors flex items-center gap-2', 
                location.pathname === link.path ? 'text-esg-blue' : 'text-foreground hover:text-esg-blue'
              )}>
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.name}
              </span>
              {location.pathname === link.path && 
                <motion.div layoutId="navbar-indicator" className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full bg-emerald-500" />
              }
            </Link>
          ))}
        </nav>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/user-management" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    <span>Gestione Utenti</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-red-500">
                <LogOut className="h-4 w-4" />
                <span>Disconnetti</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <motion.button 
              whileHover={{
                scale: 1.05
              }} 
              whileTap={{
                scale: 0.95
              }} 
              className="rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors bg-emerald-500 hover:bg-emerald-400"
            >
              Accedi
            </motion.button>
          </Link>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
