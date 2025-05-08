
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
import { Search, UserPlus, Edit, Trash2, Activity } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  years_of_experience: number;
  rating: number;
  availability: boolean;
  image_url: string | null;
  keywords: string[];
  created_at: string;
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load doctors.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor({ ...doctor });
    setDialogOpen(true);
  };

  const handleSaveDoctor = async () => {
    if (!editingDoctor) return;
    
    try {
      const { error } = await supabase
        .from("doctors")
        .update({
          name: editingDoctor.name,
          specialization: editingDoctor.specialization,
          years_of_experience: editingDoctor.years_of_experience,
          rating: editingDoctor.rating,
          availability: editingDoctor.availability,
          keywords: editingDoctor.keywords,
          image_url: editingDoctor.image_url
        })
        .eq("id", editingDoctor.id);
      
      if (error) throw error;
      
      setDoctors(doctors.map(d => d.id === editingDoctor.id ? editingDoctor : d));
      
      toast({
        title: "Success",
        description: "Doctor updated successfully.",
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast({
        title: "Error",
        description: "Failed to update doctor.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteDoctor = (doctorId: string) => {
    setDoctorToDelete(doctorId);
    setConfirmDialogOpen(true);
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    
    try {
      const { error } = await supabase
        .from("doctors")
        .delete()
        .eq("id", doctorToDelete);
      
      if (error) throw error;
      
      setDoctors(doctors.filter(d => d.id !== doctorToDelete));
      
      toast({
        title: "Success",
        description: "Doctor removed successfully.",
      });
      
      setConfirmDialogOpen(false);
      setDoctorToDelete(null);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Error",
        description: "Failed to remove doctor.",
        variant: "destructive",
      });
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Doctor Management</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => {
              setEditingDoctor({
                id: "",
                name: "",
                specialization: "",
                years_of_experience: 0,
                rating: 5.0,
                availability: true,
                image_url: null,
                keywords: [],
                created_at: new Date().toISOString()
              });
              setDialogOpen(true);
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Doctor
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialization..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading doctors...
                  </TableCell>
                </TableRow>
              ) : filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No doctors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.years_of_experience} years</TableCell>
                    <TableCell>{doctor.rating.toFixed(1)}/5.0</TableCell>
                    <TableCell>
                      {doctor.availability ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
                          Unavailable
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => confirmDeleteDoctor(doctor.id)}
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

      {/* Edit Doctor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDoctor?.id ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
            <DialogDescription>
              {editingDoctor?.id ? "Make changes to doctor information." : "Enter information for the new doctor."}
            </DialogDescription>
          </DialogHeader>
          
          {editingDoctor && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={editingDoctor.specialization}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="years">Years of Experience</Label>
                <Input
                  id="years"
                  type="number"
                  value={editingDoctor.years_of_experience}
                  onChange={(e) => setEditingDoctor({ 
                    ...editingDoctor, 
                    years_of_experience: parseInt(e.target.value) || 0 
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={editingDoctor.rating}
                  onChange={(e) => setEditingDoctor({ 
                    ...editingDoctor, 
                    rating: parseFloat(e.target.value) || 5
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Textarea
                  id="keywords"
                  value={editingDoctor.keywords?.join(", ") || ""}
                  onChange={(e) => setEditingDoctor({ 
                    ...editingDoctor, 
                    keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editingDoctor.image_url || ""}
                  onChange={(e) => setEditingDoctor({ 
                    ...editingDoctor, 
                    image_url: e.target.value || null
                  })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={editingDoctor.availability}
                  onCheckedChange={(availability) => setEditingDoctor({ ...editingDoctor, availability })}
                />
                <Label htmlFor="availability">Available for Appointments</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDoctor}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this doctor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDoctor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default DoctorsPage;
