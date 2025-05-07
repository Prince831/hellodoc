import React, { useState } from 'react';

const DoctorProfile = () => {
  const [name, setName] = useState('Dr. Jane Doe');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [specialization, setSpecialization] = useState('General Practitioner');
  const [phone, setPhone] = useState('123-456-7890');

  const handleSave = () => {
    // TODO: Save profile changes to backend
    alert('Profile saved!');
  };

  return (
    <div className="min-h-screen p-6 bg-background max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="specialization">Specialization</label>
          <input
            id="specialization"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;
