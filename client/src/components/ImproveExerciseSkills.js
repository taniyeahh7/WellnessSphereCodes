import { Link } from "react-router-dom";

export default function ImproveExerciseSkills() {
	const exerciseList = [
		"Learn effective exercise techniques",
		"Receive guidance on proper form",
		"Customized fitness routines",
		"Maximize your workout benefits",
		"Get dedicated attention from our trainer",
	];

	return (
		<div className="section improve-skills">
			<div className="col typography">
				<h1 className="title">Enhance Your Exercise Skills</h1>
				{exerciseList.map((item, index) => (
					<p className="skill-item" key={index}>
						{item}
					</p>
				))}
				<Link to="/signup">
					<button className="btn">Signup Now</button>
				</Link>
			</div>
			<div className="col img">
				<img src="/img/gallery/img_home.jpg" alt="" />
			</div>
		</div>
	);
}
