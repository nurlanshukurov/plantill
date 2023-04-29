import React from "react";
import "../css/NewApply.css";
import axios from "axios";
function NewApply({ userId, showModal, addApply }) {
  const send = (e) => {
    e.preventDefault();
    let form = {
      applyClientId: userId,
      applyPlantId: e.target.querySelector("#PlantId").value,
      text: "",
    };
    if (e.target.querySelector("#text-message").value != "") {
      form = { ...form, text: e.target.querySelector("#text-message").value };
    }
    axios.post("http://localhost:5051/Chat/AddApply", form).then((res) => {
      addApply(res.data);
      showModal(false);
    });
  };
  return (
    <div className="new-apply">
      <div className="card">
        <h2>Yeni müraciət</h2>
        <form onSubmit={send}>
          <div className="input-group">
            <label>Müraciətin kateqoriyası</label>
            <select>
              <option value="">Seçin</option>
              <option value="2004" price="0">
                Ev bitkiləri
              </option>
              <option value="2005" price="0">
                İstixana bitkiləri
              </option>
            </select>
          </div>

          <div className="input-group">
            <label>Bitki</label>
            <select id="PlantId">
              <option value="">Seçin</option>
              <option value="1006">Pomidor</option>
              <option value="1007">Xiyar</option>
            </select>
          </div>

          <div className="input-group">
            <label>Müraciətin mətni</label>
            <input id="text-message" type="text" placeholder="Mesaj..." />
          </div>

          <div className="input-group">
            <button>Göndər</button>
            <button type="button" onClick={() => showModal(false)}>
              Ləğv et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewApply;
