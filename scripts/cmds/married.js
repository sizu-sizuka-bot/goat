const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "married",
    aliases: ["marry"],
    version: "1.1",
    author: "Farhan-Khan",
    countDown: 5,
    role: 0,
    shortDescription: "get a wife",
    longDescription: "",
    category: "marry",
    guide: "{pn} @mention OR reply to someone"
  },

  onStart: async function ({ message, event, args }) {

    let one, two;

    // Reply system
    if (event.type === "message_reply") {
      one = event.senderID;
      two = event.messageReply.senderID;
    }

    // Mention system
    else if (Object.keys(event.mentions).length > 0) {
      const mention = Object.keys(event.mentions);

      if (mention.length == 1) {
        one = event.senderID;
        two = mention[0];
      } else {
        one = mention[1];
        two = mention[0];
      }
    }

    // No reply or mention
    else {
      return message.reply("Please mention or reply to someone");
    }

    bal(one, two).then(ptth => {
      message.reply({
        body: "「 i love you babe🥰❤️ 」",
        attachment: fs.createReadStream(ptth)
      });
    });

  }
};

async function bal(one, two) {

  let avone = await jimp.read(
    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
  );

  avone.circle();

  let avtwo = await jimp.read(
    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
  );

  avtwo.circle();

  let pth = "abcd.png";

  let img = await jimp.read("https://i.imgur.com/qyn1vO1.jpg");

  img
    .resize(432, 280)
    .composite(avone.resize(60, 60), 189, 15)
    .composite(avtwo.resize(60, 60), 122, 25);

  await img.writeAsync(pth);

  return pth;
}
