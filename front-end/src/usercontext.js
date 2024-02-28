import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

const UserContext = createContext();

const STATUS_BAD_REQUEST = 400;
const STATUS_CREATED = 201;
const STATUS_FORBIDDEN = 403;

const getSavedTokens = () => {
  const savedTokens = localStorage.getItem("userTokens");
  return savedTokens ? JSON.parse(savedTokens) : null;
};

export const UserProvider = ({ children }) => {
  const initialTokens = getSavedTokens();

  let decodedUser = null;
  if (
    initialTokens &&
    typeof initialTokens.access === "string" &&
    initialTokens.access.split(".").length === 3
  ) {
    try {
      decodedUser = jwt_decode(initialTokens.access);
    } catch (err) {
      console.error("Failed to decode the token", err);
    }
  }

  let [user, setUser] = useState(decodedUser);
  let [userTokens, setUserTokens] = useState(initialTokens);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);
  const [userRole, setUserRole] = useState({});
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const loginUser = async (username, role) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
      });

      const data = await response.json();
      console.log(data.access_token);

      switch (response.status) {
        case STATUS_CREATED:
          localStorage.setItem(
            "userTokens",
            JSON.stringify({
              access_token: data.access_token,
              refresh_token: data.refresh_token,
            })
          );
          setUser({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
          setUserTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
          return true;

        case STATUS_BAD_REQUEST:
          handleError("Invalid Username, please check your username!");
          break;

        case STATUS_FORBIDDEN:
          handleError(
            "Username and role do not match, please check youe log in with the right block!"
          );
          break;

        default:
          handleError("Log in failed, please try again later.");
          break;
      }
    } catch (error) {
      handleError(
        "Log in failed due to network or server issues, please try again later."
      );
    }
    return false;
  };

  const registerUser = async (firstname, lastname, username, role) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/user/manage/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, username, role }),
      });

      switch (response.status) {
        case STATUS_CREATED:
          console.log("Registered successfully");
          return true;

        case STATUS_BAD_REQUEST:
          handleError("Username already taken");
          break;

        default:
          handleError("Sign up failed, please try again later.");
          break;
      }
    } catch (error) {
      handleError(
        "Sign up failed due to network or server issues, please try again later."
      );
    }
    return false;
  };

  const logoutUser = () => {
    setUserTokens(null);
    setUser(null);
    localStorage.removeItem("userTokens");
    localStorage.removeItem("userRole");
  };

  useEffect(() => {
    setLoading(false);
  }, [userTokens]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userTokens,
        setUserTokens,
        error,
        registerUser,
        loginUser,
        logoutUser,
        setError,
        userRole,
        setUserRole,
      }}
    >
      {loading ? null : children}
    </UserContext.Provider>
  );
};

export default UserContext;
