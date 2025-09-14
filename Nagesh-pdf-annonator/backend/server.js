import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import pdfRoutes from './routes/pdfRoutes.js';
import highlightRoutes from './routes/highlightRoutes.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/highlights', highlightRoutes);

const PORT = process.env.PORT || 7500;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
