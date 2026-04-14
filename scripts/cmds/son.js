const fs = require("fs");
const path = __dirname + "/cache/son.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

// 🔒 AUTHOR LOCK
const AUTHOR = "MR_FARHAN";

module.exports.config = {
  name: "son",
  version: "1.2",
  author: "MR_FARHAN",
  category: "automation",
  role: 0
};

// 🔒 Author Check
function checkAuthor() {
  if (module.exports.config.author !== AUTHOR) {
    throw new Error("❌ Author name changed! Command locked.");
  }
}

module.exports.onStart = async function ({ api, event, args }) {

  checkAuthor();

  const permission = global.GoatBot.config.adminBot || [];

  if (!permission.includes(event.senderID)) {
    return api.sendMessage("❌ | Only bot admin can use this command!", event.threadID, event.messageID);
  }

  let data = JSON.parse(fs.readFileSync(path));

  if (args[0] == "off") {
    delete data[event.threadID];
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ ওকে বস ওর চুদা বন্ধ করা হয়েছে!", event.threadID);
  }

  if (args[0] == "on") {

    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("❌ বস একজনকে মেনশন করুন!", event.threadID);

    // 🔥 REAL NAME FIX (no Users needed)
    let name = event.mentions[mention];

    try {
      const userInfo = await api.getUserInfo(mention);
      name = userInfo[mention]?.name || name;
    } catch (e) {}

    data[event.threadID] = {
      uid: mention,
      name: name,
      index: 0
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    return api.sendMessage({
      body: `✅ ওকে ফারহান বস 𓆩»${name}«𓆪\nএই খানকির পোলা SMS করলেই চুদা ফ্রী`,
      mentions: [{
        id: mention,
        tag: name
      }]
    }, event.threadID);
  }

  return api.sendMessage("ব্যবহার:\nson on @user\nson off", event.threadID);
};

module.exports.onChat = async function ({ api, event }) {

  checkAuthor();

  if (!event.body) return;

  let data = JSON.parse(fs.readFileSync(path));

  if (!data[event.threadID]) return;

  const target = data[event.threadID];

  if (event.senderID != target.uid) return;

  const insults = [
    "খাংকির পোলা, তোর মার ভোদা তে গাধার মাল ফালাবো! 😈",
    "আমার ফারহান বস তোর মা কে চুদে পল্টি মারবো! 😡",
    "তোর মার গুদে ফুল ট্যাবলেট পুশ করবো! 🤡",
    "তোর মার ভোদায় ফারহান বস গাধার মতো মাল ফালিয়ে দিবে!🔥",
    "ফারহান বস তোর মাকে গাধার মতো চুদে বলবো এটা কার মাল? 😂",
    "এই খানকির পোলা বেশ্যার পোলা তোর মাকে চুদে আমার বস ফারহান সারা বেলা,🖕💯",
    "বস ফারহান তোর মার গুদে ইনপুট দিয়ে আউটপুট নেবো! 💀",
    "আম পাতা জোড়া জোড়া তোর মাকে চূদে আমার বস ফারহান উরাধুরা..!🖕💯"
  ];

  let index = target.index;

  api.sendMessage({
    body: `${target.name} ${insults[index % insults.length]}`,
    mentions: [{
      id: target.uid,
      tag: target.name
    }]
  }, event.threadID, event.messageID);

  data[event.threadID].index++;

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
