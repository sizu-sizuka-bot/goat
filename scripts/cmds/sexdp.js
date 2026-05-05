const axios = require("axios");

module.exports = {
	config: {
		name: "sexdp",
		aliases: ["sexpic"],
		version: "3.0",
		author: "Rocky Chowdhury",
		countDown: 5,
		role: 0,
		shortDescription: "Random Image",
		longDescription: "Send random image with caption",
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
			loadingMsg = await message.reply("🖼️ ɪᴍᴀɢᴇ ʟᴏᴀᴅɪɴɢ...");
		} catch {}

		// 🌸 Image Links
		const links = [

"https://i.postimg.cc/0NH03JGX/1517001-6a67d21-640x.jpg",
"https://i.postimg.cc/d1kjKtn6/1603858-ec52c3b-640x.jpg",
"https://i.postimg.cc/25X7JBdc/1796281-7575877-640x.jpg",
"https://i.postimg.cc/KYsDVg7R/2071191-e879a7f-640x.jpg",
"https://i.postimg.cc/N0PkVr8P/2138545-4ca0ee2-640x.jpg",
"https://i.postimg.cc/q77GjGKC/2389368-a2e02dc-640x.jpg",
"https://i.postimg.cc/s2048ZP9/2608454-ab10673-640x.jpg",
"https://i.postimg.cc/HLP9K70J/2944216-1ce93c0-640x.jpg",
"https://i.postimg.cc/4331B1c7/3120403-315d70c-640x.jpg",
"https://i.postimg.cc/k55yfySm/3289703-5a7e995-640x.jpg",
"https://i.postimg.cc/1zYrTN04/5129081-372e6d6-640x.jpg",
"https://i.postimg.cc/nLwG5QKD/5184683-720fa2f-640x.jpg",
"https://i.postimg.cc/3wwZnZGW/5296068-889f869-640x.jpg",
"https://i.postimg.cc/N0PkVr8r/5411898-186b3cc-640x.jpg",
"https://i.postimg.cc/mrrS8S9c/5566146-e376eaf-640x.jpg",
"https://i.postimg.cc/B6LBGQNN/5616280-08ce42f-640x.jpg",
"https://i.postimg.cc/0QM0q2Z0/5617854-89dc676-640x.jpg",
"https://i.postimg.cc/7LQncT1X/5939306-7c8988d-640x.jpg",
"https://i.postimg.cc/xdF37bGj/6398948-b97db40-640x.jpg",
"https://i.postimg.cc/HLLtBtMr/723663-fac2789-640x.jpg",

"https://i.postimg.cc/ZnJnxw9y/1237111-2d6f0d4-640x.jpg",
"https://i.postimg.cc/B69XXSJ4/1257106-f592249-640x.jpg",
"https://i.postimg.cc/qRsgKP7k/1598376-c87d14b-640x-(1).jpg",
"https://i.postimg.cc/QtGHH8jd/2012550-7d41ce3-640x.jpg",
"https://i.postimg.cc/1XyXrvgB/2061939-e444bc1-640x.jpg",
"https://i.postimg.cc/hjLhmkGR/2347535-687ca26-640x.jpg",
"https://i.postimg.cc/gJVrhC0J/2574465-db71b0b-640x-(1).jpg",
"https://i.postimg.cc/KjmjD0K9/2586631-59397d7-640x.jpg",
"https://i.postimg.cc/wvX3NCBH/2588380-df4ef94-640x.jpg",
"https://i.postimg.cc/QCjCJfBp/2593424-f687dd5-640x.jpg",
"https://i.postimg.cc/TwVhbzPy/2594540-474da42-640x.jpg",
"https://i.postimg.cc/XJfX5RvN/2594620-c528768-640x.jpg",
"https://i.postimg.cc/fLckdGbM/2606103-34375f3-640x-(1).jpg",
"https://i.postimg.cc/prPrJs9m/2615741-5fb4349-640x.jpg",
"https://i.postimg.cc/hjLhmkGX/2616428-c41eb13-640x.jpg",
"https://i.postimg.cc/nz4MmyLh/2624056-d6c4d56-640x.jpg",
"https://i.postimg.cc/k4QDS05q/2632756-1b2d7cd-640x.jpg",
"https://i.postimg.cc/Ss6j9BKN/2671660-2b9323a-640x-(1).jpg",
"https://i.postimg.cc/NM6LX30m/2677853-dcfae09-640x-(1).jpg",
"https://i.postimg.cc/LXthPcsf/2955904-b7f4b4f-640x.jpg",
"https://i.postimg.cc/bJxdn7vn/3118748-e5410cc-640x.jpg",
"https://i.postimg.cc/1tG4Fkz4/3193363-2e10ffe-640x.jpg",
"https://i.postimg.cc/4d6ncD3h/3292627-8ddd847-640x.jpg",
"https://i.postimg.cc/vBrDnJmg/3538134-3c852d4-640x.jpg",
"https://i.postimg.cc/MT2vv6qg/493219-4119634-640x.jpg",
"https://i.postimg.cc/GtbtxXBB/5057574-5ad9515-640x.jpg",
"https://i.postimg.cc/kG7GvTVc/5130746-ec58ea3-640x.jpg",
"https://i.postimg.cc/k4QDS05J/5184685-0cd2736-640x-(1).jpg",
"https://i.postimg.cc/0QRbbk95/6008451-f16f18f-640x.jpg",
"https://i.postimg.cc/26RVVkCz/6011933-e04c288-640x.jpg",
"https://i.postimg.cc/4dkmmfXN/6014402-8e28019-640x.jpg",
"https://i.postimg.cc/NMq55sQc/6015323-cf9e0bd-640x.jpg",
"https://i.postimg.cc/HxDVVYTT/6372275-6256644-640x.jpg",
"https://i.postimg.cc/FzhzVTfd/6430641-8cd4563-640x.jpg",
"https://i.postimg.cc/26RVVkCf/6464506-2b46693-640x.jpg",
"https://i.postimg.cc/RF7qtk05/802131-3277ea1-640x.jpg"
		];

		// 🎲 Random Image
		const randomLink = links[Math.floor(Math.random() * links.length)];

		// 📌 Caption
		const caption = `-উফ দেখ আর হাত মার_😒🥵`;

		try {
			const stream = await global.utils.getStreamFromURL(randomLink);

			await message.reply({
				body: caption,
				attachment: stream
			});

			if (loadingMsg) {
				api.unsendMessage(loadingMsg.messageID);
			}

			api.setMessageReaction("✅", messageID, () => {}, true);

		} catch (err) {
			console.error(err);

			api.setMessageReaction("❌", messageID, () => {}, true);

			message.reply("❌ Image load failed!");
		}
	}
};
