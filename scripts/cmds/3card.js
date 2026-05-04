module.exports.config = {
  name: "3card",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MR_FARHAN",
  description: "3 Card Game for groups with betting (with card images)",
  commandCategory: "Game",
  usages: "[create/join/start/leave/info]",
  cooldowns: 1
};

const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
const suits = ["spades","hearts","diamonds","clubs"];

const deck = [];

// build deck
for (let i = 0; i < values.length; i++) {
  for (let x = 0; x < suits.length; x++) {
    let weight = parseInt(values[i]);
    if (["J","Q","K"].includes(values[i])) weight = 10;
    else if (values[i] === "A") weight = 11;

    deck.push({
      Value: values[i],
      Suit: suits[x],
      Weight: weight,
      Icon: suits[x] === "spades" ? "♠️" :
            suits[x] === "hearts" ? "♥️" :
            suits[x] === "diamonds" ? "♦️" : "♣️"
    });
  }
}

// shuffle deck
function createDeck() {
  const d = [...deck];
  for (let i = 0; i < 1000; i++) {
    const a = Math.floor(Math.random() * d.length);
    const b = Math.floor(Math.random() * d.length);
    [d[a], d[b]] = [d[b], d[a]];
  }
  return d;
}

// card image link
function getCardLink(Value, Suit) {
  return `https://raw.githubusercontent.com/ntkhang03/poker-cards/main/cards/${
    Value === "J" ? "jack" :
    Value === "Q" ? "queen" :
    Value === "K" ? "king" :
    Value === "A" ? "ace" : Value
  }_of_${Suit}.png`;
}

// draw cards
async function drawCard(cards) {
  const Canvas = require("canvas");
  const canvas = Canvas.createCanvas(500 * cards.length, 726);
  const ctx = canvas.getContext("2d");

  let x = 0;
  for (const c of cards) {
    const img = await Canvas.loadImage(c);
    ctx.drawImage(img, x, 0);
    x += 500;
  }
  return canvas.toBuffer();
}

// event handler
module.exports.handleEvent = async ({ api, event, Users, Currencies }) => {
  const fs = require("fs-extra");
  const { senderID, threadID, body, messageID } = event;

  if (!body) return;
  if (!global.moduleData.threecards) global.moduleData.threecards = new Map();
  if (!global.moduleData.threecards.has(threadID)) return;

  const game = global.moduleData.threecards.get(threadID);
  if (game.start !== 1) return;

  const deckShuffled = game.deckShuffled;

  // DEAL
  if (body.toLowerCase().startsWith("deal cards")) {
    if (game.dealt === 1) return;

    for (const p of game.player) {
      const c1 = deckShuffled.shift();
      const c2 = deckShuffled.shift();
      const c3 = deckShuffled.shift();

      let total = c1.Weight + c2.Weight + c3.Weight;
      if (total >= 20) total -= 20;
      if (total >= 10) total -= 10;

      p.card1 = c1;
      p.card2 = c2;
      p.card3 = c3;
      p.total = total;

      const imgs = [
        getCardLink(c1.Value,c1.Suit),
        getCardLink(c2.Value,c2.Suit),
        getCardLink(c3.Value,c3.Suit)
      ];

      const path = __dirname + `/cache/${p.id}.png`;
      fs.writeFileSync(path, await drawCard(imgs));

      api.sendMessage({
        body: `Your Cards: ${c1.Value}${c1.Icon} | ${c2.Value}${c2.Icon} | ${c3.Value}${c3.Icon}\nTotal: ${total}`,
        attachment: fs.createReadStream(path)
      }, p.id, () => fs.unlinkSync(path));
    }

    game.dealt = 1;
    global.moduleData.threecards.set(threadID, game);
    return api.sendMessage("Cards dealt! You can swap cards 2 times.", threadID);
  }

  // SWAP
  if (body.toLowerCase().startsWith("swap card")) {
    const player = game.player.find(p => p.id === senderID);
    if (!player) return;
    if (player.swaps <= 0) return api.sendMessage("No swap left!", threadID, messageID);

    const keys = ["card1","card2","card3"];
    player[keys[Math.floor(Math.random()*3)]] = deckShuffled.shift();

    let t = player.card1.Weight + player.card2.Weight + player.card3.Weight;
    if (t >= 20) t -= 20;
    if (t >= 10) t -= 10;

    player.total = t;
    player.swaps--;

    return api.sendMessage(`Swapped! New total: ${t}`, threadID);
  }

  // READY
  if (body.toLowerCase() === "ready") {
    const p = game.player.find(x => x.id === senderID);
    if (!p || p.ready) return;

    p.ready = true;
    game.ready++;

    if (game.ready === game.player.length) {
      game.player.sort((a,b)=>b.total-a.total);

      let msg = [];
      for (let i=0;i<game.player.length;i++) {
        const name = await Users.getNameUser(game.player[i].id);
        msg.push(`${i+1}. ${name} => ${game.player[i].total}`);
      }

      await Currencies.increaseMoney(game.player[0].id, game.betAmount * game.player.length);

      global.moduleData.threecards.delete(threadID);
      return api.sendMessage("RESULT:\n\n"+msg.join("\n"), threadID);
    }

    return api.sendMessage(`${p.id} is ready.`, threadID);
  }
};

// command
module.exports.run = async ({ api, event, args, Currencies }) => {
  const { senderID, threadID, messageID } = event;

  if (!global.moduleData.threecards) global.moduleData.threecards = new Map();
  const game = global.moduleData.threecards.get(threadID);

  switch(args[0]) {

    case "create": {
      const bet = Number(args[1]);
      if (!bet || bet < 1) return api.sendMessage("Invalid bet", threadID);

      await Currencies.decreaseMoney(senderID, bet);

      global.moduleData.threecards.set(threadID, {
        author: senderID,
        start: 0,
        dealt: 0,
        ready: 0,
        betAmount: bet,
        player: [{ id: senderID, swaps: 2, ready: false }]
      });

      return api.sendMessage(`Game created with ${bet}$ bet`, threadID);
    }

    case "join": {
      if (!game) return api.sendMessage("No game found", threadID);

      if (game.player.find(p=>p.id===senderID))
        return api.sendMessage("Already joined", threadID);

      game.player.push({ id: senderID, swaps: 2, ready: false });
      await Currencies.decreaseMoney(senderID, game.betAmount);

      return api.sendMessage("Joined game", threadID);
    }

    case "start": {
      if (!game || game.author !== senderID)
        return api.sendMessage("Only host can start", threadID);

      game.deckShuffled = createDeck();
      game.start = 1;

      return api.sendMessage("Game started!", threadID);
    }

    case "leave": {
      if (!game) return;
      game.player = game.player.filter(p=>p.id!==senderID);
      return api.sendMessage("Left game", threadID);
    }

    case "info": {
      if (!game) return;
      return api.sendMessage(`Players: ${game.player.length}\nBet: ${game.betAmount}`, threadID);
    }
  }
};
