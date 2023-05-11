import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import Login from "./views/Login";
import Applies from "./components/Applies";
import Chat from "./components/Chat";
function Main() {
  const { user, con } = useAuth();
  const [applyId, setApplyId] = useState(null);
  return !user ? (
    <Login />
  ) : (
    <>
      <Applies setApplyId={setApplyId} />
      <Chat applyId={applyId} connection={con} token={user.token} status={user.status}/>
    </>
  );
}

export default Main;
