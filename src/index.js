import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HubConnectionBuilder } from "@microsoft/signalr";

const root = ReactDOM.createRoot(document.getElementById("root"));

const connection = new HubConnectionBuilder()
  .withUrl("http://localhost:5051/SignalR")
  .withAutomaticReconnect()
  .build();
connection.start().then(() => {
  root.render(
    // <React.StrictMode>
    <App connection={connection} />
    // </React.StrictMode>
  );
});
