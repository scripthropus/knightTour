import { useState } from "react";
import { type Position, knightMoves } from "./main";
import "./chessBoard.css";

export const ChessBoard = () => {
	const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const ranks = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
	const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
	const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
	const handleClick = (squareId: Position) => {
		if (!selectedSquare || possibleMoves.includes(squareId)) {
			setSelectedSquare(squareId);
			setPossibleMoves(knightMoves(squareId));
		} else {
			setSelectedSquare(null);
			setPossibleMoves([]);
		}
	};
	return (
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
							className={`square ${isSelected ? "selectedSquare" : isWhite ? "white" : "black"} ${isPossibleMove ? "possibleMove" : ""}`}
							onClick={() => handleClick(squareId)}
						>
							{squareId}
						</div>
					);
				}),
			)}
		</div>
	);
};
