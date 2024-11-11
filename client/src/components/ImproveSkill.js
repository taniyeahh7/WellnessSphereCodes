import { Link } from "react-router-dom";

export default function ImproveSkill() {
	const list = [
		"Learn new exciting recipes",
		"Discover deficiency management",
		"Get customised recipes",
		"Exercise with maximising benefits",
		"Get sole attention of our trainer",
	];

	return (
		<div className="section improve-skills">
			<div className="col img">
				<img src="/img/gallery/img_10.jpg" alt="" />
			</div>
			<div className="col typography">
				<h1 className="title">Improve Your Culinary Skills</h1>
				{list.map((item, index) => (
					<p className="skill-item" key={index}>
						{item}
					</p>
				))}
				<Link to="/signup">
					<button className="btn">Signup Now</button>
				</Link>
			</div>
		</div>
	);
}
