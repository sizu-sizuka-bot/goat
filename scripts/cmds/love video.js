const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "love video",
    version: "2.0.0",
    author: "NAZRUL x MOHAMMAD AKASH",
    countDown: 5,
    role: 0,
    shortDescription: "Sad video sender 😢",
    longDescription: "Sends random sad video with emotional captions 💔",
    category: "media",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    // 💔 Random sad captions
    const captions = [
      "===「𝐏𝐑𝐄𝐅𝐈𝐗-𝐄𝐕𝐄𝐍𝐓」=== \n--❖(✷‿𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓‿✷)❖-- \n✢━━━━━━━━━━━━━━━✢        \n🎀 ♡-𝐋💞𝐕𝐄-𝐕𝐈𝐃𝐄💍-♡ 🎀 \n✢━━━━━━━━━━━━━━━✢\n(✷‿𝐎𝐖𝐍𝐄𝐑:-𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍‿✷)"
    ];

    const caption = captions[Math.floor(Math.random() * captions.length)];

    // 🎥 Sad videos list
    const links = [
      "https://drive.google.com/uc?id=1xLc_9r1TYGVM0J33hJ61hmW3yXOBTcEo",
    "https://drive.google.com/uc?id=1xFVA97twVhvJJzmxhXjT9QukwWEDRO2a",
    "https://drive.google.com/uc?id=1xC8J23XORH4zHsXCDkfrgzmVBm1_-b5E",
    "https://drive.google.com/uc?id=1x5EX0grUJwEKzHyzeR63HnzC_UlDdJD6",
    "https://drive.google.com/uc?id=1xM82tBosefpCvaDokhufHoikub1Opupz",
    "https://drive.google.com/uc?id=1xhCqfx7pScogeGph4T4ITnRJFYcUNmJ8",
    "https://drive.google.com/uc?id=1xTgkjk__QRMOVQnkQsSIcEzGfRUwUDLY",
    "https://drive.google.com/uc?id=1xRsWDPe485xXPna9nWhj0TaW_Q9lVJDd",
    "https://drive.google.com/uc?id=1xC30T2eSDWZGr_O8699yxaMS-AZ_X5y8",
    "https://drive.google.com/uc?id=1xcoHMLkNU1naPET4bP2sEiHoXUF23w-R",
    "https://drive.google.com/uc?id=1xcN88lPjPoRJhdxCUesuTFFArtvbUNL2",
    "https://drive.google.com/uc?id=1xUee8t4ukXW_XD4K4pGV_I4VFccwdyqt",
    "https://drive.google.com/uc?id=1xgfepctwXjZ5Y9kxhD3HcTTaJcsWHi-x",
    "https://drive.google.com/uc?id=1xhymaD6J1patQzfass5-e4ewUDg8gnQ9",
    "https://drive.google.com/uc?id=1xCvCvUa2zVWLm3y1pAGFKrr-emyaFicK",
    "https://drive.google.com/uc?id=1x87CHgjwaOjANyN_06_JqB-YKaUQGU2b"
    ];

    const link = links[Math.floor(Math.random() * links.length)];
    const cachePath = path.join(__dirname, "cache", "sad.mp4");

    try {
      const response = await axios({
        url: encodeURI(link),
        method: "GET",
        responseType: "stream"
      });

      await fs.ensureDir(path.join(__dirname, "cache"));
      const writer = fs.createWriteStream(cachePath);

      response.data.pipe(writer);

      writer.on("finish", async () => {
        await api.sendMessage(
          {
            body: `「 ${caption} 」`,
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID
        );
        fs.unlinkSync(cachePath);
      });

      writer.on("error", (err) => {
        console.error(err);
        api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে!", event.threadID);
      });

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ কিছু একটা সমস্যা হয়েছে ভিডিও আনতে।", event.threadID);
    }
  }
};
