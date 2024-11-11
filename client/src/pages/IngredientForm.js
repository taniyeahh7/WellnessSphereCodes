import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function IngredientForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		input_ingredients: "",
		cannot_have: "",
	});
	const { currentUser } = useSelector((state) => state.user);
	const [userData, setUserData] = useState({
		healthConditions: currentUser.healthConditions || [],
	});
	const results = [];

	useEffect(() => {
		// Clear the form data when the component mounts
		return () => setFormData({ input_ingredients: "", cannot_have: "" });
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		// fetch user's health conditions
		const healthConds = currentUser.healthConditions;

		// fetch ingredients associated with diseases
		const results = await Promise.all(
			healthConds.map(async (condition) => {
				try {
					console.log(condition);
					const response = await fetch(
						`/api/healthCondition/getInfo/${condition}`
					);
					const data = await response.json();
					return data; // Return the data to be collected in the results array
				} catch (error) {
					console.error(
						`Error fetching health condition data for ${condition.title}:`,
						error
					);
					return null;
				}
			})
		);

		// combine the results into the form data
		const updatedFormData = results.reduce(
			(formData, healthConditionData) => {
				if (healthConditionData) {
					formData.input_ingredients = [
						formData.input_ingredients,
						healthConditionData.ingredientsBeneficial.join(", "),
					]
						.filter(Boolean)
						.join(", ");
					formData.cannot_have = [
						formData.cannot_have,
						healthConditionData.ingredientsAvoid.join(", "),
					]
						.filter(Boolean)
						.join(", ");
				}
				return formData;
			},
			{
				input_ingredients: formData.input_ingredients,
				cannot_have: formData.cannot_have,
			}
		);

		//fetch recipes from ML model
		const response = await fetch("http://localhost:5000/api/ingredform", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedFormData),
		});
		if (response.status === 200) {
			const serverResponse = await response.json();
			console.log(serverResponse.top_recipes);
			navigate("/filterrecipe", { state: serverResponse });
			return serverResponse;
		} else {
			console.log("not working");
		}
	};

	return (
		<div className="center">
			<h1>Ingredients</h1>
			<form onSubmit={handleSubmit} autoComplete="off">
				<div className="txt_field">
					<input
						type="text"
						value={formData.input_ingredients}
						onChange={(e) =>
							setFormData({ ...formData, input_ingredients: e.target.value })
						}
						required
					/>
					<span></span>
					<label>Ingredients available e.g. Milk, Flour, Vanilla</label>
				</div>
				<div className="txt_field">
					<input
						type="text"
						value={formData.cannot_have}
						onChange={(e) =>
							setFormData({ ...formData, cannot_have: e.target.value })
						}
						required
					/>
					<span></span>
					<label>Ingredients not suitable to use e.g. Sugar, Peanuts</label>
				</div>
				<input type="submit" value="Submit" />
				<div class="signup_link"></div>
			</form>
		</div>
	);
}
