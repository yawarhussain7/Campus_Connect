import React, { useState } from "react";
import { X, FileText } from "lucide-react";

export default function UploadPaperModal({
  isOpen,
  onClose,
  onUploadSubmit,
}) {
  const [subject, setSubject] = useState("");
  const [instructor, setInstructor] = useState("");
  const [semester, setSemester] = useState("Semester 1");
  const [year, setYear] = useState("2026");
  const [exam, setExam] = useState("Mid");
  const [hasSolution, setHasSolution] = useState(false);
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subject || !instructor || !batch || !file) {
      alert("Please fill all required fields");
      return;
    }

  
    const formData = new FormData();

    formData.append("subject", subject);
    formData.append("instructor", instructor);
    formData.append("semester", semester);
    formData.append("year", year);
    formData.append("exam", exam);
    formData.append("hasSolution", hasSolution);
    formData.append("batch", batch);
    formData.append("department", department);
    formData.append("file", file);

    onUploadSubmit(formData);

    // reset
    setSubject("");
    setInstructor("");
    setBatch("");
    setFile(null);
    setHasSolution(false);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            <FileText className="w-4 h-4" />
            Upload Past Paper
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
          />

          <input
            placeholder="Instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="input"
          />

          {/* Semester */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i}>
                Semester {i + 1}
              </option>
            ))}
          </select>

          {/* EXAM TYPE FIXED */}
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value)}
          >
            <option value="Mid">Mid</option>
            <option value="Final">Final</option>
          </select>

          <input
            placeholder="Batch (SP23 etc)"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          />

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Eng.">Electrical Eng.</option>
            <option value="Management Sciences">Management Sciences</option>
            <option value="Mechanical Eng.">Mechanical Eng.</option>
            <option value="Business School">Business School</option>
          </select>

          {/* FILE */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {file && (
            <p className="text-xs">
              Selected: {file.name}
            </p>
          )}

          {/* TOGGLE */}
          <label>
            <input
              type="checkbox"
              checked={hasSolution}
              onChange={(e) =>
                setHasSolution(e.target.checked)
              }
            />
            Includes Solutions
          </label>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">
              Upload
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}