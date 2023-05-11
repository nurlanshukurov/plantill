import React, { useEffect, useState } from "react";

function Apply({
  data,
  openApply,
  connection,
  userKey,
  curApplyId,
  setCurApplyId,
}) {
  const [isRead, setIsRead] = useState(data.unRead ? "unread" : "");
  const [opName, setOpName] = useState(data.fullName);
  const [notAccept, setNotAccept] = useState(data.accept);
  useEffect(() => {
    connection.on(`unread-${data.applyId}`, () => {
      if (curApplyId !== data.applyId) {
        setIsRead("unread");
      }else{
        setIsRead("");
      }
    });
  }, [curApplyId]);
  useEffect(() => {
    if (data.fullName !== undefined && data.fullName.includes("Operator")) {
      connection.on(`reciveaccept-${data.applyId}`, (res) => {
        setOpName(res.fullname);
      });
    }
  }, []);
  const open = (event) => {
    openApply(data.applyId);
    setCurApplyId(data.applyId);
    setNotAccept(true);
    setIsRead("");
    if (data.accept === false) {
      connection.send("acceptoperator", data.applyId, userKey);
      event.target.classList.remove("notaccept");
    }
  };
  return (
    <li
      className={isRead + (notAccept === false ? " notaccept" : "")}
      onClick={open}
      style={data.isEnd ? {background : "#333", color : "white"} : {}}
    >
      <h3>
        {opName}
        {/* <span>19.04.22 18:40</span> */}
      </h3>
    </li>
  );
}

export default Apply;
