const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
	config: {
		name: "married2",
		aliases: ["marry2"],
		version: "2.0",
		author: "Farhan-Khan",
		countDown: 5,
		role: 0,
		shortDescription: "get a wife",
		longDescription: "",
		category: "marry",
		guide: "{pn} @mention OR reply message"
	},

	onStart: async function ({ message, event }) {
		try {
			const mentions = Object.keys(event.mentions || {});
			let one, two;

			// Reply system
			if (event.messageReply) {
				one = event.senderID;
				two = event.messageReply.senderID;
			}

			// Mention system
			else if (mentions.length == 1) {
				one = event.senderID;
				two = mentions[0];
			}

			// Two mention system
			else if (mentions.length >= 2) {
				one = mentions[0];
				two = mentions[1];
			}

			else {
				return message.reply("❌ Please mention or reply to someone");
			}

			const imgPath = await bal(one, two);

			return message.reply({
				body: "「 Love you Babe🥰❤️ 」",
				attachment: fs.createReadStream(imgPath)
			}, () => fs.unlinkSync(imgPath));

		} catch (e) {
			console.log(e);
			return message.reply("❌ Something went wrong");
		}
	}
};

async function bal(one, two) {

	const avone = await jimp.read(
		`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
	);

	const avtwo = await jimp.read(
		`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
	);

	avone.circle();
	avtwo.circle();

	const pth = `marry2_${Date.now()}.png`;

	const img = await jimp.read(
		"https://i.ibb.co/5TwSHpP/Guardian-Place-full-1484178.jpg"
	);

	img.resize(600, 338)
		.composite(avone.resize(75, 75), 262, 0)
		.composite(avtwo.resize(80, 80), 350, 69);

	await img.writeAsync(pth);

	return pth;
}
