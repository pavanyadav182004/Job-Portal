import { useState } from "react"

import "./AddJob.css"
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/jobApi";
import { validateJobForm } from "../../utils/validation";
import { compressImage } from "../../utils/imageUtils";
export default function AddJob() {

    const navigate = useNavigate();

    const [jo, setJob] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "Full Time",
        description: "",
        companyImage: "",
        expireDate: "",
    })


    const handleChange = (e) => {
        setJob({
            ...jo,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        compressImage(file, (compressedDataUrl) => {
            setJob((prev) => ({
                ...prev,
                companyImage: compressedDataUrl,
            }));
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateJobForm(jo);

        if (validationError) {
            alert(validationError);
            return;
        }

        await createJob(jo);

        alert("Job Added");

        navigate("/my-jobs")
    };

    return (

        <>
           <div className="add-job-container">
  <form className="add-job-form" onSubmit={handleSubmit}>
    <h1>Add Job</h1>

    <input
      type="text" value={jo.title}
      name="title"
      placeholder="Job Title"
      onChange={handleChange}
      required
    />

    <input
      type="text"  value={jo.company}
      name="company"
      placeholder="Company Name"
      onChange={handleChange}
      required
    />

    <input
      type="text"  value={jo.location}
      name="location"
      placeholder="Location"
      onChange={handleChange}
      required
    />

    <div style={{ marginBottom: "15px", textAlign: "left" }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Company Logo/Image (Optional)</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {jo.companyImage && <img src={jo.companyImage} alt="Company preview" style={{ width: "80px", height: "80px", objectFit: "cover", marginTop: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />}
    </div>

    <input
      type="text"  value={jo.salary}
      name="salary"
      placeholder="Salary (e.g. 50,000 or Not Disclosed)"
      onChange={handleChange}
      required
    />

    <select name="type" value={jo.type} onChange={handleChange}>
      <option value="Full Time">Full Time</option>
      <option value="Part Time">Part Time</option>
      <option value="Internship">Internship</option>
      <option value="Remote">Remote</option>
    </select>

    <div style={{ textAlign: "left" }}>
      <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Expire Date</label>
      <input
        type="date" value={jo.expireDate}
        name="expireDate"
        onChange={handleChange}
        required
      />
    </div>

    <textarea
      value={jo.description}
      name="description"
      placeholder={"# Heading\n- Bullet point\n1. Number point\n**Bold text** and *italic text*"}
      onChange={handleChange}
      rows="8"
      required
    />

    <button type="submit">Add Job</button>
  </form>
</div>
        </>
    )
}
