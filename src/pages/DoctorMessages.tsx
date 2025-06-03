
import DoctorLayout from "@/components/doctor/DoctorLayout";
import DoctorMessages from "@/components/doctor/DoctorMessages";

const DoctorMessagesPage = () => {
  return (
    <DoctorLayout 
      title="Patient Messages"
      description="Communicate securely with your patients"
    >
      <DoctorMessages />
    </DoctorLayout>
  );
};

export default DoctorMessagesPage;
