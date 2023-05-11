import React, { createContext, useState, useContext, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [con, setCon] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const connection = new HubConnectionBuilder()
      .withUrl("https://nurlanshukur.com/SignalR")
      .withAutomaticReconnect()
      .build();
    connection.start().then(() => {
      setCon(connection);
    });
  }, []);

  const value = {
    user,
    setUser,
    con,
  };

  return con !== null ? (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  ) : null;
};
