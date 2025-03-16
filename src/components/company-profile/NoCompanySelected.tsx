
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NoCompanySelected = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Nessuna azienda selezionata</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/companies')}
            className="mt-4"
          >
            Torna alla lista aziende
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NoCompanySelected;
