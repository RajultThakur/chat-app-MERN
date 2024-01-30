import { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config/config";
import { postRequest } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    alert("logout successful");
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        console.log(registerInfo);
        const data = await postRequest(
          `${config.backendEndPoint}/user/register`,
          JSON.stringify(registerInfo),
        );
        if (data.success) {
          window.alert("Success");
          navigate("/login");
          updateRegisterInfo({
            ...registerInfo,
            name: "",
            email: "",
            password: "",
          });
        } else {
          window.alert(data.message);
        }
        console.log(data);
      } catch (err) {
        // toast.error('internal server issue')
        window.alert("internal server error :(");
        console.log(err);
      }
    },
    [registerInfo],
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      if (!loginInfo.email || !loginInfo.password) {
        // toast.error("Field can't be empty!", {
        //     position: toast.POSITION.BOTTOM_LEFT,
        //     autoClose: 1000
        // })
        window.alert("Field can't be empty!");
        return;
      }

      try {
        // const response = await fetch(`${config.backendEndPoint}/user/login`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": 'application/json',
        //     },
        //     body: JSON.stringify(loginInfo)
        // })
        const data = await postRequest(
          `${config.backendEndPoint}/user/login`,
          JSON.stringify(loginInfo),
        );
        // toast.dismiss(toastId.current)
        if (data.success) {
          // toast.success("Logged in successfully!", {
          //     position: toast.POSITION.BOTTOM_LEFT,
          //     autoClose: 2000
          // })
          window.alert("Logged in successfully!");
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          // await getUserByToken();
          navigate("/");
          setLoginInfo({
            email: "",
            password: "",
          });
          // window.location.reload()
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
    },
    [loginInfo],
  );

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const data = JSON.parse(localStorage.getItem("user"));
      setUser(data);
    }
    console.log(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        updateLoginInfo,
        loginUser,
        loginInfo,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
