
import React from 'react';
import { motion } from 'framer-motion';
import { ChartPie, FileText, Shield, BarChart3, Leaf, Award } from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "ESG Reporting",
      description: "Create comprehensive ESG reports that comply with the V-SME standard."
    },
    {
      icon: <ChartPie className="h-6 w-6" />,
      title: "Data Visualization",
      description: "Transform complex sustainability data into clear, insightful visualizations."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Compliance Check",
      description: "Ensure your reports meet all regulatory requirements and industry standards."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Performance Tracking",
      description: "Monitor your ESG performance with year-over-year comparisons."
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Sustainability Goals",
      description: "Set, track, and achieve your environmental and social objectives."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Best Practices",
      description: "Access industry-specific best practices and improvement recommendations."
    }
  ];

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-24 bg-esg-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-3 bg-esg-blue/10 text-esg-blue rounded-full text-sm font-medium mb-4"
          >
            Features
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-semibold tracking-tight mb-4"
          >
            Everything you need for ESG reporting
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto text-esg-gray-medium"
          >
            Our platform provides all the tools you need to create comprehensive, compliant, and impactful sustainability reports.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariant}
              className="glass rounded-2xl p-8 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
            >
              <div className="w-12 h-12 rounded-xl bg-esg-blue/10 flex items-center justify-center text-esg-blue mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
              <p className="text-esg-gray-medium">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
