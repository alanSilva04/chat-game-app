import "./App.css"
import Game from "./Components/Game/Game";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Components/Chat/Chat";

const socket = io.connect("https://tictactoe-chat-app.herokuapp.com");

function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [username, setUsername] = useState("");
  const [showGame, setShowGame] = useState(false);

  const joinRoom = () => {
    if (username !== "" && roomCode !== "") {
      socket.emit("joinRoom", roomCode);
      setShowGame(true);
    }
  };


  return (
    <div className="App">
      {!showGame ? (
      <div className="joinGameContainer">
        <h3>Welcome to my first game!</h3>
        <h1>Join A Room to start playing Tic Tac Toe</h1>
        <h1>You can use the in-game chat to talk to your oponent</h1>
        <h1>Have Fun!!!</h1>
        <div className="joinGame">
          <input type="text" placeholder="Your Name..." onChange={(event) => { setUsername(event.target.value); }}/>
          <input type="text" placeholder="Room ID..." onChange={(event) => { setRoomCode(event.target.value); }} onKeyPress={(event) => {event.key === "Enter" && joinRoom()}}/>
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      </div> )
      : (
      <div className="gameContainer">
        <Game socket={socket} roomCode={roomCode} />
        <br />
        <Chat socket={socket} username={username} room={roomCode} />
      </div>
      )}
    </div>
);
}

export default App;
