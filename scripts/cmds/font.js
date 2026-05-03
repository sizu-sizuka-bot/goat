const axios = require("axios");

// 🔒 LOCKED AUTHOR (DON'T CHANGE)
const LOCKED_AUTHOR = "MR_FARHAN";

module.exports = {
  config: {
    name: "font",
    version: "1.0",
    author: LOCKED_AUTHOR,
    role: 0,
    shortDescription: "Convert text to stylish font",
    longDescription: "Use API to generate stylish fonts",
    category: "fun",
    guide: {
      en: "{pn} <style> <text>\n{pn} list"
    }
  },

  onStart: async function ({ message, args }) {

    // 🔐 AUTHOR INTEGRITY CHECK
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      return message.reply("⛔ This file has been modified illegally!");
    }

    try {
      if (args[0] === "list") {
        const res = await axios.get(
          "https://sayem-apixs.vercel.app/api/styles/font?style=list"
        );

        const previews = res.data.previews;

        let msg = "✨ Available Styles:\n\n";
        let count = 0;

        for (let key in previews) {
          msg += `${key} → ${previews[key]}\n`;
          count++;
          if (count >= 30) break;
        }

        msg += "\nUse: font <style> <text>";
        return message.reply(msg);
      }

      const style = args[0];
      const text = args.slice(1).join(" ");

      if (!style || !text) {
        return message.reply(
          "❌ Usage:\nfont <style> <text>\n\nExample:\nfont 1 Hello"
        );
      }

      const url = `https://sayem-apixs.vercel.app/api/styles/font?text=${encodeURIComponent(
        text
      )}&style=${style}`;

      const res = await axios.get(url);

      if (!res.data.status) {
        return message.reply("❌ " + res.data.message);
      }

      return message.reply(
        `✨ Style: ${style}\n\n${res.data.result}`
      );

    } catch (err) {
      return message.reply("⚠️ API error or server down!");
    }
  }
};
