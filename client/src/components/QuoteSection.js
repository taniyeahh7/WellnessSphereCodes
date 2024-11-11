import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

export default function QuoteSection() {
	return (
		<div className="section quote">
			<p className="quote-text">
				<FontAwesomeIcon icon={faQuoteLeft} />
				Fitness is the art of balancing the delicious flavors of life with the
				invigorating rhythms of exercise, creating a harmonious masterpiece that
				nourishes both body and soul.
				<FontAwesomeIcon icon={faQuoteRight} />
			</p>
			<p className="quote-author"> -Angole Bordeux</p>
		</div>
	);
}
