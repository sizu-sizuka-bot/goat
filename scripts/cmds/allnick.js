module.exports = {
  config: {
    name: "allnick",
    aliases: ["an"],
    version: "1.3",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Change nickname of all members in current group"
    },
    longDescription: {
      en: "Change nickname of all members in the current group"
    },
    category: "owner",
    guide: {
      en: "{pn} <new nickname>"
    },
    envConfig: {
      delayPerUser: 200
    }
  },

  langs: {
    en: {
      missingNickname: "⚠️ Please enter a nickname",
      start: "⏳ Changing nickname for %1 members...",
      success: "✅ Successfully changed nickname for all members",
      partial: "⚠️ Done, but failed for %1 users:\n%2",
      error: "❌ Error: %1",
      onlyGroup: "❌ This command only works in groups",
      locked: "⛔ File locked! Don't change author name."
    }
  },

  onStart: async function ({ api, event, args, message, getLang }) {

    // 🔒 AUTHOR LOCK SYSTEM
    if (module.exports.config.author !== "MR_FARHAN") {
      return message.reply(getLang("locked"));
    }

    const threadID = event.threadID;
    const newNickname = args.join(" ");
    const delay = module.exports.config.envConfig.delayPerUser || 200;

    if (!newNickname) {
      return message.reply(getLang("missingNickname"));
    }

    try {
      const threadInfo = await api.getThreadInfo(threadID);

      if (!threadInfo.isGroup) {
        return message.reply(getLang("onlyGroup"));
      }

      const members = threadInfo.participantIDs;

      await message.reply(getLang("start", members.length));

      let failed = [];

      for (const userID of members) {
        try {
          await api.changeNickname(newNickname, threadID, userID);
          await new Promise(res => setTimeout(res, delay));
        } catch (err) {
          failed.push(userID);
        }
      }

      if (failed.length === 0) {
        message.reply(getLang("success"));
      } else {
        message.reply(getLang("partial", failed.length, failed.join(", ")));
      }

    } catch (err) {
      message.reply(getLang("error", err.message));
    }
  }
};
