var crypto = require("crypto");
var path = require("path");
var fs = require("fs");

const stringToArrayBuffer = str => {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

const arrayBufferToString = str => {
  var byteArray = new Uint8Array(str);
  var byteString = "";
  for (var i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCodePoint(byteArray[i]);
  }
  return byteString;
};

var encryptStringWithRsaPublicKey = function(toEncrypt, publicKey) {
  var buffer = Buffer.from(toEncrypt);
  var encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

module.exports = { stringToArrayBuffer, arrayBufferToString, encryptStringWithRsaPublicKey };
