const axios = require("axios");

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

        const data = JSON.stringify({
          username: "bregymr@gmail.com",
          password: "malpartida1"
        });

        console.log(data);

        const key = new NodeRSA(pKey);
        key.setOptions({
          environment: "browser",
          encryptionScheme: {
            scheme: "pkcs1_oaep",
            hash: "sha256"
          },
          signingScheme: {
            hash: "sha256",
            scheme: "pkcs1"
          }
        });

        const encryptedMessage = key.encrypt(data);
        const eMessage64 = encryptedMessage.toString("base64");

        // console.log(eMessage64);

        console.log(eMessage64.length);
        const payload = {
          credentials: creds,
          message: eMessage64,
          public_key: pKey
        };

        console.log(payload);

        axios
          .post("http://localhost:8080/api/unfold", payload)
          .then(r => {
            const data = r.data;
            if (data) {
              const message = data.message;
              console.log(message);
              const buff = Buffer.from(message, "base64");
              const text = buff.toString("utf-8");
              console.log(text);
            }
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
