
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Check, X, UserCog, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, makeAdmin, removeAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Ottieni tutti i profili dalla tabella profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        throw profilesError;
      }

      // Per ottenere le email, dobbiamo fare una query separata perché non possiamo
      // accedere direttamente alle informazioni degli utenti in auth.users
      const usersWithEmail = await Promise.all(
        profiles.map(async (profile) => {
          // Per l'utente corrente, possiamo usare l'email dalla sessione
          if (profile.id === supabase.auth.getSession().then(({data}) => data.session?.user.id)) {
            const session = await supabase.auth.getSession();
            return {
              ...profile,
              email: session.data.session?.user?.email || 'Email non disponibile'
            };
          }
          // Per gli altri utenti, mostriamo solo l'ID
          return {
            ...profile,
            email: `Utente ${profile.id.substring(0, 8)}...`
          };
        })
      );

      setUsers(usersWithEmail);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Errore nel caricamento degli utenti",
        description: "Si è verificato un errore durante il caricamento degli utenti",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, isAdmin: boolean) => {
    try {
      const { error } = isAdmin ? 
        await makeAdmin(userId) : 
        await removeAdmin(userId);

      if (error) throw error;

      // Update UI
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: isAdmin ? 'admin' : 'user' } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Errore nell'aggiornamento del ruolo",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-6 py-24">
        <div className="mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCog className="h-8 w-8 text-esg-blue" />
            Gestione Utenti
          </h1>
          <p className="text-esg-gray-medium">
            Gestisci gli utenti e assegna i ruoli di amministratore
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-esg-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Registrazione
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruolo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.created_at ? formatDate(user.created_at) : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? (
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Amministratore
                          </span>
                        ) : 'Utente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === 'admin' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateUserRole(user.id, false)}
                        >
                          Rimuovi Admin
                          <X className="ml-1 h-3 w-3" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-esg-blue hover:bg-esg-blue/90"
                          onClick={() => updateUserRole(user.id, true)}
                        >
                          Promuovi ad Admin
                          <Check className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
