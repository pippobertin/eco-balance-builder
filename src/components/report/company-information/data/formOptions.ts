
// Form options for company information

// Mappa di codici ATECO raggruppati per codice NACE
export const atecoByNaceMap = {
  "A": [
    { value: "01", label: "01 - Coltivazioni agricole e produzione di prodotti animali" },
    { value: "02", label: "02 - Silvicoltura ed utilizzo di aree forestali" },
    { value: "03", label: "03 - Pesca e acquacoltura" }
  ],
  "B": [
    { value: "05", label: "05 - Estrazione di carbone" },
    { value: "06", label: "06 - Estrazione di petrolio greggio e gas naturale" },
    { value: "07", label: "07 - Estrazione di minerali metalliferi" },
    { value: "08", label: "08 - Altre attività di estrazione di minerali" },
    { value: "09", label: "09 - Attività dei servizi di supporto all'estrazione" }
  ],
  "C": [
    { value: "10", label: "10 - Industrie alimentari" },
    { value: "11", label: "11 - Industria delle bevande" },
    { value: "12", label: "12 - Industria del tabacco" },
    { value: "13", label: "13 - Industrie tessili" },
    { value: "14", label: "14 - Confezione di articoli di abbigliamento" },
    { value: "15", label: "15 - Fabbricazione di articoli in pelle" },
    { value: "16", label: "16 - Industria del legno e dei prodotti in legno" },
    { value: "17", label: "17 - Fabbricazione di carta e prodotti di carta" },
    { value: "18", label: "18 - Stampa e riproduzione di supporti registrati" },
    { value: "19", label: "19 - Fabbricazione di coke e prodotti derivanti dalla raffinazione del petrolio" },
    { value: "20", label: "20 - Fabbricazione di prodotti chimici" },
    { value: "21", label: "21 - Fabbricazione di prodotti farmaceutici" },
    { value: "22", label: "22 - Fabbricazione di articoli in gomma e materie plastiche" },
    { value: "23", label: "23 - Fabbricazione di altri prodotti della lavorazione di minerali non metalliferi" },
    { value: "24", label: "24 - Metallurgia" },
    { value: "25", label: "25 - Fabbricazione di prodotti in metallo" },
    { value: "26", label: "26 - Fabbricazione di computer e prodotti elettronici" },
    { value: "27", label: "27 - Fabbricazione di apparecchiature elettriche" },
    { value: "28", label: "28 - Fabbricazione di macchinari ed apparecchiature" },
    { value: "29", label: "29 - Fabbricazione di autoveicoli, rimorchi e semirimorchi" },
    { value: "30", label: "30 - Fabbricazione di altri mezzi di trasporto" },
    { value: "31", label: "31 - Fabbricazione di mobili" },
    { value: "32", label: "32 - Altre industrie manifatturiere" },
    { value: "33", label: "33 - Riparazione, manutenzione ed installazione di macchine ed apparecchiature" }
  ],
  "D": [
    { value: "35", label: "35 - Fornitura di energia elettrica, gas, vapore e aria condizionata" }
  ],
  "E": [
    { value: "36", label: "36 - Raccolta, trattamento e fornitura di acqua" },
    { value: "37", label: "37 - Gestione delle reti fognarie" },
    { value: "38", label: "38 - Attività di raccolta, trattamento e smaltimento dei rifiuti" },
    { value: "39", label: "39 - Attività di risanamento e altri servizi di gestione dei rifiuti" }
  ],
  "F": [
    { value: "41", label: "41 - Costruzione di edifici" },
    { value: "42", label: "42 - Ingegneria civile" },
    { value: "43", label: "43 - Lavori di costruzione specializzati" }
  ],
  "G": [
    { value: "45", label: "45 - Commercio all'ingrosso e al dettaglio e riparazione di autoveicoli e motocicli" },
    { value: "46", label: "46 - Commercio all'ingrosso" },
    { value: "47", label: "47 - Commercio al dettaglio" }
  ],
  "H": [
    { value: "49", label: "49 - Trasporto terrestre e trasporto mediante condotte" },
    { value: "50", label: "50 - Trasporto marittimo e per vie d'acqua" },
    { value: "51", label: "51 - Trasporto aereo" },
    { value: "52", label: "52 - Magazzinaggio e attività di supporto ai trasporti" },
    { value: "53", label: "53 - Servizi postali e attività di corriere" }
  ],
  "I": [
    { value: "55", label: "55 - Alloggio" },
    { value: "56", label: "56 - Attività dei servizi di ristorazione" }
  ],
  "J": [
    { value: "58", label: "58 - Attività editoriali" },
    { value: "59", label: "59 - Attività di produzione cinematografica, di video e di programmi televisivi" },
    { value: "60", label: "60 - Attività di programmazione e trasmissione" },
    { value: "61", label: "61 - Telecomunicazioni" },
    { value: "62", label: "62 - Produzione di software e consulenza informatica" },
    { value: "63", label: "63 - Attività dei servizi d'informazione e altri servizi informatici" }
  ],
  "K": [
    { value: "64", label: "64 - Attività di servizi finanziari" },
    { value: "65", label: "65 - Assicurazioni, riassicurazioni e fondi pensione" },
    { value: "66", label: "66 - Attività ausiliarie dei servizi finanziari e delle attività assicurative" }
  ],
  "L": [
    { value: "68", label: "68 - Attività immobiliari" }
  ],
  "M": [
    { value: "69", label: "69 - Attività legali e contabilità" },
    { value: "70", label: "70 - Attività di direzione aziendale e di consulenza gestionale" },
    { value: "71", label: "71 - Attività di architettura e ingegneria" },
    { value: "72", label: "72 - Ricerca scientifica e sviluppo" },
    { value: "73", label: "73 - Pubblicità e ricerche di mercato" },
    { value: "74", label: "74 - Altre attività professionali, scientifiche e tecniche" },
    { value: "75", label: "75 - Servizi veterinari" }
  ],
  "N": [
    { value: "77", label: "77 - Attività di noleggio e leasing operativo" },
    { value: "78", label: "78 - Attività di ricerca, selezione, fornitura di personale" },
    { value: "79", label: "79 - Attività dei servizi delle agenzie di viaggio, dei tour operator" },
    { value: "80", label: "80 - Servizi di vigilanza e investigazione" },
    { value: "81", label: "81 - Attività di servizi per edifici e paesaggio" },
    { value: "82", label: "82 - Attività di supporto per le funzioni d'ufficio" }
  ],
  "O": [
    { value: "84", label: "84 - Amministrazione pubblica e difesa; assicurazione sociale obbligatoria" }
  ],
  "P": [
    { value: "85", label: "85 - Istruzione" }
  ],
  "Q": [
    { value: "86", label: "86 - Assistenza sanitaria" },
    { value: "87", label: "87 - Servizi di assistenza sociale residenziale" },
    { value: "88", label: "88 - Assistenza sociale non residenziale" }
  ],
  "R": [
    { value: "90", label: "90 - Attività creative, artistiche e di intrattenimento" },
    { value: "91", label: "91 - Attività di biblioteche, archivi, musei ed altre attività culturali" },
    { value: "92", label: "92 - Attività riguardanti le lotterie, le scommesse, le case da gioco" },
    { value: "93", label: "93 - Attività sportive, di intrattenimento e di divertimento" }
  ],
  "S": [
    { value: "94", label: "94 - Attività di organizzazioni associative" },
    { value: "95", label: "95 - Riparazione di computer e di beni per uso personale e per la casa" },
    { value: "96", label: "96 - Altre attività di servizi per la persona" }
  ],
  "T": [
    { value: "97", label: "97 - Attività di famiglie e convivenze come datori di lavoro per personale domestico" },
    { value: "98", label: "98 - Produzione di beni e servizi indifferenziati per uso proprio da parte di famiglie e convivenze" }
  ],
  "U": [
    { value: "99", label: "99 - Organizzazioni ed organismi extraterritoriali" }
  ],
};

