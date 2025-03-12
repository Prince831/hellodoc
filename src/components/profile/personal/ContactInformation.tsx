
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "@/types/profile";
import { Mail, MapPin, PhoneCall, User } from "lucide-react";

interface ContactInformationProps {
  userData: UserData;
  onUpdateUserData: (field: keyof UserData, value: string) => void;
}

const ContactInformation = ({ userData, onUpdateUserData }: ContactInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Your address and emergency contact details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                className="pl-10" 
                value={userData.email} 
                onChange={(e) => onUpdateUserData("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <PhoneCall className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="phone" 
                type="tel" 
                className="pl-10" 
                value={userData.phone} 
                onChange={(e) => onUpdateUserData("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="address" 
                className="pl-10" 
                value={userData.address} 
                onChange={(e) => onUpdateUserData("address", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                value={userData.city} 
                onChange={(e) => onUpdateUserData("city", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                value={userData.state} 
                onValueChange={(value) => onUpdateUserData("state", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input 
                id="zipCode" 
                value={userData.zipCode} 
                onChange={(e) => onUpdateUserData("zipCode", e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="emergencyContact" 
                    className="pl-10" 
                    value={userData.emergencyContact} 
                    onChange={(e) => onUpdateUserData("emergencyContact", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone</Label>
                <div className="relative">
                  <PhoneCall className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="emergencyPhone" 
                    type="tel" 
                    className="pl-10" 
                    value={userData.emergencyPhone} 
                    onChange={(e) => onUpdateUserData("emergencyPhone", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select 
                  value={userData.relationship} 
                  onValueChange={(value) => onUpdateUserData("relationship", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInformation;
