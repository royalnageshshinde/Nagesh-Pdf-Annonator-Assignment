import React from "react";
import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchHighlights, createHighlight } from "../redux/slices/highlightSlice.js";
import { BACKEND_BASE } from "../config.js";
import "./PdfViewer.css";
import { pdfjs } from "react-pdf";



pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";



export default function PdfViewer() {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const highlights = useSelector((s) => s.highlights.list);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  const containerRef = useRef();

  // Fetch PDF + highlights
  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/pdfs/${uuid}`);
      setPdfUrl(`${BACKEND_BASE}/uploads/${res.data.filename}`);
    };
    dispatch(fetchHighlights(uuid));
    load();
  }, [uuid, dispatch]);

  // Handle text selection
  useEffect(() => {
    const handler = async () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      const container = containerRef.current;
      if (!container) return;

      const range = selection.getRangeAt(0);
      if (!container.contains(range.commonAncestorContainer)) return;

      const clientRects = Array.from(range.getClientRects());
      if (!clientRects.length) return;

      const pageElement = range.startContainer.parentElement.closest(".react-pdf__Page");
      if (!pageElement) {
        selection.removeAllRanges();
        return;
      }

      const pageBox = pageElement.getBoundingClientRect();
      const rectsRel = clientRects.map((r) => ({
        x: (r.left - pageBox.left) / pageBox.width,
        y: (r.top - pageBox.top) / pageBox.height,
        width: r.width / pageBox.width,
        height: r.height / pageBox.height,
      }));

      const payload = {
        pdfUuid: uuid,
        page: pageNumber,
        text: selection.toString(),
        rect: rectsRel[0],
        rects: rectsRel,
      };

      await dispatch(createHighlight(payload));
      selection.removeAllRanges();
    };

    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, [dispatch, uuid, pageNumber]);

  const renderedHighlights = highlights.filter(
    (h) => Number(h.page) === Number(pageNumber)
  );

  return (
    <div className="viewer-layout">
      {/* PDF Viewer Section */}
      <div className="viewer-left">
        <div className="viewer-controls">
          <button onClick={() => setPageNumber((p) => Math.max(1, p - 1))}>
            ⬅ Prev
          </button>
          <span>
            Page {pageNumber} / {numPages || "—"}
          </span>
          <button onClick={() => setPageNumber((p) => Math.min(numPages || p + 1, p + 1))}>
            Next ➡
          </button>
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}>➖ Zoom Out</button>
          <button onClick={() => setScale((s) => s + 0.2)}>➕ Zoom In</button>
        </div>

        <div ref={containerRef} className="pdf-container">
          {pdfUrl ? (
            <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer
                renderTextLayer
                className="pdf-page"
                wrapperProps={{ style: { position: "relative" } }}
              >
                {renderedHighlights.map((h) => {
                  const r = h.rect || {};
                  return (
                    <div
                      key={h._id}
                      className="pdf-highlight"
                      style={{
                        left: `${(r.x ?? 0) * 100}%`,
                        top: `${(r.y ?? 0) * 100}%`,
                        width: `${(r.width ?? 0) * 100}%`,
                        height: `${(r.height ?? 0) * 100}%`,
                      }}
                    />
                  );
                })}
              </Page>
            </Document>
          ) : (
            <div className="loading">Loading PDF...</div>
          )}
        </div>
      </div>

      {/* Annotations Section */}
      <div className="annotations-panel">
        <h3>📌 Annotations</h3>
        {renderedHighlights.length === 0 ? (
          <p className="no-annotations">No annotations on this page.</p>
        ) : (
          <ul>
            {renderedHighlights.map((h) => (
              <li key={h._id} className="annotation-item">
                {h.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
