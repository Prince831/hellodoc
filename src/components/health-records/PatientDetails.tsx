
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Patient } from "@/types/health-records";

interface PatientDetailsProps {
  patient: Patient;
}

const PatientDetails = ({ patient }: PatientDetailsProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>Personal and emergency contact details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Personal Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Full Name:</div>
                <div>{patient.name}</div>
                <div className="text-muted-foreground">Date of Birth:</div>
                <div>{new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                <div className="text-muted-foreground">Gender:</div>
                <div>{patient.gender}</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Allergies</h4>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Name:</div>
              <div>{patient.emergencyContact.name}</div>
              <div className="text-muted-foreground">Relationship:</div>
              <div>{patient.emergencyContact.relation}</div>
              <div className="text-muted-foreground">Phone:</div>
              <div>{patient.emergencyContact.phone}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDetails;
