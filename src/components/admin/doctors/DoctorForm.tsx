
import { Doctor } from "@/types/doctor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface DoctorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
  onSave: () => void;
  onUpdateDoctor: (doctor: Partial<Doctor>) => void;
}

const DoctorForm = ({
  open,
  onOpenChange,
  doctor,
  onSave,
  onUpdateDoctor,
}: DoctorFormProps) => {
  if (!doctor) return null;

  const isNewDoctor = !doctor.id;
  const title = isNewDoctor ? "Add New Doctor" : "Edit Doctor";
  const description = isNewDoctor
    ? "Enter information for the new doctor."
    : "Make changes to doctor information.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Doctor Name</Label>
            <Input
              id="name"
              placeholder="Dr. John Smith"
              value={doctor.name}
              onChange={(e) => onUpdateDoctor({ name: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select
              value={doctor.specialization}
              onValueChange={(value) => onUpdateDoctor({ specialization: value })}
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
              value={doctor.years_of_experience}
              onChange={(e) => onUpdateDoctor({ 
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
                value={doctor.rating}
                onChange={(e) => onUpdateDoctor({ 
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
              value={doctor.keywords?.join(", ") || ""}
              onChange={(e) => onUpdateDoctor({ 
                keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
              })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              placeholder="https://example.com/doctor-image.jpg"
              value={doctor.image_url || ""}
              onChange={(e) => onUpdateDoctor({ 
                image_url: e.target.value || null
              })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="availability"
              checked={doctor.availability}
              onCheckedChange={(availability) => onUpdateDoctor({ availability })}
            />
            <Label htmlFor="availability">Available for Appointments</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorForm;
