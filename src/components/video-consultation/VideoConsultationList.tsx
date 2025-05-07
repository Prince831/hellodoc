
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelative } from "date-fns";
import { Video, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

export interface Consultation {
  id: string;
  doctorId: string;
  doctorName: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  scheduledFor: Date;
}

interface VideoConsultationListProps {
  consultations: Consultation[];
  onStartConsultation: (consultation: Consultation) => void;
  onScheduleNew: () => void;
}

const VideoConsultationList = ({ consultations, onStartConsultation, onScheduleNew }: VideoConsultationListProps) => {
  const upcomingConsultations = consultations.filter(c => c.status === "scheduled");

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Video Consultations</h1>
        <Button variant="outline" onClick={onScheduleNew}>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule New Consultation
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Consultations</CardTitle>
          <CardDescription>
            Your scheduled video appointments with healthcare providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingConsultations.map(consultation => (
              <motion.div 
                key={consultation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium text-lg">
                    {consultation.doctorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{consultation.doctorName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatRelative(consultation.scheduledFor, new Date())}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onStartConsultation(consultation)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Join Call
                </Button>
              </motion.div>
            ))}
            
            {upcomingConsultations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                You don't have any upcoming video consultations.
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Need help? Contact support at help@hellodoc.com
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default VideoConsultationList;
