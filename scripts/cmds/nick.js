const AUTHOR_LOCK = "MR_FARHAN";

module.exports = {
config: {
name: "nick",
aliases: ["nickname", "setnick", "name"],
version: "1.0",
author: AUTHOR_LOCK, // 🔒 LOCKED AUTHOR
countDown: 3,
role: 1, // 1 = গ্রুপ এডমিন/বট এডমিন
description: "Reply করে ইউজারের নিকনেম চেঞ্জ করো",
category: "group",
guide: {
en: "{pn} <নতুন নিকনেম> - রিপ্লাই দিয়ে ইউজ করো\n{pn} remove - নিকনেম রিমুভ করতে"
}
},

onStart: async function ({ api, event, args }) {
const { threadID, messageID, messageReply } = event;

// 🔒 AUTHOR CHECK (FILE EDIT PROTECTION)
if (module.exports.config.author !== AUTHOR_LOCK) {
return api.sendMessage("❌ এই কমান্ড ডিলিট/এডিট করা হয়েছে, কাজ করছে না", threadID, messageID);
}

// রিপ্লাই চেক
if (!messageReply) {
return api.sendMessage("❌ যার নিকনেম চেঞ্জ করবা তার মেসেজে রিপ্লাই দাও\n\nউদাহরণ: {p}nick সিজুকা_বট", threadID, messageID);
}

const targetID = messageReply.senderID;
const newNick = args.join(" ");

try {
const threadInfo = await api.getThreadInfo(threadID);
const botID = api.getCurrentUserID();
const botIsAdmin = threadInfo.adminIDs.some(item => item.id == botID);

if (!botIsAdmin) {
return api.sendMessage("❌ বটকে এডমিন দাও, নাহলে নিকনেম চেঞ্জ করতে পারবো না", threadID, messageID);
}

if (targetID == botID) {
return api.sendMessage("❌ আমার নিজের নিকনেম চেঞ্জ করতে পারবো না", threadID, messageID);
}

// নিকনেম রিমুভ
if (args[0]?.toLowerCase() === "remove" || args[0]?.toLowerCase() === "rmv") {
await api.changeNickname("", threadID, targetID);
return api.sendMessage(`✅ নিকনেম রিমুভ করে দিলাম`, threadID, messageID);
}

// নিকনেম খালি কিনা চেক
if (!newNick) {
return api.sendMessage("❌ নতুন নিকনেম লিখো\n\nউদাহরণ: {p}nick সিজুকা_বট", threadID, messageID);
}

// 50 ক্যারেক্টারের বেশি হলে
if (newNick.length > 50) {
return api.sendMessage("❌ নিকনেম 50 ক্যারেক্টারের বেশি হতে পারবে না", threadID, messageID);
}

// নিকনেম চেঞ্জ
await api.changeNickname(newNick, threadID, targetID);

const userInfo = await api.getUserInfo(targetID);
const name = userInfo[targetID].name;

return api.sendMessage(
`✅ ${name} এর নিকনেম চেঞ্জ করে দিলাম\n\n👑 নতুন নিকনেম: ${newNick}`,
threadID,
messageID
);

} catch (error) {
console.error("Nick change error:", error);
return api.sendMessage("❌ নিকনেম চেঞ্জ করতে পারলাম না। হয়তো বট এডমিন না অথবা ওই ইউজার গ্রুপ এডমিন", threadID, messageID);
}
}
};
