import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// import Utils from '../utils/helper';
import config from "../config/config";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { loginUser, loginInfo, updateLoginInfo, user } =
    useContext(AuthContext);

  const toastId = React.useRef(null);
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credential.email || !credential.password) {
      // toast.error("Field can't be empty!", {
      //     position: toast.POSITION.BOTTOM_LEFT,
      //     autoClose: 1000
      // })
      window.alert("Field can't be empty!");
      return;
    }

    try {
      const response = await fetch(`${config.backendEndPoint}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credential.email,
          password: credential.password,
        }),
      });
      const data = await response.json();
      toast.dismiss(toastId.current);
      if (data.success) {
        // toast.success("Logged in successfully!", {
        //     position: toast.POSITION.BOTTOM_LEFT,
        //     autoClose: 2000
        // })
        window.alert("Logged in successfully!");
        localStorage.setItem("socket-token", data.token);
        // await getUserByToken();
        navigate("/");
        setCredential({
          email: "",
          password: "",
        });
        window.location.reload();
      } else {
        // toast.dismiss(toastId.current)
        // toast.error(data.message, {
        //     position: toast.POSITION.TOP_CENTER,
        //     autoClose: 2000
        // })
        window.alert(data.message);
      }
      console.log(data);
    } catch (err) {
      window.alert("internal server issue");
      console.log(err);
    }
  };

  useEffect(() => {
    // authenticate()
    // console.log(isAuthenticated)
    if (localStorage.getItem("user") != null || user !== null) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div
        className="
        w-[100%] h-[100%] 
        flex justify-center items-center 
        mt-[100px]"
      >
        <form
          className="
                flex 
                flex-col
                p-[20px]
                "
          onSubmit={loginUser}
        >
          <div className="">
            <input
              type="email"
              value={loginInfo.email}
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, email: e.target.value })
              }
              placeholder="Email"
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
          <div className="form-group">
            <input
              type="password"
              value={loginInfo.password}
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, password: e.target.value })
              }
              placeholder="password"
              className="text-black
                                    outline-none
                                    border-none
                                    round-[10px]
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
              Login
            </button>
          </div>
          <div>
            <h1 className="text-sm mt-1">
              Don't have an account.{" "}
              <Link className="text-blue-600 underline" to="/register">
                Create
              </Link>
            </h1>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
