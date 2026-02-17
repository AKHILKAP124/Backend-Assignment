import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { setupSwagger } from "./src/config/swagger.js";

// Load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Setup Swagger
setupSwagger(app);

// Connect to MongoDB
import connectDB from "./src/config/database.js";
connectDB();

// Enable CORS
app.use(
  cors({
    origin: "https://backend-assignment-azure.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
import UserRouter from "./src/routes/UserRoutes.js";
import TaskRouter from "./src/routes/TaskRoutes.js";

app.use("/api/users", UserRouter);
app.use("/api/tasks", TaskRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use("/", (req, res) => {
  res.send("Welcome to the Task Management API");
});