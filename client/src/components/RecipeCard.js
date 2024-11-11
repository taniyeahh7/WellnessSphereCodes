
import CustomImage from "./CustomImage"

export default function RecipeCard({recipe}){
    return(
        <div className="recipe-card">
            <div className="recipes-container">
                <CustomImage imgSrc={recipe.image} pt="65%"/>
                <div className="recipe-card-info">
                    
                    {/* <p className="recipe-desc">Description</p> */}
                    
                    <img className="auther-img" src={recipe.authorImg} alt=""/>
                    <p className="recipe-title">{recipe.title}</p>
                    
                </div>
            </div>
        </div>
    )
}