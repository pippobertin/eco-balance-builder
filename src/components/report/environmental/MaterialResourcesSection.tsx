
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MaterialResourcesSectionProps {
  reportId?: string;
}

const MaterialResourcesSection: React.FC<MaterialResourcesSectionProps> = ({ reportId }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>B6-B7. Risorse Materiali e Circolari</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Questa sezione è in fase di sviluppo</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialResourcesSection;
