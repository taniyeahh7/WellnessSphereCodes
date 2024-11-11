import PreviousSearches from "../components/PreviousSearches";
import RecipeCard from "../components/RecipeCard";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, React, useMemo } from "react";

export default function Recipes() {
	const navigate = useNavigate();
	// const data = navigate.location.state?.data;
	const { state } = useLocation();
	const topRecipes = state?.top_recipes || [];
	const recipeNames = topRecipes.map((recipe) => recipe.name);
	const recipeIngred = topRecipes.map((recipe) => recipe.ingredients);
	const recipeInstruct = topRecipes.map((recipe) => recipe.instructions);
	const recipeTime = topRecipes.map((recipe) => recipe.time);
	const recipeImg = topRecipes.map((recipe) => recipe.image);

	useEffect(() => {
		// Trigger additional actions or updates when state changes, if needed
		console.log("State changed:", state);
	}, [state]);

	const recipes = [
		{
			title: recipeNames[0],
			image: recipeImg[0],
			authorImg: "/img/top-chiefs/img_1.jpg",
			link: "/textrecipe",
			ingred: recipeIngred[0],
			instruct: recipeInstruct[0],
			time: recipeTime[0],
		},
		{
			title: recipeNames[1],
			image: recipeImg[1],
			authorImg: "/img/top-chiefs/img_2.jpg",
			link: "/textrecipe",
			ingred: recipeIngred[1],
			instruct: recipeInstruct[1],
			time: recipeTime[1],
		},
		{
			title: recipeNames[2],
			image: recipeImg[2],
			authorImg: "/img/top-chiefs/img_3.jpg",
			link: "/textrecipe",
			ingred: recipeIngred[2],
			instruct: recipeInstruct[2],
			time: recipeTime[2],
		},
		{
			title: recipeNames[3],
			image: recipeImg[3],
			authorImg: "/img/top-chiefs/img_4.jpg",
			link: "/textrecipe",
			ingred: recipeIngred[3],
			instruct: recipeInstruct[3],
			time: recipeTime[3],
		},
		{
			title: recipeNames[4],
			image: recipeImg[4],
			authorImg: "/img/top-chiefs/img_5.jpg",
			link: "/textrecipe",
			ingred: recipeIngred[4],
			instruct: recipeInstruct[4],
			time: recipeTime[4],
		},
		{
			title: recipeNames[5],
			image: recipeImg[5],
			authorImg: "/img/top-chiefs/img_6.jpg",
			link: "/textrecipe",
			ingred: recipeIngred[5],
			instruct: recipeInstruct[5],
			time: recipeTime[5],
		},
	];

	const handleRecipeClick = (index) => {
		const selectedRecipe = recipes[index];
		navigate(`/filterrecipe/${index}`, { state: { recipe: selectedRecipe } });
	};

	return (
		<div>
			{/* gonna add the delay here so that the animation changes acoording to the number of items itself */}

			<div className="recipes-container">
				{recipes.map((recipes, index) => (
					<div key={index} onClick={() => handleRecipeClick(index)}>
						<RecipeCard recipe={recipes} />
					</div>
				))}
			</div>
		</div>
	);
}
