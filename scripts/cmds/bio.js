module.exports.config = {
  name: "bio",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MR_FARHAN",
  description: "Change bot's bio",
  commandCategory: "admin",
  usages: "bio [text]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const text = args.join(" ");

  if (!text) {
    return api.sendMessage("⚠️ অনুগ্রহ করে কিছু টেক্সট লিখুন!", event.threadID, event.messageID);
  }

  api.changeBio(text, (err) => {
    if (err) {
      return api.sendMessage(
        "❌ বায়ো পরিবর্তন করতে সমস্যা হয়েছে: " + err,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      "😕 আইডির বায়ো পরিবর্তন করা হয়েছে 👇:\n" + text,
      event.threadID,
      event.messageID
    );
  });
};
