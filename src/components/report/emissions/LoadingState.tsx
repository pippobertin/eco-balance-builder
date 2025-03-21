
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="border rounded-md p-4 bg-white/80">
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Caricamento dati delle emissioni...</p>
      </div>
    </div>
  );
};

export default LoadingState;
