
// ATECO codes organized by macro-categories
export type AtecoCode = {
  code: string;
  description: string;
  category: string;
};

export const atecoCategories = [
  { id: "A", name: "A - AGRICOLTURA, SILVICOLTURA E PESCA" },
  { id: "B", name: "B - ESTRAZIONE DI MINERALI DA CAVE E MINIERE" },
  { id: "C", name: "C - ATTIVITÀ MANIFATTURIERE" },
  { id: "D", name: "D - FORNITURA DI ENERGIA ELETTRICA, GAS, VAPORE E ARIA CONDIZIONATA" },
  { id: "E", name: "E - FORNITURA DI ACQUA; RETI FOGNARIE, ATTIVITÀ DI GESTIONE DEI RIFIUTI E RISANAMENTO" },
  { id: "F", name: "F - COSTRUZIONI" },
  { id: "G", name: "G - COMMERCIO ALL'INGROSSO E AL DETTAGLIO; RIPARAZIONE DI AUTOVEICOLI E MOTOCICLI" },
  { id: "H", name: "H - TRASPORTO E MAGAZZINAGGIO" },
  { id: "I", name: "I - ATTIVITÀ DEI SERVIZI DI ALLOGGIO E DI RISTORAZIONE" },
  { id: "J", name: "J - SERVIZI DI INFORMAZIONE E COMUNICAZIONE" },
  { id: "K", name: "K - ATTIVITÀ FINANZIARIE E ASSICURATIVE" },
  { id: "L", name: "L - ATTIVITÀ IMMOBILIARI" },
  { id: "M", name: "M - ATTIVITÀ PROFESSIONALI, SCIENTIFICHE E TECNICHE" },
  { id: "N", name: "N - NOLEGGIO, AGENZIE DI VIAGGIO, SERVIZI DI SUPPORTO ALLE IMPRESE" },
  { id: "O", name: "O - AMMINISTRAZIONE PUBBLICA E DIFESA; ASSICURAZIONE SOCIALE OBBLIGATORIA" },
  { id: "P", name: "P - ISTRUZIONE" },
  { id: "Q", name: "Q - SANITÀ E ASSISTENZA SOCIALE" },
  { id: "R", name: "R - ATTIVITÀ ARTISTICHE, SPORTIVE, DI INTRATTENIMENTO E DIVERTIMENTO" },
  { id: "S", name: "S - ALTRE ATTIVITÀ DI SERVIZI" },
  { id: "T", name: "T - ATTIVITÀ DI FAMIGLIE E CONVIVENZE COME DATORI DI LAVORO" },
  { id: "U", name: "U - ORGANIZZAZIONI ED ORGANISMI EXTRATERRITORIALI" }
];

