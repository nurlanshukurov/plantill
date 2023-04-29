import React, { useEffect, useState } from "react";
import axios from "axios";
import NewApply from "./NewApply";
import Apply from "./Apply";
function Applies({ setApplyId, user, connection }) {
  const [applies, setApplies] = useState([]);
  const [modal, showModal] = useState(false);
  const [curApplyId, setCurApplyId] = useState(null);
  useEffect(() => {
    if (user !== null) {
      axios
        .get("http://localhost:5051/Chat/ApplyList/" + user.userId)
        .then((res) => {
          setApplies(res.data);
        });
    }
  }, []);
  useEffect(() => {
    if (user.userStatus === 2) {
      connection.on("operatorApply", (res) => {
        setApplies([...applies, res]);
      });
      connection.on(`reciveacceptforop`, (res) => {
        if (res.oppId !== user.userId) {
          console.log(res);
          console.log(
            applies.filter((x) => {
              return x.applyId === res.applyid;
            })
          );
          setApplies(
            applies.filter((x) => {
              return x.applyId !== res.applyid;
            })
          );
        }
      });
    }
  }, [applies]);
  const addApply = (x) => {
    setApplies([...applies, x]);
    let signal = {
      ...x,
      otherUserId: user.userId,
      fullName: user.userFullName,
      accept: false,
    };
    setApplyId(x.applyId);
    connection.send("newapply", signal);
  };
  function compare(a, b) {
    if (a.unRead && !b.unRead) {
      return -1;
    }
    if (!a.unRead && b.unRead) {
      return 1;
    }
    return b.applyId - a.applyId;
  }
  return (
    <>
      <nav>
        <div className="head">
          <h2>{user.userFullName}</h2>
          <i
            onClick={() => showModal(true)}
            className="fa-regular fa-pen-to-square"
          ></i>
        </div>
        <h4>Chats</h4>
        <input type="search" className="search" placeholder="search..." />
        <ul className="chats">
          {applies.sort(compare).map((a) => {
            return (
              <Apply
                data={a}
                openApply={(id) => setApplyId(id)}
                connection={connection}
                userId={user.userId}
                key={a.applyId}
                curApplyId={curApplyId}
                setCurApplyId={setCurApplyId}
              />
            );
          })}
        </ul>
      </nav>
      {modal ? (
        <NewApply
          userId={user.userId}
          showModal={showModal}
          addApply={addApply}
        />
      ) : null}
    </>
  );
}

export default Applies;
