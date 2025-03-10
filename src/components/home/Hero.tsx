import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
const Hero = () => {
  return <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-esg-blue opacity-5 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-esg-blue-light opacity-5 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
      </div>
      
      {/* Label */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="mb-6">
        <span className="inline-block py-1.5 px-4 bg-esg-blue/10 text-esg-blue rounded-full text-sm font-medium">
          V-SME Standard Compliant
        </span>
      </motion.div>
      
      {/* Heading */}
      <motion.h1 initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.1
    }} className="max-w-4xl mb-6 text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight">
        Build <span className="text-emerald-500">ESG</span> reports that make a difference
      </motion.h1>
      
      {/* Description */}
      <motion.p initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.2
    }} className="max-w-2xl mb-10 text-lg text-esg-gray-medium">
        Create professional sustainability reports with our intuitive platform. Designed for small and medium enterprises following the V-SME standard.
      </motion.p>
      
      {/* CTA Buttons */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.3
    }} className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="text-white px-8 bg-emerald-500 hover:bg-emerald-400">
          Start your report
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button size="lg" variant="outline" className="border-esg-blue text-esg-blue hover:bg-esg-blue/10">
          Learn more
        </Button>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1,
      duration: 0.8
    }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-esg-blue to-transparent relative">
          <div className="w-1.5 h-1.5 bg-esg-blue rounded-full absolute -left-[2px] animate-bounce"></div>
        </div>
      </motion.div>
    </section>;
};
export default Hero;