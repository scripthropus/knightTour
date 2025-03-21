import { useEffect, useState } from "react";
import { ClearAnimation } from "./ClearAnimation";
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
	const [validMoves, setValidMoves] = useState<Position[]>(
		knightMoves(currentPosition).filter((move) => generatedTour.includes(move)),
	);
	const [visitedSquares, setVisitedSquares] = useState<Position[]>([
		generatedTour[0],
	]);
	const [displayState, setDisplayState] = useState<DisplayStatus>("hidden");

	useEffect(() => {
		setCurrentPosition(generatedTour[0]);
		setValidMoves(
			knightMoves(generatedTour[0]).filter((move) =>
				generatedTour.includes(move),
			),
		);
		setVisitedSquares([generatedTour[0]]);
		setDisplayState(() => "hidden");
	}, [generatedTour]);

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

		//移動不可
		if (!validMoves.includes(squareId)) {
			return;
		}

		setCurrentPosition(() => squareId);
		setVisitedSquares((prevVisited) => [...prevVisited, squareId]);
		setValidMoves(() =>
			knightMoves(squareId)
				.filter((move) => generatedTour.includes(move))
				.filter((move) => !visitedSquares.includes(move)),
		);

		if (compareArrays(generatedTour, [...visitedSquares, squareId])) {
			setDisplayState(() => "complete");
		} else if (
			//動けるマスがない
			knightMoves(squareId)
				.filter((move) => generatedTour.includes(move))
				.filter((move) => !visitedSquares.includes(move)).length === 0
		) {
			setDisplayState(() => "failed");
		}
	};

	const restPath = () => {
		setDisplayState("hidden");
		setCurrentPosition(() => generatedTour[0]);
		setVisitedSquares(() => [generatedTour[0]]);
		setValidMoves(() =>
			knightMoves(generatedTour[0]).filter((move) =>
				generatedTour.includes(move),
			),
		);
	};

	return (
		<>
			{displayState === "complete" && <ClearAnimation />}
			{displayState === "failed"}
			<button onClick={restPath}>reset</button>
			<div
				className={`chessBoard ${displayState === "failed" ? "shake-light" : ""}`}
			>
				{ranks.map((rank) =>
					files.map((file, fileIndex) => {
						const isWhite = (rank + fileIndex) % 2 === 0;
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
		</>
	);
};
