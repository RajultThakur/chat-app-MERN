import React from "react";

function UserInfo({ name }) {
  return (
    <div className="cursor-pointer hover:text-gray-500 text-gray-400 flex items-center p-1 sticky top-0 bg-gray-300 mb-1 z-10 rounded-tr-xl rounded-tl-xl">
      <ul>
        <li className="flex items-center space-x-2">
          <div className="w-8 h-8 items-center flex justify-center font-semibold  bg-gray-200 rounded-full">
            {name[0].toUpperCase()}
          </div>
          <span className="font-semibold ">{name}</span>
        </li>
      </ul>
    </div>
  );
}

export default UserInfo;
