
import DoctorLayout from "@/components/doctor/DoctorLayout";
import DoctorSettings from "@/components/doctor/DoctorSettings";

const DoctorSettingsPage = () => {
  return (
    <DoctorLayout 
      title="Settings"
      description="Manage your account preferences and profile settings"
    >
      <DoctorSettings />
    </DoctorLayout>
  );
};

export default DoctorSettingsPage;
