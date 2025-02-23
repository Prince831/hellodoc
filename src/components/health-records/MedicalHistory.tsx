
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  doctor: {
    name: string;
    specialization: string;
  };
  prescription?: string;
  notes: string;
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    oxygenSaturation: string;
  };
}

interface MedicalHistoryProps {
  records: MedicalRecord[];
}

const MedicalHistory = ({ records }: MedicalHistoryProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Medical History</h2>
      {records.map((record) => (
        <Card key={record.id} className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>{record.diagnosis}</CardTitle>
                <CardDescription>
                  {new Date(record.date).toLocaleDateString()} • {record.doctor.name} ({record.doctor.specialization})
                </CardDescription>
              </div>
              <Stethoscope className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                {record.prescription && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Prescription</h4>
                    <p className="text-sm text-muted-foreground">{record.prescription}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{record.notes}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Vitals</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Blood Pressure</div>
                    <div className="text-sm font-medium">{record.vitals.bloodPressure}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                    <div className="text-sm font-medium">{record.vitals.temperature}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Heart Rate</div>
                    <div className="text-sm font-medium">{record.vitals.heartRate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">O₂ Saturation</div>
                    <div className="text-sm font-medium">{record.vitals.oxygenSaturation}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MedicalHistory;
