import { useState } from "react";
import { type Position, makeTour } from "./main.ts";

interface TourButtonProps {
	onTourGenerated?: (positions: Position[]) => void;
}

export const TourButton = ({ onTourGenerated }: TourButtonProps) => {
	const [tour, setTour] = useState<Position[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [showSolution, setShowSolution] = useState(false);
	const [steps, setSteps] = useState<number>(10);

	const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
	const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
	const handleGenerateTour = () => {
		setIsGenerating(true);
		const position = (files[Math.floor(Math.random() * files.length)] +
			ranks[Math.floor(Math.random() * files.length)]) as Position;
		const newTour = makeTour(steps, position);
		setTour(newTour);
		// 親コンポーネントに通知
		if (onTourGenerated) {
			onTourGenerated(newTour);
		}
		setIsGenerating(false);
	};
	const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value);
		if (!isNaN(value) && value > 0) {
			setSteps(value);
		}
	};

	return (
		<div>
			<button onClick={handleGenerateTour} disabled={isGenerating}>
				{isGenerating ? "生成中..." : "ナイトツアーの生成"}
			</button>
			<input
				id="number"
				type="number"
				value={steps}
				onChange={handleStepsChange}
				min="2"
				max="32"
			/>
			{tour.length > 0 && (
				<button onClick={() => setShowSolution(!showSolution)}>
					{showSolution ? "解答を隠す" : "解答を表示"}
				</button>
			)}
			{tour.length > 0 && showSolution && <div>ツアー: {tour.join(" → ")}</div>}
		</div>
	);
};
