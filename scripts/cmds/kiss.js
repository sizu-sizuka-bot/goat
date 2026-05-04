const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return base.data.mahmud;
};

/**
 * @author MahMUD
 * @author: do not delete it
 */

module.exports = {
  config: {
    name: "kiss",
    version: "1.7",
    author: "MahMUD",
    countDown: 5,
    role: 0,
    longDescription: "Generate anime-style kiss image",
    category: "love",
    guide: "{pn} @mention or reply to someone"
  },

  onStart: async function ({ message, event, api }) {
    try {
      const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
      if (module.exports.config.author.trim() !== obfuscatedAuthor) {
        return api.sendMessage(
          "❌ | You are not authorized to change the author name.",
          event.threadID,
          event.messageID
        );
      }

      // ✅ Reply support (FIRST priority)
      let targetID;

      if (event.messageReply && event.messageReply.senderID) {
        targetID = event.messageReply.senderID;
      } 
      // ✅ Mention support (SECOND priority)
      else {
        const mention = Object.keys(event.mentions || {});
        if (mention.length > 0) {
          targetID = mention[0];
        }
      }

      if (!targetID) {
        return message.reply("Please mention or reply to someone to kiss 💋");
      }

      const senderID = event.senderID;

      const base = await mahmud();
      const apiURL = `${base}/api/kiss`;

      const response = await axios.post(
        apiURL,
        { senderID, targetID },
        { responseType: "arraybuffer" }
      );

      const imgPath = path.join(
        __dirname,
        `kiss_${senderID}_${targetID}.png`
      );

      fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

      message.reply({
        body: "💋 ইস বেবি, তোমাকে তো খেয়ে দিল এখন তো তোমার বিয়ে হবে না। 🤭🤣",
        attachment: fs.createReadStream(imgPath)
      });

      setTimeout(() => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }, 10000);

    } catch (err) {
      console.error("Error in kiss command:", err.message || err);
      message.reply("🥹 Error হয়েছে, Boss_Farhan-কে contact করো।");
    }
  }
};
