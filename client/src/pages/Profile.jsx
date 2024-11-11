import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutUserStart,
} from "../redux/user/userSlice";

export default function EditProfile() {
	const [ShowHealthConditionsError, setShowHealthConditionsError] =
		useState(false);
	const [healthConditionsArray, setHealthConditionsArray] = useState([
		{ title: "Loading... Please refresh if this continues" },
	]);
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const [formData, setFormData] = useState({
		username: currentUser.username || "",
		email: currentUser.email || "",
		healthConditions: currentUser.healthConditions || [],
		password: "", // Assuming you want to update the password as well
	});
	const dispatch = useDispatch();

	// Function to show the health conditions
	const handleShowHealthConditions = async () => {
		try {
			setShowHealthConditionsError(false);
			const response = await fetch("/api/healthCondition/getAll", {
				method: "GET",
			});
			const filtered_data = await response.json();
			if (!response.ok) {
				setShowHealthConditionsError(true);
				return;
			}
			setHealthConditionsArray(filtered_data);
		} catch (error) {
			setShowHealthConditionsError(true);
		}
	};
	useEffect(() => {
		handleShowHealthConditions();
	}, []);

	// Function to handle change in the form
	const handleChange = (e) => {
		const { id, type, checked } = e.target;
		setFormData((prevFormData) => {
			if (type === "checkbox") {
				const updatedConditions = checked
					? [...prevFormData.healthConditions, id]
					: prevFormData.healthConditions.filter(
							(condition) => condition !== id
					  );
				console.log("Updated healthConditions:", updatedConditions);
				return {
					...prevFormData,
					healthConditions: updatedConditions,
				};
			}
			return {
				...prevFormData,
				[id]: e.target.value,
			};
		});
	};

	//function to submit the form
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}

			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	//Function to delete user's account
	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	// ------- front-end code -------
	return (
		<div>
			<div class="center">
				<h1>Profile</h1>
				<form onSubmit={handleSubmit}>
					<div class="txt_field">
						<input
							type="text"
							placeholder="username"
							defaultValue={currentUser.username}
							id="username"
							onChange={handleChange}
							required
						/>
						<span></span>
						<label>Username</label>
					</div>
					<div class="txt_field">
						<input
							type="text"
							id="email"
							placeholder="email"
							defaultValue={currentUser.email}
							onChange={handleChange}
							required
						/>
						<span></span>
						<label>Email</label>
					</div>
					<div style={{ marginBottom: "4px" }}>
						<label>Update any of the following health conditions:</label>
					</div>
					{healthConditionsArray.length > 0 ? (
						healthConditionsArray.map((condition) => (
							<div key={condition.title}>
								<input
									type="checkbox"
									id={condition.title}
									onChange={handleChange}
									checked={
										currentUser.healthConditions.includes(condition.title) ||
										formData.healthConditions.includes(condition.title)
									}
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
					<input
						disabled={loading}
						type="submit"
						value={loading ? "Loading..." : "Update"}
					/>
					<input
						disabled={loading}
						type="submit"
						value={loading ? "Loading..." : "Delete Account"}
						onClick={handleDeleteUser}
					/>
				</form>
				<div className="signup_link"></div>
			</div>
		</div>
	);
}
