const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "kiss2",
    aliases: ["k2"],
    version: "1.7",
    author: "MahMUD",
    role: 0,
    category: "fun",
    cooldown: 8,
    guide: "kiss2 @tag / reply / uid",
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply, mentions, senderID } = event;

    // target user detect (reply > mention > uid > self)
    let id2;

    if (messageReply && messageReply.senderID) {
      id2 = messageReply.senderID;
    } 
    else if (mentions && Object.keys(mentions).length > 0) {
      id2 = Object.keys(mentions)[0];
    } 
    else if (args[0]) {
      id2 = args[0];
    } 
    else {
      return api.sendMessage(
        "👉 Mention, reply বা UID দিয়ে ইউজার দিন।",
        threadID,
        messageID
      );
    }

    try {
      const url = `${await baseApiUrl()}/api/dig?type=kiss&user=${senderID}&user2=${id2}`;

      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `kiss_${Date.now()}.png`);

      fs.writeFileSync(filePath, response.data);

      api.sendMessage(
        {
          body: `জান উফ সেই স্বাদ 💋`,
          attachment: fs.createReadStream(filePath),
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("🥹 Error হয়েছে, Boss_Farhan-কে contact করো।", threadID, messageID);
    }
  },
};