// Questa lista viene usata quando nessun NACE è selezionato
export const atecoOptions = [
  { value: "01", label: "01 - Coltivazioni agricole e produzione di prodotti animali" },
  { value: "10", label: "10 - Industrie alimentari" },
  { value: "25", label: "25 - Fabbricazione di prodotti in metallo" },
  { value: "41", label: "41 - Costruzione di edifici" },
  { value: "47", label: "47 - Commercio al dettaglio" },
  { value: "56", label: "56 - Attività dei servizi di ristorazione" },
  { value: "62", label: "62 - Produzione di software e consulenza informatica" },
  { value: "71", label: "71 - Attività di architettura e ingegneria" },
  { value: "85", label: "85 - Istruzione" },
  { value: "96", label: "96 - Altre attività di servizi per la persona" }
];

export const naceOptions = [
  { value: "A", label: "A - AGRICOLTURA, SILVICOLTURA E PESCA" },
  { value: "B", label: "B - ESTRAZIONE DI MINERALI DA CAVE E MINIERE" },
  { value: "C", label: "C - ATTIVITÀ MANIFATTURIERE" },
  { value: "D", label: "D - FORNITURA DI ENERGIA ELETTRICA, GAS, VAPORE E ARIA CONDIZIONATA" },
  { value: "E", label: "E - FORNITURA DI ACQUA; RETI FOGNARIE, ATTIVITÀ DI GESTIONE DEI RIFIUTI E RISANAMENTO" },
  { value: "F", label: "F - COSTRUZIONI" },
  { value: "G", label: "G - COMMERCIO ALL'INGROSSO E AL DETTAGLIO; RIPARAZIONE DI AUTOVEICOLI E MOTOCICLI" },
  { value: "H", label: "H - TRASPORTO E MAGAZZINAGGIO" },
  { value: "I", label: "I - ATTIVITÀ DEI SERVIZI DI ALLOGGIO E DI RISTORAZIONE" },
  { value: "J", label: "J - SERVIZI DI INFORMAZIONE E COMUNICAZIONE" },
  { value: "K", label: "K - ATTIVITÀ FINANZIARIE E ASSICURATIVE" },
  { value: "L", label: "L - ATTIVITÀ IMMOBILIARI" },
  { value: "M", label: "M - ATTIVITÀ PROFESSIONALI, SCIENTIFICHE E TECNICHE" },
  { value: "N", label: "N - NOLEGGIO, AGENZIE DI VIAGGIO, SERVIZI DI SUPPORTO ALLE IMPRESE" },
  { value: "O", label: "O - AMMINISTRAZIONE PUBBLICA E DIFESA; ASSICURAZIONE SOCIALE OBBLIGATORIA" },
  { value: "P", label: "P - ISTRUZIONE" },
  { value: "Q", label: "Q - SANITÀ E ASSISTENZA SOCIALE" },
  { value: "R", label: "R - ATTIVITÀ ARTISTICHE, SPORTIVE, DI INTRATTENIMENTO E DIVERTIMENTO" },
  { value: "S", label: "S - ALTRE ATTIVITÀ DI SERVIZI" },
  { value: "T", label: "T - ATTIVITÀ DI FAMIGLIE E CONVIVENZE COME DATORI DI LAVORO PER PERSONALE DOMESTICO; PRODUZIONE DI BENI E SERVIZI INDIFFERENZIATI PER USO PROPRIO DA PARTE DI FAMIGLIE E CONVIVENZE" },
  { value: "U", label: "U - ORGANIZZAZIONI ED ORGANISMI EXTRATERRITORIALI" }
];

