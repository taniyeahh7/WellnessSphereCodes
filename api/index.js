import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import healthConditionRouter from "./routes/healthCondRoute.js";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
mongoose
	.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
	console.log("Server running");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/healthCondition", healthConditionRouter);

app.use(express.static(path.join(__dirname, "/client/public")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
