import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  UserRoundPlus,
  Moon,
  SunMoon,
  Search,
  LogOut,
  BellRing,
  MessageCircleMore,
} from "lucide-react";
import { UserRound } from "lucide-react";
import { ChatContext } from "../context/ChatContext";
import ChatMembersList from "./ChatList";
import PotentialChat from "./PotentialChat";
import { useState } from "react";
import { useFetchNotification } from "../hooks/useFetchNotification";

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const { userChat, socket, notifications } = useContext(ChatContext);
  const [showAllUsers, setShowAllUser] = useState(false);
  // const {myNotifications} = useFetchNotification(notifications, user);
  // console.log(myNotifications)

  const handleLogout = () => {
    socket.off("getOnlineUsers");
    logoutUser();
  };
  return (
    <>
      <div className="flex-[0.3] text-gray-500 flex shadow-xl flex-col rounded-xl">
        <div className="rounded-xl shadow-gray-300 shadow-lg flex items-center p-2 justify-between">
          <UserRound className="cursor-pointer" />
          {user?.name}
          <div className="flex items-center gap-2">
            {showAllUsers ? (
              <MessageCircleMore
                onClick={() => {
                  setShowAllUser(!showAllUsers);
                }}
                className="cursor-pointer focus:ring"
              />
            ) : (
              <UserRoundPlus
                onClick={() => {
                  setShowAllUser(!showAllUsers);
                }}
                className="cursor-pointer focus:ring"
              />
            )}
            <SunMoon className="cursor-pointer" />
            <LogOut onClick={handleLogout} className="cursor-pointer" />
          </div>
        </div>
        <div className="flex gap-1 items-center mt-2 px-2 py-3  shadow-gray-300 shadow-xl rounded-xl">
          <Search className="cursor-pointer" />
          <input
            type="text"
            placeholder="search for the user"
            className="border-none outline-none bg-transparent"
          />
        </div>
        {showAllUsers ? (
          <PotentialChat />
        ) : (
          <div className="flex flex-1 overflow-y-scroll chat-area flex-col gap-1 items-start mt-2 p-2 text-gray-400 shadow-gray-300 shadow-lg rounded-xl scroll-smooth">
            <p className="flex items-center justify-start p-1 sticky top-[-8px] w-full bg-[#f4f5f8]  rounded-xl mb-1">
              <MessageCircleMore /> Chats
            </p>
            {userChat !== null &&
              userChat.map((chat, index) => {
                return <ChatMembersList key={index} chat={chat} />;
              })}
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
