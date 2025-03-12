
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, HeartPulse, Pill, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const MedicalInformation = () => {
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  
  // Placeholder medical data - in a real app, this would come from a database
  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: "o_positive",
    height: "180",
    weight: "75",
    allergies: ["Penicillin", "Peanuts"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" }
    ],
    medicalConditions: [
      { condition: "Hypertension", diagnosedDate: "2018-03-15", status: "Controlled" },
      { condition: "Type 2 Diabetes", diagnosedDate: "2019-07-22", status: "Controlled" }
    ],
    familyHistory: "Father had heart disease. Mother has arthritis.",
    organDonor: true,
    smoker: false,
    alcoholConsumption: "occasional",
    exerciseFrequency: "moderate"
  });

  const handleChange = (field: string, value: any) => {
    setMedicalInfo(prev => ({ ...prev, [field]: value }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !medicalInfo.allergies.includes(newAllergy.trim())) {
      handleChange("allergies", [...medicalInfo.allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    handleChange("allergies", medicalInfo.allergies.filter(a => a !== allergy));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      handleChange("medications", [
        ...medicalInfo.medications, 
        { name: newMedication.trim(), dosage: "", frequency: "" }
      ]);
      setNewMedication("");
    }
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...medicalInfo.medications];
    updatedMedications.splice(index, 1);
    handleChange("medications", updatedMedications);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updatedMedications = [...medicalInfo.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    handleChange("medications", updatedMedications);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Health Information</CardTitle>
          <CardDescription>
            Your physical characteristics and general health information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select 
                value={medicalInfo.bloodType} 
                onValueChange={(value) => handleChange("bloodType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a_positive">A+</SelectItem>
                  <SelectItem value="a_negative">A-</SelectItem>
                  <SelectItem value="b_positive">B+</SelectItem>
                  <SelectItem value="b_negative">B-</SelectItem>
                  <SelectItem value="ab_positive">AB+</SelectItem>
                  <SelectItem value="ab_negative">AB-</SelectItem>
                  <SelectItem value="o_positive">O+</SelectItem>
                  <SelectItem value="o_negative">O-</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={medicalInfo.height} 
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={medicalInfo.weight} 
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smoker">Smoker</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="smoker" 
                  checked={medicalInfo.smoker} 
                  onCheckedChange={(checked) => handleChange("smoker", checked)}
                />
                <Label htmlFor="smoker" className="cursor-pointer">
                  {medicalInfo.smoker ? "Yes" : "No"}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
              <Select 
                value={medicalInfo.alcoholConsumption} 
                onValueChange={(value) => handleChange("alcoholConsumption", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="frequent">Frequent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
              <Select 
                value={medicalInfo.exerciseFrequency} 
                onValueChange={(value) => handleChange("exerciseFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex items-center space-x-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <Label htmlFor="organDonor" className="font-medium">
              Organ Donor
            </Label>
            <Switch 
              id="organDonor" 
              checked={medicalInfo.organDonor} 
              onCheckedChange={(checked) => handleChange("organDonor", checked)}
            />
            <span className="text-sm text-muted-foreground">
              {medicalInfo.organDonor ? "Yes" : "No"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Allergies & Medical Alerts
          </CardTitle>
          <CardDescription>
            Important medical information that healthcare providers should know about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Allergies</Label>
            <div className="flex flex-wrap gap-2 min-h-12 p-2 border rounded-md bg-muted/40">
              {medicalInfo.allergies.length === 0 ? (
                <span className="text-sm text-muted-foreground p-1">No allergies listed</span>
              ) : (
                medicalInfo.allergies.map((allergy) => (
                  <Badge key={allergy} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                    {allergy}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full ml-1"
                      onClick={() => removeAllergy(allergy)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add allergy..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAllergy()}
              />
              <Button type="button" size="icon" onClick={addAllergy}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Current Medications
          </CardTitle>
          <CardDescription>
            Medications you are currently taking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicalInfo.medications.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 border rounded-md">
              No medications listed
            </div>
          ) : (
            medicalInfo.medications.map((medication, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2 p-3 border rounded-md">
                <div className="flex-1 min-w-[200px] space-y-1">
                  <div className="font-medium">{medication.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {medication.dosage} {medication.frequency && `• ${medication.frequency}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeMedication(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}

          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add medication..."
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMedication()}
            />
            <Button type="button" size="icon" onClick={addMedication}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Family Medical History</CardTitle>
          <CardDescription>
            Relevant family medical history that may be important for your healthcare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="familyHistory">Family Medical History</Label>
            <Textarea 
              id="familyHistory" 
              placeholder="Please describe any significant family medical history"
              className="h-32 resize-none"
              value={medicalInfo.familyHistory}
              onChange={(e) => handleChange("familyHistory", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include information about close family members (parents, siblings, grandparents) and any hereditary conditions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInformation;
