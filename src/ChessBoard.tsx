import { useState } from 'react';
import { Position } from './main';
import './chessBoard.css';

export const ChessBoard = () => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = [ 1, 2, 3, 4, 5, 6, 7, 8].reverse();
    const [selectedSquare, setSelectedSquare] = useState<Position|null>(null);
    const handleClick = (squareId: Position) => {
        setSelectedSquare(squareId);
    }
    return (
    <div className="chessBoard">
    {ranks.map((rank) => (
                files.map((file, fileIndex) => {
                    const isWhite = (rank + fileIndex) % 2 === 0;
                    const squareId= `${file}${rank}` as Position;
                    const isSelected = selectedSquare === squareId;

                    return (
                        <div 
                            key={squareId}
                            className={`square ${isSelected ? 'selectedSquare' : isWhite? 'white' : 'black'}`}
                            onClick={() => handleClick(squareId)}
                        >
                            {squareId}
                        </div>
                    );
                })
            ))}      

    </div>
    );
}