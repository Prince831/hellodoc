import React, { useEffect, useState } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
}

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // TODO: Fetch appointments from backend API or supabase
    // For now, using mock data
    setAppointments([
      { id: '1', patientName: 'John Doe', date: '2024-05-01', time: '10:00 AM', status: 'Confirmed' },
      { id: '2', patientName: 'Jane Smith', date: '2024-05-02', time: '2:00 PM', status: 'Pending' },
      { id: '3', patientName: 'Alice Johnson', date: '2024-05-03', time: '11:00 AM', status: 'Cancelled' },
    ]);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>
      <section>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="min-w-full border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Patient</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="text-center">
                  <td className="py-2 px-4 border-b">{appt.patientName}</td>
                  <td className="py-2 px-4 border-b">{appt.date}</td>
                  <td className="py-2 px-4 border-b">{appt.time}</td>
                  <td className="py-2 px-4 border-b">{appt.status}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Confirm</button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Reschedule</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default DoctorAppointments;
