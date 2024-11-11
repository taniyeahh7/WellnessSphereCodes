import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function Signup() {
	const [formData, setFormData] = useState({
		healthConditions: [],
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [ShowHealthConditionsError, setShowHealthConditionsError] =
		useState(false);
	const [healthConditionsArray, setHealthConditionsArray] = useState([
		{ title: "Loading... Please refresh if this continues" },
	]);
	const navigate = useNavigate();

	//function to show the health conditions
	const handleShowHealthConditions = async () => {
		try {
			setShowHealthConditionsError(false);
			const response = await fetch("/api/healthCondition/getAll", {
				method: "GET",
			});
			const filtered_data = await response.json();
			if (response.success === false) {
				setShowHealthConditionsError(true);
				return;
			}
			console.log(filtered_data);
			setHealthConditionsArray(filtered_data);
		} catch (error) {
			setShowHealthConditionsError(true);
		}
	};
	useEffect(() => {
		handleShowHealthConditions();
	}, []);

	//function to handle change in the form
	const handleChange = (e) => {
		const { id, value, type, checked } = e.target;
		setFormData((prevFormData) => {
			// For checkboxes, update the healthConditions array
			if (type === "checkbox") {
				return {
					...prevFormData,
					healthConditions: checked
						? [...prevFormData.healthConditions, id]
						: prevFormData.healthConditions.filter(
								(condition) => condition !== id
						  ),
				};
			}
			// For other input fields, update based on the id
			return {
				...prevFormData,
				[id]: value,
			};
		});
	};

	//function to submit the form
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			console.log(formData);
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				setLoading(false);
				setError(data.message);
				return;
			}
			setLoading(false);
			setError(null);
			navigate("/login");
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	// ------- front-end code -------
	return (
		<div>
			<div class="center">
				<h1 style={{ marginTop: "5rem" }}>Sign Up</h1>
				<form onSubmit={handleSubmit}>
					<div class="txt_field">
						<input type="text" required id="username" onChange={handleChange} />
						<span></span>
						<label>Username</label>
					</div>
					<div class="txt_field">
						<input type="text" required id="email" onChange={handleChange} />
						<span></span>
						<label>Email</label>
					</div>
					<div style={{ marginBottom: "4px" }}>
						<label>Have any of the following health conditions:</label>
					</div>
					{healthConditionsArray.length > 0 ? (
						healthConditionsArray.map((condition) => (
							<div key={condition.title}>
								<input
									type="checkbox"
									id={condition.title}
									onChange={handleChange}
									checked={formData.healthConditions.includes(condition.title)}
								/>
								<label htmlFor={condition.title}>{condition.title}</label>
							</div>
						))
					) : (
						<div style={{ marginBottom: "4px" }}>
							<label>No health conditions available.</label>
						</div>
					)}
					<div className="txt_field">
						<input
							type="password"
							required
							onChange={handleChange}
							id="password"
						/>
						<span></span>
						<label>Password</label>
					</div>
					<div className="pass">Forgot Password?</div>
					<input
						disabled={loading}
						type="submit"
						value={loading ? "Loading..." : "Sign Up"}
					/>
				</form>
				<OAuth />
				<div className="signup_link">
					Already a member? <Link to="/login">Login</Link>
				</div>
			</div>
		</div>
	);
}
