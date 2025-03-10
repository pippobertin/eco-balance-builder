
import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
  selectedStakeholdersCount: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  selectedStakeholdersCount
}) => {
  return (
    <div className="py-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
      >
        <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
      </motion.div>
      <h3 className="text-xl font-medium mb-2">Sondaggi inviati con successo!</h3>
      <p className="text-gray-500 dark:text-gray-400">
        I sondaggi sono stati inviati a {selectedStakeholdersCount} stakeholder selezionati.
      </p>
    </div>
  );
};

export default SuccessMessage;
