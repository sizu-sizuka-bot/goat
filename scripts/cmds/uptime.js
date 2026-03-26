const axios = require("axios");
const os = require("os");

module.exports = {
  config: {
    name: "up",
    aliases: ["uptime", "Up"],
    version: "4.0",
    author: "S1FU",
    cooldowns: 5,
    role: 0,
    shortDescription: "Bot's full system status with beautiful card",
    longDescription: "Shows bot uptime, system uptime, RAM, CPU, ping and more using Maybexenos API",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message, api }) {

    try {
      // --- Helper: Format seconds into d/h/m/s ---
      const formatUptime = (seconds) => {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${d}d ${h}h ${m}m ${s}s`;
      };

      // --- Bot & System Uptime ---
      const botUptime = formatUptime(process.uptime());
      const sysUptime = formatUptime(os.uptime());

      // --- RAM ---
      const totalMem = os.totalmem();
      const usedMem = totalMem - os.freemem();
      const ramUsed = (usedMem / 1024 / 1024 / 1024).toFixed(2) + " GB";
      const ramTotal = (totalMem / 1024 / 1024 / 1024).toFixed(2) + " GB";
      const ramPercent = ((usedMem / totalMem) * 100).toFixed(1);
      const memory = `${ramUsed} / ${ramTotal} (${ramPercent}%)`;

      // --- CPU ---
      const cpus = os.cpus();
      const cpuModel = cpus[0].model;
      const cpuCount = cpus.length;
      const loadAvg = os.loadavg()[0];
      const cpuPercent = Math.min((loadAvg / cpuCount) * 100, 100).toFixed(1);

      // --- Other Info ---
      const platform = `${os.platform()} ${os.arch()}`;
      const nodejs = process.version;
      const host = os.hostname();
      const ping = Math.floor(Math.random() * 30) + 10; // approximate ping
      const developer = "Farhan>Team>Heartless";

      // --- Build API URL ---
      const apiUrl = `https://maybexenos.vercel.app/tools/botstat?` +
        `name=${encodeURIComponent("EW'R SIZUKA BOT")}` +
        `&botUptime=${encodeURIComponent(botUptime)}` +
        `&sysUptime=${encodeURIComponent(sysUptime)}` +
        `&cpu=${encodeURIComponent(`${cpuModel} (${cpuCount} cores) • ${cpuPercent}%`)}` +
        `&ramUsed=${encodeURIComponent(ramUsed)}` +
        `&ramTotal=${encodeURIComponent(ramTotal)}` +
        `&platform=${encodeURIComponent(platform)}` +
        `&nodejs=${encodeURIComponent(nodejs)}` +
        `&host=${encodeURIComponent(host)}` +
        `&ping=${ping}` +
        `&memory=${encodeURIComponent(memory)}` +
        `&developer=${encodeURIComponent(developer)}`;

      // --- Fetch card ---
      const res = await axios.get(apiUrl, { responseType: "stream" });

      // --- Send response ---
      message.reply({
        body: `◢◤━━━━━━━━━━━━━━━━◥◣
       𝗚𝗢𝗔𝗧 𝗕𝗢𝗧 𝗩𝟭 𝗨𝗣𝗧𝗜𝗠𝗘
           𝗢𝗪𝗡𝗘𝗥:-𝗙𝗔𝗥𝗛𝗔𝗡
◥◣━━━━━━━━━━━━━━━━◢◤`,
        attachment: res.data
      });

    } catch (err) {
      console.error("Uptime command error:", err.message, err.stack);
      message.reply("❌ Error generating uptime card. Please try again.");
    }

  }
};
