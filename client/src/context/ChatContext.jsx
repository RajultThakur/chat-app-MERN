import { useState, useEffect, useCallback } from "react";
import { createContext } from "react";
import { getRequest, postRequest } from "../utils/service";
import config from "../config/config";
import { io } from "socket.io-client";
import { useFetchNotification } from "../hooks/useFetchNotification";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChat, setUserChat] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  const [potentialUsers, setPotentialUsers] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [stopReqCount, setStopReqCount] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const newSocket = io(config.SOCKET_URL);

    if (!user) newSocket.disconnect();

    setSocket(newSocket);
    return () => {
      newSocket.off("disconnect");
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;

    socket.emit("addNewUser", user?._id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    socket.on("typing-started", () => {
      // console.log("typing started :)");
      setIsTyping(true);
    });

    socket.on("typing-stopped", () => {
      // console.log("typing started :)");
      setIsTyping(false);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // sending message

  useEffect(() => {
    if (socket === null) return;

    const recipientUser = currentChat?.members.find(
      (member) => member._id !== user?._id,
    );

    socket.emit("sendMessage", {
      ...newMessage,
      recipientId: recipientUser._id,
    });

    socket.emit("notification-trigger", {
      ...newMessage,
      recipientUserId: recipientUser._id,
    });
  }, [newMessage]);

  useEffect(() => {
    if (!socket) return;

    socket.on("getNotification", (res) => {
      setNotifications(res);
    });
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessage((prev) => [res, ...prev]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat]);

  
  // getting users chat
  useEffect(() => {
    const getUserChats = async () => {
      if (!user) return;

      setIsUserChatLoading(true);

      const response = await getRequest(
        `${config.backendEndPoint}/chats/${user?._id}`,
      );

      setIsUserChatLoading(false);

      if (response.error) {
        setUserChatError(response.error);
      }

      setUserChat(response);
    };

    getUserChats();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("remove-notification", {
      chatId: currentChat._id,
      userId: currentChat.members[0],
    });
  }, [currentChat]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
    setRequestCount(0);
    setMessage([]);
  }, []);

  const scrollEvent = (e) => {
    const target = e.target;
    if (!stopReqCount && target.scrollTop === 0) {
      // target.scrollTop = 100;
      setRequestCount(requestCount + 1);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      if (user !== null) {
        const response = await getRequest(`${config.backendEndPoint}/user`);

        const pChat = response.user.filter((u) => {
          let isChatCreated = false;

          if (u._id === user?._id) {
            return false;
          }

          if (userChat) {
            isChatCreated = userChat?.some((chat) => {
              return (
                chat.members[0]._id === u._id || chat.members[1]._id === u._id
              );
            });
          }
          return !isChatCreated;
        });
        setPotentialUsers(pChat);
      }
    };
    getUsers();
  }, [userChat]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${config.backendEndPoint}/chats`,
      JSON.stringify({ firstId, secondId }),
    );

    if (response.error) {
      console.log("Error while creating chat :(");
    }

    setUserChat((prev) => [...prev, response]);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;

      setStopReqCount(false);
      setIsMessageLoading(true);

      const response = await getRequest(
        `${config.backendEndPoint}/messages/${currentChat?._id}?page=${requestCount}`,
      );

      if (response.error) setMessageError(response.error);
      if (response.length === 0) setStopReqCount(true);

      if (message === null) setMessage(response);
      else setMessage((prev) => [...prev, ...response]);
      setIsMessageLoading(false);
    };

    getMessages();
  }, [currentChat, requestCount]);

  const sendMessage = useCallback(
    async (textMessage, sender, chatId, setTextMessage) => {
      if (!textMessage) return console.log("you must type something..");

      const response = await postRequest(
        `${config.backendEndPoint}/messages`,
        JSON.stringify({
          chatId,
          senderId: sender._id,
          message: textMessage,
        }),
      );

      if (response.error) {
        setSendTextMessageError(response.error);
      }

      setNewMessage(response);
      setMessage((prev) => [response, ...prev]);
      setTextMessage("");
    },

    [],
  );

  return                                                              (
    <ChatContext.Provider
      value={{
        userChat,
        isUserChatLoading,
        userChatError,
        potentialUsers,
        createChat,
        updateCurrentChat,
        currentChat,
        message,
        isMessageLoading,
        messageError,
        sendMessage,
        onlineUsers,
        socket,
        isTyping,
        scrollEvent,
        requestCount,
        notifications,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
