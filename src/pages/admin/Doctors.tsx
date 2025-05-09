// Fix only the problematic imports at the top of the file
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Activity, 
  Check, 
  X, 
  Eye, 
  Calendar, 
  Star,
  FileText,
  User,
  Clipboard
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const specializationOptions = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Rheumatology",
  "Urology"
];

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

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesSpecialization = !filterSpecialization || 
                                doctor.specialization === filterSpecialization;
                                
    return matchesSearch && matchesSpecialization;
  });

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
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctors.length}</div>
              <p className="text-xs text-muted-foreground">
                {doctors.filter(d => d.availability).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(doctors.map(d => d.specialization)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique specialties
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {doctors.length ? 
                  (doctors.reduce((acc, doc) => acc + doc.rating, 0) / doctors.length).toFixed(1) : 
                  "N/A"}
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-3 w-3 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {doctors.length ? 
                  Math.round(doctors.reduce((acc, doc) => acc + doc.years_of_experience, 0) / doctors.length) : 
                  0}
              </div>
              <p className="text-xs text-muted-foreground">Years</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_300px]">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name or specialization..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Specializations</SelectItem>
              {Array.from(new Set(doctors.map(d => d.specialization))).map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <TableHead>Appointments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading doctors...
                  </TableCell>
                </TableRow>
              ) : filteredDoctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No doctors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.years_of_experience} years</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-1">{doctor.rating.toFixed(1)}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </div>
                    </TableCell>
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
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{doctorStats[doctor.id]?.totalAppointments || 0}</span>
                        {doctorStats[doctor.id]?.pendingAppointments > 0 && (
                          <Badge variant="outline" className="ml-1 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                            {doctorStats[doctor.id]?.pendingAppointments} pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleViewDoctor(doctor)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
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

      {/* View Doctor Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          {viewDoctor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{viewDoctor.name}</DialogTitle>
                <DialogDescription>
                  {viewDoctor.specialization} • {viewDoctor.years_of_experience} years experience
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    {viewDoctor.image_url ? (
                      <img
                        src={viewDoctor.image_url}
                        alt={viewDoctor.name}
                        className="rounded-md object-cover aspect-square w-full"
                      />
                    ) : (
                      <div className="bg-slate-100 rounded-md flex items-center justify-center aspect-square w-full dark:bg-slate-800">
                        <Activity className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="text-lg font-semibold">{viewDoctor.rating.toFixed(1)}/5.0</span>
                      </div>
                      
                      <div className="mt-2">
                        <Badge variant={viewDoctor.availability ? "default" : "secondary"}>
                          {viewDoctor.availability ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {viewDoctor.keywords.map((keyword, i) => (
                            <Badge key={i} variant="outline">{keyword}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Tabs defaultValue="appointments">
                      <TabsList className="mb-4">
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="patients">Patients</TabsTrigger>
                        <TabsTrigger value="records">Health Records</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="appointments" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Recent Appointments</h3>
                          <span className="text-sm text-muted-foreground">
                            {doctorStats[viewDoctor.id]?.totalAppointments || 0} total
                          </span>
                        </div>
                        
                        <div className="rounded-md border p-4 text-center text-muted-foreground">
                          <Calendar className="mx-auto h-8 w-8 mb-2" />
                          <p>Detailed appointment data will be displayed here</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="patients" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Patients</h3>
                        </div>
                        
                        <div className="rounded-md border p-4 text-center text-muted-foreground">
                          <User className="mx-auto h-8 w-8 mb-2" />
                          <p>Patient list will be displayed here</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="records" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Health Records</h3>
                        </div>
                        
                        <div className="rounded-md border p-4 text-center text-muted-foreground">
                          <Clipboard className="mx-auto h-8 w-8 mb-2" />
                          <p>Health records will be displayed here</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setViewDialogOpen(false);
                  setEditingDoctor({...viewDoctor});
                  setDialogOpen(true);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

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
                <Label htmlFor="name">Doctor Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. John Smith"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={editingDoctor.specialization}
                  onValueChange={(value) => setEditingDoctor({ ...editingDoctor, specialization: value })}
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializationOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="years">Years of Experience</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="5"
                  value={editingDoctor.years_of_experience}
                  onChange={(e) => setEditingDoctor({ 
                    ...editingDoctor, 
                    years_of_experience: parseInt(e.target.value) || 0 
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <div className="flex items-center">
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
                  <Star className="ml-2 h-5 w-5 text-amber-500" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Textarea
                  id="keywords"
                  placeholder="heart, cardiology, hypertension"
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
                  placeholder="https://example.com/doctor-image.jpg"
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
