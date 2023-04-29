import React, { useState, useRef } from "react";
import axios from "axios";
const RecordAudio = ({ userId, otherUserId, applyId, doneSendVoice }) => {
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
    formData.append("userId", userId);
    formData.append("otherUserId", otherUserId);
    formData.append("applyId", applyId);
    axios
      .post("http://localhost:5051/Chat/SendVoice", formData)
      .then((response) => {
        doneSendVoice(response.data);
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
        <i className="fa-solid fa-microphone-lines" onClick={startRecording}></i>
      )}
      {audioBlob && <i className="fa fa-paper-plane" onClick={sendAudio}></i>}
    </div>
  );
};

export default RecordAudio;
