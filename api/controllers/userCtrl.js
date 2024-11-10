import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import HealthCondition from "../models/healthCondModel.js";
import { errorHandler } from "../utils/error.js";

// function to update the user information
export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "You can only update your own account!"));
	try {
		if (req.body.password) {
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					username: req.body.username,
					email: req.body.email,
					phone: req.body.phone,
					healthConditions: req.body.healthConditions,
					password: req.body.password,
				},
			},
			{ new: true }
		);

		const { password, ...rest } = updatedUser._doc;

		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};

// function to delete the user
export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "You can only delete your own account!"));
	try {
		await User.findByIdAndDelete(req.params.id);
		res.clearCookie("access_token");
		res.status(200).json("User has been deleted!");
	} catch (error) {
		next(error);
	}
};

// function to get the user's health conditions
export const getUserHealthConditions = async (req, res, next) => {
	if (req.user.id === req.params.id) {
		try {
			const conditions = await HealthCondition.find({
				userRef: req.params.id,
			});
			res.status(200).json(conditions);
		} catch (error) {
			next(error);
		}
	} else {
		return next(
			errorHandler(401, "You can only view your own health conditions!")
		);
	}
};

// function to get the user's information
export const getUser = async (req, res, next) => {
	try {
		// using the ID to fetch
		const user = await User.findById(req.params.id);
		if (!user) {
			return next(errorHandler(404, "User not found!"));
		}
		const { password: pass, ...rest } = user._doc;
		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};

//testing route
export const test = (req, res) => {
	res.json({
		message: "Api route is working!",
	});
};
