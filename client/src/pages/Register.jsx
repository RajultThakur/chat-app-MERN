import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config/config";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { registerInfo, registerUser, updateRegisterInfo } =
    useContext(AuthContext);
  // Define state variables for form fields
  const navigate = useNavigate();
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div
      className="
    w-[100%] h-[100%] 
    flex justify-center items-center 
    mt-[100px]"
    >
      <form className="text-gray-400" onSubmit={registerUser}>
        <div>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={registerInfo.name}
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, name: e.target.value })
            }
            className="text-black 
            outline-none
            border-none
            round-lg
            bg-gray-200
            px-3
            py-1
            mb-4"
          />
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="email"
            value={registerInfo.email}
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, email: e.target.value })
            }
            className="text-black
            outline-none
            border-none
            round-lg
            bg-gray-200
            px-3
            py-1
            mb-4"
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={registerInfo.password}
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, password: e.target.value })
            }
            className="text-black
            outline-none
            border-none
            round-lg
            bg-gray-200
            px-3
            py-1
            mb-4"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-green-400 text-white font-medium p-1 w-[100%]"
          >
            Signup
          </button>
        </div>
        <div>
          <h1 className="text-sm mt-1">
            Already have an account.{" "}
            <Link className="text-blue-600 underline" to="/login">
              Login
            </Link>
          </h1>
        </div>
      </form>
    </div>
  );
}

export default Register;
