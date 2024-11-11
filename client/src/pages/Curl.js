// import { useState } from "react";
import React from "react";

export default function Curl() {
	// const [videoFeedStopped, setVideoFeedStopped] = useState(false);

	const stopVideoFeed = () => {
		fetch("http://localhost:5000/api/stop_curl_feed")
			.then(() => {
				console.log("Video feed has stopped hehe.");
				// setVideoFeedStopped(true);
			})
			.catch((error) => console.error("Error:", error));
	};

	return (
		<div className="stream-div">
			<img
				src="http://localhost:5000/api/curl_feed"
				alt="curl video window"
				width="1000"
				height="600"
				className="stream-window"
			/>
			<button onClick={stopVideoFeed} className="google-stop-stream-btn">
				Stop Video
			</button>
		</div>
	);
}
