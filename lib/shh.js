const axios = require("axios");

const NodeRSA = require("node-rsa");

class SHH {
  constructor(shhHost = "http://localhost:8080") {
    this.host = shhHost;
    this.generatePath = "/api/generate";
    this.credentials = {
      username: "public",
      password: "access"
    };
  }

  obtainNewPublicKey = credentials => {
    const url = this.host + this.generatePath;

    const creds = this.credentials || credentials;
    console.log(creds);

    return new Promise((resolve, reject) => {
      axios
        .post(url, creds, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          const pKey = res.data.public_key;
          resolve({ key: pKey });
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  signMessage = (publicKey, message) => {
    const pKey = publicKey;

    var data = message;
    if (typeof message == "object") {
      data = JSON.stringify(message);
    }

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

    return {
      key: pKey,
      message: eMessage64
    };
  };

  sendMessageAsPost = (message, credentials, redirect = "") => {
    const creds = this.credentials || credentials;

    const self = this;
    return new Promise(function(resolve, reject) {
      self.obtainNewPublicKey(creds).then(r => {
        const publicKey = r.key;
        const encodedMessage = self.signMessage(publicKey, message);

        const compose = {
          publicKey: publicKey,
          message: encodedMessage.message
        };

        if (redirect !== "") {
          axios
            .post(redirect)
            .then(r => resolve(r))
            .catch(e => reject(e));
        }

        resolve(compose);
      });
    });
  };
}

module.exports = { SHH };
