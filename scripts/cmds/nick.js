const LOCKED_AUTHOR = "FARHAN-KHAN";

module.exports = {
  config: {
    name: "nick",
    aliases: ["sn"],
    version: "2.0",
    author: LOCKED_AUTHOR,
    countDown: 5,
    role: 1,
    shortDescription: {
      en: "রিপ্লাই দিয়ে নিকনেম পরিবর্তন"
    },
    longDescription: {
      en: "কারো মেসেজে রিপ্লাই দিয়ে শুধুমাত্র ওই ইউজারের নিকনেম পরিবর্তন করবে"
    },
    category: "owner",
    guide: {
      en: "{pn} <নতুন নিকনেম>\nকারো মেসেজে রিপ্লাই দিন"
    }
  },

  langs: {
    en: {
      missingNickname: "দয়া করে একটি নিকনেম লিখুন।",
      missingReply: "আগে কারো মেসেজে রিপ্লাই দিন।",
      success: "সফলভাবে নিকনেম পরিবর্তন করা হয়েছে: %1",
      failed: "নিকনেম পরিবর্তন করা যায়নি।",
      authorError: "Author পরিবর্তন করা হয়েছে। ফাইল লক করা আছে।"
    }
  },

  onStart: async function ({ api, event, args, message, getLang }) {

    // 🔒 Author Lock
    if (module.exports.config.author !== LOCKED_AUTHOR) {
      throw new Error(getLang("authorError"));
    }

    // 📝 Nickname
    const newNickname = args.join(" ");

    if (!newNickname) {
      return message.reply(getLang("missingNickname"));
    }

    // 📌 Must reply
    if (!event.messageReply) {
      return message.reply(getLang("missingReply"));
    }

    try {
      const targetID = event.messageReply.senderID;
      const threadID = event.threadID;

      // ✅ Change nickname only for replied user
      await api.changeNickname(newNickname, threadID, targetID);

      return message.reply(getLang("success", newNickname));

    } catch (e) {
      console.log(e);
      return message.reply(getLang("failed"));
    }
  }
};
