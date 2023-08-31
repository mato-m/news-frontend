import React, { useRef, useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import apiURL from "../../../config";
import Loading from "./Loading";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const Login = ({ setUserData }) => {
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const passRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const login = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameRef.current.value,
          password: passRef.current.value,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setUserData(jwtDecode(data.token));
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast("Error at login");
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className={styles.loginDiv}>
      <input
        type="text"
        ref={usernameRef}
        placeholder="Username"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            login();
          }
        }}
      />
      <input
        type="password"
        ref={passRef}
        placeholder="Password"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            login();
          }
        }}
      />
      <button onClick={login}>Login</button>
      <span>
        Don't have an account? <Link to="/register">Sign up</Link>
      </span>
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </div>
  );
};

export default Login;
