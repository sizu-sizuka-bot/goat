const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "hack",
    version: "1.1.0",
    author: "FARHAN-KHAN",
    countDown: 0,
    role: 0,
    shortDescription: "Fake FB hack generator 😅",
    longDescription: "Creates a fake hacking style image using target profile photo and name.",
    category: "fun",
    guide: {
      en: "{pn} @mention বা reply দিয়ে ব্যবহার করো"
    }
  },

  // ✏️ টেক্সট wrap function
  wrapText(ctx, text, maxWidth) {
    return new Promise(resolve => {
      if (ctx.measureText(text).width < maxWidth) return resolve([text]);
      if (ctx.measureText("W").width > maxWidth) return resolve(null);

      const words = text.split(" ");
      const lines = [];
      let line = "";

      while (words.length > 0) {
        let split = false;
        while (ctx.measureText(words[0]).width >= maxWidth) {
          const temp = words[0];
          words[0] = temp.slice(0, -1);
          if (split) {
            words[1] = temp.slice(-1) + words[1];
          } else {
            split = true;
            words.splice(1, 0, temp.slice(-1));
          }
        }

        if (ctx.measureText(line + words[0]).width < maxWidth) {
          line += words.shift() + " ";
        } else {
          lines.push(line.trim());
          line = "";
        }

        if (words.length === 0) lines.push(line.trim());
      }

      resolve(lines);
    });
  },

  // 🎯 Main Command
  onStart: async function ({ event, message, usersData }) {
    try {
      // ✅ mention + reply + self support
      let mentionID;

      if (Object.keys(event.mentions).length > 0) {
        mentionID = Object.keys(event.mentions)[0];
      } else if (event.messageReply) {
        mentionID = event.messageReply.senderID;
      } else {
        mentionID = event.senderID;
      }

      const userName = await usersData.getName(mentionID);

      // 🎨 background
      const backgrounds = [
        "https://drive.google.com/uc?id=1_S9eqbx8CxMMxUdOfATIDXwaKWMC-8ox&export=download"
      ];
      const bgLink = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      const bgPath = __dirname + "/cache/hack_bg.png";
      const avatarPath = __dirname + "/cache/hack_avatar.png";

      // 📥 avatar download
      const avatarData = (
        await axios.get(
          `https://graph.facebook.com/${mentionID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(avatarPath, Buffer.from(avatarData, "utf-8"));

      // 📥 background download
      const bgData = (await axios.get(bgLink, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(bgPath, Buffer.from(bgData, "utf-8"));

      // 🖼️ canvas draw
      const background = await loadImage(bgPath);
      const avatar = await loadImage(avatarPath);
      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // ✍️ text settings
      ctx.font = "400 23px Arial";
      ctx.fillStyle = "#1878F3";
      ctx.textAlign = "start";

      const wrappedText = await this.wrapText(ctx, userName, 1160);

      // ✅ proper multiline text draw
      let y = 335;
      for (const line of wrappedText) {
        ctx.fillText(line, 136, y);
        y += 25;
      }

      // 👤 avatar draw
      ctx.beginPath();
      ctx.drawImage(avatar, 57, 290, 66, 68);

      const finalBuffer = canvas.toBuffer();
      fs.writeFileSync(bgPath, finalBuffer);

      await message.reply({
        body: "✅[𝙎𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮 𝙃𝙖𝙘𝙠𝙚𝙙]✅\n[আপনার আইডিটা এই মুহূর্তে হ্যাক করা হয়েছে 😅]",
        attachment: fs.createReadStream(bgPath)
      });

      // 🧹 cleanup
      fs.unlinkSync(bgPath);
      fs.unlinkSync(avatarPath);

    } catch (err) {
      console.error(err);
      message.reply("❌ কিছু ভুল হয়েছে!");
    }
  }
};
