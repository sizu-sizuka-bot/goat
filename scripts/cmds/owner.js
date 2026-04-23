const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "3.0.0",
    author: "MR_FARHAN",
    role: 0,
    countDown: 10,
    shortDescription: {
      en: "Owner & Bot Info"
    },
    category: "owner"
  },

  onStart: async function ({ message }) {

    // ===== OWNER INFO =====
    const ownerName = "𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍";
    const ownerAge = "𝟐𝟎+";
    const ownerGender = "𝐌𝐀𝐋𝐄";
    const ownerReligion = "𝐈𝐒𝐋𝐀𝐌";
    const ownerAddress = "𝐂𝐇𝐔𝐀𝐃𝐀𝐍𝐆𝐀";
    const ownerRelation = "𝐒𝐈𝐍𝐆𝐋𝐄";
    const ownerWork = "𝐉𝐎𝐁";
    const ownerFB1 = "https://m.me/61560833120754";
    const ownerFB2 = "https://www.facebook.com/61560833120754";
    const ownerWhatsApp = "https://wa.me/+8801934640061";
    const status = "𝐀𝐂𝐓𝐈𝐕𝐄 ✅";

    // ===== BOT INFO =====
    const botName = global.GoatBot?.config?.nickNameBot || "𝐆𝐎𝐀𝐓𝐁𝐎𝐓";
    const prefix = global.GoatBot?.config?.prefix || ".";
    const totalCommands = global.GoatBot?.commands?.size || 0;

    // ===== TIME =====
    const now = moment().tz("Asia/Dhaka");
    const date = now.format("MMMM Do YYYY");
    const time = now.format("hh:mm:ss A");

    // ===== UPTIME =====
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = ${days}𝐝 ${hours}𝐡 ${minutes}𝐦 ${seconds}𝐬;

    // ===== VIDEO DOWNLOAD (TEMP FIX, NO 429) =====
    const videoUrl = "https://files.catbox.moe/rtgdvs.mp4";
    const filePath = path.join(__dirname, "cache", "owner.mp4");

    const writer = fs.createWriteStream(filePath);
    const response = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // ===== MESSAGE =====
    const msg = `
╔═════════════════╗
  🤖「 𝐎𝐖𝐍𝐄𝐑 𝐏𝐀𝐍𝐄𝐋 」🤖
╚═════════════════╝

👑 𝐍𝐀𝐌𝐄     : ${ownerName}
🎂 𝐀𝐆𝐄      : ${ownerAge}
🚻 𝐆𝐄𝐍𝐃𝐄𝐑   : ${ownerGender}
🕋 𝐑𝐄𝐋𝐈𝐆𝐈𝐎𝐍 : ${ownerReligion}
💞 𝐑𝐄𝐋𝐀𝐓𝐈𝐎𝐍 : ${ownerRelation}
🧑‍🔧 𝐖𝐎𝐑𝐊    : ${ownerWork}
🏠 𝐀𝐃𝐃𝐑𝐄𝐒𝐒  : ${ownerAddress}

════════════════════

⚙️ 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄   : ${botName}

🔧 𝐏𝐑𝐄𝐅𝐈𝐗     : 「 ${prefix} 」

📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒   : ${totalCommands}

📡 𝐒𝐓𝐀𝐓𝐔𝐒     : ${status}

════════════════════
📅 𝐃𝐀𝐓𝐄  : ${date}
🕒 𝐓𝐈𝐌𝐄  : ${time}
⏳ 𝐔𝐏𝐓𝐈𝐌𝐄: ${uptimeString}
════════════════════

🌐 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 (𝟏)
${ownerFB1}

🌐 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 (𝟐)
${ownerFB2}

📞 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏
${ownerWhatsApp}

╚════❖𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨❖════╝`,

    return message.reply({
      body: msg,
      attachment: fs.createReadStream(filePath)
    });
  }
};
