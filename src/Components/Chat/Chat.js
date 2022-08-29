import React from 'react';
import { useState, useEffect } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import "./Chat.css"

function Chat({socket, username, room, win, lose, tie}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessagelist] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessagelist((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessagelist((list) => [...list, data]);
        });
    }, [socket]);

    useEffect(() => {
        setCurrentMessage(username + " has just joined the Room");
    }, [username]);

    useEffect(() => {
        if (currentMessage === username + " has just joined the Room") {
            sendMessage()
        }
    }, [currentMessage]);
    return (
      <div className={win || lose || tie ? "chat-window gameEnd" : "chat-window"}>
          <div className="chat-header">
              <p>Chat with your opponent!</p>
          </div>
          <div className="chat-body">
              <ScrollToBottom className="message-container">
              {messageList.map((messageContent) => {
                  return <div className="message" key={messageContent.message} id={username === messageContent.author ? "you" : "other"}>
                        <div>
                            <div className='message-meta'>
                                <p id='author'>{messageContent.author}</p>
                            </div>
                            <div className='message-content'>
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id='time'>{messageContent.time}</p>
                            </div>
                        </div>
                      </div>
              })}
              </ScrollToBottom>
          </div>
          <div className="chat-footer">
              <input type="text" value={currentMessage} placeholder="Your message goes here..." onChange={(event) => { setCurrentMessage(event.target.value); }} onKeyPress={(event) => {event.key === "Enter" && sendMessage()}}/>
              <button onClick={sendMessage}>&#9658;</button>
          </div>
      </div>
    )
  };

export default Chat;