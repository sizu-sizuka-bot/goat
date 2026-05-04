const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "hack",
    version: "1.0.1",
    author: "MR_FARHAN",
    countDown: 0,
    role: 0,
    shortDescription: "Fake FB hack generator 😅",
    category: "fun",
    guide: {
      en: "{pn} @mention বা reply দিয়ে ব্যবহার করো"
    }
  },

  wrapText(ctx, text, maxWidth) {
    return new Promise(resolve => {
      const words = text.split(" ");
      const lines = [];
      let line = "";

      for (let word of words) {
        let testLine = line + word + " ";
        let testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && line !== "") {
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

  onStart: async function ({ event, message, usersData }) {
    try {

      // ✅ REPLY + MENTION FIX
      let targetID;

      if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      } else {
        targetID = Object.keys(event.mentions)[0] || event.senderID;
      }

      // ✅ REAL NAME
      const userName = await usersData.getName(targetID);

      const bgLink =
        "https://drive.google.com/uc?id=1_S9eqbx8CxMMxUdOfATIDXwaKWMC-8ox&export=download";

      const bgPath = __dirname + "/cache/hack_bg.png";
      const avatarPath = __dirname + "/cache/hack_avatar.png";

      // ✅ AVATAR FIX (no utf-8 bug)
      const avatarData = (
        await axios.get(
          `https://graph.facebook.com/${targetID}/picture?width=720&height=720`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(avatarPath, Buffer.from(avatarData));

      const bgData = (await axios.get(bgLink, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(bgPath, Buffer.from(bgData));

      const background = await loadImage(bgPath);
      const avatar = await loadImage(avatarPath);

      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // ✅ FONT FIX (better display)
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = "#1878F3";
      ctx.textAlign = "start";

      const wrappedText = await this.wrapText(ctx, userName, 400);
      ctx.fillText(wrappedText.join(" "), 136, 335);

      ctx.drawImage(avatar, 57, 290, 66, 68);

      const finalBuffer = canvas.toBuffer();
      fs.writeFileSync(bgPath, finalBuffer);

      await message.reply({
        body:
          "✅ [SUCCESS] ✅\nআপনার আইডি হ্যাক করা হয়েছে 😅\nচেক করুন আপনার প্রোফাইল!",
        attachment: fs.createReadStream(bgPath)
      });

      fs.unlinkSync(bgPath);
      fs.unlinkSync(avatarPath);

    } catch (err) {
      console.error(err);
      message.reply("❌ কিছু ভুল হয়েছে!");
    }
  }
};
