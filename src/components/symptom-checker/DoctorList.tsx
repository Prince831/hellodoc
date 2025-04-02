
import DoctorCard, { Doctor } from "./DoctorCard";

interface DoctorListProps {
  doctors: Doctor[];
}

const DoctorList = ({ doctors }: DoctorListProps) => {
  if (doctors.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Recommended Specialists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