// Sample of most common ATECO codes per category
// In a real implementation, this would contain all 3157 codes
export const atecoCodes: AtecoCode[] = [
  // Category A - AGRICOLTURA, SILVICOLTURA E PESCA
  { code: "01.11.10", description: "Coltivazione di cereali (escluso il riso)", category: "A" },
  { code: "01.13.10", description: "Coltivazione di ortaggi", category: "A" },
  { code: "01.21.00", description: "Coltivazione di uva", category: "A" },
  { code: "01.41.00", description: "Allevamento di bovini da latte", category: "A" },
  { code: "01.50.00", description: "Coltivazioni agricole associate all'allevamento", category: "A" },
  { code: "02.10.00", description: "Silvicoltura e altre attività forestali", category: "A" },
  { code: "03.11.00", description: "Pesca in acque marine", category: "A" },
  
  // Category B - ESTRAZIONE DI MINERALI DA CAVE E MINIERE
  { code: "05.10.00", description: "Estrazione di carbon fossile", category: "B" },
  { code: "06.10.00", description: "Estrazione di petrolio greggio", category: "B" },
  { code: "07.10.00", description: "Estrazione di minerali metalliferi ferrosi", category: "B" },
  { code: "08.11.00", description: "Estrazione di pietre ornamentali", category: "B" },
  
  // Category C - ATTIVITÀ MANIFATTURIERE
  { code: "10.11.00", description: "Produzione di carne non di volatili", category: "C" },
  { code: "10.51.10", description: "Trattamento igienico del latte", category: "C" },
  { code: "10.71.10", description: "Produzione di prodotti di panetteria freschi", category: "C" },
  { code: "13.10.00", description: "Preparazione e filatura di fibre tessili", category: "C" },
  { code: "14.13.10", description: "Confezione di abbigliamento esterno", category: "C" },
  { code: "15.20.10", description: "Fabbricazione di calzature", category: "C" },
  { code: "16.10.00", description: "Taglio e piallatura del legno", category: "C" },
  { code: "18.12.00", description: "Altra stampa", category: "C" },
  { code: "20.13.09", description: "Fabbricazione di altri prodotti chimici di base inorganici", category: "C" },
  { code: "22.19.09", description: "Fabbricazione di altri prodotti in gomma", category: "C" },
  { code: "23.61.00", description: "Fabbricazione di prodotti in calcestruzzo per l'edilizia", category: "C" },
  { code: "24.10.00", description: "Siderurgia - Fabbricazione di ferro, acciaio e ferroleghe", category: "C" },
  { code: "25.11.00", description: "Fabbricazione di strutture metalliche e parti assemblate", category: "C" },
  { code: "26.20.00", description: "Fabbricazione di computer e unità periferiche", category: "C" },
  { code: "27.11.00", description: "Fabbricazione di motori, generatori e trasformatori elettrici", category: "C" },
  { code: "28.13.00", description: "Fabbricazione di altre pompe e compressori", category: "C" },
  { code: "29.10.00", description: "Fabbricazione di autoveicoli", category: "C" },
  { code: "30.11.02", description: "Cantieri navali per costruzioni metalliche e non metalliche", category: "C" },
  { code: "31.01.10", description: "Fabbricazione di mobili per ufficio e negozi", category: "C" },
  { code: "32.50.11", description: "Fabbricazione di materiale medico-chirurgico", category: "C" },
  { code: "33.12.10", description: "Riparazione e manutenzione di macchine di impiego generale", category: "C" },
  
  // Category D - FORNITURA DI ENERGIA ELETTRICA, GAS, VAPORE E ARIA CONDIZIONATA
  { code: "35.11.00", description: "Produzione di energia elettrica", category: "D" },
  { code: "35.22.00", description: "Distribuzione di combustibili gassosi", category: "D" },
  { code: "35.30.00", description: "Fornitura di vapore e aria condizionata", category: "D" },
  
  // Category E - FORNITURA DI ACQUA; RETI FOGNARIE, ATTIVITÀ DI GESTIONE DEI RIFIUTI
  { code: "36.00.00", description: "Raccolta, trattamento e fornitura di acqua", category: "E" },
  { code: "37.00.00", description: "Gestione delle reti fognarie", category: "E" },
  { code: "38.11.00", description: "Raccolta di rifiuti non pericolosi", category: "E" },
  { code: "38.21.09", description: "Trattamento e smaltimento di altri rifiuti non pericolosi", category: "E" },
  
  // Category F - COSTRUZIONI
  { code: "41.20.00", description: "Costruzione di edifici residenziali e non residenziali", category: "F" },
  { code: "42.11.00", description: "Costruzione di strade e autostrade", category: "F" },
  { code: "43.21.01", description: "Installazione di impianti elettrici in edifici", category: "F" },
  { code: "43.31.00", description: "Intonacatura e stuccatura", category: "F" },
  { code: "43.91.00", description: "Realizzazione di coperture", category: "F" },
  
  // Category G - COMMERCIO ALL'INGROSSO E AL DETTAGLIO
  { code: "45.11.01", description: "Commercio all'ingrosso e al dettaglio di autovetture", category: "G" },
  { code: "46.31.10", description: "Commercio all'ingrosso di frutta e ortaggi freschi", category: "G" },
  { code: "47.11.10", description: "Ipermercati", category: "G" },
  { code: "47.52.10", description: "Commercio al dettaglio di ferramenta, vernici, vetro", category: "G" },
  { code: "47.71.10", description: "Commercio al dettaglio di abbigliamento", category: "G" },
  { code: "47.73.10", description: "Farmacie", category: "G" },
  
  // Category H - TRASPORTO E MAGAZZINAGGIO
  { code: "49.31.00", description: "Trasporto terrestre di passeggeri in aree urbane", category: "H" },
  { code: "49.41.00", description: "Trasporto di merci su strada", category: "H" },
  { code: "50.20.00", description: "Trasporto marittimo e costiero di merci", category: "H" },
  { code: "51.10.10", description: "Trasporto aereo di passeggeri", category: "H" },
  { code: "52.10.10", description: "Magazzini di custodia e deposito", category: "H" },
  
  // Category I - ATTIVITÀ DEI SERVIZI DI ALLOGGIO E DI RISTORAZIONE
  { code: "55.10.00", description: "Alberghi", category: "I" },
  { code: "56.10.11", description: "Ristorazione con somministrazione", category: "I" },
  { code: "56.30.00", description: "Bar e altri esercizi simili", category: "I" },
  
  // Category J - SERVIZI DI INFORMAZIONE E COMUNICAZIONE
  { code: "58.11.00", description: "Edizione di libri", category: "J" },
  { code: "59.11.00", description: "Attività di produzione cinematografica", category: "J" },
  { code: "60.10.00", description: "Trasmissioni radiofoniche", category: "J" },
  { code: "61.10.00", description: "Telecomunicazioni fisse", category: "J" },
  { code: "62.01.00", description: "Produzione di software non connesso all'edizione", category: "J" },
  { code: "63.11.30", description: "Hosting e fornitura di servizi applicativi", category: "J" },
  
  // Category K - ATTIVITÀ FINANZIARIE E ASSICURATIVE
  { code: "64.19.10", description: "Intermediazione monetaria di istituti monetari", category: "K" },
  { code: "65.11.00", description: "Assicurazioni sulla vita", category: "K" },
  { code: "66.19.10", description: "Attività di gestione di fondi comuni", category: "K" },
  
  // Category L - ATTIVITÀ IMMOBILIARI
  { code: "68.10.00", description: "Compravendita di beni immobili", category: "L" },
  { code: "68.20.01", description: "Locazione immobiliare di beni propri", category: "L" },
  { code: "68.31.00", description: "Attività di mediazione immobiliare", category: "L" },
  
  // Category M - ATTIVITÀ PROFESSIONALI, SCIENTIFICHE E TECNICHE
  { code: "69.10.10", description: "Attività degli studi legali", category: "M" },
  { code: "69.20.11", description: "Servizi forniti da dottori commercialisti", category: "M" },
  { code: "70.22.01", description: "Attività di consulenza per la gestione aziendale", category: "M" },
  { code: "71.11.00", description: "Attività degli studi di architettura", category: "M" },
  { code: "71.12.10", description: "Attività degli studi di ingegneria", category: "M" },
  { code: "72.19.09", description: "Ricerca e sviluppo sperimentale nel campo delle scienze naturali", category: "M" },
  { code: "73.11.01", description: "Ideazione di campagne pubblicitarie", category: "M" },
  { code: "74.10.10", description: "Attività di design di moda", category: "M" },
  { code: "75.00.00", description: "Servizi veterinari", category: "M" },
  
  // Category N - NOLEGGIO, AGENZIE DI VIAGGIO, SERVIZI DI SUPPORTO ALLE IMPRESE
  { code: "77.11.00", description: "Noleggio di autovetture ed autoveicoli leggeri", category: "N" },
  { code: "79.11.00", description: "Attività delle agenzie di viaggio", category: "N" },
  { code: "80.10.00", description: "Servizi di vigilanza privata", category: "N" },
  { code: "81.21.00", description: "Pulizia generale (non specializzata) di edifici", category: "N" },
  { code: "82.11.01", description: "Servizi integrati di supporto per uffici", category: "N" },
  
  // Category O - AMMINISTRAZIONE PUBBLICA E DIFESA
  { code: "84.11.10", description: "Attività degli organi legislativi ed esecutivi", category: "O" },
  { code: "84.23.00", description: "Giustizia ed attività giudiziarie", category: "O" },
  { code: "84.30.00", description: "Assicurazione sociale obbligatoria", category: "O" },
  
  // Category P - ISTRUZIONE
  { code: "85.10.00", description: "Istruzione di grado preparatorio: scuole dell'infanzia", category: "P" },
  { code: "85.31.10", description: "Istruzione secondaria di primo grado: scuole medie", category: "P" },
  { code: "85.42.00", description: "Istruzione universitaria e post-universitaria", category: "P" },
  { code: "85.59.20", description: "Corsi di formazione e aggiornamento professionale", category: "P" },
  
  // Category Q - SANITÀ E ASSISTENZA SOCIALE
  { code: "86.10.10", description: "Ospedali e case di cura generici", category: "Q" },
  { code: "86.21.00", description: "Servizi degli studi medici di medicina generale", category: "Q" },
  { code: "87.10.00", description: "Strutture di assistenza residenziale per anziani", category: "Q" },
  { code: "88.91.00", description: "Servizi di asili nido e assistenza diurna per minori", category: "Q" },
  
  // Category R - ATTIVITÀ ARTISTICHE, SPORTIVE, DI INTRATTENIMENTO
  { code: "90.01.01", description: "Attività nel campo della recitazione", category: "R" },
  { code: "91.02.00", description: "Attività di musei", category: "R" },
  { code: "92.00.01", description: "Ricevitorie del Lotto, SuperEnalotto", category: "R" },
  { code: "93.11.10", description: "Gestione di stadi", category: "R" },
  { code: "93.21.00", description: "Parchi di divertimento e parchi tematici", category: "R" },
  
  // Category S - ALTRE ATTIVITÀ DI SERVIZI
  { code: "94.11.00", description: "Attività di organizzazione di datori di lavoro", category: "S" },
  { code: "95.11.00", description: "Riparazione di computer e periferiche", category: "S" },
  { code: "96.02.01", description: "Servizi dei saloni di barbiere e parrucchiere", category: "S" },
  
  // Category T - ATTIVITÀ DI FAMIGLIE E CONVIVENZE COME DATORI DI LAVORO
  { code: "97.00.00", description: "Attività di famiglie come datori di lavoro per personale domestico", category: "T" },
  
  // Category U - ORGANIZZAZIONI ED ORGANISMI EXTRATERRITORIALI
  { code: "99.00.00", description: "Organizzazioni ed organismi extraterritoriali", category: "U" }
];

// Function to get ATECO codes filtered by category
export const getAtecoCodesByCategory = (category: string): AtecoCode[] => {
  return atecoCodes.filter(code => code.category === category);
};

// Function to search ATECO codes by code or description
export const searchAtecoCodes = (query: string): AtecoCode[] => {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return atecoCodes.filter(
    code => 
      code.code.toLowerCase().includes(lowerQuery) || 
      code.description.toLowerCase().includes(lowerQuery)
  );
};
