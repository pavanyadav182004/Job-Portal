export const initialJobs = [
  {
    id: 1,
    title: "Software Developer",
    company: "Apni Company Ka Naam",
    location: "Remote / Office",
    salary: "50,000 - 60,000",
    type: "Full Time",
    description: "Yahan apni job ki details likhein...",
    createdAt: new Date().toISOString().split('T')[0],
    expireDate: "2026-12-31",
    // Agar internet se koi image URL dalna hai to yahan dalein:
    // companyImage: "https://example.com/meri-image.jpg"
    companyImage: "../../assets/job.png"
  }
];
