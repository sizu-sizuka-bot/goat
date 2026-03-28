const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autoazan",
  version: "4.2",
  role: 0,
  author: "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ",
  description: "🕌 Ultra Auto Azan + Random Dua + Single Video System",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  setTimeout(() => {

    // 🕌 নামাজের সময়
    const azanTimes = {
      "05:00:00 AM": "🌅 ফজর নামাজের সময় হয়েছে",
      "01:15:00 PM": "☀️ যোহর নামাজের সময় হয়েছে",
      "04:30:00 PM": "🌤️ আসর নামাজের সময় হয়েছে",
      "06:15:00 PM": "🌇 মাগরিব নামাজের সময় হয়েছে",
      "08:00:00 PM": "🌙 এশা নামাজের সময় হয়েছে"
    };

    // 🤲 দোয়া লিস্ট
    const duas = [
      "🤲 اللّهُمَّ اغْفِرْ لِي وَارْحَمْنِي\nহে আল্লাহ, আমাকে ক্ষমা করুন ও দয়া করুন",
      "🤲 رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন",
      "🤲 اللّهُمَّ اهْدِنِي الصِّرَاطَ الْمُسْتَقِيمَ\nহে আল্লাহ, আমাকে সরল পথে পরিচালিত করুন",
      "🤲 رَبَّنَا تَقَبَّلْ مِنَّا\nহে আমাদের রব, আমাদের আমল কবুল করুন",
      "🤲 اللّهُمَّ ارْزُقْنِي حَلَالًا طَيِّبًا\nহে আল্লাহ, আমাকে হালাল রিযিক দান করুন"
    ];

    // 🎥 Single Video (Updated Link)
    const videoURL = "https://files.catbox.moe/gr8zqw.mp4";

    const AUTHOR = "ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ";

    console.log("✅ Ultra Auto Azan System Running (Updated Video)...");

    const checkAzan = async () => {
      const now = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
      const azanText = azanTimes[now];

      if (azanText) {

        const randomDua = duas[Math.floor(Math.random() * duas.length)];
        const timeNow = moment().tz("Asia/Dhaka").format("hh:mm A");
        const dateNow = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");

        const filePath = path.join(__dirname, "cache", "azan.mp4");

        try {
          // 🎥 Download Video
          const response = await axios({
            url: videoURL,
            method: "GET",
            responseType: "stream"
          });

          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);

          writer.on("finish", async () => {

            const msg =
`◢◤━━━━━━━━━━━━━━━━◥◣
📅>ᴅᴀᴛᴇ: ${dateNow}
🕒>ᴛɪᴍᴇ: ${timeNow}  
${azanText}
━━━━━━━━━━━━━━━━━━

📿 দোয়া:
${randomDua}

━━━━━━━━━━━━━━━━━━
🤖[ʙᴏᴛ ᴏᴡɴᴇʀ:-${AUTHOR}]🤖
🤲(সবাই নামাজ আদায় করুন)🤲
◥◣━━━━━━━━━━━━━━━━◢◤`;

            const allThreads = await api.getThreadList(100, null, ["INBOX"]);
            const groups = allThreads.filter(t => t.isGroup);

            console.log(`🕌 Sending Azan to ${groups.length} groups`);

            for (const thread of groups) {
              await api.sendMessage({
                body: msg,
                attachment: fs.createReadStream(filePath)
              }, thread.threadID);
            }

            // 🧹 Delete Cache File
            fs.unlinkSync(filePath);

            console.log("✅ Azan Sent + Cache Cleared!");
          });

        } catch (err) {
          console.error("❌ Error:", err);
        }
      }
    };

    setInterval(checkAzan, 1000);

  }, 5000);
};

module.exports.onStart = () => {};
