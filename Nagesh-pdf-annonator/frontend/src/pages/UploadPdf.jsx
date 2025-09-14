import { useState } from "react";
import { uploadPdf } from "../redux/slices/pdfSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function UploadPdf() {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a file");
    const fm = new FormData();
    fm.append("pdf", file);
    const res = await dispatch(uploadPdf(fm));
    if (res.type.endsWith("fulfilled")) {
      nav(`/pdf/${res.payload.uuid}`);
    }
  };

  return (
    <div className="card">
      <h3>Upload PDF</h3>
      <form onSubmit={submit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" className="btn">
          Upload
        </button>
      </form>
    </div>
  );
}
