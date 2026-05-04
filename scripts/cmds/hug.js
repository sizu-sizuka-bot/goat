const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "hug",
    aliases: ["hug"],
    version: "2.2",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: "Give someone a hug!",
    longDescription: "A fun command to give someone a hug with a picture.",
    category: "fun",
    guide: "{pn} @mention or reply",
  },

  onStart: async function ({ event, api, usersData }) {
    try {

      // ✅ Mention বা Reply detect
      let targetID;

      if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else if (event.messageReply) {
        targetID = event.messageReply.senderID;
      }

      if (!targetID) {
        return api.sendMessage(
          "🤗 কাকে hug দিবা? mention দাও বা reply করো!",
          event.threadID,
          event.messageID
        );
      }

      const huggerID = event.senderID;

      // ✅ Avatar fetch function
      const getAvatar = async (uid) => {
        try {
          const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

          const avatarPath = path.join(__dirname, `${uid}_avatar.png`);

          const res = await axios.get(url, {
            responseType: "arraybuffer",
          });

          fs.writeFileSync(avatarPath, res.data);

          return avatarPath;
        } catch (err) {
          console.log("Avatar Error:", err.message);
          return null;
        }
      };

      // ✅ Background load
      const bg = await loadImage("https://i.imgur.com/eUNHCj3.jpeg");

      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bg, 0, 0, bg.width, bg.height);

      // ✅ Avatar load
      const huggerAvatarPath = await getAvatar(huggerID);
      const targetAvatarPath = await getAvatar(targetID);

      if (!huggerAvatarPath || !targetAvatarPath) {
        return api.sendMessage(
          "❌ Avatar load করতে সমস্যা হয়েছে!",
          event.threadID,
          event.messageID
        );
      }

      const huggerAvatar = await loadImage(huggerAvatarPath);
      const targetAvatar = await loadImage(targetAvatarPath);

      // ✅ Hugger avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(285, 110, 50, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(huggerAvatar, 235, 60, 100, 100);
      ctx.restore();

      // ✅ Target avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(460, 160, 50, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(targetAvatar, 410, 110, 100, 100);
      ctx.restore();

      // ✅ Save image
      const output = path.join(__dirname, `hug_${Date.now()}.png`);

      fs.writeFileSync(output, canvas.toBuffer("image/png"));

      // ✅ FIXED NAME SYSTEM
      let targetName = "Baby 😘";

      try {
        const userData = await usersData.get(targetID);

        if (userData?.name) {
          targetName = userData.name;
        } else if (event.mentions[targetID]) {
          targetName = event.mentions[targetID].replace("@", "");
        } else if (event.messageReply?.senderID == targetID) {
          targetName =
            event.messageReply.senderName ||
            event.messageReply.body ||
            "User";
        }
      } catch (e) {
        console.log("Name Error:", e.message);
      }

      // ✅ Send message
      api.sendMessage(
        {
          body:
`✿•≫───────────────≪•✿
「 ${targetName} 」

ইস তোমাকে তো অন্য বেডা জড়িয়ে ধরল আমি তোমার জামাই কে বলে দিব।😒🔪
✿•≫───────────────≪•✿`,

          attachment: fs.createReadStream(output),

          mentions: [
            {
              tag: targetName,
              id: targetID,
            },
          ],
        },

        event.threadID,

        () => {
          try {
            if (fs.existsSync(output)) fs.unlinkSync(output);
            if (fs.existsSync(huggerAvatarPath))
              fs.unlinkSync(huggerAvatarPath);
            if (fs.existsSync(targetAvatarPath))
              fs.unlinkSync(targetAvatarPath);
          } catch (e) {
            console.log(e);
          }
        },

        event.messageID
      );

    } catch (err) {
      console.error(err);

      api.sendMessage(
        "❌ Something went wrong!",
        event.threadID,
        event.messageID
      );
    }
  },
};
