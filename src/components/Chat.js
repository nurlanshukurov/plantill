import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Chat.css";
import RecordAudio from "./RecordAudio";

function Chat({ applyId, connection, token, status }) {
  const [data, setData] = useState({});
  const [isRec, setIsRec] = useState(false);
  const [mediaModal, setMediaModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaViewer, setMediaViewer] = useState(null);
  let starCount = 0;
  const selectStar = (i) => {
    document.querySelectorAll(".fa-star").forEach((star, index) => {
      starCount = i + 1;
      if (index <= i) {
        star.style.color = "#ffb72c";
      } else {
        star.style.color = "";
      }
    });
  };
  const endChat = () => {
    axios
      .post(
        "https://nurlanshukur.com/Chat/EndChat",
        {
          starCount: starCount,
          applyId: applyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        connection.send("endchat", res.data);
        document.querySelector(".end-modal").style.top = "";
      });
  };
  useEffect(() => {
    connection.on("endchat-" + applyId, () => {
      setData({ ...data, isEnd: true });
    });
  }, [data]);
  useEffect(() => {
    if (applyId !== null) {
      axios
        .get(`https://nurlanshukur.com/Chat/GetMessages?applyId=${applyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
          otherUserKey: res.userKey,
        });
      });
    }
    return () => {
      connection.off(`reciveaccept-${applyId}`);
    };
  }, [data]);
  useEffect(() => {
    connection.on("recive-" + applyId, (res) => {
      axios.post("https://nurlanshukur.com/Chat/markasread/", {
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
      connection.off("recive-" + applyId);
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
      applyId: applyId,
    };
    axios
      .post(
        "https://nurlanshukur.com/Chat/SendMessage",
        { ...msg },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const oldmessage = data.messages;
        oldmessage.push(res.data);
        setData({
          ...data,
          oldmessage,
        });
        connection.send("sendMessage", { ...res.data }, "recive-" + applyId);
        connection.send("unreadmessage", applyId);
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
    connection.send("sendMessage", { ...res }, "recive-" + applyId);
    connection.send("unreadmessage", applyId);
  };
  const SelectFile = (e) => {
    setMediaFiles(mediaFiles.concat(...e.target.files));
  };
  const removeFile = (i) => {
    const f = mediaFiles.filter((a, index) => {
      return index !== i;
    });
    setMediaFiles(f);
  };
  const sendMedia = () => {
    const formData = new FormData();
    for (let i = 0; i < mediaFiles.length; i++) {
      formData.append("files", mediaFiles[i]);
    }
    formData.append("applyId", applyId);
    axios
      .post("https://nurlanshukur.com/Chat/SendMedia", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const oldmessage = data.messages;
        oldmessage.push(...res.data);
        setData({
          ...data,
          oldmessage,
        });
        [...res.data].map((d) => {
          connection.send("sendMessage", { ...d }, "recive-" + applyId);
        });
        connection.send("unreadmessage", applyId);
        setMediaFiles([]);
        setMediaModal(false);
      });
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
          {status === 3 && !data.isEnd ? (
            <button
              className="endchat"
              onClick={() => {
                document.querySelector(".end-modal").style.top = "0px";
              }}
            >
              End Chat
            </button>
          ) : null}
        </div>
        <div className="messages">
          {data.messages.map((m) => {
            return (
              <div className={"message " + m.messageClass} key={m.messageId}>
                {m.messageTaiv0123 === 0 ? (
                  <p>{m.messageText}</p>
                ) : m.messageTaiv0123 === 1 ? (
                  <>
                    <audio controls>
                      <source
                        src={"https://nurlanshukur.com/voice/" + m.messageText}
                        type="audio/wav"
                      />
                    </audio>
                  </>
                ) : m.messageTaiv0123 === 2 ? (
                  <img
                    src={"https://nurlanshukur.com/uploads/" + m.messageText}
                    onClick={() =>
                      setMediaViewer({
                        src: "https://nurlanshukur.com/uploads/" + m.messageText,
                        type: "img",
                      })
                    }
                  />
                ) : (
                  <video
                    src={"https://nurlanshukur.com/uploads/" + m.messageText}
                    onClick={() =>
                      setMediaViewer({
                        src: "https://nurlanshukur.com/uploads/" + m.messageText,
                        type: "video",
                      })
                    }
                  />
                )}
                <span>{m.messageTime}</span>
              </div>
            );
          })}
        </div>
        {!data.isEnd ? (
          <form id="message" onSubmit={send}>
            <input type="text" placeholder="type here..." />
            <RecordAudio
              applyId={applyId}
              doneSendVoice={doneSendVoice}
              token={token}
              setIsRec={setIsRec}
            />
            {!isRec ? (
              <>
                <i
                  className="fa-solid fa-photo-film"
                  onClick={() => setMediaModal(true)}
                ></i>
                <button>
                  <i className="fa fa-paper-plane"></i>
                </button>
              </>
            ) : null}
          </form>
        ) : (
          <p className="chatisend_p">
            Bu müraciət müştəri tərəfindən sonlandırılmışdır...
          </p>
        )}

        {mediaModal ? (
          <div className="media-modal">
            <div className="modal-content">
              <div className="modal-head">
                <h4>Sekil ve ya video gonderme</h4>
                <i
                  className="fa fa-times"
                  onClick={() => setMediaModal(false)}
                ></i>
              </div>
              <div className="modal-body">
                <div className="files">
                  <div className="input-file">
                    <label htmlFor="inputfile">+</label>
                    <input
                      type="file"
                      multiple
                      id="inputfile"
                      accept="image/*,video/*"
                      onChange={(event) => SelectFile(event)}
                    />
                  </div>
                  {mediaFiles.map((file, index) =>
                    file.type.startsWith("video/") ? (
                      <div
                        className="file"
                        key={index}
                        onClick={() => removeFile(index)}
                      >
                        <video
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                        />
                      </div>
                    ) : (
                      <div
                        className="file"
                        onClick={() => removeFile(index)}
                        key={index}
                      >
                        <img src={URL.createObjectURL(file)} alt={file.name} />
                      </div>
                    )
                  )}
                </div>
              </div>
              <button onClick={sendMedia}>Send</button>
            </div>
          </div>
        ) : null}
        {mediaViewer != null ? (
          <div className="MediaViewer">
            <div className="viewer-content">
              {mediaViewer.type === "img" ? (
                <img src={mediaViewer.src} />
              ) : (
                <video src={mediaViewer.src} controls />
              )}
              <button onClick={() => setMediaViewer(null)}>close</button>
            </div>
          </div>
        ) : null}
        {!data.isEnd ? (
          <div className="end-modal">
            <div className="stars">
              <i className="fa fa-star" onClick={() => selectStar(0)}></i>
              <i className="fa fa-star" onClick={() => selectStar(1)}></i>
              <i className="fa fa-star" onClick={() => selectStar(2)}></i>
              <i className="fa fa-star" onClick={() => selectStar(3)}></i>
              <i className="fa fa-star" onClick={() => selectStar(4)}></i>
              <div className="btns">
                <button
                  onClick={() => {
                    document.querySelector(".end-modal").style.top = "";
                  }}
                >
                  Ləğv et
                </button>
                <button onClick={endChat}>Göndər</button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    );
  }
}

export default Chat;
