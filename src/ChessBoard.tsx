import { useEffect, useState } from "react";
import { ClearAnimation } from "./ClearAnimation";
import { type Position, knightMoves, makeTour } from "./main";
import "./chessBoard.css";
import "./KnightTourButtons.css";

type DisplayStatus = "hidden" | "complete" | "failed";

export const ChessBoard = () => {
	const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
	const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

	const [generatedTour, setGeneratedTour] = useState<Position[]>([]);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [steps, setSteps] = useState<number>(10);
	const [showSolution, setShowSolution] = useState(false);

	const [currentPosition, setCurrentPosition] = useState<Position | undefined>(
		undefined,
	);
	const [validMoves, setValidMoves] = useState<Position[]>([]);
	const [visitedSquares, setVisitedSquares] = useState<Position[]>([]);
	const [displayState, setDisplayState] = useState<DisplayStatus>("hidden");

	const handleGenerateTour = () => {
		if (steps < 1 || steps > 32) {
			return;
		}
		setIsGenerating(true);
		const randomFile = files[Math.floor(Math.random() * files.length)];
		const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
		const startPosition = `${randomFile}${randomRank}` as Position;

		const tour = makeTour(steps, startPosition);
		setGeneratedTour(tour);
		setIsGenerating(false);
		setShowSolution(false);
	};

	const handleStepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const valueString = e.target.value;
		if (valueString === "") {
			setSteps(0);
			return;
		}
		const value = Number.parseInt(valueString);
		if (!Number.isNaN(value)) {
			setSteps(value);
		}
	};

	useEffect(() => {
		if (generatedTour.length > 0) {
			const startPos = generatedTour[0];
			setCurrentPosition(startPos);
			setVisitedSquares([startPos]);

			if (startPos) {
				setValidMoves(
					knightMoves(startPos)
						.filter((move) => generatedTour.includes(move))
						.filter((move) => move !== startPos),
				);
			} else {
				setValidMoves([]);
			}
		} else {
			setCurrentPosition(undefined);
			setValidMoves([]);
			setVisitedSquares([]);
		}
		setDisplayState("hidden");
	}, [generatedTour]);

	const comparePathsAsSets = (
		path1: Position[],
		path2: Position[],
	): boolean => {
		if (path1.length !== path2.length) {
			return false;
		}
		const set1 = new Set(path1);
		return path2.every((item) => set1.has(item));
	};

	const moveKnight = (squareId: Position) => {
		if (visitedSquares.includes(squareId) || !validMoves.includes(squareId)) {
			return;
		}

		const newVisitedSquares = [...visitedSquares, squareId];
		setCurrentPosition(squareId);
		setVisitedSquares(newVisitedSquares);

		const nextPossibleMoves = knightMoves(squareId)
			.filter((move) => generatedTour.includes(move))
			.filter((move) => !newVisitedSquares.includes(move));
		setValidMoves(nextPossibleMoves);

		if (newVisitedSquares.length === generatedTour.length) {
			if (comparePathsAsSets(generatedTour, newVisitedSquares)) {
				setDisplayState("complete");
			} else {
				setDisplayState("failed");
			}
		} else if (nextPossibleMoves.length === 0) {
			setDisplayState("failed"); // 次に動けるマスがない
		}
	};

	const resetPath = () => {
		if (generatedTour.length > 0) {
			const startPos = generatedTour[0];
			setCurrentPosition(startPos);
			setVisitedSquares([startPos]);
			if (startPos) {
				setValidMoves(
					knightMoves(startPos)
						.filter((move) => generatedTour.includes(move))
						.filter((move) => move !== startPos),
				);
			} else {
				setValidMoves([]);
			}
			setDisplayState("hidden");
		}
	};

	return (
		<>
			{displayState === "complete" && <ClearAnimation />}
			<div className="container">
				<div className="buttonsContainer">
					<button
						onClick={handleGenerateTour}
						disabled={isGenerating || steps === 0}
					>
						{isGenerating ? "生成中..." : "ナイトツアーの生成"}
					</button>
					<input
						id="number"
						type="number"
						value={steps === 0 && !isGenerating ? "" : steps}
						onChange={handleStepsChange}
						min="1"
						max="32"
					/>
					{generatedTour.length > 0 && (
						<button onClick={() => setShowSolution(!showSolution)}>
							{showSolution ? "解答を隠す" : "解答を表示"}
						</button>
					)}
					{generatedTour.length > 0 && (
						<button onClick={resetPath}>リセット</button>
					)}
				</div>
				{generatedTour.length > 0 && showSolution && (
					<div className="tour">ツアー: {generatedTour.join(" → ")}</div>
				)}
			</div>

			{generatedTour.length > 0 && (
				<div
					className={`chessBoard ${displayState === "failed" ? "shake-light" : ""}`}
				>
					<div
						className={`chessBoard ${displayState === "failed" ? "shake-light" : ""}`}
					>
						{ranks.map((rank) =>
							files.map((file, fileIndex) => {
								const isWhite = (Number.parseInt(rank) + fileIndex) % 2 === 0;
								const squareId = `${file}${rank}` as Position;
								const isSelected = currentPosition === squareId;
								const isPossibleMove = validMoves.includes(squareId);
								const isVisited = visitedSquares.includes(squareId);

								return (
									<div
										key={squareId}
										className={`square ${isSelected ? "selectedSquare" : isWhite ? "black" : "white"} ${isPossibleMove ? "possibleMove" : ""} ${generatedTour.includes(squareId) ? "" : "vacant"} ${isVisited ? "visitedSquare" : ""}`}
										onClick={() => moveKnight(squareId)}
									>
										{squareId}
									</div>
								);
							}),
						)}
					</div>
				</div>
			)}
		</>
	);
};
