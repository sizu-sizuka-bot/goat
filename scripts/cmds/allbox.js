const axios = require("axios");

module.exports = {
  config: {
    name: "allgroup",
    aliases: ["allgc", "listgc"],
    version: "6.5.0",
    role: 2, 
    author: "Milon Hasan",
    description: "View Group Name and Member Count with custom wait message.",
    category: "admin",
    usePrefix: false,
    countDown: 5
  },

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔐 [ FILE CREATOR INFORMATION - MILON BOT ]
 * 👤 OWNER    : MILON HASAN (MILON BOSS)
 * 🆔 UID      : 100088210336214
 * 🔗 FACEBOOK : https://www.facebook.com/share/17uGq8qVZ9/
 * 📞 WHATSAPP : +880 1912603270
 * 📍 LOCATION : NARAYANGANJ, BANGLADESH
 * 🛠️ PROJECT  : MILON BOT PROJECT (2026)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  onChat: async function ({ api, event, message, commandName }) {
    if (!event.body) return;
    const body = event.body.toLowerCase().trim();
    if (body === "allgroups" || body === "allgc") {
      return this.onStart({ api, event, message, commandName });
    }
  },

  onStart: async function ({ api, event, message, threadsData }) {
    // --- [ 🛰️ INITIAL WAIT MESSAGE ] ---
    const waitMsg = await message.reply("🔄 SIZUKA BOT: Fetching group list... 🛰️");

    try {
      let threadList = [];
      try {
        // Attempting live fetch from Facebook
        threadList = await api.getThreadList(75, null, ["INBOX"]);
      } catch (e) {
        // Fallback to Database if API is restricted
        const allThreads = await threadsData.getAll();
        threadList = allThreads.filter(t => t.threadID && t.threadID.length > 10);
      }

      let list = threadList.filter(group => (group.isSubscribed && group.isGroup) || group.threadID);
      
      if (list.length === 0) {
        return api.editMessage("⚠️ No active groups found.", waitMsg.messageID);
      }

      let msg = `📊 [ SIZUKA BOT - GROUPS: ${list.length} ]\n${"━".repeat(15)}\n`;
      let groupid = [];
      let i = 1;

      for (const group of list) {
        const name = group.name || group.threadName || "Unnamed Group";
        const members = group.participantIDs ? group.participantIDs.length : "N/A";
        
        // Showing only Name and Member count as requested
        msg += `${i++}. 🏢 ${name}\n👥 Members: ${members}\n${"━".repeat(10)}\n`;
        groupid.push(group.threadID);
      }

      msg += '🎮 Admin Actions:\n👉 Reply "out <num>" to Leave\n👉 Reply "add <num>" to Join\n👉 Reply "ban <num>" to Ban';

      // Remove wait message and send the actual list
      await api.unsendMessage(waitMsg.messageID);
      return message.reply(msg, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          groupid
        });
      });

    } catch (error) {
      console.error(error);
      return api.editMessage("❌ System Error: Could not load group list.", waitMsg.messageID);
    }
  },

  onReply: async function ({ api, event, Reply, message, threadsData }) {
    const { author, groupid } = Reply;
    if (event.senderID != author) return;

    const args = event.body.split(/\s+/);
    const action = args[0].toLowerCase();
    const index = parseInt(args[1]) - 1;
    const targetID = groupid[index];

    if (!targetID || isNaN(index)) return message.reply("❌ Invalid serial number!");

    if (action === "out") {
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);
        return message.reply(`✅ Success: Bot left the group successfully.`);
      } catch (e) { return message.reply("❌ Error: Facebook restriction detected."); }
    }

    if (action === "add") {
      try {
        await api.addUserToGroup(author, targetID);
        return message.reply(`✅ Success: Added you to the group.`);
      } catch (e) { return message.reply("❌ Error: Bot needs admin permission to add."); }
    }

    if (action === "ban") {
      try {
        await threadsData.set(targetID, true, "data.banned");
        await api.sendMessage("🚫 Group Banned by farhan Hasan.", targetID).catch(() => {});
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);
        return message.reply(`✅ Success: Group banned and bot left.`);
      } catch (e) { return message.reply("❌ Database error."); }
    }
  }
};
