import { useState } from "react";
import { TourButton } from "./TourButton";
import { type Position, knightMoves } from "./main";
import "./chessBoard.css";

export const ChessBoard = () => {
	const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const ranks = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
	const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
	const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
	const [currentTour, setCurrentTour] = useState<Position[]>([]);
	const handleClick = (squareId: Position) => {
		if (!selectedSquare || possibleMoves.includes(squareId)) {
			setSelectedSquare(squareId);
			setPossibleMoves(knightMoves(squareId));
		} else {
			setSelectedSquare(null);
			setPossibleMoves([]);
		}
	};
	const handleTourGenerated = (tour: Position[]) => {
		setCurrentTour(tour);
		// 最初の位置を選択状態にする
		if (tour.length > 0) {
			setSelectedSquare(tour[0]);
			setPossibleMoves(knightMoves(tour[0]));
		}
	};
	return (
		<>
			<TourButton onTourGenerated={handleTourGenerated} />
			<div className="chessBoard">
				{ranks.map((rank) =>
					files.map((file, fileIndex) => {
						const isWhite = (rank + fileIndex) % 2 === 0;
						const squareId = `${file}${rank}` as Position;
						const isSelected = selectedSquare === squareId;
						const isPossibleMove = possibleMoves.includes(squareId);

						return (
							<div
								key={squareId}
								className={`square ${isSelected ? "selectedSquare" : isWhite ? "black" : "white"} ${isPossibleMove ? "possibleMove" : ""} ${currentTour.includes(squareId) ? "" : "vacant"}`}
								onClick={() => handleClick(squareId)}
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
