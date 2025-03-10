
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardCard from '@/components/dashboard/DashboardCard';
import MetricChart from '@/components/dashboard/MetricChart';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  BarChart3, 
  Leaf, 
  Users, 
  Building2, 
  Flame,
  Download,
  Filter
} from 'lucide-react';

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  
  const environmentalData = [
    { month: 'Jan', emissions: 120, waste: 65, energy: 45 },
    { month: 'Feb', emissions: 132, waste: 59, energy: 49 },
    { month: 'Mar', emissions: 101, waste: 80, energy: 40 },
    { month: 'Apr', emissions: 94, waste: 81, energy: 38 },
    { month: 'May', emissions: 85, waste: 56, energy: 35 },
    { month: 'Jun', emissions: 90, waste: 55, energy: 40 },
    { month: 'Jul', emissions: 97, waste: 66, energy: 45 },
    { month: 'Aug', emissions: 88, waste: 50, energy: 38 },
    { month: 'Sep', emissions: 82, waste: 63, energy: 36 },
    { month: 'Oct', emissions: 78, waste: 59, energy: 35 },
    { month: 'Nov', emissions: 74, waste: 52, energy: 30 },
    { month: 'Dec', emissions: 70, waste: 48, energy: 28 },
  ];
  
  const socialData = [
    { name: 'Gender Diversity', value: 65 },
    { name: 'Employee Satisfaction', value: 78 },
    { name: 'Training Hours', value: 89 },
    { name: 'Community Engagement', value: 72 }
  ];
  
  const governanceData = [
    { quarter: 'Q1', compliance: 85, risk: 20, policy: 70 },
    { quarter: 'Q2', compliance: 88, risk: 18, policy: 75 },
    { quarter: 'Q3', compliance: 92, risk: 15, policy: 80 },
    { quarter: 'Q4', compliance: 95, risk: 12, policy: 85 },
  ];
  
  const performanceData = [
    { name: 'Environmental', value: 75 },
    { name: 'Social', value: 82 },
    { name: 'Governance', value: 88 },
  ];
  
  const staggerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold">ESG Performance Dashboard</h1>
                <p className="text-esg-gray-medium">Monitor and analyze your sustainability metrics</p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="glass p-2 rounded-lg flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className={selectedYear === "2021" ? "bg-esg-blue text-white" : ""} onClick={() => setSelectedYear("2021")}>2021</Button>
                  <Button variant="ghost" size="sm" className={selectedYear === "2022" ? "bg-esg-blue text-white" : ""} onClick={() => setSelectedYear("2022")}>2022</Button>
                  <Button variant="ghost" size="sm" className={selectedYear === "2023" ? "bg-esg-blue text-white" : ""} onClick={() => setSelectedYear("2023")}>2023</Button>
                </div>
                
                <Button variant="outline" size="sm" className="border-esg-blue">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <Button className="bg-esg-blue hover:bg-esg-blue/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Summary Cards */}
          <motion.div
            variants={staggerAnimation}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={itemAnimation}>
              <DashboardCard
                title="ESG Score"
                value={82}
                change={5}
                icon={<Activity className="h-5 w-5 text-esg-blue" />}
                description="Overall sustainability performance"
                glowColor="rgba(10, 132, 255, 0.15)"
              />
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <DashboardCard
                title="Carbon Emissions"
                value="70 tons"
                change={-12}
                icon={<Flame className="h-5 w-5 text-esg-blue" />}
                description="Total emissions for the period"
                glowColor="rgba(10, 132, 255, 0.15)"
              />
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <DashboardCard
                title="Workforce Diversity"
                value="65%"
                change={8}
                icon={<Users className="h-5 w-5 text-esg-blue" />}
                description="Gender balance improvement"
                glowColor="rgba(10, 132, 255, 0.15)"
              />
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <DashboardCard
                title="Governance Compliance"
                value="95%"
                change={3}
                icon={<Building2 className="h-5 w-5 text-esg-blue" />}
                description="Adherence to policies"
                glowColor="rgba(10, 132, 255, 0.15)"
              />
            </motion.div>
          </motion.div>
          
          {/* ESG Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">ESG Performance Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <MetricChart
                title="Environmental Performance"
                description="Monthly tracking of key environmental metrics"
                type="area"
                data={environmentalData}
                dataKey="month"
                categories={['emissions', 'waste', 'energy']}
                colors={['#0A84FF', '#34C759', '#5AC8FA']}
              />
              
              <MetricChart
                title="Social Initiatives"
                description="Performance across social dimensions"
                type="bar"
                data={socialData}
                dataKey="name"
                categories={['value']}
                colors={['#FF9500']}
              />
              
              <MetricChart
                title="Governance Metrics"
                description="Quarterly governance performance"
                type="area"
                data={governanceData}
                dataKey="quarter"
                categories={['compliance', 'risk', 'policy']}
                colors={['#64D2FF', '#FF2D55', '#BF5AF2']}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricChart
                title="Overall ESG Score Distribution"
                description="Performance across ESG dimensions"
                type="pie"
                data={performanceData}
                dataKey="name"
                colors={['#30D158', '#FF9F0A', '#5E5CE6']}
              />
              
              <GlassmorphicCard className="h-full">
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-medium mb-4">Sustainability Highlights</h3>
                  
                  <div className="space-y-4 flex-grow">
                    <div className="p-4 bg-esg-blue/10 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Leaf className="h-5 w-5 text-esg-blue mt-0.5" />
                        <div>
                          <h4 className="font-medium">Carbon Reduction</h4>
                          <p className="text-sm text-esg-gray-medium">Reduced carbon emissions by 12% through renewable energy initiatives.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-esg-blue/10 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-esg-blue mt-0.5" />
                        <div>
                          <h4 className="font-medium">Diversity Program</h4>
                          <p className="text-sm text-esg-gray-medium">Implemented new diversity hiring program increasing workforce diversity by 8%.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-esg-blue/10 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Building2 className="h-5 w-5 text-esg-blue mt-0.5" />
                        <div>
                          <h4 className="font-medium">Governance Update</h4>
                          <p className="text-sm text-esg-gray-medium">Updated compliance policies achieving 95% adherence rate.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full bg-esg-blue hover:bg-esg-blue/90">
                      View Complete Report
                    </Button>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
