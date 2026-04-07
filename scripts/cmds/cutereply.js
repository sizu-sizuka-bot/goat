const fs = require("fs-extra");
const path = require("path");
const https = require("https");

exports.config = {
  name: "cutereply",
  version: "3.0.0",
  author: "Farhan-Khan",
  countDown: 0,
  role: 0,
  shortDescription: "Reply only if message starts with trigger",
  longDescription: "শুধু মেসেজের শুরুতে trigger থাকলে reply দিবে",
  category: "system"
};

const cooldown = 10000;
const last = {};

const TRIGGERS = [
  {
    words: ["farhan","Farhan","FARHAN","ফারহান"],
    text: "👉আমার বস♻️ 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো ‎‎‎‎‎‎‎‎‎[https://www.facebook.com/MR.FARHAN.420] 🔰 ♪√বস ফ্রি হলে আসবে,! 😜🐒",
    images: [
      "https://i.imgur.com/OE2zJre.jpeg"
    ]
  },
  {
    words: ["@এৃঁলেৃঁ'ক্সৃঁ সিৃঁ'জুৃঁ'কাৃঁ","@সিৃঁ'জুৃঁ সিৃঁ'জুৃঁ'কাৃঁ","@সিৃঁ'জুৃঁ'কাৃঁ সিৃঁ'জুৃঁ"],
    text: "-আমাকে মেনশন দিয়ে লাভ নাই- কারণ আমি একটা মেসেঞ্জার চ্যাট রোবট,🤖 আমাকে বানানো হয়েছে শুধুমাত্র আপনাদেরকে বিনোদনের জন্য, আমাকে বানিয়েছেন আমার বস ফারহান-😽🫶 [https://www.facebook.com/MR.FARHAN.420,!🌺",
    images: [
      "https://i.imgur.com/rkrXNso.jpeg",
      "https://i.imgur.com/zrpFJUc.jpeg"
    ]
  }
];

exports.onStart = async function () {};

exports.onChat = async function ({ event, api }) {
  try {
    const { threadID, senderID, messageID } = event;
    const body = (event.body || "").trim();
    if (!body) return;

    // bot নিজের মেসেজ ignore
    if (senderID === api.getCurrentUserID()) return;

    // cooldown
    const now = Date.now();
    if (last[threadID] && now - last[threadID] < cooldown) return;

    let matched = null;

    for (const t of TRIGGERS) {
      if (
        t.words.some(w =>
          body.toLowerCase().startsWith(w.toLowerCase())
        )
      ) {
        matched = t;
        break;
      }
    }

    if (!matched) return;

    last[threadID] = now;

    const imgUrl =
      matched.images[Math.floor(Math.random() * matched.images.length)];
    const imgName = path.basename(imgUrl);
    const imgPath = path.join(__dirname, imgName);

    if (!fs.existsSync(imgPath)) {
      await download(imgUrl, imgPath);
    }

    api.sendMessage(
      {
        body: matched.text,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      messageID
    );

  } catch (e) {
    console.log(e);
  }
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject();
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", () => {
      fs.unlink(dest, () => {});
      reject();
    });
  });
    }
