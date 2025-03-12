
import { UserData } from "@/types/profile";
import BasicInformation from "./personal/BasicInformation";
import ContactInformation from "./personal/ContactInformation";
import Preferences from "./personal/Preferences";

interface PersonalInformationProps {
  userData: UserData;
  onUpdateUserData: (updatedData: UserData) => void;
}

const PersonalInformation = ({ userData, onUpdateUserData }: PersonalInformationProps) => {
  const handleFieldUpdate = (field: keyof UserData, value: string) => {
    onUpdateUserData({
      ...userData,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <BasicInformation 
        userData={userData}
        onUpdateUserData={handleFieldUpdate}
      />
      <ContactInformation 
        userData={userData}
        onUpdateUserData={handleFieldUpdate}
      />
      <Preferences 
        userData={userData}
        onUpdateUserData={handleFieldUpdate}
      />
    </div>
  );
};

export default PersonalInformation;
