module.exports = {
  config: {
    name: "adminmention",
    version: "20.0.0",
    author: "Farhan-Khan",
    countDown: 0,
    role: 0,
    shortDescription: "Ultra fast caption reply",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    // 🔒 Author lock
    if (this.config.author !== "Farhan-Khan") return;

    const admins = [
      { uid: "61573366160918", names: ["মিৃঁ'স্টাৃঁ'রৃঁ ফাৃঁ'রৃঁ'হা্ঁ'নৃঁ"] },
      { uid: "61583610247347", names: ["ヽ｟ᏟᎬϴ｠▁▁ዐዐዐ 🙁😚☺️👿"] }
    ];

    const senderID = String(event.senderID);
    if (admins.some(a => a.uid === senderID)) return;

    const text = (event.body || "").toLowerCase();
    const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // ⚡ captions only (no video)
    const captions = [
      "Mantion_দিস না _ফারহান বস এর মন মন ভালো নেই আস্কে-!💔🥀",
      "- আমার বস ফারহান এর সাথে কেউ টেক্স করে নাহ🫂💔",
      "👉আমার বস ♻️ 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এখন বিজি আছে । ইনবক্সে মেসেজ দিয়ে রাখো 🔰",
      "বস ফারহান কে এত মেনশন না দিয়ে বক্স আসো 😘",
      "বস ফারহান কে Mantion_দিলে ঠুটের কালার change কইরা দিবো 💋😾",
      "ফারহান বস এখন বিজি, যা বলার আমাকে বলো 😼🥰",
      "ফারহান বস কে এতো মেনশন না দিয়া একটা জি এফ দে 😒",
      "Mantion_না দিয়ে সিরিয়াস প্রেম করতে চাইলে ইনবক্স 😏",
      "বস ফারহান কে মেনশন দিসনা 😑",
      "বাল পাকনা Mantion_দিস না বস ফারহান বিজি 🥵🥀",
      "চুমু খাওয়ার বয়স টা বস চকলেট খেয়ে উড়ায় দিছে 🍫🤗"
    ];

    const mentionNames = mentionedIDs.map(id => `@${id}`).join(", ");

    const caption = `
✿•≫───────────────≪•✿
${mentionNames ? `Reply to: ${mentionNames}\n` : ""}
『 ${captions[Math.floor(Math.random() * captions.length)]} 』
✿•≫───────────────≪•✿
`;

    try {
      // ⚡ super fast reply (no axios, no delay)
      await message.reply({
        body: caption
      });
    } catch (err) {
      console.log("❌ error:", err.message);
    }
  }
};
