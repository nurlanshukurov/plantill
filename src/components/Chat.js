import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Chat.css";
import RecordAudio from "./RecordAudio";

function Chat({ applyId, userId, connection }) {
  const [data, setData] = useState({});
  useEffect(() => {
    if (applyId !== null) {
      axios
        .get(
          `http://localhost:5051/Chat/GetMessages?userid=${userId}&applyId=${applyId}`
        )
        .then((res) => {
          setData(res.data);
        });
    }
  }, [applyId]);
  useEffect(() => {
    if (
      data.otherUserFullName !== undefined &&
      data.otherUserFullName.includes("Operator")
    ) {
      connection.on(`reciveaccept-${applyId}`, (res) => {
        setData({
          ...data,
          otherUserFullName: res.fullname,
          otherUserId: res.userId,
        });
      });
    }
    return () => {
      connection.off(`reciveaccept-${applyId}`);
    };
  }, [data]);
  useEffect(() => {
    connection.on("recive-" + applyId + "-" + userId, (res) => {
      axios.post("http://localhost:5051/Chat/markasread/", {
        messageId: res.messageId,
      });
      if (
        data.messages.find((x) => {
          return x.messageId === res.messageId;
        }) === undefined
      ) {
        res.messageClass = "left";
        let oldmessage = data.messages;
        oldmessage.push(res);
        setData({
          ...data,
          oldmessage,
        });
      }
    });
    return () => {
      connection.off("recive-" + applyId + "-" + userId);
    };
  }, [data]);
  useEffect(() => {
    if (data.messages != null) {
      document.querySelector(".messages").scrollTop =
        document.querySelector(".messages").scrollHeight;
    }
  }, [data]);
  const send = (event) => {
    event.preventDefault();
    if (event.target.querySelector("input").value === "") return;
    let msg = {
      msg: event.target.querySelector("input").value,
      userId: userId,
      otherUserId: data.otherUserId,
      applyId: applyId,
    };
    axios
      .post("http://localhost:5051/Chat/SendMessage", { ...msg })
      .then((res) => {
        const oldmessage = data.messages;
        oldmessage.push(res.data);
        setData({
          ...data,
          oldmessage,
        });
        connection.send(
          "sendMessage",
          { ...res.data },
          "recive-" + applyId + "-" + data.otherUserId
        );
        connection.send("unreadmessage", applyId, data.otherUserId);
      })
      .then(() => {
        event.target.querySelector("input").value = "";
      });
  };
  const doneSendVoice = (res) => {
    const oldmessage = data.messages;
    oldmessage.push(res);
    setData({
      ...data,
      oldmessage,
    });
    connection.send(
      "sendMessage",
      { ...res },
      "recive-" + applyId + "-" + data.otherUserId
    );
    connection.send("unreadmessage", applyId, data.otherUserId);
  };
  if (applyId === null) {
    return (
      <div className="landing">
        <div className="card">
          <img src="https://plantill.com/images/auth-im.png" alt="pp" />
          <h2>PlantILL</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>
    );
  } else if (data.messages != null) {
    return (
      <main>
        <div className="head">
          <h3>{data.otherUserFullName}</h3>
          <button
            className="endchat"
            onClick={() => {
              document.querySelector(".end-modal").style.top = "0px";
            }}
          >
            End Chat
          </button>
        </div>
        <div className="messages">
          {data.messages.map((m) => {
            return (
              <div className={"message " + m.messageClass} key={m.messageId}>
                {m.messageTaiv0123 === 0 ? (
                  <p>{m.messageText}</p>
                ) : (
                  <>
                    <audio controls>
                      <source
                        src={"http://localhost:5051/voice/" + m.messageText}
                        type="audio/wav"
                      />
                    </audio>
                  </>
                )}
                <span>{m.messageTime}</span>
              </div>
            );
          })}
        </div>
        <form id="message" onSubmit={send}>
          <input type="text" placeholder="type here..." />
          <RecordAudio
            userId={userId}
            otherUserId={data.otherUserId}
            applyId={applyId}
            doneSendVoice={doneSendVoice}
          />
          <button>
            <i className="fa fa-paper-plane"></i>
          </button>
        </form>
        <div className="end-modal">
          <div className="stars">
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <i className="fa fa-star"></i>
            <div className="btns">
              <button
                onClick={() => {
                  document.querySelector(".end-modal").style.top = "";
                }}
              >
                Ləğv et
              </button>
              <button>Göndər</button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
export default Chat;
