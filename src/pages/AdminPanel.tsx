import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UserPlus, Mail, Check, Clock, Trash2, Shield } from "lucide-react";

interface InvitedUser {
  id: string;
  email: string;
  created_at: string;
  accepted_at: string | null;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);

      if (data) {
        fetchInvitedUsers();
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("invited_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvitedUsers(data || []);
    } catch (error) {
      console.error("Error fetching invited users:", error);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      toast.error("Ingresa un email válido");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error("El formato del email no es válido");
      return;
    }

    setInviting(true);

    try {
      // Check if already invited
      const { data: existing } = await supabase
        .from("invited_users")
        .select("id")
        .eq("email", newEmail.toLowerCase())
        .maybeSingle();

      if (existing) {
        toast.error("Este email ya fue invitado");
        setInviting(false);
        return;
      }

      const { error } = await supabase
        .from("invited_users")
        .insert({
          email: newEmail.toLowerCase(),
          invited_by: user!.id
        });

      if (error) throw error;

      toast.success(`Invitación creada para ${newEmail}`);
      setNewEmail("");
      fetchInvitedUsers();
    } catch (error: any) {
      console.error("Error inviting user:", error);
      toast.error("Error al crear la invitación");
    } finally {
      setInviting(false);
    }
  };

  const handleDeleteInvitation = async (id: string, email: string) => {
    try {
      const { error } = await supabase
        .from("invited_users")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success(`Invitación para ${email} eliminada`);
      fetchInvitedUsers();
    } catch (error) {
      console.error("Error deleting invitation:", error);
      toast.error("Error al eliminar la invitación");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        <p className="text-muted-foreground">
          No tienes permisos para acceder a esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Panel de Administración
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona los usuarios que pueden acceder a la aplicación
        </p>
      </div>

      {/* Invite User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invitar Nuevo Usuario
          </CardTitle>
          <CardDescription>
            Ingresa el email del usuario que deseas invitar. Solo los usuarios invitados podrán registrarse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInviteUser} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={inviting}
              />
            </div>
            <Button type="submit" disabled={inviting}>
              {inviting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Invitar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invited Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Invitados</CardTitle>
          <CardDescription>
            Lista de todos los usuarios que han sido invitados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitedUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay usuarios invitados aún
            </p>
          ) : (
            <div className="space-y-3">
              {invitedUsers.map((invited) => (
                <div
                  key={invited.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{invited.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Invitado el {new Date(invited.created_at).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {invited.accepted_at ? (
                      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Check className="h-3 w-3 mr-1" />
                        Registrado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                    {!invited.accepted_at && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteInvitation(invited.id, invited.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
