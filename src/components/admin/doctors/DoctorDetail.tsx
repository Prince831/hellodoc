
import { Doctor } from "@/types/doctor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Star, Activity, Calendar, User, Clipboard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DoctorDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
  doctorStats: {[key: string]: any};
  onEdit: (doctor: Doctor) => void;
}

const DoctorDetail = ({
  open,
  onOpenChange,
  doctor,
  doctorStats,
  onEdit,
}: DoctorDetailProps) => {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{doctor.name}</DialogTitle>
          <DialogDescription>
            {doctor.specialization} • {doctor.years_of_experience} years experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              {doctor.image_url ? (
                <img
                  src={doctor.image_url}
                  alt={doctor.name}
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
                  <span className="text-lg font-semibold">{doctor.rating.toFixed(1)}/5.0</span>
                </div>

                <div className="mt-2">
                  <Badge variant={doctor.availability ? "default" : "secondary"}>
                    {doctor.availability ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {doctor.keywords.map((keyword, i) => (
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
                      {doctorStats[doctor.id]?.totalAppointments || 0} total
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => {
            onOpenChange(false);
            onEdit(doctor);
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetail;