export const legalFormOptions = [
  { value: "ditta_individuale", label: "Ditta individuale" },
  { value: "snc", label: "SNC" },
  { value: "sas", label: "SAS" },
  { value: "srls", label: "SRLS" },
  { value: "srl", label: "SRL" },
  { value: "spa", label: "SpA" },
  { value: "sapa", label: "SAPA" },
  { value: "coop", label: "Società Cooperativa" }
];

export const collectiveAgreementOptions = [
  { value: "agricoltura", label: "Agricoltura" },
  { value: "chimici", label: "Chimici" },
  { value: "meccanici", label: "Meccanici" },
  { value: "tessili", label: "Tessili" },
  { value: "alimentaristi", label: "Alimentaristi" },
  { value: "edilizia", label: "Edilizia" },
  { value: "legno_arredamento", label: "Legno E Arredamento" },
  { value: "poligrafici_spettacolo", label: "Poligrafici e Spettacolo" },
  { value: "terziario", label: "Terziario" },
  { value: "servizi", label: "Servizi" },
  { value: "lavoro_domestico", label: "Lavoro Domestico e Di Cura" },
  { value: "trasporti", label: "Trasporti" },
  { value: "credito_assicurazioni", label: "Credito e Assicurazioni" },
  { value: "aziende_servizi", label: "Aziende Di Servizi" },
  { value: "istruzione_sanita", label: "Istruzione-Sanità-Assistenza-Cultura-Enti" },
  { value: "ccnl_plurisettoriali", label: "CCNL Plurisettoriali" },
  { value: "microsettoriali", label: "Microsettoriali" },
  { value: "altri", label: "Altri" }
];
