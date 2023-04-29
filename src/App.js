import "./App.css";
import { useState } from "react";
import Login from "./views/Login";
import Applies from "./components/Applies";
import Chat from "./components/Chat";
function App({ connection }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [applyId, setApplyId] = useState(null);
  return (
    <>
      {user === null ? (
        <Login />
      ) : (
        <>
          <Applies
            setApplyId={setApplyId}
            user={user}
            connection={connection}
          />
          <Chat
            applyId={applyId}
            userId={user.userId}
            connection={connection}
          />
        </>
      )}
    </>
  );
}

export default App;
