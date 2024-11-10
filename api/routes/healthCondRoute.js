import express from "express";
import {
	createHealthCondition,
	deleteHealthCondition,
	updateHealthCondition,
	getHealthCondition,
	getAllHealthConditions,
	getHealthConditionInfo,
} from "../controllers/healthCondCtrl.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createHealthCondition);
router.delete("/delete/:id", deleteHealthCondition);
router.post("/update/:id", updateHealthCondition);
router.get("/get/:id", getHealthCondition);
router.get("/getAll", getAllHealthConditions);
router.get("/getInfo/:title", getHealthConditionInfo);

export default router;
