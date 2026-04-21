const axios = require("axios");

module.exports = {
	config: {
		name: "couple",
		aliases: ["couplevideo","love video"],
		version: "2.0",
		author: "Rocky Chowdhury",
		countDown: 5,
		role: 0,
		shortDescription: "Random captions with video and owner link",
		longDescription: "Bangla + English captions with direct video and owner contact link",
		category: "𝗙𝗨𝗡",
		guide: "{pn}"
	},

	onStart: async function ({ message, api }) {
		const { messageID } = message;

		// 🔒 AUTHOR LOCK
		if (this.config.author !== "Rocky Chowdhury") {
			return message.reply("⚠️ Author change detected! Command disabled.");
		}

		try {
			api.setMessageReaction("⏳", messageID, () => {}, true);
		} catch {}

		let loadingMsg;
		try {
			loadingMsg = await message.reply("⚡ ᴠɪᴅᴇᴏ ʟᴏᴀᴅɪɴɢ...⚡");
		} catch {}

		// 🔥 Drive Links (Converted)
		const links = [
	"1xLc_9r1TYGVM0J33hJ61hmW3yXOBTcEo",
	"1xFVA97twVhvJJzmxhXjT9QukwWEDRO2a",
	"1xC8J23XORH4zHsXCDkfrgzmVBm1_-b5E",
	"1x5EX0grUJwEKzHyzeR63HnzC_UlDdJD6",
	"1xM82tBosefpCvaDokhufHoikub1Opupz",
	"1xhCqfx7pScogeGph4T4ITnRJFYcUNmJ8",
	"1xTgkjk__QRMOVQnkQsSIcEzGfRUwUDLY",
	"1xRsWDPe485xXPna9nWhj0TaW_Q9lVJDd",
	"1xC30T2eSDWZGr_O8699yxaMS-AZ_X5y8",
	"1xcoHMLkNU1naPET4bP2sEiHoXUF23w-R",
	"1xcN88lPjPoRJhdxCUesuTFFArtvbUNL2",
	"1xUee8t4ukXW_XD4K4pGV_I4VFccwdyqt",
	"1xgfepctwXjZ5Y9kxhD3HcTTaJcsWHi-x",
	"1xhymaD6J1patQzfass5-e4ewUDg8gnQ9",
	"1xCvCvUa2zVWLm3y1pAGFKrr-emyaFicK",
	"1x87CHgjwaOjANyN_06_JqB-YKaUQGU2b"
		];

		// 🎲 Random ID
		const randomID = links[Math.floor(Math.random() * links.length)];

		// ✅ Proper Direct Download Link
		const videoURL = `https://drive.google.com/uc?export=download&id=${randomID}`;

		const caption = `✢━━━━━━━━━━━━━━━✢\n✨ 𝐑𝐚𝐧𝐝𝐨𝐦 𝐂𝐨𝐮𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 🎬\n𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐦𝐨𝐦𝐞𝐧𝐭 💫`;

		const footer = `\n✢━━━━━━━━━━━━━━━✢\n--❖(✷‿𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓‿✷)❖--\n✢━━━━━━━━━━━━━━━✢\n(✷‿𝐎𝐖𝐍𝐄𝐑:-𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍‿✷)`;

		try {
			const stream = await global.utils.getStreamFromURL(videoURL);

			await message.reply({
				body: caption + footer,
				attachment: stream
			});

			if (loadingMsg) api.unsendMessage(loadingMsg.messageID);
			api.setMessageReaction("✅", messageID, () => {}, true);

		} catch (err) {
			console.error(err);
			api.setMessageReaction("❌", messageID, () => {}, true);
			message.reply("❌ Video load failed!");
		}
	}
};
