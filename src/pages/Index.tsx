
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';

const Index = () => {
  const benefits = [
    "Compliant with V-SME ESG standards",
    "Intuitive data collection process",
    "Automated report generation",
    "Performance tracking dashboard",
    "Industry benchmarking",
    "Improvement recommendations"
  ];

  const testimonials = [
    {
      quote: "This platform made it remarkably easy to create our first ESG report. The guidance and templates were invaluable.",
      author: "Maria Rodriguez",
      position: "Sustainability Director, GreenTech Solutions"
    },
    {
      quote: "V-SME Reporter streamlined our reporting process. What used to take months now takes weeks, with better quality results.",
      author: "Thomas Chen",
      position: "COO, EcoInnovate"
    },
    {
      quote: "As a small business, we thought ESG reporting would be overwhelming. This platform made it accessible and manageable.",
      author: "Sophie Martin",
      position: "Founder, Sustainable Crafts"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Features />
        
        {/* Benefits section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block py-1 px-3 bg-esg-blue/10 text-esg-blue rounded-full text-sm font-medium mb-4">
                  Why Choose Us
                </span>
                <h2 className="text-4xl font-semibold tracking-tight mb-6">
                  Simplify your ESG reporting journey
                </h2>
                <p className="text-esg-gray-medium mb-8">
                  Our platform transforms complex ESG reporting into a straightforward, manageable process. We guide you through each step, ensuring your reports are compliant, comprehensive, and impactful.
                </p>
                
                <ul className="space-y-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <CheckCircle className="h-5 w-5 text-esg-blue mr-3 mt-0.5" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <Button className="bg-esg-blue hover:bg-esg-blue/90">
                  Learn more
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-esg-blue opacity-5 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-esg-blue-light opacity-5 rounded-full filter blur-3xl"></div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <GlassmorphicCard 
                    className="w-full"
                    glowColor="rgba(10, 132, 255, 0.15)"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1611175694989-4870fafa4494?q=80&w=1287&auto=format&fit=crop"
                      alt="ESG Reporting Dashboard" 
                      className="w-full h-auto rounded-lg object-cover"
                    />
                    <div className="mt-6 space-y-4">
                      <h3 className="text-xl font-medium">Intuitive Reporting Interface</h3>
                      <p className="text-esg-gray-medium">
                        Our user-friendly platform guides you through the data collection and report generation process with ease.
                      </p>
                      <Button variant="outline" className="border-esg-blue text-esg-blue hover:bg-esg-blue/10">
                        See how it works
                      </Button>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-24 bg-esg-gray">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block py-1 px-3 bg-esg-blue/10 text-esg-blue rounded-full text-sm font-medium mb-4"
              >
                Testimonials
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-semibold tracking-tight mb-4"
              >
                What our clients say
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-2xl mx-auto text-esg-gray-medium"
              >
                Discover how our platform is helping businesses of all sizes create impactful ESG reports.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassmorphicCard>
                    <div className="flex flex-col space-y-6">
                      <div>
                        <svg className="h-8 w-8 text-esg-blue mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 11.5C10 12.3284 9.32843 13 8.5 13C7.67157 13 7 12.3284 7 11.5C7 10.6716 7.67157 10 8.5 10C9.32843 10 10 10.6716 10 11.5Z" fill="currentColor" />
                          <path d="M17 11.5C17 12.3284 16.3284 13 15.5 13C14.6716 13 14 12.3284 14 11.5C14 10.6716 14.6716 10 15.5 10C16.3284 10 17 10.6716 17 11.5Z" fill="currentColor" />
                          <path d="M12 18C14.7614 18 17 15.7614 17 13H7C7 15.7614 9.23858 18 12 18Z" fill="currentColor" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" fill="currentColor" />
                        </svg>
                        <p className="italic text-esg-gray-dark">"{testimonial.quote}"</p>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-esg-gray-medium">{testimonial.position}</p>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-esg-blue opacity-5 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-esg-blue-light opacity-5 rounded-full filter blur-3xl"></div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative z-10 glass rounded-3xl p-16 text-center"
              >
                <h2 className="text-4xl font-semibold tracking-tight mb-6">
                  Ready to start your ESG reporting journey?
                </h2>
                <p className="max-w-2xl mx-auto text-esg-gray-medium mb-10">
                  Join businesses from around the world using our platform to create impactful ESG reports that showcase their sustainability efforts.
                </p>
                <Button size="lg" className="bg-esg-blue text-white hover:bg-esg-blue/90 px-8">
                  Get started today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
