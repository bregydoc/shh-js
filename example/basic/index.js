import { SHH } from "shhjs";

const helper = new SHH("http://localhost:8080", { username: "public", password: "access" });

helper
  .sendMessageAsPost({ hello: "world" })
  .then(r => {
    console.log(r);
  })
  .catch(err => console.log(err));
