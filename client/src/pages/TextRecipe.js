// TextRecipe.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const TextRecipe = () => {
  const { state } = useLocation();
  console.log(state);

  if (!state || !state.recipe) {
    // Handle the case where the state or recipe is not available
    return <div>No recipe data available</div>;
  }

  const totalRecipe = state.recipe;
  console.log(totalRecipe.name);

  return (
    <div className="text-recipe">
      <h1>{totalRecipe.title}</h1>
      
      <h4>Ingredients:</h4>
      <p> {totalRecipe.ingred}</p>
      <h4>Time:</h4>
      <p>{totalRecipe.time} minutes</p>
      <h4>Instructions:</h4>
      <p> {totalRecipe.instruct}</p>
      
      {/* Add more details as needed */}
    </div>
  );
};

export default TextRecipe;
