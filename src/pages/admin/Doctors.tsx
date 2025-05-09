
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Doctor } from "@/types/doctor";

// Import the extracted components
import DoctorList from "@/components/admin/doctors/DoctorList";
import DoctorForm from "@/components/admin/doctors/DoctorForm";
import DoctorDetail from "@/components/admin/doctors/DoctorDetail";
import DeleteConfirmDialog from "@/components/admin/doctors/DeleteConfirmDialog";
import DoctorStats from "@/components/admin/doctors/DoctorStats";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("");
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [doctorStats, setDoctorStats] = useState<{[key: string]: any}>({});
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
      
      // Get appointments count for each doctor
      const doctorsWithStats = await Promise.all((data || []).map(async (doctor) => {
        const { count: appointmentCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("doctor_id", doctor.id);
        
        const { count: pendingCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("doctor_id", doctor.id)
          .eq("status", "pending");
        
        setDoctorStats(prev => ({
          ...prev,
          [doctor.id]: {
            totalAppointments: appointmentCount || 0,
            pendingAppointments: pendingCount || 0
          }
        }));
        
        return doctor;
      }));
      
      setDoctors(doctorsWithStats || []);
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

  const handleViewDoctor = (doctor: Doctor) => {
    setViewDoctor(doctor);
    setViewDialogOpen(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor({ ...doctor });
    setDialogOpen(true);
  };

  const handleUpdateDoctor = (updates: Partial<Doctor>) => {
    if (editingDoctor) {
      setEditingDoctor({ ...editingDoctor, ...updates });
    }
  };

  const handleSaveDoctor = async () => {
    if (!editingDoctor) return;
    
    try {
      // For new doctors, we need to insert
      if (!editingDoctor.id) {
        const { data, error } = await supabase
          .from("doctors")
          .insert({
            name: editingDoctor.name,
            specialization: editingDoctor.specialization,
            years_of_experience: editingDoctor.years_of_experience,
            rating: editingDoctor.rating,
            availability: editingDoctor.availability,
            keywords: editingDoctor.keywords,
            image_url: editingDoctor.image_url
          })
          .select();
        
        if (error) throw error;
        if (data) {
          setDoctors([...doctors, data[0]]);
          toast({
            title: "Success",
            description: "Doctor added successfully.",
          });
        }
      } else {
        // For existing doctors, we update
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
      }
      
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

  const handleAddNewDoctor = () => {
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
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Doctor Management</h1>
          <div className="flex items-center gap-2">
            <Button onClick={handleAddNewDoctor}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Doctor
            </Button>
          </div>
        </div>
        
        {/* Doctor Stats */}
        <DoctorStats doctors={doctors} />
        
        {/* Doctor List with Search and Filters */}
        <DoctorList 
          doctors={doctors}
          loading={loading}
          doctorStats={doctorStats}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterSpecialization={filterSpecialization}
          setFilterSpecialization={setFilterSpecialization}
          onViewDoctor={handleViewDoctor}
          onEditDoctor={handleEditDoctor}
          onDeleteDoctor={confirmDeleteDoctor}
        />
      </div>

      {/* Doctor Detail Dialog */}
      <DoctorDetail 
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        doctor={viewDoctor}
        doctorStats={doctorStats}
        onEdit={(doctor) => {
          setViewDialogOpen(false);
          handleEditDoctor(doctor);
        }}
      />

      {/* Doctor Edit/Add Dialog */}
      <DoctorForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        doctor={editingDoctor}
        onSave={handleSaveDoctor}
        onUpdateDoctor={handleUpdateDoctor}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleDeleteDoctor}
      />
    </AdminLayout>
  );
};

export default DoctorsPage;
