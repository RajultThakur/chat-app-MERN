// src/ChatMembersList.js
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useFetchRecipient } from "../hooks/useFetchRecipient";
import { ChatContext } from "../context/ChatContext";
import { useFetchNotification } from "../hooks/useFetchNotification";

const ChatMembersList = ({ chat }) => {
  const { user } = useContext(AuthContext);
  const { updateCurrentChat, currentChat, notifications, onlineUsers, socket } =
    useContext(ChatContext);
  const { myNotifications } = useFetchNotification(notifications, chat?._id);

  useEffect(() => {
    if (!socket || !myNotifications || !currentChat) return;

    if (myNotifications?.chatId === currentChat?._id) {
      socket.emit("remove-notification", {
        chatId: currentChat._id,
        userId: currentChat.members[0],
      });
    }
  }, [socket, myNotifications]);

  const { recipientUser } = useFetchRecipient(chat, user);
  console.log(myNotifications, "++");

  return (
    <div
      onClick={() => {
        updateCurrentChat(chat);
      }}
      className="cursor-pointer w-full hover:text-gray-600 flex items-center py-1"
    >
      {/* <h2 className="text-xl font-bold mb-4">Members</h2> */}
      <ul className="w-full">
        {recipientUser !== null ? (
          <div className="flex w-full items-center justify-between space-x-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 items-center flex justify-center font-semibold  bg-gray-200 rounded-full">
                {recipientUser.name[0].toUpperCase()}
              </span>
              <span className="font-semibold ">{recipientUser.name}</span>
              {onlineUsers && onlineUsers.some((u) => u.userId === recipientUser._id) && (
                <div className="bg-green-400 w-[7px] h-[7px] rounded-xl   "></div>
              )}
            </div>

            <div className="flex items-center">
              {myNotifications &&
                myNotifications.recipientId === user?._id &&
                myNotifications.chatId !== currentChat?._id && (
                  <div className="border-gray-300 border flex items-center justify-center w-[20px] h-[20px] rounded-xl text-[12px]">{myNotifications?.message.length}</div>
                )}
              
            </div>
          </div>
        ) : null}
      </ul>
    </div>
  );
};

export default ChatMembersList;
