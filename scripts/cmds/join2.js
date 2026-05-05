OWNER_NAME = "MR_FAEHAÑ";

// 🔒 ANTI-EDIT LOCK SYSTEM
const ORIGINAL_AUTHOR_HASH = "join_v2_2_1_lock_99431";

function verifyAuthor(configAuthor) {
  return configAuthor === OWNER_NAME;
}

module.exports = {
  config: {
    name: "join2",
    aliases: ["adgc", "groups", "mygc"],
    version: "2.2.1",
    role: 2,
    author: OWNER_NAME,
    description: "Group Manager System (List / Out / Add / Ban / Info)",
    category: "admin",
    countDown: 8,
    _lock: ORIGINAL_AUTHOR_HASH
  },

  onStart: async function ({ api, event, message, commandName }) {

    if (!verifyAuthor(module.exports.config.author) ||
        module.exports.config._lock !== ORIGINAL_AUTHOR_HASH) {
      return message.reply("⛔ 𝐁𝐎𝐓 𝐒𝐓𝐎𝐏𝐏𝐄𝐃\n⚠️ 𝐀𝐔𝐓𝐇𝐎𝐑 𝐌𝐎𝐃𝐈𝐅𝐈𝐄𝐃");
    }

    try {
      const list = await api.getThreadList(100, null, ["INBOX"]);
      const groups = list.filter(g => g.isGroup && g.isSubscribed);

      if (!groups.length)
        return message.reply("⚠️ 𝐍𝐎 𝐆𝐑𝐎𝐔𝐏 𝐅𝐎𝐔𝐍𝐃");

      let msg =
`╔═════════════════════╗
               🌐 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓
╚═════════════════════╝\n\n`;

      let groupIDs = [];

      // 🔢 Stylish Number Function
      const fancyNum = (n) => {
        const map = ['𝟬','𝟭','𝟮','𝟯','𝟰','𝟱','𝟲','𝟳','𝟴','𝟵'];
        return String(n).split('').map(d => map[+d]).join('');
      };

      groups.forEach((g, i) => {
        msg +=
`╭─〔 ${fancyNum(i + 1)} 〕
│ 📌 𝐍𝐀𝐌𝐄: ${g.name || "𝐍𝐎 𝐍𝐀𝐌𝐄"}
│ 👥 𝐌𝐄𝐌𝐁𝐄𝐑𝐒: ${g.participantIDs?.length || 0}
│ 🆔 𝐈𝐃: ${g.threadID}
╰──────────────\n\n`;

        groupIDs.push(g.threadID);
      });

      msg +=
`╔═════════════════════╗
           🎮 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 𝐏𝐀𝐍𝐄𝐋
╚═════════════════════╝

🟢 𝐎𝐔𝐓 <𝐍𝐎> → 𝐋𝐄𝐀𝐕𝐄 𝐆𝐑𝐎𝐔𝐏
➕ 𝐀𝐃𝐃 <𝐍𝐎> → 𝐉𝐎𝐈𝐍 𝐆𝐑𝐎𝐔𝐏
⛔ 𝐁𝐀𝐍 <𝐍𝐎> → 𝐁𝐀𝐍 𝐆𝐑𝐎𝐔𝐏
📋 𝐈𝐍𝐅𝐎 <𝐍𝐎>→ 𝐆𝐑𝐎𝐔𝐏 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
╚═════════════════════╝`;

      return message.reply(msg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName,
          author: event.senderID,
          groupIDs
        });
      });

    } catch (e) {
      return message.reply("❌ 𝐄𝐑𝐑𝐎𝐑 𝐋𝐎𝐀𝐃𝐈𝐍𝐆 𝐆𝐑𝐎𝐔𝐏𝐒");
    }
  },

  onReply: async function ({ api, event, Reply, message, threadsData }) {
    const { author, groupIDs } = Reply;

    if (event.senderID !== author) return;

    const args = (event.body || "").split(" ");
    const action = args[0]?.toLowerCase();
    const index = parseInt(args[1]) - 1;

    if (!groupIDs[index])
      return message.reply("⚠️ 𝐈𝐍𝐕𝐀𝐋𝐈𝐃 𝐍𝐔𝐌𝐁𝐄𝐑");

    const tid = groupIDs[index];
    const botID = api.getCurrentUserID();

    // OUT
    if (action === "out") {
      try {
        await api.removeUserFromGroup(botID, tid);
        return message.reply(`✅ 𝐁𝐎𝐓 𝐋𝐄𝐅𝐓 𝐆𝐑𝐎𝐔𝐏\n🆔 ${tid}`);
      } catch {
        return message.reply("❌ 𝐂𝐀𝐍𝐍𝐎𝐓 𝐋𝐄𝐀𝐕𝐄 (𝐍𝐄𝐄𝐃 𝐀𝐃𝐌𝐈𝐍)");
      }
    }

    // ADD
    if (action === "add") {
      try {
        await api.addUserToGroup(event.senderID, tid);

        const userName = (await api.getUserInfo(event.senderID))[event.senderID].name;

        await api.sendMessage(
{
  body:
`╔══════ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ══════╗
👤 𝐔𝐒𝐄𝐑: ${userName}
💬 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐓𝐇𝐄 𝐆𝐑𝐎𝐔𝐏
🎉 𝐄𝐍𝐉𝐎𝐘 𝐘𝐎𝐔𝐑 𝐒𝐓𝐀𝐘
╚════════════════════╝`,
  mentions: [
    {
      tag: userName,
      id: event.senderID
    }
  ]
},
          tid
        );

        return message.reply(`✅ 𝐀𝐃𝐃𝐄𝐃 𝐓𝐎 𝐆𝐑𝐎𝐔𝐏\n🆔 ${tid}`);
      } catch {
        return message.reply("❌ 𝐀𝐃𝐃 𝐅𝐀𝐈𝐋𝐄𝐃 (𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍 𝐍𝐄𝐄𝐃𝐄𝐃)");
      }
    }

    // BAN
    if (action === "ban") {
      try {
        const data = await threadsData.get(tid) || {};
        data.data = { ...(data.data || {}), banned: true };

        await threadsData.set(tid, data.data, "data");
        await api.removeUserFromGroup(botID, tid);

        return message.reply(`⛔ 𝐆𝐑𝐎𝐔𝐏 𝐁𝐀𝐍𝐍𝐄𝐃\n🆔 ${tid}`);
      } catch {
        return message.reply("❌ 𝐁𝐀𝐍 𝐅𝐀𝐈𝐋𝐄𝐃");
      }
    }

    // INFO
    if (action === "info") {
      try {
        const info = await api.getThreadInfo(tid);

        return message.reply(
`╔══════ 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎 ══════╗
📌 𝐍𝐀𝐌𝐄: ${info.threadName}
👥 𝐌𝐄𝐌𝐁𝐄𝐑𝐒: ${info.participantIDs.length}
💬 𝐌𝐄𝐒𝐒𝐀𝐆𝐄𝐒: ${info.messageCount || 0}
🆔 𝐈𝐃: ${tid}
╚════════════════════╝`
        );
      } catch {
        return message.reply("❌ 𝐈𝐍𝐅𝐎 𝐅𝐀𝐈𝐋𝐄𝐃");
      }
    }
  }
};
