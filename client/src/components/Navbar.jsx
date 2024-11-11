import { Link, useNavigate } from "react-router-dom";
import { faHome, faList, faCog } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
	signOutUserStart,
	deleteUserFailure,
	deleteUserSuccess,
} from "../redux/user/userSlice.js";

export default function Navbar() {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//log out functionality
	const handleSignOut = async () => {
		try {
			dispatch(signOutUserStart());
			const res = await fetch("/api/auth/signout");
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
			navigate("/");
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	//all the default links
	const defaultLinks = [
		{
			name: "Settings",
			path: "/settings",
			icon: faCog,
		},
	];
	//links to be displayed when user is not logged in
	const loggedOutLinks = [
		{
			name: "Home",
			path: "/",
			icon: faHome,
		},
		// {
		// 	name: "Recipes",
		// 	path: "/recipes",
		// 	icon: faList,
		// },
		{
			name: "Login",
			path: "/login",
			icon: faCog,
		},
		{
			name: "Signup",
			path: "/signup",
			icon: faCog,
		},
	];
	//links to be displayed when user is logged in
	const loggedInLinks = [
		{
			name: "Home",
			path: "/choice",
			icon: faHome,
		},
		{
			name: "Profile",
			path: "/profile",
			icon: faCog,
		},
	];

	// ----- front-end code -----
	return (
		<>
			<div className="navbar container">
				<Link to="/" className="logo">
					W<span>ellness</span>Sphere
				</Link>
				<div className="nav-links">
					{currentUser
						? loggedInLinks.map((link) => (
								<Link to={link.path} key={link.name}>
									{link.name}
								</Link>
						  ))
						: loggedOutLinks.map((link) => (
								<Link to={link.path} key={link.name}>
									{link.name}
								</Link>
						  ))}
					{defaultLinks.map((link) => (
						<Link to={link.path} key={link.name}>
							{link.name}
						</Link>
					))}
					{currentUser && <span onClick={handleSignOut}>Sign out</span>}
				</div>
			</div>
		</>
	);
}
