import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";
import ChatList from "../components/ChatList.jsx";
import PotentialChat from "../components/PotentialChat.jsx";
import ChatBox from "../components/ChatBox.jsx";
import Navbar from "../components/Navbar.jsx";

function Chat() {
  const navigate = useNavigate();
  const { userChat, isUserChatLoading, userChatError } =
    useContext(ChatContext);
  return (
    <div className="h-[90vh] w-[90vw] rounded-xl p-2 gap-2 bg-[#f4f5f8] flex ">
      {/* <div className="flex flex-col h-[85vh] bg-gray-300 w-[200px]">
        {userChat !== null &&
          userChat.map((chat, index) => {
            return <ChatList key={index} chat={chat} />;
          })}
      </div>

      <div className="flex flex-col flex-1"> */}
      {/* <PotentialChat /> */}
      {/* Chat Section */}
      {/* <ChatBox />
      </div> */}
      <Navbar />
      <ChatBox />
    </div>
  );
}

export default Chat;
