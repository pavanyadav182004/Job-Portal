import { useContext } from "react";
import JobContext from "../context/JobContext.js";

export default function useJobs() {
  const context = useContext(JobContext);

  if (context === undefined) {
    throw new Error("useJobs must be used inside a JobProvider.");
  }

  return context;
}
