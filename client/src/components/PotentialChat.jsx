import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { Contact2 } from "lucide-react";

function PotentialChat() {
  const { potentialUsers, createChat, onlineUsers } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="p-2 mt-2 flex flex-col flex-1 shadow-xl justify-start gap-2 items-baseline rounded-xl text-gray-400">
      <p className="flex items-center justify-start p-1 sticky top-[-8px] w-full bg-[#f4f5f8]  rounded-xl mb-1">
        <Contact2 /> Other Users
      </p>
      {potentialUsers &&
        potentialUsers.map((_user) => {
          return (
            <div
              key={_user._id}
              onClick={() => {
                createChat(user._id, _user._id);
              }}
              className="cursor-pointer hover:text-gray-600 flex items-start py-1 justify-start"
            >
              <ul>
                <li className="flex items-center space-x-2">
                  <div className="w-8 h-8 items-center flex justify-center font-semibold  bg-gray-200 rounded-full">
                    {_user.name[0].toUpperCase()}
                  </div>
                  <span className="font-semibold ">{_user.name}</span>

                  {onlineUsers.some((u) => u.userId === _user._id) && (
                    <span className="bg-green-400 w-[7px] h-[7px] rounded-xl relative right-[100%] "></span>
                  )}
                </li>
              </ul>
            </div>
          );
        })}
    </div>
  );
}

export default PotentialChat;
