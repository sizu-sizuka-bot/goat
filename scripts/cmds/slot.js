module.exports = {
  config: {
    name: "slot",
    version: "6.2",
    author: "FARHAN-KHAN",
    role: 0,
    category: "game",
    shortDescription: "🎰 Professional Slot Machine"
  },

  onStart: async function ({ message, event, args, usersData, threadsData }) {
    const { senderID, threadID } = event;

    if (!global.slotCooldown) global.slotCooldown = {};
    if (global.slotCooldown[senderID] && Date.now() - global.slotCooldown[senderID] < 3000) {
      return message.reply("⏳ | Please wait 3 seconds before spinning again!");
    }
    global.slotCooldown[senderID] = Date.now();

    let input = args[0];
    if (!input) return message.reply("❌ | Enter bet amount!");

    let bet = 0;
    input = input.toLowerCase();

    if (input.endsWith("k")) bet = parseFloat(input) * 1000;
    else if (input.endsWith("m")) bet = parseFloat(input) * 1000000;
    else bet = parseFloat(input);

    if (isNaN(bet) || bet < 300)
      return message.reply("❌ | Minimum bet is 300!");

    if (bet > 300000000)
      return message.reply("❌ | Maximum bet is 300M!");

    let userData = await usersData.get(senderID);
    if (!userData || bet > userData.money)
      return message.reply("❌ | Not enough balance!");

    let slotData = await threadsData.get(threadID, "data.slotData") || {};

    if (!slotData[senderID]) {
      slotData[senderID] = { spins: 40, lastReset: Date.now() };
    }

    if (Date.now() - slotData[senderID].lastReset > 3600000) {
      slotData[senderID] = { spins: 40, lastReset: Date.now() };
    }

    if (slotData[senderID].spins <= 0)
      return message.reply("⏳ | No spins left! Try again later.");

    slotData[senderID].spins--;

    const icons = ["🍊","🍉","💚","💛","💜","❤️","💎","🍇","🍒"];
    const roll = () => icons[Math.floor(Math.random() * icons.length)];

    const s1 = roll();
    const s2 = roll();
    const s3 = roll();
    const s4 = roll();
    const s5 = roll();

    const chance = Math.random();

    let win = 0;
    let resultText = "";
    let bonusText = "";

    if (chance < 0.10) {
      win = bet * (10 + Math.random() * 5);
      resultText = "💎 JACKPOT 💎";
      bonusText = "Ultimate 5 match!";
    } 
    else if (chance < 0.30) {
      win = bet * (5 + Math.random() * 2);
      resultText = "🎉 BIG WIN 🎉";
      bonusText = "4 icons matched!";
    } 
    else if (chance < 0.55) {
      win = bet * (2 + Math.random());
      resultText = "🔥 GOOD WIN 🔥";
      bonusText = "Nice hit!";
    } 
    else if (chance < 0.70) {
      win = bet * (1.2 + Math.random() * 0.5);
      resultText = "🙂 SMALL WIN";
      bonusText = "Lucky spin!";
    } 
    else {
      win = -bet;
      resultText = "😢 YOU LOST";
      bonusText = "Better luck next time!";
    }

    win = Math.floor(win);

    const newBalance = userData.money + win;

    await usersData.set(senderID, {
      money: newBalance,
      data: userData.data
    });

    await threadsData.set(threadID, slotData, "data.slotData");

    const format = (n) => {
      if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
      if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
      return n;
    };

    let msg =
`╔════════════════════╗
   🔰♻️ 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄 ♻️🔰
╚════════════════════╝

❰ ${s1} ┃ ${s2} ┃ ${s3} ┃ ${s4} ┃ ${s5} ❱

━━━━━━━━━━━━━━━━━━
🎯 𝐑𝐄𝐒𝐔𝐋𝐓 ➤ ${resultText}

${win > 0 
? `🟢 𝐖𝐈𝐍 ➤ 💵 $${format(win)}`
: `🔴 𝐋𝐎𝐒𝐒 ➤ 💵 $${format(-win)}`
}

💰 𝐁𝐀𝐋𝐀𝐍𝐂𝐄 ➤ $${format(newBalance)}

💡 ${bonusText}
🎲 𝐒𝐏𝐈𝐍𝐒 ➤ ${slotData[senderID].spins}/40
━━━━━━━━━━━━━━━━━━`;

    return message.reply(msg);
  }
};
