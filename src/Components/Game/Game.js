import { useEffect, useState } from "react";
import Cell from "../Cell/Cell";
import "./Game.css";
import Confetti from "react-confetti";

const Main = ({ socket, roomCode, win, lose, tie, setWin, setLose, setTie }) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [canPlay, setCanPlay] = useState(true);
  const [winCount, setWinCount] = useState(0);
  const [tieCount, setTieCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);



  useEffect(() => {
    socket.on("updateGame", (id) => {
      console.log("use Effect", id);
      setBoard((data) => ({ ...data, [id]: "O" }));
      setCanPlay(true);
    });

    return () => socket.off("updateGame");
  });

  const handleCellClick = (e) => {
    const id = e.currentTarget.id;
    if (canPlay && board[id] === "") {
      setBoard((data) => ({ ...data, [id]: "X" }));
      socket.emit("play", { id, roomCode });
      setCanPlay(false);
    }
  };

  const winConditions = (board[0] === "X" && board[1] === "X" && board[2] === "X") ||
  (board[3] === "X" && board[4] === "X" && board[5] === "X") ||
  (board[6] === "X" && board[7] === "X" && board[8] === "X") ||
  (board[0] === "X" && board[3] === "X" && board[6] === "X") ||
  (board[1] === "X" && board[4] === "X" && board[7] === "X") ||
  (board[2] === "X" && board[5] === "X" && board[8] === "X") ||
  (board[0] === "X" && board[4] === "X" && board[8] === "X") ||
  (board[2] === "X" && board[4] === "X" && board[6] === "X");

  const loseConditions = (board[0] === "O" && board[1] === "O" && board[2] === "O") ||
  (board[3] === "O" && board[4] === "O" && board[5] === "O") ||
  (board[6] === "O" && board[7] === "O" && board[8] === "O") ||
  (board[0] === "O" && board[3] === "O" && board[6] === "O") ||
  (board[1] === "O" && board[4] === "O" && board[7] === "O") ||
  (board[2] === "O" && board[5] === "O" && board[8] === "O") ||
  (board[0] === "O" && board[4] === "O" && board[8] === "O") ||
  (board[2] === "O" && board[4] === "O" && board[6] === "O");

  const tieConditions = ((board[0] === ("X" || "O") && board[0] !== "") &&
                (board[1] === ("X" || "O") && board[1] !== "") &&
                (board[2] === ("X" || "O") && board[2] !== "") &&
                (board[3] === ("X" || "O") && board[3] !== "") &&
                (board[4] === ("X" || "O") && board[4] !== "") &&
                (board[5] === ("X" || "O") && board[5] !== "") &&
                (board[6] === ("X" || "O") && board[6] !== "") &&
                (board[7] === ("X" || "O") && board[7] !== "") &&
                (board[8] === ("X" || "O") && board[8] !== ""));

  useEffect(() => {
    if (winConditions) {
      setWin(true)
      setWinCount((prevCount) => (prevCount +1))
    } else if (loseConditions) {
      setLose(true)
      setLoseCount((prevCount) => (prevCount +1))
    } else if(tieConditions) {  
      setTie(true)
      setTieCount((prevCount) => (prevCount +1))
    }
  }, [board])

  function resetGame() {
    return (
      setWin(false),
      setLose(false),
      setTie(false),
      setBoard(["", "", "", "", "", "", "", "", ""])
    )
  }

  return (
    <main>
      <section className={win || lose || tie ? "main-section gameEnd" : "main-section"}>
        <Cell handleCellClick={handleCellClick} id={"0"} text={board[0]} />
        <Cell handleCellClick={handleCellClick} id={"1"} text={board[1]} />
        <Cell handleCellClick={handleCellClick} id={"2"} text={board[2]} />

        <Cell handleCellClick={handleCellClick} id={"3"} text={board[3]} />
        <Cell handleCellClick={handleCellClick} id={"4"} text={board[4]} />
        <Cell handleCellClick={handleCellClick} id={"5"} text={board[5]} />

        <Cell handleCellClick={handleCellClick} id={"6"} text={board[6]} />
        <Cell handleCellClick={handleCellClick} id={"7"} text={board[7]} />
        <Cell handleCellClick={handleCellClick} id={"8"} text={board[8]} />
      </section>

      <div className={win || lose || tie ? "counts gameEnd" : "counts"}>
        <ul>
          <li className="counter"> Win Count <br />{winCount}</li>
          <li className="counter"> Draws Count <br />{tieCount}</li>
          <li className="counter"> Loss Count <br />{loseCount}</li>
        </ul>
      </div>

        {win ?
        <>
          <Confetti/> 
          <div className="gameFinished won">
            <h1 className="endText"> Congratulations you won!!! </h1>
            <div className="resetButton" onClick={resetGame}> Reset Game </div>
          </div> 
        </> : ""    
        }
        {lose ?
            <div className="gameFinished lose"> 
              <h1 className="endText"> Sorry you lose </h1>
              <div className="resetButton" onClick={resetGame}> Reset Game </div>
            </div> : ""
        }
        {tie ?
            <div className="gameFinished tie">
              <h1 className="endText"> It's a tie!! Good luck next time </h1>
              <div className="resetButton" onClick={resetGame}> Rematch </div>
            </div> : ""
        }
    </main>
  );
};

export default Main;
