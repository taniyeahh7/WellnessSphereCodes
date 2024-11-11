import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

export default function ExerciseChoice() {
	const recipes = [
		{
			title: "Curls",
			image: "/img/gallery/img-curl.png",
			authorImg: "/img/top-chiefs/img-exercise-icon.jpg",
		},
		{
			title: "Push Ups",
			image: "/img/gallery/img-pushup.png",
			authorImg: "/img/top-chiefs/img-exercise-icon.jpg  ",
		},
		// {
		// 	title: "Squats",
		// 	image: "/img/gallery/img-squat.png",
		// 	authorImg: "/img/top-chiefs/img-exercise-icon.jpg  ",
		// },
	];

	return (
		<div className="recipes-container">
			<Link to="/curl">
				<RecipeCard key={0} recipe={recipes[0]} />
			</Link>
			<Link to="/pushup">
				<RecipeCard key={1} recipe={recipes[1]} />
			</Link>
			{/* <Link to="/curl">
				<RecipeCard key={2} recipe={recipes[2]} />
			</Link> */}
		</div>
	);
}
