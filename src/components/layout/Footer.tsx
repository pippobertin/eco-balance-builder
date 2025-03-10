import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerSections = [{
    title: 'Product',
    links: [{
      name: 'Dashboard',
      path: '/dashboard'
    }, {
      name: 'Report Generator',
      path: '/report'
    }, {
      name: 'ESG Guidelines',
      path: '/guidelines'
    }, {
      name: 'V-SME Standard',
      path: '/standard'
    }]
  }, {
    title: 'Company',
    links: [{
      name: 'About',
      path: '/about'
    }, {
      name: 'Pricing',
      path: '/pricing'
    }, {
      name: 'Contact',
      path: '/contact'
    }, {
      name: 'Careers',
      path: '/careers'
    }]
  }, {
    title: 'Resources',
    links: [{
      name: 'Blog',
      path: '/blog'
    }, {
      name: 'Documentation',
      path: '/docs'
    }, {
      name: 'Support',
      path: '/support'
    }, {
      name: 'Webinars',
      path: '/webinars'
    }]
  }];
  const staggerAnimation = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemAnimation = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  return <footer className="bg-esg-gray">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500">
                <span className="text-white font-medium text-lg">ESG</span>
              </div>
              <span className="text-xl font-medium">V-SME Reporter</span>
            </Link>
            <p className="mt-4 text-esg-gray-medium text-sm">
              Helping businesses create sustainable, compliant ESG reports following the V-SME standard.
            </p>
          </div>
          
          {footerSections.map((section, index) => <motion.div key={index} initial="hidden" whileInView="visible" viewport={{
          once: true
        }} variants={staggerAnimation}>
              <h4 className="text-base font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => <motion.li key={i} variants={itemAnimation}>
                    <Link to={link.path} className="text-esg-gray-medium text-sm hover:text-esg-blue transition-colors">
                      {link.name}
                    </Link>
                  </motion.li>)}
              </ul>
            </motion.div>)}
        </div>
        
        <div className="mt-12 pt-8 border-t border-esg-gray-medium/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-esg-gray-medium">
            © {currentYear} V-SME Reporter. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-esg-gray-medium hover:text-esg-blue transition-colors">
              Terms
            </a>
            <a href="#" className="text-esg-gray-medium hover:text-esg-blue transition-colors">
              Privacy
            </a>
            <a href="#" className="text-esg-gray-medium hover:text-esg-blue transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;