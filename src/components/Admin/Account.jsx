import React, { useRef, useState } from "react";
import styles from "./Admin.module.css";
import apiURL from "../../../config";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Loading from "../Other/Loading";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const Account = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const editUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/user/" + userData.user_id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: usernameRef.current.value,
          email: emailRef.current.value,
          pass: passRef.current.value,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        localStorage.setItem("token", data.token);
        setUserData(jwtDecode(data.token));
      }
      toast(data.message);
    } catch (error) {
      console.log(error);
      toast("Error while editing user");
    }
  };
  const deleteUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiURL + "/user/" + userData.user_id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        localStorage.clear();
        setUserData(null);
        navigate("/");
      }
      toast(data.message);
    } catch (error) {
      toast("Error while deleting user");
    }
  };

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  return loading ? (
    <Loading />
  ) : (
    <div className={styles.adminMainDiv}>
      <div className={styles.accountDiv}>
        <input
          ref={usernameRef}
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editUser();
            }
          }}
          placeholder="New username"
        />
        <input
          ref={emailRef}
          type="email"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editUser();
            }
          }}
          placeholder="New email"
        />
        <input
          ref={passRef}
          type="password"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editUser();
            }
          }}
          placeholder="New password"
        />
        <button onClick={editUser}>Edit</button>
        <button onClick={deleteUser}>Delete</button>
      </div>
      <ToastContainer theme="dark" position="top-center" hideProgressBar />
    </div>
  );
};

export default Account;
