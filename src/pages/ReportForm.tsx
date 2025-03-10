
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { 
  Button,
  Card,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
} from '@/components/ui';
import { 
  Building, 
  Users, 
  Leaf, 
  ClipboardCheck, 
  ArrowRight, 
  ArrowLeft, 
  Save,
  CheckCircle,
} from 'lucide-react';

const ReportForm = () => {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 4;
  
  const handleNext = () => {
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const calculateProgress = () => {
    return (activeStep / totalSteps) * 100;
  };
  
  // Render form steps
  const renderFormStep = () => {
    switch (activeStep) {
      case 1:
        return <CompanyInfoStep />;
      case 2:
        return <EnvironmentalStep />;
      case 3:
        return <SocialStep />;
      case 4:
        return <GovernanceStep />;
      default:
        return <CompanyInfoStep />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">Create ESG Report</h1>
            <p className="text-esg-gray-medium">Complete the form to generate your V-SME compliant sustainability report</p>
          </motion.div>
          
          {/* Progress indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Step {activeStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium">
                {Math.round(calculateProgress())}% Complete
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </motion.div>
          
          {/* Step indicators */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StepIndicator 
              step={1} 
              activeStep={activeStep} 
              title="Company" 
              icon={<Building className="h-4 w-4" />} 
            />
            <StepIndicator 
              step={2} 
              activeStep={activeStep} 
              title="Environmental" 
              icon={<Leaf className="h-4 w-4" />} 
            />
            <StepIndicator 
              step={3} 
              activeStep={activeStep} 
              title="Social" 
              icon={<Users className="h-4 w-4" />} 
            />
            <StepIndicator 
              step={4} 
              activeStep={activeStep} 
              title="Governance" 
              icon={<ClipboardCheck className="h-4 w-4" />} 
            />
          </div>
          
          {/* Form container */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <GlassmorphicCard className="w-full" hover={false}>
              {renderFormStep()}
            </GlassmorphicCard>
          </motion.div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={activeStep === 1}
              className="border-esg-blue text-esg-blue hover:bg-esg-blue/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex space-x-3">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              
              {activeStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-esg-blue hover:bg-esg-blue/90">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-esg-blue hover:bg-esg-blue/90">
                  Generate Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Step Indicator Component
const StepIndicator = ({ step, activeStep, title, icon }) => {
  const isCompleted = activeStep > step;
  const isActive = activeStep === step;
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
          isCompleted 
            ? 'bg-esg-blue text-white' 
            : isActive 
              ? 'bg-esg-blue/10 text-esg-blue border-2 border-esg-blue' 
              : 'bg-esg-gray text-esg-gray-medium'
        }`}
      >
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : icon}
      </div>
      <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-esg-blue' : 'text-esg-gray-medium'}`}>
        {title}
      </span>
    </div>
  );
};

// Form Step Components
const CompanyInfoStep = () => {
  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold">Company Information</h2>
      <p className="text-esg-gray-medium mb-6">
        Provide basic information about your company to get started.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Company Name</label>
          <Input placeholder="Enter company name" />
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Industry</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Company Size</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (1-50 employees)</SelectItem>
              <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
              <SelectItem value="large">Large (251+ employees)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Year Founded</label>
          <Input type="number" placeholder="Enter founding year" />
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium">Headquarters Location</label>
        <Input placeholder="Enter headquarters location" />
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium">Company Description</label>
        <Textarea 
          placeholder="Provide a brief description of your company" 
          rows={4}
        />
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium">Sustainability Statement</label>
        <Textarea 
          placeholder="Describe your company's approach to sustainability" 
          rows={4}
        />
      </div>
    </div>
  );
};

const EnvironmentalStep = () => {
  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold">Environmental Information</h2>
      <p className="text-esg-gray-medium mb-6">
        Provide details about your environmental impact and initiatives.
      </p>
      
      <div className="space-y-6">
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Carbon Emissions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Total CO2 Emissions (tons)</label>
              <Input type="number" placeholder="Enter total emissions" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Reporting Period</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Emission Reduction Initiatives</label>
            <Textarea 
              placeholder="Describe initiatives to reduce emissions" 
              rows={3}
            />
          </div>
        </Card>
        
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Energy Consumption</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Total Energy Consumption (kWh)</label>
              <Input type="number" placeholder="Enter energy consumption" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Renewable Energy Percentage</label>
              <Input type="number" placeholder="Enter percentage" max="100" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Energy Efficiency Measures</label>
            <Textarea 
              placeholder="Describe energy efficiency measures" 
              rows={3}
            />
          </div>
        </Card>
        
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Waste Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Total Waste Generated (tons)</label>
              <Input type="number" placeholder="Enter waste generated" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Recycling Rate (%)</label>
              <Input type="number" placeholder="Enter recycling rate" max="100" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Waste Reduction Initiatives</label>
            <Textarea 
              placeholder="Describe waste reduction initiatives" 
              rows={3}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const SocialStep = () => {
  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold">Social Information</h2>
      <p className="text-esg-gray-medium mb-6">
        Provide details about your social impact and workforce.
      </p>
      
      <div className="space-y-6">
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Workforce Diversity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Gender Diversity (% women)</label>
              <Input type="number" placeholder="Enter percentage" max="100" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Management Diversity (% women in management)</label>
              <Input type="number" placeholder="Enter percentage" max="100" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Diversity Initiatives</label>
            <Textarea 
              placeholder="Describe diversity and inclusion initiatives" 
              rows={3}
            />
          </div>
        </Card>
        
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Employee Development</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Average Training Hours per Employee</label>
              <Input type="number" placeholder="Enter hours" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Employee Satisfaction Score (%)</label>
              <Input type="number" placeholder="Enter percentage" max="100" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Professional Development Programs</label>
            <Textarea 
              placeholder="Describe professional development programs" 
              rows={3}
            />
          </div>
        </Card>
        
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Community Engagement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Community Service Hours</label>
              <Input type="number" placeholder="Enter total hours" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Charitable Contributions</label>
              <Input placeholder="Enter amount" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Community Initiatives</label>
            <Textarea 
              placeholder="Describe community engagement initiatives" 
              rows={3}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const GovernanceStep = () => {
  return (
    <div className="space-y-6 p-1">
      <h2 className="text-xl font-semibold">Governance Information</h2>
      <p className="text-esg-gray-medium mb-6">
        Provide details about your governance structure and policies.
      </p>
      
      <div className="space-y-6">
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Board Composition</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Board Size</label>
              <Input type="number" placeholder="Enter number of board members" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Independent Directors (%)</label>
              <Input type="number" placeholder="Enter percentage" max="100" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Board Diversity</label>
            <Textarea 
              placeholder="Describe board diversity" 
              rows={3}
            />
          </div>
        </Card>
        
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Ethics & Compliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Ethics Policy</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, we have one</SelectItem>
                  <SelectItem value="inProgress">In development</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Whistleblower Policy</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, we have one</SelectItem>
                  <SelectItem value="inProgress">In development</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Ethics Training</label>
            <Textarea 
              placeholder="Describe ethics training programs" 
              rows={3}
            />
          </div>
        </Card>
        
        <Card className="p-5 border border-esg-blue/20">
          <h3 className="text-lg font-medium mb-4">Risk Management</h3>
          
          <div className="space-y-3 mb-6">
            <label className="text-sm font-medium">Risk Assessment Process</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal process in place</SelectItem>
                <SelectItem value="informal">Informal process</SelectItem>
                <SelectItem value="developing">In development</SelectItem>
                <SelectItem value="none">No process</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium">ESG Risk Management</label>
            <Textarea 
              placeholder="Describe how ESG risks are managed" 
              rows={3}
            />
          </div>
        </Card>
      </div>
      
      <div className="pt-4">
        <div className="p-4 bg-esg-blue/10 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <CheckCircle className="h-5 w-5 text-esg-blue mr-2" />
            Ready to Generate Report
          </h3>
          <p className="text-sm text-esg-gray-medium">
            You've completed all the required information. Click "Generate Report" to create your V-SME compliant ESG report.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
