import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import "./Edit.css"
import { getJobs } from "../../utils/storage";
import { updateJob } from "../../services/jobApi";
import { validateJobForm } from "../../utils/validation";
import { compressImage } from "../../utils/imageUtils";


export default function EditJob(){

    const {id} = useParams();

    const navigate = useNavigate();

    const [job, setJob]  = useState(() => {
        const jobs = getJobs();
        const foundJob = jobs.find((j)=> j.id ===Number(id));

        return foundJob || {
            title:"",
            company:"",
            location:"",
            salary:"",
            type: "Full Time",
            description: "",
            companyImage: foundJob?.companyImage || "",
            expireDate: "",
        };
    })

    const handleChange = (e)=>{
        setJob({
            ...job,
            [e.target.name]: e.target.value,
        });
    }

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

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const validationError = validateJobForm(job);

        if (validationError) {
            alert(validationError);
            return;
        }

        await updateJob(id, job);

        alert("Job Updated");
        navigate("/my-jobs");
    }

    return(
        <>
        <form className="edit-job-form" onSubmit={handleSubmit} > 
            <h1>Edit jobs</h1>

            <input onChange={handleChange}  name="title" value={job.title} placeholder="Update Job Title " required/>
            <input  onChange={handleChange}   name="company" value={job.company} placeholder=" Update Company Name" required />
            <input  onChange={handleChange}   name="location" value={job.location} placeholder="Update Location" required/>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Company Logo/Image (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {job.companyImage && <img src={job.companyImage} alt="Company preview" style={{ width: "80px", height: "80px", objectFit: "cover", marginTop: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />}
            </div>

            <input  onChange={handleChange}   name="salary" value={job.salary} placeholder="Update Salary" required/>
            <select onChange={handleChange} name="type" value={job.type}>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
            </select>

            <div style={{ textAlign: "left", marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Expire Date</label>
              <input
                type="date" value={job.expireDate || ""}
                name="expireDate"
                onChange={handleChange}
                required
              />
            </div>

            <textarea
                onChange={handleChange}
                name="description"
                value={job.description}
                placeholder={"# Heading\n- Bullet point\n1. Number point\n**Bold text** and *italic text*"}
                rows="8"
                required
            />

            <button>Update Job</button>
        </form>
        
        </>
    )
}
