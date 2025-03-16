import { useState } from "react";
import { ChessBoard } from "./ChessBoard.tsx";
import { type Position, makeTour } from "./main.ts";
import "./knightTour.css";

export const KnightTour = () => {
	const [generatedTour, setGeneratedTour] = useState<Position[]>([]);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [steps, setSteps] = useState<number>(10);
	const [showSolution, setShowSolution] = useState(false);

	const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
	const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

	const handleGenerateTour = () => {
		setIsGenerating(true);
		const position = (files[Math.floor(Math.random() * files.length)] +
			ranks[Math.floor(Math.random() * files.length)]) as Position;
		setGeneratedTour(() => makeTour(steps, position));
		setIsGenerating(false);
	};

	const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseInt(e.target.value);
		if (!isNaN(value) && value > 0) {
			setSteps(value);
		}
	};

	return (
		<div className="container">
			<div className="buttonsContainer">
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
				{generatedTour.length > 0 && (
					<button onClick={() => setShowSolution(!showSolution)}>
						{showSolution ? "解答を隠す" : "解答を表示"}
					</button>
				)}
			</div>
			{generatedTour.length > 0 && showSolution && (
				<div className="tour">ツアー: {generatedTour.join(" → ")}</div>
			)}
			{generatedTour.length > 0 && <ChessBoard generatedTour={generatedTour} />}
		</div>
	);
};
