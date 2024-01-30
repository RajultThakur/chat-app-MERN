import { useContext, useState, useRef, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import InputEmoji from "react-input-emoji";
import { SendHorizontal } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import UserInfo from "./UserInfo";
import moment from "moment";
function ChatBox() {
  const {
    message,
    isMessageLoading,
    messageError,
    sendMessage,
    currentChat,
    socket,
    isTyping,
    scrollEvent,
    requestCount,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const userFocus = useRef();
  const [textMessage, setTextMessage] = useState("");
  const [typingTimeOut, setTypingTimeOut] = useState(null);
  const scroll = useRef();

  useEffect(() => {
    if (requestCount === 0)
      scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    if (!currentChat) return;
    userFocus.current.focus();
  }, [currentChat]);

  const handleChange = () => {
    // setTextMessage(e.target.value)
    const recipientUser = currentChat?.members.find(
      (member) => member._id !== user?._id,
    );

    socket.emit("typing-start", { recipientId: recipientUser._id });

    if (typingTimeOut) clearTimeout(typingTimeOut);

    setTypingTimeOut(
      setTimeout(() => {
        socket.emit("typing-stop", { recipientId: recipientUser._id });
      }, 500),
    );
  };

  return (
    <div className="flex-[0.7] flex flex-col shadow-xl rounded-xl">
      {currentChat && (
        <>
          <UserInfo
            name={
              currentChat?.members[0]._id !== user._id
                ? currentChat?.members[0].name
                : currentChat?.members[1].name
            }
          />
          <div
            className="overflow-y-scroll chat-area rounded-xl flex-1 h-[90%] flex flex-col"
            onScroll={scrollEvent}
          >
            {isMessageLoading && <div className="text-center">Loading...</div>}
            {message !== null &&
              message.toReversed().map((mess, idx) => {
                return (
                  <div
                    key={idx}
                    ref={scroll}
                    className={`flex px-4 w-auto text-gray-600  ${
                      mess.senderId === user._id
                        ? "justify-end"
                        : "justify-start"
                    }  items-start mb-1`}
                  >
                    <span
                      className={` p-1 max-w-[300px] rounded-md ${
                        mess.senderId === user._id
                          ? "bg-gray-300"
                          : "bg-gray-200"
                      }`}
                    >
                      {mess.message}{" "}
                      <span className="text-[10px] relative top-[7px] z-[0]">
                        {moment(mess.createdAt).calendar()}
                      </span>
                    </span>
                    {/* <span className="text-[10px]" >
                  {moment(mess.createdAt).calendar()}
                </span> */}
                  </div>
                );
              })}
            {/* Add more chat messages as needed */}
          </div>
          {isTyping && (
            <div className="px-4">
              <span>typing...</span>
            </div>
          )}

          <div className="mb-[10px] flex justify-center h-[10%] items-center">
            <InputEmoji
              ref={userFocus}
              buttonRef={userFocus}
              value={textMessage}
              onChange={setTextMessage}
              onKeyDown={handleChange}
              onEnter={() => {
                sendMessage(textMessage, user, currentChat._id, setTextMessage);
              }}
            />
            <button className="relative right-16 z-10">
              <SendHorizontal
                onClick={() => {
                  sendMessage(
                    textMessage,
                    user,
                    currentChat._id,
                    setTextMessage,
                  );
                }}
                className="cursor-pointer  text-gray-400 hover:text-gray-500"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatBox;

{
  /* Input area goes here */
}
{
  /* <div className="flex-[0.95]">
          <InputEmoji value={textMessage} onChange={setTextMessage} />
        </div>
        <button className="p-[14px] ">
          <SendHorizontal
            onClick={() => {
              sendMessage(textMessage, user, currentChat._id, setTextMessage);
            }}
            className="cursor-pointer text-gray-400 hover:text-gray-500"
          />
        </button> */
}
