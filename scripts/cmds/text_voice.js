const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 Author Lock
const LOCKED_AUTHOR = "Farhan-Khan (🔒 Do Not Change)";

module.exports = {
  config: {
    name: "text_voice",
    version: "4.0.0",
    author: "Farhan-Khan (🔒 Do Not Change)",
    countDown: 1,
    role: 0,
    shortDescription: "Voice + React + Seen + Filter",
    longDescription: "Auto voice + react + seen + ignore commands",
    category: "system"
  },

  onStart: async function () {
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      console.error("❌ Author changed! Script stopped.");
      process.exit(1);
    }
  },

  onChat: async function ({ event, api, message }) {
    if (!event.body || !event.messageID) return;

    // ❌ Command Ignore System
    const prefixes = ["/", "!", "#"];
    if (prefixes.some(p => event.body.startsWith(p))) return;

    const input = event.body.toLowerCase();

    // 👀 Auto Seen
    try {
      api.markAsRead(event.threadID);
    } catch (e) {}

    // 😆 Auto React (Goat)
    try {
      const reactions = ["👍", "😆", "🔥", "❤️", "😎"];
      const randomReact = reactions[Math.floor(Math.random() * reactions.length)];

      api.setMessageReaction(randomReact, event.messageID, () => {}, true);
    } catch (e) {}

    // 🎵 Voice Map
    const voiceMap = {
      "চুদি": "https://files.catbox.moe/ecgpak.mp4",
      "cudi": "https://files.catbox.moe/ecgpak.mp4",
      "chudi": "https://files.catbox.moe/ecgpak.mp4",
      "magi": "https://files.catbox.moe/ecgpak.mp4",
      "মাগি": "https://files.catbox.moe/ecgpak.mp4",
      "খানকি": "https://files.catbox.moe/ecgpak.mp4",
      "khanki": "https://files.catbox.moe/ecgpak.mp4",
      "farhan": "https://files.catbox.moe/tvpfee.mp3",
      "ফারহান": "https://files.catbox.moe/tvpfee.mp3",
      "sizuka": "https://files.catbox.moe/3u6shs.mp3",
      "sizu": "https://files.catbox.moe/3u6shs.mp3",
      "সিজুকা": "https://files.catbox.moe/3u6shs.mp3",
      "good night": "https://files.catbox.moe/i29m4q.mp3",
      "গুড নাইট": "https://files.catbox.moe/i29m4q.mp3",
      "good morning": "https://files.catbox.moe/8gzqx5.mp3",
      "গুড মর্নিং": "https://files.catbox.moe/8gzqx5.mp3",
      "i love you": "https://files.catbox.moe/y3fk8i.mp3",
      "love you": "https://files.catbox.moe/y3fk8i.mp3",
      "@everyone": "https://files.catbox.moe/3u6shs.mp3",
      "bye": "https://files.catbox.moe/fdqh2m.mp3",
      "by": "https://files.catbox.moe/fdqh2m.mp3",
      "বাই": "https://files.catbox.moe/fdqh2m.mp3",
      "বায়": "https://files.catbox.moe/fdqh2m.mp3"
    };

    // 🔍 Keyword Match
    for (const key in voiceMap) {
      if (input.includes(key)) {
        const audioUrl = voiceMap[key];

        const cacheDir = path.join(__dirname, "cache", "voices");
        fs.ensureDirSync(cacheDir);

        const fileName = `${Buffer.from(key).toString("hex")}.mp3`;
        const filePath = path.join(cacheDir, fileName);

        try {
          if (fs.existsSync(filePath)) {
            return await message.reply({
              attachment: fs.createReadStream(filePath)
            });
          }

          const response = await axios.get(audioUrl, {
            responseType: "arraybuffer"
          });

          fs.writeFileSync(filePath, Buffer.from(response.data));

          return await message.reply({
            attachment: fs.createReadStream(filePath)
          });

        } catch (error) {
          console.error("Voice error:", error);
        }
      }
    }
  }
};
