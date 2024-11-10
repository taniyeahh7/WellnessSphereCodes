import HealthCondition from "../models/healthCondModel.js";
import { errorHandler } from "../utils/error.js";

//function to create health condition
export const createHealthCondition = async (req, res, next) => {
	try {
		const healthCondition = await HealthCondition.create(req.body);
		return res.status(201).json(healthCondition);
	} catch (error) {
		next(error);
	}
};

//function to delete health condition
export const deleteHealthCondition = async (req, res, next) => {
	const healthCondition = await HealthCondition.findById(req.params.id);
	if (!healthCondition) {
		return next(errorHandler(404, "Health Condition not found!"));
	}
	if (req.user.id !== healthCondition.userRef) {
		return next(
			errorHandler(401, "You can only delete your own health condition!")
		);
	}
	try {
		await HealthCondition.findByIdAndDelete(req.params.id);
		res.status(200).json("Health Condition has been deleted!");
	} catch (error) {
		next(error);
	}
};

//function to update health condition
export const updateHealthCondition = async (req, res, next) => {
	const healthCondition = await HealthCondition.findById(req.params.id);
	if (!healthCondition) {
		return next(errorHandler(404, "Health Condition not found!"));
	}
	try {
		const updatedhealthCondition = await HealthCondition.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(200).json(updatedhealthCondition);
	} catch (error) {
		next(error);
	}
};

//function to get a specific health condition
export const getHealthCondition = async (req, res, next) => {
	try {
		const healthCondition = await HealthCondition.findById(req.params.id);
		if (!healthCondition) {
			return next(errorHandler(404, "Health Condition not found!"));
		}
		res.status(200).json(healthCondition);
	} catch (error) {
		next(error);
	}
};

//function to get information about a specific health condition
export const getHealthConditionInfo = async (req, res, next) => {
	try {
		const healthCondition = await HealthCondition.findOne({
			title: req.params.title,
		});
		if (!healthCondition) {
			return next(errorHandler(404, "Health Condition not found!"));
		}
		// If health condition is found, extract only the required fields
		const { ingredientsAvoid, ingredientsBeneficial } = healthCondition;
		res.status(200).json({ ingredientsAvoid, ingredientsBeneficial });
	} catch (error) {
		// Handle any errors that occur during the process
		next(error);
	}
};

// function to fetch all health conditions
export const getAllHealthConditions = async (req, res, next) => {
	try {
		const sort = req.query.sort || "createdAt";
		const order = req.query.order || "desc";

		const healthConditions = await HealthCondition.find({}).sort({
			[sort]: order,
		});

		return res.status(200).json(healthConditions);
	} catch (error) {
		next(error);
	}
};
