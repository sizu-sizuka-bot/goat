module.exports = {
  config: {
    name: "fork",
    version: "3.0.1",
    author: "MR_FARHAN",
    role: 0,
    shortDescription: "Owner info (fb link bottom)",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {

    const ownerText = 
` ⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎    ╭•┄┅══❁♻️❁══┅┄•╮
 •—»✨𝗢𝗪𝗡𝗘𝗥 𝗙𝗢𝗥𝗞✨«—•
‎    ╰•┄┅══❁♻️❁══┅┄•╯
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
‎╔══════════════════╗
‎  👉-এই নাও বস ফারহান এর\nɢɪᴛʜᴜʙ ᴀᴄᴄᴏᴜɴᴛ  লিংক ফলো \nকরে দিও-♻️👇
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
       ‎  ↓𓆩» 𝐆𝐎𝐀𝐓-𝐅𝐎𝐑𝐊 «𓆪↓
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆      
       [>https://github.com/FARHAN-MIRAI-BOT/GOAT<]
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
         ↓𓆩» 𝐌𝐈𝐑𝐀𝐈-𝐅𝐎𝐑𝐊 «𓆪↓
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆      
       [>https://github.com/FARHAN-MIRAI-BOT/SIZUKA<]
╠══════════════════╣`;

    return api.sendMessage(ownerText, event.threadID, event.messageID);
  }
};
