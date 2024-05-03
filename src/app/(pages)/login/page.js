"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const router = useRouter();

  const loginUser = () => {
    const data = {
      usernameOrEmail: usernameOrEmail,
      password: password,
    };

    axios
      .post("https://shop-management-backend.vercel.app/api/v1/users/auth-user-login", data, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const logoutUser = () => {
    axios
      .post(
        "https://shop-management-backend.vercel.app/api/v1/users/auth-user-logout",
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        setUser({});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const privateRoute = () => {
    axios
      .get("https://shop-management-backend.vercel.app/api/v1/users/check", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          router.push("/private");
        }
      })
      .catch((err) => {
        if (err) {
          alert(err.response.data.message);
        }
      });
  };

  return (
    <div>
      <h1>Login here</h1>
      <p>{user?.name}</p>
      <input
        value={usernameOrEmail}
        onChange={(e) => setUsernameOrEmail(e.target.value)}
        type="text"
        placeholder="username or email"
      />
      <br />
      <br />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
      />
      <br />
      <br />
      <button onClick={loginUser}>Login</button>
      <br />
      <br />
      {user?.name && <button onClick={logoutUser}>Logout</button>}
      <br />
      <br />
      {user?.name && <button onClick={privateRoute}>private route</button>}
    </div>
  );
};

export default LoginPage;
