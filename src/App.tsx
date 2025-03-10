
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReportProvider } from '@/context/ReportContext';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Report from '@/pages/Report';
import ReportForm from '@/pages/ReportForm';
import NotFound from '@/pages/NotFound';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ReportProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/report" element={<Report />} />
              <Route path="/report-form" element={<ReportForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ReportProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
