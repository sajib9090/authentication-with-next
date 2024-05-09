"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../baseUrl";

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const d = localStorage.getItem("user");
    const userData = JSON.parse(d);
    setUser(userData);
    if (userData) {
      router.push("/dashboard");
    }
  }, []);

  const loginUser = () => {
    const data = {
      usernameOrEmail: usernameOrEmail,
      password: password,
    };
    setLoading(true);

    axios
      .post(`${baseUrl}/api/v1/users/auth-user-login`, data, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        localStorage.setItem(
          "accessToken",
          JSON.stringify(res.data.accessToken)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(res.data.refreshToken)
        );
        router.push("/dashboard");
      })
      .catch((error) => {
        alert(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logoutUser = () => {
    setLoading(true);
    axios
      .post(`${baseUrl}/api/v1/users/auth-user-logout`, null, {
        withCredentials: true,
      })
      .then((res) => {
        setUser({});
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("logout");
      })
      .catch((err) => {
        if (err) {
          setUser({});
        }
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const privateRoute = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/api/v1/users/check`, {
        withCredentials: true,
        headers:{
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2MzRjMzRhN2MwZTI2NGI3MzI4YzIyMCIsInNob3BfaWQiOiIxLWM2ZDk4ODQ2MzYyZDg0MGM3N2RjODU4N2VhYzRmNzZjIiwidXNlcl9pZCI6IjEtNmYyNjg3ZTU2NTYzM2E3NGUxOWI1MmE2YmUxYjliMGYiLCJuYW1lIjoicmF5YW4gYWhtZWQiLCJ1c2VybmFtZSI6InVuc2VlbmJldXR5IiwiZW1haWwiOiJ1bnNlZW5iZXV0eUBnbWFpbC5jb20iLCJtb2JpbGUiOiIrODgwMTc5MTkxNTY0MyIsInBhc3N3b3JkIjoiJDJhJDEwJEdueTJWV29SRTI5NmtLdGliRGJxYS4uRXM3UjFsdWdTVWFNallaYTRiby8walBvM1pscFJtIiwiYWRtaW4iOnRydWUsInNob3Bfb3duZXIiOnRydWUsInNob3BfYWRtaW4iOmZhbHNlLCJiYW5uZWRfdXNlciI6ZmFsc2UsImRlbGV0ZWRfdXNlciI6ZmFsc2UsImFkZHJlc3MiOnsiZGV0YWlsZWRfc2hvcF9hZGRyZXNzIjoibmFyaWEgYmF6YXIgY2hha2RobyBiYWphciAsIHNoYXJpYXRwdXIgc2FraGlwb3VyIGFsdWJhamFyIiwiY291bnRyeSI6InVuaXRlZCBraW5nZG9tIn0sImNyZWF0ZWRBdCI6IjIwMjQtMDUtMDNUMTA6NTg6MTguNTk1WiJ9LCJpYXQiOjE3MTUyNjExODAsImV4cCI6MTcxNTM0NzU4MH0.9r_1xlnkGmauSWlTMM5bBLBDLIsLGeiClwxxgKWI1ew`
        }
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refreshToAccess = () => {
    setLoading(true);
    axios
      .get(`${baseUrl}/api/v1/users/auth-manage-token`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {loading && <h1>Loading...</h1>}
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
      {loading && <h1>Loading...</h1>}
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
      <button onClick={logoutUser}>Logout</button>
      <br />
      <br />
      {loading && <h1>Loading...</h1>}
      <br />
      <br />
      <button onClick={privateRoute}>admin route</button>
      <br />
      {loading && <h1>Loading...</h1>}
      <br />
      <button onClick={refreshToAccess}>Generate new access token</button>
    </div>
  );
};

export default LoginPage;
