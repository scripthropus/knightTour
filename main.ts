type Files = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
type FileIndex = 0 |1 | 2 | 3 | 4 | 5 | 6 | 7 ;
type Ranks = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ;
type Position = `${Files}${Ranks}`;
type knightMove = readonly [FileIndex, Ranks];

const knight: Position = "a1";

const files: Files[] = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const ranks: Ranks[] = [1, 2, 3, 4, 5, 6, 7, 8] as const;

function knightMoves(pos: Position): Position[] {
    const [file, rank] = [pos[0] as Files, Number(pos[1]) as Ranks];
    const fileIndex = files.indexOf(file) as FileIndex;

    const upRight = [fileIndex+1, rank+2] as const;
    const upLeft = [fileIndex-1, rank+2] as const;
    const rightUp = [fileIndex+2, rank+1] as const;
    const rightDown = [fileIndex+2, rank-1] as const;
    const downRight = [fileIndex+1, rank-2] as const;
    const downLeft = [fileIndex-1, rank-2] as const;
    const leftUp = [fileIndex-2, rank+1] as const;
    const leftDown = [fileIndex-2, rank-1] as const;
   
    const allMoves = [
        upRight, upLeft, rightUp, rightDown,
        downRight, downLeft, leftUp, leftDown
    ].filter((move): move is  knightMove => {
        const [f, r] = move;
        return (
        0 <= f && f <=7 &&
        1 <= r && r <= 8
        );
    });

    return allMoves.map(([newFileIdx, newRank])=>{
        return `${files[newFileIdx]}${newRank}` as Position;
    });
}

console.log(knightMoves(knight).map(knightMoves).map(moves => moves.map(knightMoves)));
 