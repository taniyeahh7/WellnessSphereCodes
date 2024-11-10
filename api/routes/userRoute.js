import express from "express";
import {
	deleteUser,
	updateUser,
	test,
	getUserHealthConditions,
	getUser,
} from "../controllers/userCtrl.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/healthCond/:id", verifyToken, getUserHealthConditions);
router.get("/:id", verifyToken, getUser);

export default router;
