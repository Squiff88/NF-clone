const fs = require("fs");
const axios = require("axios");

let media = ["video.png"];
let ipfsArr = [];
let promises = [];

for (let i = 0; i < media.length; i++) {
  promises.push(
    new Promise((res, rej) => {
      fs.readFile(`${__dirname}/export/${media[i]}`, (err, data) => {
        if (err) {
          rej();
        }
        ipfsArr.push({
          path: `media/${i}`,
          content: data.toString("base64"),
        });
        res();
      });
    })
  );
}

Promise.all(promises).then(() => {
  axios
    .post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", ipfsArr, {
      headers: {
        "X-API-KEY":
          "jaTzv2eE74a32w0EBauhULVtGV4da8ZAL4R9Cz8V4gRPrMdOlOEqFr2wNtqnBq84",
        "Content-Type": "application/json",
        accept: "application/json",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
    .then((res) => console.log(res.data, "success"))
    .catch((err) => console.log(err, "err"));
});
