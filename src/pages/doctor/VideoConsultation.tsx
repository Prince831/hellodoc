import React from 'react';

const DoctorVideoConsultation = () => {
  return (
    <div className="min-h-screen p-6 bg-background flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Video Consultation</h1>
      <p className="mb-4">Conduct virtual consultations with your patients here.</p>
      <div className="w-full max-w-4xl aspect-video bg-black rounded shadow-lg flex items-center justify-center text-white">
        {/* TODO: Integrate video call component here */}
        <p>Video call interface coming soon...</p>
      </div>
    </div>
  );
};

export default DoctorVideoConsultation;
