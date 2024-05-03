"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [shop, setShop] = useState({});
  const router = useRouter();

  const loginUser = () => {
    const data = {
      usernameOrEmail: usernameOrEmail,
      password: password,
    };

    axios
      .post(
        "https://shop-management-backend-84x8.onrender.com/api/v1/users/auth-user-login",
        data,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const logoutUser = () => {
    axios
      .post(
        "https://shop-management-backend-84x8.onrender.com/api/v1/users/auth-user-logout",
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        setUser({});
      })
      .catch((err) => {
        if (err) {
          setUser({});
        }
      });
  };

  const privateRoute = () => {
    axios
      .get(
        "https://shop-management-backend-84x8.onrender.com/api/v1/users/check",
        {
          withCredentials: true,
        }
      )
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

  const refreshToAccess = () => {
    axios
      .get(
        "https://shop-management-backend-84x8.onrender.com/api/v1/users/auth-manage-token",
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <div>
      {user?.name && (
        <>
          <p>user_id: {user?.user_id}</p>
          <p>name: {user?.name}</p>
          <p>username: {user?.username}</p>
          <p>email: {user?.email}</p>
          <p>mobile: {user?.mobile}</p>
          <p>address: {user?.address?.detailed_shop_address}</p>
          <p>country: {user?.address?.country}</p>
        </>
      )}
      {!user?.name && (
        <>
          <h1>Login here</h1>
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
        </>
      )}

      <br />
      <br />
      {user?.name && <button onClick={logoutUser}>Logout</button>}
      <br />
      <br />
      {user?.name && <button onClick={privateRoute}>admin route</button>}
      <br />
      <br />
      <button onClick={refreshToAccess}>Generate new access token</button>
    </div>
  );
};

export default LoginPage;
