
import React from 'react';
import { GitMerge } from 'lucide-react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { MaterialityIssue } from '../types';

interface IROSummaryProps {
  materialIssues: MaterialityIssue[];
}

const IROSummary: React.FC<IROSummaryProps> = ({ materialIssues }) => {
  // Filtriamo i temi che hanno selezioni IRO
  const issuesWithIRO = materialIssues.filter(issue => issue.iroSelections);
  
  if (issuesWithIRO.length === 0) {
    return null;
  }
  
  return (
    <GlassmorphicCard>
      <div className="flex items-center mb-4">
        <GitMerge className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-900">Riepilogo IRO e Azioni</h3>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">
        Questa tabella mostra i collegamenti tra i temi materiali e gli impatti, rischi, opportunità e azioni selezionati.
      </p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema Materiale</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impatti Positivi</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impatti Negativi</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rischi</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunità</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {issuesWithIRO.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{issue.name}</td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {(issue.iroSelections?.selectedPositiveImpacts || [])
                      .filter(Boolean)
                      .map((impact, index) => (
                        <li key={`positive-impact-${index}`} className="mb-1">{impact}</li>
                      ))}
                  </ul>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {(issue.iroSelections?.selectedNegativeImpacts || [])
                      .filter(Boolean)
                      .map((impact, index) => (
                        <li key={`negative-impact-${index}`} className="mb-1">{impact}</li>
                      ))}
                  </ul>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {(issue.iroSelections?.selectedRisks || [])
                      .filter(Boolean)
                      .map((risk, index) => (
                        <li key={`risk-${index}`} className="mb-1">{risk}</li>
                      ))}
                  </ul>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {(issue.iroSelections?.selectedOpportunities || [])
                      .filter(Boolean)
                      .map((opportunity, index) => (
                        <li key={`opportunity-${index}`} className="mb-1">{opportunity}</li>
                      ))}
                  </ul>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {(issue.iroSelections?.selectedActions || [])
                      .filter(Boolean)
                      .map((action, index) => (
                        <li key={`action-${index}`} className="mb-1">{action}</li>
                      ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassmorphicCard>
  );
};

export default IROSummary;
