
import React from 'react';
import { ReportData } from '@/context/types';
import { Users } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

interface SocialSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const SocialSection: React.FC<SocialSectionProps> = ({ reportData, companyName }) => {
  const {
    totalEmployees,
    maleEmployees,
    femaleEmployees,
    otherGenderEmployees,
    permanentEmployees,
    temporaryEmployees,
    fullTimeEmployees,
    partTimeEmployees,
    avgTrainingHoursMale,
    avgTrainingHoursFemale,
    employeeTurnover,
    workAccidents
  } = reportData.socialMetrics || {};
  
  // Prepara i dati per i grafici basati sui campi delle informative sociali
  
  // Dati sulla composizione di genere
  const genderData = [];
  if (maleEmployees || femaleEmployees || otherGenderEmployees) {
    if (maleEmployees) {
      genderData.push({
        name: 'Uomini',
        value: typeof maleEmployees === 'number' ? maleEmployees : 
               typeof maleEmployees === 'string' ? parseInt(maleEmployees, 10) || 0 : 0
      });
    }
    
    if (femaleEmployees) {
      genderData.push({
        name: 'Donne',
        value: typeof femaleEmployees === 'number' ? femaleEmployees : 
               typeof femaleEmployees === 'string' ? parseInt(femaleEmployees, 10) || 0 : 0
      });
    }
    
    if (otherGenderEmployees) {
      genderData.push({
        name: 'Altro',
        value: typeof otherGenderEmployees === 'number' ? otherGenderEmployees : 
               typeof otherGenderEmployees === 'string' ? parseInt(otherGenderEmployees, 10) || 0 : 0
      });
    }
  }
  
  // Dati sul tipo di contratto
  const contractData = [];
  if (permanentEmployees || temporaryEmployees) {
    if (permanentEmployees) {
      contractData.push({
        name: 'Dipendenti a Tempo Indeterminato',
        value: typeof permanentEmployees === 'number' ? permanentEmployees : 
               typeof permanentEmployees === 'string' ? parseInt(permanentEmployees, 10) || 0 : 0
      });
    }
    
    if (temporaryEmployees) {
      contractData.push({
        name: 'Dipendenti a Tempo Determinato',
        value: typeof temporaryEmployees === 'number' ? temporaryEmployees : 
               typeof temporaryEmployees === 'string' ? parseInt(temporaryEmployees, 10) || 0 : 0
      });
    }
  }
  
  // Dati sul tipo di impiego
  const employmentData = [];
  if (fullTimeEmployees || partTimeEmployees) {
    if (fullTimeEmployees) {
      employmentData.push({
        name: 'Full-Time',
        value: typeof fullTimeEmployees === 'number' ? fullTimeEmployees : 
               typeof fullTimeEmployees === 'string' ? parseInt(fullTimeEmployees, 10) || 0 : 0
      });
    }
    
    if (partTimeEmployees) {
      employmentData.push({
        name: 'Part-Time',
        value: typeof partTimeEmployees === 'number' ? partTimeEmployees : 
               typeof partTimeEmployees === 'string' ? parseInt(partTimeEmployees, 10) || 0 : 0
      });
    }
  }
  
  // Dati sulla formazione - Etichette modificate per mostrare solo "Uomini" e "Donne"
  const trainingData = [];
  if (avgTrainingHoursMale || avgTrainingHoursFemale) {
    if (avgTrainingHoursMale) {
      trainingData.push({
        name: 'Uomini',
        value: typeof avgTrainingHoursMale === 'number' ? avgTrainingHoursMale : 
               typeof avgTrainingHoursMale === 'string' ? parseFloat(avgTrainingHoursMale) || 0 : 0
      });
    }
    
    if (avgTrainingHoursFemale) {
      trainingData.push({
        name: 'Donne',
        value: typeof avgTrainingHoursFemale === 'number' ? avgTrainingHoursFemale : 
               typeof avgTrainingHoursFemale === 'string' ? parseFloat(avgTrainingHoursFemale) || 0 : 0
      });
    }
  }
  
  // Dati su turnover e sicurezza
  const safetyData = [];
  if (employeeTurnover || workAccidents) {
    if (employeeTurnover) {
      safetyData.push({
        name: 'Turnover Dipendenti',
        value: typeof employeeTurnover === 'number' ? employeeTurnover : 
               typeof employeeTurnover === 'string' ? parseFloat(employeeTurnover) || 0 : 0
      });
    }
    
    if (workAccidents) {
      safetyData.push({
        name: 'Incidenti sul Lavoro',
        value: typeof workAccidents === 'number' ? workAccidents : 
               typeof workAccidents === 'string' ? parseInt(workAccidents, 10) || 0 : 0
      });
    }
  }
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Performance Sociale
          {companyName && <span className="text-blue-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Grafico composizione di genere - Colori aggiornati per genere */}
        <MetricChart
          title="Composizione di Genere"
          description="Distribuzione dei dipendenti per genere"
          type={genderData.length > 0 ? "bar" : "empty"}
          data={genderData}
          dataKey="name"
          categories={["value"]}
          colors={["#0EA5E9", "#FFDEE2", "#BF5AF2"]} {/* Azzurro per uomini, Rosa per donne, Viola per altro */}
        />
        
        {/* Grafico tipo di contratto */}
        <MetricChart
          title="Tipo di Contratto"
          description="Distribuzione per tipo di contratto"
          type={contractData.length > 0 ? "bar" : "empty"}
          data={contractData}
          dataKey="name"
          categories={["value"]}
          colors={["#34C759", "#FF9500"]}
        />
        
        {/* Grafico tipo di impiego */}
        <MetricChart
          title="Tipo di Impiego"
          description="Distribuzione full-time vs part-time"
          type={employmentData.length > 0 ? "bar" : "empty"}
          data={employmentData}
          dataKey="name"
          categories={["value"]}
          colors={["#007AFF", "#5856D6"]}
        />
        
        {/* Grafico formazione - Etichette e colori aggiornati */}
        <MetricChart
          title="Formazione"
          description="Ore medie di formazione per genere"
          type={trainingData.length > 0 ? "bar" : "empty"}
          data={trainingData}
          dataKey="name"
          categories={["value"]}
          colors={["#0EA5E9", "#FFDEE2"]} {/* Azzurro per uomini, Rosa per donne */}
        />
        
        {/* Grafico sicurezza */}
        <MetricChart
          title="Turnover e Sicurezza"
          description="Indicatori di turnover e sicurezza sul lavoro"
          type={safetyData.length > 0 ? "bar" : "empty"}
          data={safetyData}
          dataKey="name"
          categories={["value"]}
          colors={["#FF9500", "#FF3B30"]}
        />
      </div>
    </div>
  );
};

export default SocialSection;
