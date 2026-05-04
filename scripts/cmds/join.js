const ORIGINAL_AUTHOR = "MR_FARHAN";

module.exports = {
  config: {
    name: "join",
    aliases: ["boxlist", "allbox"],
    version: "2.2.1",
    author: ORIGINAL_AUTHOR,
    role: 0,
    shortDescription: "গ্রুপ লিস্ট দেখাবে ও নিজেকে add করবে",
    category: "system",
    countDown: 10
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const perPage = 10;

    if (module.exports.config.author !== ORIGINAL_AUTHOR) {
      return api.sendMessage(
        "⛔ এই কমান্ড পরিবর্তন করা হয়েছে, তাই এটি বন্ধ করা হয়েছে।",
        threadID,
        messageID
      );
    }

    try {
      const allThreads = await api.getThreadList(100, null, ["INBOX"]);

      if (!allThreads || !Array.isArray(allThreads)) {
        return api.sendMessage("❌ গ্রুপ ডাটা লোড করা যায়নি।", threadID);
      }

      const groups = allThreads.filter(t => t.isGroup === true);

      if (groups.length === 0) {
        return api.sendMessage(
          "⚠️ বট এখন কোনো গ্রুপে যুক্ত নেই।",
          threadID,
          messageID
        );
      }

      const page = 1;
      const start = 0;
      const current = groups.slice(start, start + perPage);

      let msg =
`📦 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 (পৃষ্ঠা ${page})
━━━━━━━━━━━━━━━━━━\n`;

      current.forEach((g, i) => {
        msg += `_____________________\n🔢 ${i + 1}. ${g.name || "Unnamed Group"}\n`;
        msg += `🆔: ${g.threadID}\n\n`;
      });

      msg +=
`━━━━━━━━━━━━━━━━━━
👉 add 1 | add 2 লিখে নিজেকে যোগ করুন
👉 page 2 লিখে পরের পেজ দেখুন`;

      return api.sendMessage(msg, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          groups,
          page,
          perPage
        });
      }, messageID);

    } catch (e) {
      console.log(e);
      return api.sendMessage(
        "❌ গ্রুপ লিস্ট লোড করা যাচ্ছে না।",
        threadID,
        messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== Reply.author) return;

    const args = body.trim().toLowerCase().split(/\s+/);
    const perPage = Reply.perPage || 10;

    // 📄 PAGE SYSTEM
    if (args[0] === "page") {
      const pageNum = parseInt(args[1]);
      if (isNaN(pageNum) || pageNum < 1) {
        return api.sendMessage("❌ ভুল পেজ নাম্বার।", threadID);
      }

      const start = (pageNum - 1) * perPage;
      const current = Reply.groups.slice(start, start + perPage);

      if (!current.length) {
        return api.sendMessage("⚠️ আর কোনো গ্রুপ নেই।", threadID);
      }

      let msg =
`📦 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 (পৃষ্ঠা ${pageNum})
━━━━━━━━━━━━━━━━━━\n`;

      current.forEach((g, i) => {
        msg += `_____________________\n🔢 ${start + i + 1}. ${g.name || "Unnamed Group"}\n`;
        msg += `🆔: ${g.threadID}\n\n`;
      });

      return api.sendMessage(msg, threadID, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: Reply.commandName,
          author: Reply.author,
          groups: Reply.groups,
          page: pageNum,
          perPage
        });
      });
    }

    // ➕ ADD SYSTEM
    if (args[0] === "add") {
      const index = parseInt(args[1]) - 1;

      if (isNaN(index) || index < 0 || !Reply.groups[index]) {
        return api.sendMessage("❌ ভুল নাম্বার। আবার চেষ্টা করুন।", threadID);
      }

      const group = Reply.groups[index];

      let userName = "Unknown User";

      try {
        const userInfo = await api.getUserInfo(senderID);
        userName = userInfo?.[senderID]?.name || "Unknown User";
      } catch (e) {}

      try {
        await api.addUserToGroup(senderID, group.threadID);

        api.sendMessage(
          `✅ আপনাকে "${group.name}" গ্রুপে যোগ করা হয়েছে।`,
          threadID,
          messageID
        );

        api.sendMessage(
`━━━━━━━━━━━━━━━━━━
🔔 নতুন সদস্য যুক্ত হয়েছে

👤 নাম: ${userName}
🆔 ID: ${senderID}
📦 গ্রুপ: ${group.name}
━━━━━━━━━━━━━━━━━━`,
          group.threadID
        );

      } catch (err) {
        api.sendMessage(
          `❌ "${group.name}" গ্রুপে যোগ করা যায়নি।`,
          threadID,
          messageID
        );
      }

      return global.GoatBot.onReply.delete(Reply.messageID);
    }
  }
};
