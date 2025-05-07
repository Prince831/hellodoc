import React, { useEffect, useState } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-doctor-appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctorId: 'doctor-123' }), // Replace with actual doctorId from auth
        });
        const data = await response.json();
        if (response.ok) {
          setAppointments(data.appointments || []);
        } else {
          console.error('Error fetching appointments:', data.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(appt => appt.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="min-h-screen p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2 font-semibold">Filter by status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {filteredAppointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredAppointments.map((appt) => (
              <li key={appt.id} className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
                <p><strong>Patient:</strong> {appt.patientName}</p>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
                <p><strong>Status:</strong> <span className={`capitalize ${appt.status.toLowerCase() === 'confirmed' ? 'text-green-600' : appt.status.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{appt.status}</span></p>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* TODO: Add messages and patient overview sections */}
    </div>
  );
};

export default DoctorDashboard;
