import mongoose from "mongoose";

const healthConditionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		ingredientsAvoid: {
			type: Array,
			required: true,
		},
		ingredientsBeneficial: {
			type: Array,
			required: true,
		},
	},
	{ timestamps: true }
);

const HealthCondition = mongoose.model(
	"healthCondition",
	healthConditionSchema
);

export default HealthCondition;
