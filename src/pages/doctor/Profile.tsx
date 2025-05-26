
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Mail, Phone, Building } from "lucide-react";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  specialization: z.string().min(2, {
    message: "Specialization must be at least 2 characters.",
  }),
  phone: z.string().min(6, {
    message: "Phone number must be at least 6 characters.",
  }),
  education: z.string().optional(),
  hospital: z.string().optional(),
  experience: z.string().optional(),
  languages: z.string().optional(),
  licenseNumber: z.string().optional(),
});

const DoctorProfile = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const defaultValues = {
    name: 'Dr. Jane Doe',
    email: 'jane.doe@example.com',
    specialization: 'General Practitioner',
    phone: '123-456-7890',
    education: 'MD, Stanford University',
    hospital: 'City General Hospital',
    experience: '10 years',
    languages: 'English, Spanish',
    licenseNumber: 'MD12345678',
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSave = (values: z.infer<typeof formSchema>) => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    console.log(values);
  };

  const handleAvatarUpload = () => {
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully."
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DoctorSidebar />
      
      <div className="flex-1 pt-16">
        <div className="container max-w-6xl py-8 px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Doctor Profile</h1>
          
          <div className="mb-8 p-6 bg-card border rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src="/placeholder.svg" alt={defaultValues.name} />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {defaultValues.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow"
                  onClick={handleAvatarUpload}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{defaultValues.name}</h2>
                <p className="text-muted-foreground">{defaultValues.specialization}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{defaultValues.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{defaultValues.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{defaultValues.hospital}</span>
                  </div>
                </div>
              </div>
              
              <Button variant="default" onClick={form.handleSubmit(handleSave)}>
                Save Changes
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="professional">Professional Info</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Dr. Jane Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="doctor@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="123-456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="languages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Languages Spoken</FormLabel>
                              <FormControl>
                                <Input placeholder="English, Spanish" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Update your professional details and qualifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="specialization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specialization</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select specialization" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                                  <SelectItem value="Neurologist">Neurologist</SelectItem>
                                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                                  <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="education"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Education</FormLabel>
                              <FormControl>
                                <Input placeholder="MD, Stanford University" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience</FormLabel>
                              <FormControl>
                                <Input placeholder="10 years" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="hospital"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hospital/Clinic</FormLabel>
                              <FormControl>
                                <Input placeholder="City General Hospital" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="licenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>License Number</FormLabel>
                              <FormControl>
                                <Input placeholder="MD12345678" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit">Save Professional Information</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Notification Preferences</h3>
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-sm">
                            Notification preferences can be configured here
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Privacy Settings</h3>
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-sm">
                            Privacy settings can be configured here
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="destructive" className="mt-4">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
