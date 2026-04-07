const fs = require("fs-extra");
const path = require("path");
const https = require("https");

exports.config = {
  name: "cutereply",
  version: "4.1.0",
  author: "Farhan-Khan",
  countDown: 0,
  role: 0,
  shortDescription: "Trigger reply + react",
  longDescription: "Trigger দিলে random reply + image + user react দিবে",
  category: "system"
};

const cooldown = 10000;
const last = {};

const TRIGGERS = [
  {
    words: ["farhan","Farhan","FARHAN","ফারহান"],
    replies: [
      {
        text: "👉 ফারহান বস এখন বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
        images: ["https://i.imgur.com/oTS3Un0.jpeg"]
      },
      {
        text: "🔥 বস ফারহান কে মেনশন দিসনা পারলে একটা জি এফ দে...!😃",
        images: ["https://i.imgur.com/dTc5oYc.jpeg"]
      },
      {
        text: "😎 চুমু খাওয়ার বয়স টা আমার বস ফারহান চকলেট🍫খেয়ে উড়িয়ে দিল 🤗",
        images: ["https://i.imgur.com/oTS3Un0.jpeg"]
      },
      {
        text: "👉 আমার বস ♻️ 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো https://www.facebook.com/MR.FARHAN.420 🔰 ♪√বস ফ্রি হলে আসবে🧡😁😜",
        images: ["https://i.imgur.com/dTc5oYc.jpeg"]
      }
    ]
  },
  {
    words: ["@এৃঁলেৃঁ'ক্সৃঁ সিৃঁ'জুৃঁ'কাৃঁ","@সিৃঁ'জুৃঁ সিৃঁ'জুৃঁ'কাৃঁ","@সিৃঁ'জুৃঁ'কাৃঁ সিৃঁ'জুৃঁ"],
    replies: [
      {
        text: "🤖 আমাকে মেনশন দিয়ে লাভ নাই 😆 আমি একটা রোবট শুধু ফান করার জন্য!",
        images: ["https://i.imgur.com/rkrXNso.jpeg"]
      },
      {
        text: "😽 আমি একটা বট, বস ফারহান বানাইছে 😎",
        images: ["https://i.imgur.com/zrpFJUc.jpeg"]
      }
    ]
  }
];

exports.onStart = async function () {};

exports.onChat = async function ({ event, api }) {
  try {
    const { threadID, senderID, messageID } = event;
    const body = (event.body || "").trim();
    if (!body) return;

    // ❌ bot নিজের message ignore
    if (senderID === api.getCurrentUserID()) return;

    // ⏱ cooldown (thread ভিত্তিক)
    const now = Date.now();
    if (last[threadID] && now - last[threadID] < cooldown) return;

    // 🔍 trigger match
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

    // 🎲 random reply
    const reply =
      matched.replies[Math.floor(Math.random() * matched.replies.length)];

    // 🎲 random image
    const imgUrl =
      reply.images[Math.floor(Math.random() * reply.images.length)];

    const imgName = path.basename(imgUrl);
    const imgPath = path.join(__dirname, imgName);

    if (!fs.existsSync(imgPath)) {
      await download(imgUrl, imgPath);
    }

    // 📩 send message
    api.sendMessage(
      {
        body: reply.text,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      messageID
    );

    // 😆🔥 user message-এ react
    const reactions = ["😆", "🔥", "😎", "😂"];
    const react =
      reactions[Math.floor(Math.random() * reactions.length)];

    api.setMessageReaction(react, messageID, () => {}, true);

  } catch (e) {
    console.log(e);
  }
};

// 📥 download function
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
