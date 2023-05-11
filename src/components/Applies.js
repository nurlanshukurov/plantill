import React, { useEffect, useState } from "react";
import axios from "axios";
import NewApply from "./NewApply";
import Apply from "./Apply";
import { useAuth } from "../contexts/AuthContext";

function Applies({ setApplyId }) {
  const [applies, setApplies] = useState([]);
  const [modal, showModal] = useState(false);
  const [curApplyId, setCurApplyId] = useState(null);
  const { user, con } = useAuth();
  const [category, setCategory] = useState(false);
  useEffect(() => {
    axios
      .get("https://nurlanshukur.com/Chat/ApplyList", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setApplies(res.data);
      });
  }, []);
  useEffect(() => {
    con.on(`endchat-${user.key}`, (applyId) => {
      const app = applies.find((a) => {
        return a.applyId === applyId;
      });
      if (app.isEnd === false) {
        app.isEnd = true;
      }
    });
  }, [applies]);
  useEffect(() => {
    // eger operatordursa
    if (user.status === 2) {
      //yeni gelen applylari gozleyir
      con.on("operatorApply", (res) => {
        setApplies([...applies, res]);
      });
      //qebul olan applylari diger operatorlardan silir
      con.on(`reciveacceptforop`, (res) => {
        if (res.oppKey !== user.key) {
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
    //yeni apply yaratmaq
    x.isEnd = false;
    setApplies([...applies, x]);
    let signal = {
      ...x,
      otherUserKey: user.key,
      fullName: user.fullName,
      accept: false,
    };
    setApplyId(x.applyId);
    con.send("newapply", signal);
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
          <h2>{user.fullName}</h2>
          <i
            onClick={() => showModal(true)}
            className="fa-regular fa-pen-to-square"
          ></i>
        </div>
        <div className="category">
          <button
            className={!category ? "active" : ""}
            onClick={() => setCategory(false)}
          >
            Aktiv
          </button>
          <button
            className={category ? "active" : ""}
            onClick={() => setCategory(true)}
          >
            Bitmiş
          </button>
        </div>
        <ul className="chats">
          {applies
            .filter((a) => {
              return a.isEnd === category;
            })
            .sort(compare)
            .map((a) => {
              return (
                <Apply
                  data={a}
                  openApply={(id) => setApplyId(id)}
                  connection={con}
                  userKey={user.key}
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
          showModal={showModal}
          addApply={addApply}
          token={user.token}
        />
      ) : null}
    </>
  );
}

export default Applies;
