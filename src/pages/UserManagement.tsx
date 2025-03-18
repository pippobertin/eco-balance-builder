import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Define the UserProfile type
interface UserProfile {
  id: string;
  role: string;
  email: string;
  updated_at: string;
  created_at: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!isAdmin) {
          toast({
            title: "Accesso negato",
            description: "Non hai i permessi per gestire gli utenti",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // First get profile data
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*");

        if (profilesError) {
          throw profilesError;
        }

        // Get auth users data (requires admin access and is using auth.admin endpoints)
        // This would need to be done via a server function in a real implementation
        // For now we'll just use the profiles table data
        
        if (profiles) {
          // Map profiles to UserProfile format
          const mappedUsers: UserProfile[] = profiles.map((profile) => ({
            id: profile.id,
            role: profile.role || 'user',
            email: `user-${profile.id.substring(0, 6)}@example.com`, // Placeholder email
            updated_at: profile.updated_at || new Date().toISOString(),
            created_at: new Date().toISOString() // Placeholder created_at
          }));
          
          setUsers(mappedUsers);
        }
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast({
          title: "Errore",
          description: `Impossibile caricare gli utenti: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, toast]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestione Utenti</h1>
      
      {loading ? (
        <p>Caricamento in corso...</p>
      ) : !isAdmin ? (
        <p className="text-red-500">Accesso non autorizzato</p>
      ) : users.length === 0 ? (
        <p>Nessun utente trovato</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ultimo aggiornamento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role === "admin" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Amministratore
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Utente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      onClick={() => {
                        /* Implementation for edit user action */
                        toast({
                          title: "Funzionalità non implementata",
                          description: "La modifica degli utenti sarà disponibile prossimamente",
                        });
                      }}
                    >
                      Modifica
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
