const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "vip",
    version: "1.1.0",
    role: 2, // AdminBot
    author: "rX",
    description: "Manage VIP mode & VIP users",
    category: "admin",
    guide: "{pn} [on|off|add|remove|list]"
};

module.exports.onStart = async function ({ api, event, args }) {

    const basePath = path.join(__dirname, "rx");
    const vipFile = path.join(basePath, "vip.json");
    const modeFile = path.join(basePath, "vipMode.json");

    // ===== Ensure folder/files =====
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });
    if (!fs.existsSync(vipFile)) fs.writeFileSync(vipFile, "[]");
    if (!fs.existsSync(modeFile)) fs.writeFileSync(modeFile, JSON.stringify({ vipMode: false }, null, 2));

    // ===== Load Data =====
    const vipList = JSON.parse(fs.readFileSync(vipFile));
    let vipMode = JSON.parse(fs.readFileSync(modeFile)).vipMode;

    const saveVIP = (data) => fs.writeFileSync(vipFile, JSON.stringify(data, null, 2));
    const saveMode = (mode) => fs.writeFileSync(modeFile, JSON.stringify({ vipMode: mode }, null, 2));

    const sub = args[0]?.toLowerCase();

    let targetID = args[1];
    if (!targetID && event.messageReply) targetID = event.messageReply.senderID;

    if (!sub) {
        return api.sendMessage("⚙️ Usage:\nvip on/off/add/remove/list", event.threadID);
    }

    // ===== COMMANDS =====
    switch (sub) {

        case "on":
            saveMode(true);
            return api.sendMessage("🎀 | VIP Mode ON\nOnly VIP users can use commands.", event.threadID);

        case "off":
            saveMode(false);
            return api.sendMessage("🎀 | VIP Mode OFF\nEveryone can use commands.", event.threadID);

        case "add":
            if (!targetID)
                return api.sendMessage("❌ | Reply or give UID.", event.threadID);

            if (vipList.includes(targetID))
                return api.sendMessage("⚠️ | Already VIP.", event.threadID);

            vipList.push(targetID);
            saveVIP(vipList);

            return api.sendMessage(`✅ | Added to VIP:\n${targetID}`, event.threadID);

        case "remove":
            if (!targetID)
                return api.sendMessage("❌ | Reply or give UID.", event.threadID);

            if (!vipList.includes(targetID))
                return api.sendMessage("⚠️ | Not in VIP list.", event.threadID);

            const newList = vipList.filter(id => id != targetID);
            saveVIP(newList);

            return api.sendMessage(`✅ | Removed from VIP:\n${targetID}`, event.threadID);

        case "list":
            if (vipList.length === 0)
                return api.sendMessage("📭 | VIP list is empty.", event.threadID);

            return api.sendMessage(
                "📋 VIP Users:\n" + vipList.join("\n"),
                event.threadID
            );

        default:
            return api.sendMessage("❌ Invalid option.", event.threadID);
    }
};
