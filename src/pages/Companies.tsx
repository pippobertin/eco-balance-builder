import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Plus, 
  FileText, 
  CalendarDays, 
  Briefcase, 
  ChevronRight, 
  FileBarChart,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useReport, Company, Report } from '@/context/ReportContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const Companies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    companies, 
    loadCompanies, 
    createCompany, 
    reports, 
    loadReports, 
    createReport,
    deleteReport,
    setCurrentCompany,
    setCurrentReport,
    loadReport
  } = useReport();
  
  const [newCompany, setNewCompany] = useState<Omit<Company, 'id'>>({
    name: '',
    vat_number: '',
    country: '',
    address: '',
    contact_email: '',
    contact_phone: ''
  });
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [newReportData, setNewReportData] = useState({
    report_year: new Date().getFullYear().toString(),
    report_type: 'A',
    is_consolidated: false
  });
  
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    loadCompanies();
  }, []);
  
  useEffect(() => {
    if (selectedCompany) {
      loadReports(selectedCompany.id);
    }
  }, [selectedCompany]);
  
  const handleCreateCompany = async () => {
    if (!newCompany.name.trim()) {
      toast({
        title: "Errore",
        description: "Il nome dell'azienda è obbligatorio",
        variant: "destructive"
      });
      return;
    }
    
    const companyId = await createCompany(newCompany);
    if (companyId) {
      setNewCompany({
        name: '',
        vat_number: '',
        country: '',
        address: '',
        contact_email: '',
        contact_phone: ''
      });
    }
  };
  
  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };
  
  const handleCreateReport = async () => {
    if (!selectedCompany) {
      toast({
        title: "Errore",
        description: "Seleziona un'azienda prima di creare un report",
        variant: "destructive"
      });
      return;
    }
    
    const reportId = await createReport({
      company_id: selectedCompany.id,
      report_year: newReportData.report_year,
      report_type: newReportData.report_type,
      is_consolidated: newReportData.is_consolidated,
      environmental_metrics: {},
      social_metrics: {},
      conduct_metrics: {},
      status: 'draft'
    });
    
    if (reportId) {
      setNewReportData({
        report_year: new Date().getFullYear().toString(),
        report_type: 'A',
        is_consolidated: false
      });
      
      navigate('/report');
    }
  };
  
  const handleOpenReport = async (report: Report) => {
    const company = companies.find(c => c.id === report.company_id) || null;
    setCurrentCompany(company);
    
    await loadReport(report.id);
    
    navigate('/report');
  };
  
  const handleViewDashboard = async (report: Report) => {
    const company = companies.find(c => c.id === report.company_id) || null;
    setCurrentCompany(company);
    
    await loadReport(report.id);
    
    navigate('/dashboard');
  };
  
  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    
    const success = await deleteReport(reportToDelete.id);
    if (success) {
      setReportToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const openDeleteDialog = (report: Report, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportToDelete(report);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Gestione Aziende e Report</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestisci le tue aziende e i report di sostenibilità
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <GlassmorphicCard className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-blue-500" />
                    Aziende
                  </h2>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Nuova
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Aggiungi Nuova Azienda</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="company-name">Nome Azienda *</Label>
                          <Input 
                            id="company-name" 
                            value={newCompany.name} 
                            onChange={(e) => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nome dell'azienda" 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="vat-number">Partita IVA</Label>
                          <Input 
                            id="vat-number" 
                            value={newCompany.vat_number || ''} 
                            onChange={(e) => setNewCompany(prev => ({ ...prev, vat_number: e.target.value }))}
                            placeholder="Partita IVA" 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="country">Paese</Label>
                          <Input 
                            id="country" 
                            value={newCompany.country || ''} 
                            onChange={(e) => setNewCompany(prev => ({ ...prev, country: e.target.value }))}
                            placeholder="Paese" 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="address">Indirizzo</Label>
                          <Input 
                            id="address" 
                            value={newCompany.address || ''} 
                            onChange={(e) => setNewCompany(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Indirizzo completo" 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="contact-email">Email di contatto</Label>
                            <Input 
                              id="contact-email" 
                              type="email"
                              value={newCompany.contact_email || ''} 
                              onChange={(e) => setNewCompany(prev => ({ ...prev, contact_email: e.target.value }))}
                              placeholder="Email" 
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="contact-phone">Telefono di contatto</Label>
                            <Input 
                              id="contact-phone" 
                              value={newCompany.contact_phone || ''} 
                              onChange={(e) => setNewCompany(prev => ({ ...prev, contact_phone: e.target.value }))}
                              placeholder="Telefono" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <DialogClose asChild>
                          <Button variant="outline">Annulla</Button>
                        </DialogClose>
                        
                        <DialogClose asChild>
                          <Button onClick={handleCreateCompany}>Salva Azienda</Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {companies.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nessuna azienda presente.</p>
                      <p className="text-sm">Crea la tua prima azienda per iniziare.</p>
                    </div>
                  ) : (
                    companies.map((company) => (
                      <div 
                        key={company.id} 
                        className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                          selectedCompany?.id === company.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => handleSelectCompany(company)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{company.name}</h3>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        {company.vat_number && (
                          <p className="text-sm text-gray-500">P.IVA: {company.vat_number}</p>
                        )}
                        {company.country && (
                          <p className="text-sm text-gray-500">{company.country}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </GlassmorphicCard>
            </div>
            
            <div className="md:col-span-2">
              <GlassmorphicCard className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-green-500" />
                    Report di Sostenibilità
                    {selectedCompany && (
                      <span className="ml-2 text-base font-normal text-gray-500">
                        - {selectedCompany.name}
                      </span>
                    )}
                  </h2>
                  
                  {selectedCompany && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Plus className="h-4 w-4" />
                          Nuovo Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crea Nuovo Report</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="report-year">Anno di Riferimento</Label>
                            <Input 
                              id="report-year" 
                              type="number"
                              value={newReportData.report_year} 
                              onChange={(e) => setNewReportData(prev => ({ ...prev, report_year: e.target.value }))}
                              placeholder="Anno" 
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label>Tipo di Report</Label>
                            <RadioGroup 
                              value={newReportData.report_type} 
                              onValueChange={(value) => setNewReportData(prev => ({ ...prev, report_type: value }))}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="A" id="option-a" />
                                <Label htmlFor="option-a">Opzione A: Modulo Base</Label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B" id="option-b" />
                                <Label htmlFor="option-b">Opzione B: Modulo Base e Modulo Narrativo-PAT</Label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="C" id="option-c" />
                                <Label htmlFor="option-c">Opzione C: Modulo Base e Modulo Partner commerciali</Label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="D" id="option-d" />
                                <Label htmlFor="option-d">Opzione D: Tutti i moduli</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="is-consolidated" 
                              checked={newReportData.is_consolidated}
                              onCheckedChange={(checked) => 
                                setNewReportData(prev => ({ 
                                  ...prev, 
                                  is_consolidated: checked === true 
                                }))
                              }
                            />
                            <Label htmlFor="is-consolidated">Rendicontazione su base consolidata</Label>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <DialogClose asChild>
                            <Button variant="outline">Annulla</Button>
                          </DialogClose>
                          
                          <DialogClose asChild>
                            <Button onClick={handleCreateReport}>Crea Report</Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                {!selectedCompany ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Seleziona un'azienda per visualizzare i suoi report</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nessun report presente per questa azienda.</p>
                    <p className="text-sm">Crea il tuo primo report di sostenibilità.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div 
                        key={report.id} 
                        className="p-5 rounded-lg border border-gray-200 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
                            <h3 className="font-medium">
                              Report anno {report.report_year}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDashboard(report)}
                            >
                              <FileBarChart className="h-4 w-4 mr-1" />
                              Dashboard
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleOpenReport(report)}
                            >
                              Apri Report
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={(e) => openDeleteDialog(report, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Tipo:</span>{" "}
                            <span>Opzione {report.report_type}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Rendicontazione:</span>{" "}
                            <span>{report.is_consolidated ? "Consolidata" : "Individuale"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stato:</span>{" "}
                            <span className={`${
                              report.status === 'published' ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {report.status === 'published' ? 'Pubblicato' : 'Bozza'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Conferma eliminazione
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-2">Sei sicuro di voler eliminare questo report?</p>
            {reportToDelete && (
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                <div><span className="font-medium">Anno:</span> {reportToDelete.report_year}</div>
                <div><span className="font-medium">Tipo:</span> Opzione {reportToDelete.report_type}</div>
                <div><span className="font-medium">Rendicontazione:</span> {reportToDelete.is_consolidated ? "Consolidata" : "Individuale"}</div>
              </div>
            )}
            <p className="mt-4 text-red-600 text-sm">Questa azione non può essere annullata. Tutti i dati associati a questo report saranno eliminati definitivamente.</p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteReport}
            >
              Elimina Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Companies;
