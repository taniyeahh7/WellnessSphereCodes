import RecipeCard from "../components/RecipeCard"
import { Link } from "react-router-dom"
export default function Choice(){
    const recipes = [
        {
            title: "Recipe Generator",
            image: "/img/gallery/img_2.jpg",
            authorImg: "/img/top-chiefs/img_food_icon.png",
        }, 
        {
            title: "Virtual Exercise Trainer",
            image: "/img/gallery/img_exercise.jpg",
            authorImg: "/img/top-chiefs/img-exercise-icon.jpg  ",
        }
    ]

    return (
        <div className="recipes-container">
                <Link to="/ingredientform"><RecipeCard key={0} recipe={recipes[0]} /></Link>
                <Link to="/exercisechoice"><RecipeCard key={1} recipe={recipes[1]}/></Link>
        </div>
    )
}