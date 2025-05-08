
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Edit, Trash2, Check, X, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  active: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userHealthRecords, setUserHealthRecords] = useState<any[]>([]);
  const [healthRecordsDialogOpen, setHealthRecordsDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // In a real application with a profiles table, we would query it
      // For now, simulating with auth data and adding some mock users
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      // Get appointment users as a proxy for patients
      const { data: appointmentUsers, error: appointmentError } = await supabase
        .from("appointments")
        .select("user_id")
        .distinct();
        
      if (appointmentError) throw appointmentError;
      
      // Create a set of unique user IDs
      const userIds = new Set(appointmentUsers?.map(a => a.user_id) || []);
      
      // Add the current authenticated user
      if (authData.user) {
        userIds.add(authData.user.id);
      }
      
      // Create users from the unique IDs
      const userList: User[] = Array.from(userIds).map((id, index) => {
        // The first user is the authenticated one
        if (authData.user && id === authData.user.id) {
          return {
            id: id,
            email: authData.user.email || "admin@example.com",
            role: "admin",
            created_at: authData.user.created_at || new Date().toISOString(),
            active: true,
          };
        }
        
        // Create mock data for other users
        return {
          id: id,
          email: `patient${index}@example.com`,
          role: "patient",
          created_at: new Date(Date.now() - 86400000 * index).toISOString(),
          active: true,
        };
      });
      
      // Add some demo doctors if there aren't many users
      if (userList.length < 3) {
        userList.push({
          id: "demo-doctor-1",
          email: "doctor1@example.com",
          role: "doctor",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          active: true,
        });
        
        userList.push({
          id: "demo-doctor-2",
          email: "doctor2@example.com",
          role: "doctor",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          active: true,
        });
      }
      
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientHealthRecords = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("health_records")
        .select(`
          id,
          diagnosis,
          prescription,
          notes,
          date,
          doctor_id,
          doctors:doctor_id (
            name,
            specialization
          )
        `)
        .eq("user_id", patientId)
        .order("date", { ascending: false });

      if (error) throw error;

      setUserHealthRecords(data || []);
      setSelectedPatientId(patientId);
      setHealthRecordsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast({
        title: "Error",
        description: "Failed to load health records.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    try {
      // In a real application, this would update the user in the database
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setConfirmDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // In a real application, this would delete or deactivate the user in the database
      setUsers(users.filter(u => u.id !== userToDelete));
      
      toast({
        title: "Success",
        description: "User removed successfully.",
      });
      
      setConfirmDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "doctor":
        return "default";
      case "patient":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex items-center gap-2">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by email or role..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role) as any}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user.role === "patient" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => fetchPatientHealthRecords(user.id)}
                            title="View Health Records"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Records</span>
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => confirmDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user account settings.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  disabled
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(role) => setEditingUser({ ...editingUser, role })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={editingUser.active}
                  onCheckedChange={(active) => setEditingUser({ ...editingUser, active })}
                />
                <Label htmlFor="active">Active Account</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Health Records Dialog */}
      <Dialog open={healthRecordsDialogOpen} onOpenChange={setHealthRecordsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Health Records</DialogTitle>
            <DialogDescription>
              Health records for patient ID: {selectedPatientId}
            </DialogDescription>
          </DialogHeader>
          
          {userHealthRecords.length === 0 ? (
            <div className="py-4 text-center">
              <p>No health records found for this patient.</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {userHealthRecords.map((record) => (
                <div key={record.id} className="rounded-lg border p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Diagnosis: {record.diagnosis}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                  {record.prescription && (
                    <p className="mt-2"><span className="font-medium">Prescription:</span> {record.prescription}</p>
                  )}
                  {record.notes && (
                    <p className="mt-2"><span className="font-medium">Notes:</span> {record.notes}</p>
                  )}
                  <div className="mt-2">
                    <Badge variant="outline">
                      {record.doctors?.name || "Unknown Doctor"} ({record.doctors?.specialization || "Unknown Specialization"})
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setHealthRecordsDialogOpen(false)}>
              Close
            </Button>
            {selectedPatientId && (
              <Button asChild>
                <Link to={`/admin/health-records?patientId=${selectedPatientId}`}>
                  Manage Records
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersPage;
