
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, Clock, Video, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Appointment {
  id: string;
  patientName: string;
  patientImage?: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
}

const DoctorAppointments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching appointments from backend API or Supabase
    const fetchAppointments = async () => {
      setIsLoading(true);
      // Mock data - in a real app, this would be fetched from your API
      const mockAppointments: Appointment[] = [
        { 
          id: '1', 
          patientName: 'John Doe', 
          date: '2025-05-11', 
          time: '10:00 AM', 
          status: 'confirmed',
          type: 'Check-up',
          notes: 'Regular annual check-up, patient reported mild seasonal allergies'
        },
        { 
          id: '2', 
          patientName: 'Jane Smith', 
          patientImage: 'https://i.pravatar.cc/150?img=5',
          date: '2025-05-11', 
          time: '2:00 PM', 
          status: 'pending',
          type: 'Follow-up',
          notes: 'Follow-up after medication change, check blood pressure'
        },
        { 
          id: '3', 
          patientName: 'Alice Johnson', 
          patientImage: 'https://i.pravatar.cc/150?img=6',
          date: '2025-05-12', 
          time: '11:00 AM', 
          status: 'confirmed',
          type: 'Consultation',
          notes: 'New patient, complaining of persistent headaches'
        },
        { 
          id: '4', 
          patientName: 'Robert Brown', 
          date: '2025-05-10', 
          time: '3:30 PM', 
          status: 'completed',
          type: 'Check-up',
          notes: 'Patient is showing good progress after treatment'
        },
        { 
          id: '5', 
          patientName: 'Emily Wilson', 
          patientImage: 'https://i.pravatar.cc/150?img=9',
          date: '2025-05-10', 
          time: '9:15 AM', 
          status: 'cancelled',
          type: 'Consultation',
          notes: 'Patient cancelled due to emergency'
        },
        { 
          id: '6', 
          patientName: 'Michael Garcia', 
          date: '2025-05-12', 
          time: '4:45 PM', 
          status: 'pending',
          type: 'Follow-up',
          notes: 'Check healing progress after minor procedure'
        },
      ];
      
      setTimeout(() => {
        setAppointments(mockAppointments);
        setIsLoading(false);
      }, 800);
    };
    
    fetchAppointments();
  }, []);

  const handleConfirmAppointment = (id: string) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: 'confirmed' } : appt
    ));
    
    toast({
      title: "Appointment confirmed",
      description: "The patient will be notified of your confirmation",
    });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: 'cancelled' } : appt
    ));
    
    toast({
      title: "Appointment cancelled",
      description: "The patient will be notified of the cancellation",
      variant: "destructive"
    });
  };

  const handleStartConsultation = (id: string) => {
    toast({
      title: "Starting consultation",
      description: "Setting up virtual appointment..."
    });
    
    navigate('/video-consultation');
  };

  const handleViewRecords = (patientName: string) => {
    toast({
      title: "Opening health records",
      description: `Viewing ${patientName}'s medical records`
    });
    
    navigate('/doctor/health-records');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 hover:bg-green-200">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 hover:bg-amber-200">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-200">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filter appointments for the tabs
  const upcomingAppointments = appointments.filter(appt => 
    appt.status === 'confirmed' || appt.status === 'pending'
  );
  const pastAppointments = appointments.filter(appt => 
    appt.status === 'completed' || appt.status === 'cancelled'
  );

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Appointments</h1>
        <p className="text-muted-foreground">Manage your patient consultations and schedule</p>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {upcomingAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {upcomingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
          </TabsList>
          
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Availability
          </Button>
        </div>
        
        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="text-center p-12">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground animate-pulse mb-4" />
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No Upcoming Appointments</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  You don't have any upcoming appointments scheduled. Enjoy your free time!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r md:w-64">
                      <Avatar className="h-14 w-14">
                        {appointment.patientImage ? (
                          <img src={appointment.patientImage} alt={appointment.patientName} className="h-full w-full object-cover" />
                        ) : (
                          <AvatarFallback className="text-lg">{appointment.patientName.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mb-4">{appointment.notes}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleConfirmAppointment(appointment.id)}>
                              <Check className="h-4 w-4 mr-2" />
                              Confirm
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleCancelAppointment(appointment.id)}>
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <Button size="sm" onClick={() => handleStartConsultation(appointment.id)}>
                            <Video className="h-4 w-4 mr-2" />
                            Start Consultation
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline" onClick={() => handleViewRecords(appointment.patientName)}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Records
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>View your complete appointment history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-8">
                  <Clock className="w-10 h-10 mx-auto text-muted-foreground animate-pulse mb-3" />
                  <p className="text-muted-foreground">Loading appointments...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center p-8">
                  <p>No appointments found.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Avatar>
                                  {appointment.patientImage ? (
                                    <img src={appointment.patientImage} alt={appointment.patientName} className="h-10 w-10 rounded-full" />
                                  ) : (
                                    <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                                  )}
                                </Avatar>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium">{appointment.patientName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{new Date(appointment.date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{appointment.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(appointment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleViewRecords(appointment.patientName)}>
                                <FileText className="h-4 w-4" />
                              </Button>
                              {appointment.status === 'confirmed' && (
                                <Button size="sm" variant="ghost" onClick={() => handleStartConsultation(appointment.id)}>
                                  <Video className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Review your completed and cancelled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-8">
                  <Clock className="w-10 h-10 mx-auto text-muted-foreground animate-pulse mb-3" />
                  <p className="text-muted-foreground">Loading appointments...</p>
                </div>
              ) : pastAppointments.length === 0 ? (
                <div className="text-center p-8">
                  <p>No past appointments found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          {appointment.patientImage ? (
                            <img src={appointment.patientImage} alt={appointment.patientName} className="h-10 w-10 rounded-full" />
                          ) : (
                            <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.status)}
                        <Button size="sm" variant="ghost" onClick={() => handleViewRecords(appointment.patientName)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorAppointments;
