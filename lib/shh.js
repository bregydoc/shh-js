const axios = require("axios");
const path = require("path");
const NodeRSA = require("node-rsa");

const { stringToArrayBuffer, arrayBufferToString } = require("./cipher.js");

class SHH {
  constructor(shhHost = "http://localhost:8080") {
    this.host = shhHost;
    this.generatePath = "/api/generate";
    this.credentials = {
      username: "public",
      password: "access"
    };
  }

  sendMessageAsPost = (message, credentials) => {
    const url = this.host + this.generatePath;

    const creds = this.credentials || credentials;
    console.log(creds);

    axios
      .post(url, creds, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        console.log(res.data);
        const pKey = res.data.public_key;

        const data = stringToArrayBuffer("data");
        console.log(data);

        const key = new NodeRSA(pKey);
        key.setOptions({
          encryptionScheme: "pkcs1_oaep",
          signingScheme: "pkcs1-sha256"
        });

        const encryptedMessage = key.encrypt(data);
        const eMessage64 = encryptedMessage.toString("base64");

        console.log(eMessage64);

        const payload = {
          credentials: creds,
          message: encryptedMessage.toString("base64"),
          public_key: pKey
        };

        console.log(payload);

        axios
          .post("http://localhost:8080/api/unfold", payload)
          .then(r => {
            console.log(r);
          })
          .catch(err => {
            console.log(err.response.data);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };
}

module.exports = { SHH };
