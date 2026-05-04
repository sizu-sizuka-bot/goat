module.exports = {
  config: {
    name: "join",
    aliases: ["addgc"],
    version: "1.6.1",
    role: 0,
    author: "MR_FARHAN",
    description: "Manage all groups: List, Leave, or Add yourself to any group.",
    category: "admin",
    guide: {
      en: "{pn}",
      bn: "{pn}"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, message, commandName }) {
    try {
      await api.getThreadList(25, null, ["INBOX"], (err, list) => {
        if (err)
          return message.reply("❌ 𝐆𝐫𝐨𝐮𝐩 𝐋𝐢𝐬𝐭 𝐅𝐞𝐭𝐜𝐡 𝐅𝐚𝐢𝐥𝐞𝐝");

        const groups = list.filter(g => g.isGroup && g.isSubscribed);

        if (!groups.length)
          return message.reply("⚠️ 𝐍𝐨 𝐆𝐫𝐨𝐮𝐩 𝐅𝐨𝐮𝐧𝐝");

        const stylishNumber = [
          "𝟏","𝟐","𝟑","𝟒","𝟓",
          "𝟔","𝟕","𝟖","𝟗","𝟏𝟎",
          "𝟏𝟏","𝟏𝟐","𝟏𝟑","𝟏𝟒","𝟏𝟓",
          "𝟏𝟔","𝟏𝟕","𝟏𝟖","𝟏𝟗","𝟐𝟎",
          "𝟐𝟏","𝟐𝟐","𝟐𝟑","𝟐𝟒","𝟐𝟓"
        ];

        let msg =
`╔════════════════════╗
              🌐 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓
╚════════════════════╝\n\n`;

        let groupIDs = [];

        groups.forEach((group, index) => {
          const name = group.name || "নাম নেই";
          const members = group.participantIDs
            ? group.participantIDs.length
            : 0;

          msg +=
`╭─〔 ${stylishNumber[index] || index + 1} 〕
│ 📌 𝐍𝐚𝐦𝐞: ${name}
│ 👥 𝐌𝐞𝐦𝐛𝐞𝐫𝐬: ${members}
│ 🆔 𝐈𝐃: ${group.threadID}
╰──────────────\n\n`;

          groupIDs.push(group.threadID);
        });

        msg +=
`╔════════════════════╗
          🎮 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 𝐏𝐀𝐍𝐄𝐋
╚════════════════════╝

➤ 🟢 𝐨𝐮𝐭 <number> → 𝐋𝐞𝐚𝐯𝐞 𝐆𝐫𝐨𝐮𝐩
➤ ➕ 𝐚𝐝𝐝 <number> → 𝐉𝐨𝐢𝐧 𝐆𝐫𝐨𝐮𝐩
➤ ⛔ 𝐛𝐚𝐧 <number> → 𝐁𝐚𝐧 𝐆𝐫𝐨𝐮𝐩

╚════════════════════╝`;

        return message.reply(msg, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            groupIDs
          });
        });
      });
    } catch (e) {
      return message.reply("❌ 𝐄𝐫𝐫𝐨𝐫 𝐎𝐜𝐜𝐮𝐫𝐫𝐞𝐝");
    }
  },

  onReply: async function ({ api, event, Reply, message, threadsData }) {
    const { author, groupIDs } = Reply;
    if (event.senderID != author) return;

    const input = event.body.split(" ");
    const action = input[0].toLowerCase();
    const index = parseInt(input[1]) - 1;
    const targetID = groupIDs[index];

    if (!targetID || isNaN(index))
      return message.reply("⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐍𝐮𝐦𝐛𝐞𝐫");

    // OUT
    if (action === "out") {
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);
        return message.reply(`✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐋𝐞𝐟𝐭 𝐆𝐫𝐨𝐮𝐩:\n🆔 ${targetID}`);
      } catch {
        return message.reply("❌ 𝐂𝐚𝐧𝐧𝐨𝐭 𝐋𝐞𝐚𝐯𝐞 𝐆𝐫𝐨𝐮𝐩");
      }
    }

    // ADD
    if (action === "add") {
      try {
        const userInfo = await api.getUserInfo(author);
        const userName = userInfo[author]?.name || "ইউজার";

        await api.addUserToGroup(author, targetID);

        await api.sendMessage(
`🎉 স্বাগতম ${userName}!

📢 আপনাকে এই গ্রুপে সফলভাবে যুক্ত করা হয়েছে।
👥 এখন আপনি এই গ্রুপের একজন সদস্য।
💬 সক্রিয় থাকুন ও উপভোগ করুন!`,
          targetID
        );

        return message.reply(`✅ ${userName} কে সফলভাবে গ্রুপে যোগ করা হয়েছে:\n🆔 ${targetID}`);
      } catch {
        return message.reply("❌ 𝐆𝐫𝐨𝐮𝐩 𝐀𝐝𝐝 𝐅𝐚𝐢𝐥𝐞𝐝");
      }
    }

    // BAN
    if (action === "ban") {
      try {
        const data = await threadsData.get(targetID);
        if (!data.data) data.data = {};
        data.data.banned = true;

        await threadsData.set(targetID, data.data, "data");
        await api.removeUserFromGroup(api.getCurrentUserID(), targetID);

        return message.reply(`⛔ 𝐆𝐫𝐨𝐮𝐩 𝐁𝐚𝐧𝐧𝐞𝐝:\n🆔 ${targetID}`);
      } catch {
        return message.reply("❌ 𝐁𝐚𝐧 𝐅𝐚𝐢𝐥𝐞𝐝");
      }
    }
  }
};
