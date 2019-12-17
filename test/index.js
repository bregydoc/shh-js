const { SHH } = require("../index");

const shh = new SHH();

shh.sendMessageAsPost({ username: "bregy", password: "malpartida" }).then(r => console.log(r));
