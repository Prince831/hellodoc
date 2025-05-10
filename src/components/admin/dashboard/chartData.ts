
// Mock chart data for the admin dashboard

export const getBarChartData = () => ({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Patients",
      data: [65, 78, 86, 93, 102, 110],
      backgroundColor: "rgba(37, 99, 235, 0.8)",
    },
    {
      label: "Doctors",
      data: [28, 32, 35, 41, 46, 55],
      backgroundColor: "rgba(251, 146, 60, 0.8)",
    },
  ],
});
  
export const getLineChartData = () => ({
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Appointments",
      data: [125, 165, 142, 198],
      borderColor: "rgba(37, 99, 235, 1)",
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      tension: 0.4,
    },
  ],
});
  
export const getPieChartData = () => ({
  labels: ["General Practice", "Cardiology", "Pediatrics", "Dermatology", "Other"],
  datasets: [
    {
      label: "Appointments",
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        "rgba(37, 99, 235, 0.8)",
        "rgba(251, 146, 60, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(139, 92, 246, 0.8)",
        "rgba(107, 114, 128, 0.8)",
      ],
    },
  ],
});

export const getRecentAppointments = () => [
  {
    id: 1,
    patientName: "Emma Wilson",
    doctorName: "Dr. Sarah Johnson",
    date: "2023-05-10T14:30:00",
    status: "completed",
    type: "General Checkup"
  },
  {
    id: 2,
    patientName: "John Smith",
    doctorName: "Dr. Michael Chen",
    date: "2023-05-10T16:00:00",
    status: "completed",
    type: "Cardiology Followup"
  },
  {
    id: 3,
    patientName: "Sophia Garcia",
    doctorName: "Dr. Emily Rodriguez",
    date: "2023-05-11T10:00:00",
    status: "scheduled",
    type: "Pediatric Checkup"
  },
  {
    id: 4,
    patientName: "Robert Brown",
    doctorName: "Dr. Sarah Johnson",
    date: "2023-05-11T11:30:00",
    status: "scheduled",
    type: "General Checkup"
  },
  {
    id: 5,
    patientName: "Olivia Taylor",
    doctorName: "Dr. Michael Chen",
    date: "2023-05-11T15:00:00",
    status: "pending",
    type: "Cardiology Consultation"
  },
];

export const getRecentMessages = () => [
  {
    id: 1,
    from: "Emma Wilson",
    to: "Dr. Sarah Johnson",
    message: "Thank you for the appointment, I'll see you then!",
    time: "10 minutes ago",
    read: true
  },
  {
    id: 2,
    from: "Dr. Michael Chen",
    to: "John Smith",
    message: "Please remember to bring your previous medical records.",
    time: "30 minutes ago",
    read: true
  },
  {
    id: 3,
    from: "Sophia Garcia",
    to: "Dr. Emily Rodriguez",
    message: "My daughter's fever has gone down after taking the prescribed medication.",
    time: "1 hour ago",
    read: false
  },
  {
    id: 4,
    from: "Dr. Sarah Johnson",
    to: "Robert Brown",
    message: "I've reviewed your lab results. Everything looks normal.",
    time: "2 hours ago",
    read: false
  }
];
