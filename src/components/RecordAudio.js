import React, { useState, useRef } from "react";
import axios from "axios";
const RecordAudio = ({ applyId, doneSendVoice, token, setIsRec }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
      setRecording(true);
      setIsRec(true);
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleDataAvailable = (event) => {
    const audioBlob = event.data;
    setAudioBlob(audioBlob);
  };

  const sendAudio = () => {
    const formData = new FormData();
    formData.append("vioce", audioBlob, "audio.wav");
    formData.append("applyId", applyId);
    axios
      .post("https://nurlanshukur.com/Chat/SendVoice", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        doneSendVoice(response.data);
        setIsRec(false);
        setAudioBlob(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {recording ? (
        <i className="fa-regular fa-circle-stop" onClick={stopRecording}></i>
      ) : (
        <i
          className="fa-solid fa-microphone-lines"
          onClick={startRecording}
        ></i>
      )}
      {audioBlob != null ? (
        <i className="fa fa-paper-plane" onClick={sendAudio}></i>
      ) : null}
    </div>
  );
};

export default RecordAudio;
