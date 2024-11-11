import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home.js";
import Settings from "./pages/Settings.js";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Choice from "./pages/Choice.js";
import ExerciseChoice from "./pages/ExerciseChoice.js";
import IngredientForm from "./pages/IngredientForm.js";
import FilterRecipe from "./pages/FilterRecipe.js";
import TextRecipe from "./pages/TextRecipe.js";
import Curl from "./pages/Curl.js";
import Profile from "./pages/Profile.jsx";
import Pushup from "./pages/Pushup.js";
//import Recipes from "./pages/Recipes.js";

function App() {
	return (
		<Router>
			<Navbar />
			<div className="container main">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					{/* <Route path="/recipes" element={<Recipes />} /> */}
					<Route element={<PrivateRoute />}>
						<Route path="/choice" element={<Choice />} />
						<Route path="/exercisechoice" element={<ExerciseChoice />} />
						<Route path="/ingredientform" element={<IngredientForm />} />
						<Route path="/filterrecipe" element={<FilterRecipe />} />
						<Route path="/filterrecipe/:id" element={<TextRecipe />} />
						<Route path="/curl" element={<Curl />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/pushup" element={<Pushup />} />
					</Route>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
