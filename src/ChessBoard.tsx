import { useEffect, useState } from "react";
import { Popup } from "./Popup";
import { type Position, knightMoves } from "./main";
import "./chessBoard.css";

type ChessBoardProps = {
	generatedTour: Position[];
};

type DisplayStatus = "hidden" | "complete" | "failed";

export const ChessBoard: React.FC<ChessBoardProps> = ({ generatedTour }) => {
	const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const ranks = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
	const [currentPosition, setCurrentPosition] = useState<Position>(
		generatedTour[0],
	);
	const [validMoves, setValidMoves] = useState<Position[]>([]);
	const [visitedSquares, setVisitedSquares] = useState<Position[]>([
		generatedTour[0],
	]);
	const [displayState, setDisplayState] = useState<DisplayStatus>("hidden");

	useEffect(() => {
		setDisplayState("hidden");
		setCurrentPosition(generatedTour[0]);
		setValidMoves(
			knightMoves(generatedTour[0]).filter((move) =>
				generatedTour.includes(move),
			),
		);
		setVisitedSquares([generatedTour[0]]);
	}, [generatedTour]);

	useEffect(() => {
		setValidMoves(
			knightMoves(currentPosition)
				.filter((move) => generatedTour.includes(move))
				.filter((move) => !visitedSquares.includes(move)),
		);
	}, [currentPosition, visitedSquares]);

	useEffect(() => {
		if (compareArrays(generatedTour, visitedSquares)) {
			setDisplayState("complete");
		}
	}, [visitedSquares, generatedTour]);

	useEffect(() => {
		if (compareArrays(generatedTour, visitedSquares)) {
			setDisplayState("complete");
		} else if (
			knightMoves(currentPosition)
				.filter((move) => generatedTour.includes(move))
				.filter((move) => !visitedSquares.includes(move)).length === 0
		) {
			if (displayState !== "complete") {
				setDisplayState("failed");
			}
		}
	}, [currentPosition, visitedSquares, generatedTour]);

	const compareArrays: <T>(arr1: T[], arr2: T[]) => boolean = (arr1, arr2) => {
		if (arr1.length !== arr2.length) {
			return false;
		}

		return arr1.every((item) => arr2.includes(item));
	};

	const moveKnight = (squareId: Position) => {
		// すでに通った道は移動不可にする
		if (visitedSquares.includes(squareId)) {
			return;
		}

		if (validMoves.includes(squareId)) {
			setCurrentPosition(squareId);
			setVisitedSquares((prevVisited) => [...prevVisited, squareId]);
		}

		if (compareArrays(generatedTour, visitedSquares)) {
			setDisplayState("complete");
		}
		//動けるマスがない
		if (
			knightMoves(currentPosition)
				.filter((move) => generatedTour.includes(move))
				.filter((move) => !visitedSquares.includes(move)).length === 0
		) {
			//complete後にfailed表示をしないため
			if (displayState === "complete") {
				return;
			}
			setDisplayState("failed");
		}
	};

	const restPath = () => {
		setDisplayState("hidden");
		setCurrentPosition(generatedTour[0]);
		setVisitedSquares([generatedTour[0]]);
	};

	return (
		<>
			{displayState === "complete" && <Popup message={displayState} />}
			{displayState === "failed" && <Popup message={displayState} />}
			<button onClick={restPath}>reset</button>
			<div className="chessBoard">
				{ranks.map((rank) =>
					files.map((file, fileIndex) => {
						const isWhite = (rank + fileIndex) % 2 === 0;
						const squareId = `${file}${rank}` as Position;
						const isSelected = currentPosition === squareId;
						const isPossibleMove = validMoves.includes(squareId);

						return (
							<div
								key={squareId}
								className={`square ${isSelected ? "selectedSquare" : isWhite ? "black" : "white"} ${isPossibleMove ? "possibleMove" : ""} ${generatedTour.includes(squareId) ? "" : "vacant"}`}
								onClick={() => moveKnight(squareId)}
							>
								{squareId}
							</div>
						);
					}),
				)}
			</div>
		</>
	);
};
