import { useEffect, useState } from "react";
import { type Position, knightMoves } from "./main";
import "./chessBoard.css";

type ChessBoardProps = {
	generatedTour: Position[];
};

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

	useEffect(() => {
		// generatedTourが更新されたときに状態をリセット
		setCurrentPosition(generatedTour[0]);
		setValidMoves(
			knightMoves(generatedTour[0]).filter((move) =>
				generatedTour.includes(move),
			),
		);
		setVisitedSquares([generatedTour[0]]);
	}, [generatedTour]); // generatedTourが変更されたときにリセット

	useEffect(() => {
		// currentPositionが変わるたびにvalidMovesを更新
		setValidMoves(
			knightMoves(currentPosition)
				.filter((move) => generatedTour.includes(move))
				.filter((move) => !visitedSquares.includes(move)),
		);
	}, [currentPosition, visitedSquares]); // currentPosition と visitedSquares が変わったときのみ実行

	const moveKinght = (squareId: Position) => {
		// すでに通った道は移動不可にする
		if (visitedSquares.includes(squareId)) {
			return;
		}

		if (validMoves.includes(squareId)) {
			setCurrentPosition(squareId);
			setVisitedSquares((prevVisited) => [...prevVisited, squareId]);
		}
	};

	const restPath = () => {
		setCurrentPosition(generatedTour[0]);
		setVisitedSquares([generatedTour[0]]);
	};

	return (
		<>
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
								onClick={() => moveKinght(squareId)}
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
