import express from 'express'
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import analysisRoutes from './src/routes/analysisRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import authRoutes from './src/routes/authRoutes.js'; // Keep this, it's used
import industryDemandRoutes from './src/routes/industryDemandRoutes.js';
import careerRoleRoutes from './src/routes/careerRoleRoutes.js';
// import postRoutes from './src/routes/postRoutes.js'; // Uncomment when ready to use
// import creatorRoutes from './src/routes/creatorRoutes.js'; // Uncomment when ready to use
// import path from 'path'; // Uncomment if path module is needed
import { connectDB } from './src/lib/db.js';
import { sanitizeInput } from './src/middlewares/sanitize.js';

dotenv.config();

const app=express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(sanitizeInput);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
// serve uploaded files statically if needed (preview)
app.use('/uploads', express.static(path.resolve('uploads')));
app.use("/api/analysis", analysisRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/industry-demand", industryDemandRoutes);
app.use("/api/career-role", careerRoleRoutes);

const port=process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDB();
})
 