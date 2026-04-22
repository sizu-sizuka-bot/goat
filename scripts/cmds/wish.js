const axios = require("axios");
const fs = require("fs-extra");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "wish",
    version: "2.1",
    author: "MR_FARHAN",
    role: 0,
    shortDescription: "Beautiful birthday wish card",
    longDescription: "Premium birthday wish with avatar + tag + reply support",
    category: "birthday",
    guide: {
      en: "{pn} @tag OR reply to a message"
    }
  },

  wrapText(ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);

      const words = text.split(" ");
      const lines = [];
      let line = "";

      for (let word of words) {
        const testLine = line + word + " ";
        if (ctx.measureText(testLine).width > maxWidth) {
          lines.push(line.trim());
          line = word + " ";
        } else {
          line = testLine;
        }
      }

      lines.push(line.trim());
      resolve(lines);
    });
  },

  onStart: async function ({ api, event, usersData }) {

    const bgPath = __dirname + "/cache/bgc.png";
    const avtPath = __dirname + "/cache/avt.png";

    try {

      // ✅ FIX: mention OR reply support
      const mentionIDs = Object.keys(event.mentions || {});

      const mentionID =
        mentionIDs.length > 0
          ? mentionIDs[0]
          : (event.type === "message_reply"
              ? event.messageReply.senderID
              : null);

      if (!mentionID) {
        return api.sendMessage(
          "⚠️ Please tag someone or reply to their message!",
          event.threadID,
          event.messageID
        );
      }

      const targetName = await usersData.getName(mentionID);
      const senderName = await usersData.getName(event.senderID);

      // Background
      const bgURL =
        "https://i.postimg.cc/k4RS69d8/20230921-195836.png";

      // Avatar fetch
      const avtData = (
        await axios.get(
          `https://graph.facebook.com/${mentionID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;

      fs.writeFileSync(avtPath, Buffer.from(avtData));

      // Background fetch
      const bgData = (
        await axios.get(bgURL, { responseType: "arraybuffer" })
      ).data;

      fs.writeFileSync(bgPath, Buffer.from(bgData));

      // Load images
      const bg = await loadImage(bgPath);
      const avt = await loadImage(avtPath);

      const canvas = createCanvas(bg.width, bg.height);
      const ctx = canvas.getContext("2d");

      // Background
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // Avatar circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(270, 470, 200, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avt, 70, 270, 400, 400);
      ctx.restore();

      // Name text
      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";

      const nameLines = await this.wrapText(ctx, targetName, 900);

      nameLines.forEach((line, i) => {
        ctx.fillText(line, 550, 420 + i * 45);
      });

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(bgPath, imageBuffer);

      // Message (FIXED TAG SYSTEM)
      const caption =
        `✿•≫───────────────≪•✿\n「 ✿ 𝗛𝗔𝗣𝗣𝗬 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬 ✿ 」\n✿•≫───────────────≪•✿\n 「 ${targetName} 」\n\n` +
        `🌟 আজকের এই দিনটা তোমার জন্য বিশেষ 🌟\n\n` +
        `💖「 ${targetName} 」💖\n\n` +
        `💖 তোমার হাসি সবসময় উজ্জ্বল থাকুক\n` +
        `💖 স্বপ্নগুলো সত্যি হোক ✨\n\n` +
        `🩷 𝐌𝐚𝐧𝐲 𝐌𝐚𝐧𝐲 𝐇𝐚𝐩𝐩𝐲 𝐑𝐞𝐭𝐮𝐫𝐧𝐬 𝐎𝐟 𝐓𝐡𝐞 𝐃𝐚𝐲!\n\n` +
        `—𝐁𝐞𝐬𝐭 𝐖𝐢𝐬𝐡𝐞𝐬 𝐅𝐫𝐨𝐦:-「 ${senderName} 」`;

      // FIXED MENTION POSITION
      const mentions = [
        {
          tag: targetName,
          id: mentionID,
          fromIndex: caption.indexOf(targetName)
        }
      ];

      api.sendMessage(
        {
          body: caption,
          mentions,
          attachment: fs.createReadStream(bgPath)
        },
        event.threadID,
        event.messageID
      );

      // cleanup
      setTimeout(() => {
        try {
          fs.unlinkSync(bgPath);
          fs.unlinkSync(avtPath);
        } catch (e) {}
      }, 5000);

    } catch (e) {
      console.error(e);
      api.sendMessage(
        "❌ Error occurred! Please try again.",
        event.threadID,
        event.messageID
      );
    }
  }
};
