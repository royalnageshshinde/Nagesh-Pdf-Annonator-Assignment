import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPdfs, deletePdf } from "../redux/slices/pdfSlice.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.pdfs);

  useEffect(() => {
    dispatch(fetchMyPdfs());
  }, [dispatch]);

  const handleDelete = (uuid) => {
    if (!window.confirm("Delete this PDF?")) return;
    dispatch(deletePdf(uuid));
  };

  return (
    <div>
      <h2>My Library</h2>
      <div className="pdf-grid">
        {loading && <div>Loading...</div>}
        {list.length === 0 && !loading && <div>No PDFs yet. Upload one.</div>}
        {list.map((pdf) => (
          <div className="pdf-card" key={pdf.uuid}>
            <div className="pdf-name">{pdf.originalName}</div>
            <div className="pdf-actions">
              <Link to={`/pdf/${pdf.uuid}`} className="btn">
                Open
              </Link>
              <button className="btn" onClick={() => handleDelete(pdf.uuid)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
