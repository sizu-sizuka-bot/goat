const axios = require("axios");

const LOCKED_AUTHOR = "MR_FARHAN"; // 🔒 Locked Author Name

module.exports = {
  config: {
    name: "goatai",
    aliases: ["ai", "gpt"],
    version: "1.0",
    author: LOCKED_AUTHOR, // 🔒 Locked here
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "AI Chat Bot"
    },
    longDescription: {
      en: "Chat with AI using farhan API"
    },
    category: "ai",
    guide: {
      en: "{pn} <question>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const prompt = args.join(" ");

      if (!prompt) {
        return message.reply("❌ | Please enter a question.");
      }

      message.reply("🤖 | Thinking...");

      const res = await axios.get(
        `https://sayem-apixs.vercel.app/api/ai/pro-ai?prompt=${encodeURIComponent(prompt)}`
      );

      const reply =
        res.data.reply ||
        res.data.message ||
        res.data.result ||
        "❌ | No response from AI.";

      return message.reply(`🤖 AI Response:\n\n${reply}`);

    } catch (err) {
      console.error(err);
      return message.reply("❌ | API Error.");
    }
  }
};
