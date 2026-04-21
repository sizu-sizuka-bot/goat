module.exports = {
  config: Object.freeze({
    name: "owner",
    version: "3.0.1",
    author: "MR_FARHAN", // 🔒 locked author
    role: 0,
    shortDescription: "Owner info (fb link bottom)",
    category: "Information",
    guide: {
      en: "owner"
    }
  }),

  onStart: async function ({ api, event }) {

    // 🔒 author lock check (anti edit protection)
    if (module.exports.config.author !== "MR_FARHAN") {
      module.exports.config.author = "MR_FARHAN";
      return api.sendMessage(
        "⚠️ Author lock detected! Config reset করা হয়েছে।",
        event.threadID,
        event.messageID
      );
    }

    const ownerText =
`╔═══❖𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢❖═══╗
 
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆ 
  [🤖]↓:𝐁𝐎𝐓→𝐀𝐃𝐌𝐈𝐍:↓
  ➤ 『 𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍 』
 ‎⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

╠══❖『𝐁𝐈𝐎 𝐀𝐃𝐌𝐈𝐍』❖══╣
 ⊱༅༎😽💚༅༎⊱

-আমি ভদ্র, বেয়াদব দুটোই 🥱✌️  
-তুমি যেটা ডি'জার্ভ করো, আমি সেটাই দেখাবো 🙂  

  ⊱༅༎😽💚༅༎⊱
╠═════════════════╣

[🏠]↓:𝐀𝐃𝐃𝐑𝐄𝐒𝐒:↓
➤ 『 𝐂𝐇𝐔𝐀𝐃𝐀𝐍𝐆𝐀 』

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[🕋]↓:𝐑𝐄𝐋𝐈𝐆𝐈𝐎𝐍:↓
➤ 『 𝐈𝐒𝐋𝐀𝐌 』

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[🚻]↓:𝐆𝐄𝐍𝐃𝐄𝐑:↓
➤ 『 𝐌𝐀𝐋𝐄 』

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[💞]↓:𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍𝐒𝐇𝐈𝐏:↓
➤ 『 𝐒𝐈𝐍𝐆𝐋𝐄 』

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

[🧑‍🔧]↓:𝐖𝐎𝐑𝐊:↓
➤ 『 𝐉𝐎𝐁 』

⋆✦⋆═══🅲🅾🅽🆃🅰🅲🆃═══⋆✦⋆

[🌍] 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 (❶)
➤ https://m.me/Ewr.Farhan.420

[🌍] 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 (❷)
➤ https://www.facebook.com/Ewr.Farhan.420

⋆✦⋆══════════════⋆✦⋆
[📞] ↓:𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣:↓
https://wa.me/+8801934640061

╚═══❖𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨❖═══╝`;

    return api.sendMessage(ownerText, event.threadID, event.messageID);
  }
};
