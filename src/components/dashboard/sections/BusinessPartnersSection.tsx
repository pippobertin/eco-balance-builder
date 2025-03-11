
import React from 'react';
import { ReportData } from '@/context/types';
import { Building2 } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { useNavigate } from 'react-router-dom';

interface BusinessPartnersSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const BusinessPartnersSection: React.FC<BusinessPartnersSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  const {
    totalSuppliers,
    localSuppliers,
    internationalSuppliers,
    certifiedSuppliers,
    positiveEsgImpactSuppliers,
    negativeEsgImpactSuppliers,
    avgPaymentTime,
    avgContractDuration
  } = reportData.businessPartnersMetrics || {};

  // BP1-BP2: Suppliers distribution
  const suppliersData = [];
  if (localSuppliers) {
    suppliersData.push({ name: 'Locali', value: localSuppliers });
  }
  if (internationalSuppliers) {
    suppliersData.push({ name: 'Internazionali', value: internationalSuppliers });
  }

  // BP3: Certified suppliers
  const certificationData = [];
  if (certifiedSuppliers) {
    certificationData.push({ name: 'Certificati', value: certifiedSuppliers });
  }
  if (totalSuppliers) {
    certificationData.push({ name: 'Non Certificati', value: totalSuppliers - (certifiedSuppliers || 0) });
  }

  // BP5-BP6: ESG Impact
  const impactData = [];
  if (positiveEsgImpactSuppliers) {
    impactData.push({ name: 'Impatto Positivo', value: positiveEsgImpactSuppliers });
  }
  if (negativeEsgImpactSuppliers) {
    impactData.push({ name: 'Impatto Negativo', value: negativeEsgImpactSuppliers });
  }

  // BP10-BP11: Contract metrics
  const paymentData = [];
  if (avgPaymentTime) {
    paymentData.push({ name: 'Tempo Medio Pagamento', value: avgPaymentTime });
  }

  const contractData = [];
  if (avgContractDuration) {
    contractData.push({ name: 'Durata Media Contratti', value: avgContractDuration });
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-6 w-6 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Partner Commerciali
          {companyName && <span className="text-orange-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricChart
          title="BP1-BP2 - Distribuzione Fornitori"
          description="Fornitori locali vs internazionali"
          type={suppliersData.length > 0 ? "donut" : "empty"}
          data={[
            { ring: 'inner', data: suppliersData, colors: ['#0EA5E9', '#F97316'] },
            { ring: 'outer', data: [{ name: 'Totale Fornitori', value: totalSuppliers || 0 }], colors: ['#8E9196'] }
          ]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'businessPartners', field: 'suppliers' } })}
        />
        
        <MetricChart
          title="BP3 - Fornitori Certificati"
          description="Fornitori con certificazioni di qualità"
          type={certificationData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: certificationData, colors: ['#34C759', '#FF3B30'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'businessPartners', field: 'certification' } })}
        />
        
        <MetricChart
          title="BP5-BP6 - Impatto ESG"
          description="Valutazione impatto ESG dei fornitori"
          type={impactData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: impactData, colors: ['#34C759', '#FF3B30'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'businessPartners', field: 'impact' } })}
        />
        
        <MetricChart
          title="BP10 - Tempi di Pagamento"
          description="Tempi medi di pagamento fornitori"
          type={paymentData.length > 0 ? "bar" : "empty"}
          data={paymentData}
          dataKey="name"
          categories={["value"]}
          colors={['#007AFF']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'businessPartners', field: 'payment' } })}
        />

        <MetricChart
          title="BP11 - Durata Contratti"
          description="Durata media dei contratti"
          type={contractData.length > 0 ? "bar" : "empty"}
          data={contractData}
          dataKey="name"
          categories={["value"]}
          colors={['#5856D6']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'businessPartners', field: 'contracts' } })}
        />
      </div>
    </div>
  );
};

export default BusinessPartnersSection;
