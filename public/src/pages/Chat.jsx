import React, { useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import { host} from "../utils/APIRoutes";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer"
import Welcome from "../components/Welcome";
import {io} from "socket.io-client";
export default function Chat() {
  const socket=useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  
  useEffect(()=>{
    let storageIni=async () => {
      if (!localStorage.getItem("chat-app-current-user")) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    }
    storageIni()
  }, []);
 
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(()=>{
    let setAvatar=async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    setAvatar();
  }, [currentUser]);
  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <Container>
    <div className="container">
   <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
   {currentChat === undefined ? (
    <Welcome currentUser={currentUser}/>
  ) : (
    <ChatContainer currentChat={currentChat}  currentUser={currentUser} socket={socket}/>
  )}
    </div>
   
    </Container>
  )
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
