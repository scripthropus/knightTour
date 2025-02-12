"use strict";
const knight = "a1";
const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
function knightMoves(pos) {
    const [file, rank] = [pos[0], Number(pos[1])];
    const fileIndex = files.indexOf(file);
    const upRight = [fileIndex + 1, rank + 2];
    const upLeft = [fileIndex - 1, rank + 2];
    const rightUp = [fileIndex + 2, rank + 1];
    const rightDown = [fileIndex + 2, rank - 1];
    const downRight = [fileIndex + 1, rank - 2];
    const downLeft = [fileIndex - 1, rank - 2];
    const leftUp = [fileIndex - 2, rank + 1];
    const leftDown = [fileIndex - 2, rank - 1];
    const allMoves = [
        upRight, upLeft, rightUp, rightDown,
        downRight, downLeft, leftUp, leftDown
    ].filter((move) => {
        const [f, r] = move;
        return (0 <= f && f <= 7 &&
            1 <= r && r <= 8);
    });
    return allMoves.map(([newFileIdx, newRank]) => {
        return `${files[newFileIdx]}${newRank}`;
    });
}
function makeTour(steps, startPos) {
    const tour = [startPos];
    while (tour.length < steps) {
        const currentPos = tour[tour.length - 1];
        const possibleMoves = knightMoves(currentPos).filter(move => !tour.includes(move));
        if (possibleMoves.length === 0) {
            break;
        }
        const rand = Math.floor(Math.random() * possibleMoves.length);
        const nextMove = possibleMoves[rand];
        const futureMovesAvailable = knightMoves(nextMove)
            .some(move => !tour.includes(move) && move !== nextMove);
        if (!futureMovesAvailable) {
            continue;
        }
        tour.push(nextMove);
    }
    return tour;
}
console.log(makeTour(15, "b3"));
