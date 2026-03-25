const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");

if (global.prayerTimerRunning) return;
global.prayerTimerRunning = true;

module.exports.config = {
  name: "prayerTimer",
  version: "14.0",
  role: 0,
  author: "Farhan Khan + Upgrade",
  description: "🕌 Ultra Prayer Timer v14 (No Miss + Smart Retry + Full Stable)",
  category: "AutoTime",
  countDown: 5,
};

module.exports.onLoad = async function ({ api }) {

  setTimeout(async () => {

    let prayerTimes = {};
    let triggered = new Set();
    let lastUpdateDate = "";

    const azanPath = __dirname + "/cache/azan.mp4";
    const backupPath = __dirname + "/cache/prayer.json";

    console.log("🕌 Prayer Timer v14 Running...");

    // ✅ Save Backup
    const saveBackup = () => {
      fs.writeFileSync(backupPath, JSON.stringify(prayerTimes, null, 2));
    };

    // ✅ Load Backup
    const loadBackup = () => {
      try {
        if (fs.existsSync(backupPath)) {
          prayerTimes = JSON.parse(fs.readFileSync(backupPath, "utf8"));
          lastUpdateDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
          console.log("📦 Backup Loaded");
        }
      } catch {
        console.log("⚠️ Backup Failed");
      }
    };

    // ✅ Load API
    const loadPrayerTimes = async () => {
      try {
        const today = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
        if (lastUpdateDate === today) return;

        const res = await axios.get(
          "https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=2"
        );

        const data = res.data.data.timings;

        prayerTimes = {
          Fajr: data.Fajr.slice(0, 5),
          Dhuhr: data.Dhuhr.slice(0, 5),
          Asr: data.Asr.slice(0, 5),
          Maghrib: data.Maghrib.slice(0, 5),
          Isha: data.Isha.slice(0, 5)
        };

        triggered.clear();
        lastUpdateDate = today;
        saveBackup();

        console.log("✅ Prayer times updated");

      } catch (err) {
        console.error("❌ API Failed → Using Backup");
        loadBackup();
      }
    };

    // ✅ Azan Download
    const prepareAzan = async () => {
      try {
        if (!fs.existsSync(azanPath)) {
          console.log("⬇️ Downloading Azan...");
          const res = await axios({
            url: "https://files.catbox.moe/uf11xf.mp4",
            method: "GET",
            responseType: "stream"
          });

          const writer = fs.createWriteStream(azanPath);
          res.data.pipe(writer);

          await new Promise(resolve => writer.on("finish", resolve));

          console.log("✅ Azan Ready");
        }
      } catch {
        console.log("⚠️ Azan download failed");
      }
    };

    await loadPrayerTimes();
    await prepareAzan();

    const prayerText = {
      Fajr: "🕌 ফজরের নামাজের সময় হয়েছে",
      Dhuhr: "🕌 যোহরের নামাজের সময় হয়েছে",
      Asr: "🕌 আসরের নামাজের সময় হয়েছে",
      Maghrib: "🕌 মাগরিবের নামাজের সময় হয়েছে",
      Isha: "🕌 এশার নামাজের সময় হয়েছে"
    };

    // ✅ Get ALL Groups (No Limit)
    const getAllGroups = async () => {
      let allThreads = [];
      let i = 0;

      while (true) {
        const list = await api.getThreadList(100, i * 100, ["INBOX"]);
        if (!list.length) break;
        allThreads.push(...list);
        i++;
      }

      return allThreads.filter(t => t.isGroup);
    };

    // ✅ Check Prayer
    const checkPrayer = async () => {

      const now = moment().tz("Asia/Dhaka");
      const current = now.format("HH:mm");
      const today = now.format("DD-MM-YYYY");

      if (today !== lastUpdateDate) {
        await loadPrayerTimes();
      }

      for (const [name, time] of Object.entries(prayerTimes)) {

        const prayerMoment = moment.tz(`${today} ${time}`, "DD-MM-YYYY HH:mm", "Asia/Dhaka");
        const diff = Math.abs(now.diff(prayerMoment, "minutes"));

        if (diff <= 1 && !triggered.has(name)) {

          triggered.add(name);

          const finalMsg = `📿 সবাই নামাজ আদায় করুন 🤲
━━━━━━━━━━━━━━━━━━
${prayerText[name]}
🕒 সময়: ${now.format("hh:mm A")}
📅 তারিখ: ${today}
🤖 ʙᴏᴛ-ᴏᴡɴᴇʀ:-ꜰᴀʀʜᴀɴ-ᴋʜᴀɴ
━━━━━━━━━━━━━━━━━━`;

          try {
            const groups = await getAllGroups();

            console.log(`🕌 ${name} → ${groups.length} groups`);

            for (const thread of groups) {
              await api.sendMessage({
                body: finalMsg,
                attachment: fs.existsSync(azanPath)
                  ? fs.createReadStream(azanPath)
                  : null
              }, thread.threadID);
            }

            console.log(`✅ ${name} sent`);

          } catch (err) {
            console.error("❌ Send Error:", err);
          }
        }
      }
    };

    // ✅ Smart Interval (Stable)
    setInterval(checkPrayer, 20000);

  }, 5000);
};

module.exports.onStart = () => {};
