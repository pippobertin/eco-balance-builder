
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TransportDistanceInputProps {
  transportDistance: string;
  setTransportDistance: (value: string) => void;
}

const TransportDistanceInput: React.FC<TransportDistanceInputProps> = ({
  transportDistance,
  setTransportDistance
}) => {
  return (
    <div>
      <Label>Distanza percorsa (km)</Label>
      <Input 
        type="number" 
        value={transportDistance} 
        onChange={(e) => setTransportDistance(e.target.value)}
        placeholder="Inserisci distanza in km"
        className="bg-white"
      />
    </div>
  );
};

export default TransportDistanceInput;
