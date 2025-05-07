import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Administrator Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <p>Manage patients and doctors, activate/deactivate accounts, assign roles.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Appointments Overview</h2>
        <p>Monitor and manage all appointments between doctors and patients.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Messages Monitoring</h2>
        <p>View and moderate messages exchanged between users.</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Health Records Access</h2>
        <p>Access patient health records for oversight and compliance.</p>
      </section>
    </div>
  );
};

export default AdminDashboard;
