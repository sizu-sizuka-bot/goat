const axios = require("axios");

module.exports = {
	config: {
		name: "attitude",
		aliases: ["ego"],
		version: "2.4",
		author: "MR_FARHAN",
		countDown: 5,
		role: 0,
		shortDescription: "Random attitude videos",
		longDescription: "Random attitude/ego videos with stylish caption",
		category: "𝗙𝗨𝗡",
		guide: "{pn}"
	},

	onStart: async function ({ message, api }) {
		const { messageID } = message;

		// 🔒 AUTHOR LOCK (DO NOT CHANGE)
		const OWNER = "MR_FARHAN";
		if (this.config.author !== OWNER) {
			return message.reply("⚠️ Author modified! Command disabled for security reason.");
		}

		try {
			api.setMessageReaction("⏳", messageID, () => {}, true);
		} catch {}

		let loadingMsg;
		try {
			loadingMsg = await message.reply("⚡ ᴠɪᴅᴇᴏ ʟᴏᴀᴅɪɴɢ... ⚡");
		} catch {}

		const links = [
			"11dUXILgge35GyV9ilD_JmzLiL7yq5WMc",
	"11Wr0yQ3QVG1BucbdlANkSo5vE-a___Sn",
	"10e1TdrCvj0w2GIBrczbQYUFvb5HddTaW",
	"114eZDQU1xbBa2BKrfaboA8tQlJi2fWcS",
	"11x0wO9uv9foBrq0B585QEVTk1h0Ci6L_",
	"11PXirNeOGwoJblFBxp5M9DFYaGVDlyzT",
	"10qGgG0YdBksgEp1k9fCAsv46PrWfUCSm",
	"11f2yNWaoLNVORhsuwiQto47oLSqEFmyB",
	"10hxxvZ3zwKqmwxvZFg1YkIsEcI2x0d_a",
	"158uOCkcLSgn0yAmb9A3GxNBuwhQ6whJl",
	"1-0nXpw6ch9JTDRcSrN5bdsXzh67lyEDe",
	"1-LC1zOtGFf2Toa0zfTUN9Y8xC-CQloHp",
	"13AMbqn7jai43XgbNADQ8nqW7tieDY4fa",
	"10C_AagqYOXSp67gkPpwXOdhIXhSosf_O",
	"13068I_ImTH0RQkWHgxGddKMzC0qMirS3",
	"10CvsLzpZGbTyGbf9ysMWQHe4rwmC1yw3",
	"14dqAKDGlPsee-85XvJTld_Jcx6P7mNaI",
	"15BmVYod3VW0zePhdNGD3-RpPoQyFI65U",
	"14-ymwZdWOKj89pWtA0MiLGN7Eh2xmHaG",
	"1-y_vYnJYSPe2gMsPfZQjmjOvhkyVw35R",
	"14oBehghDvtnmJL3wNvN0Kc6YGzJt2iQJ",
	"13pTcxmag7B893dWzfe7OavvayD7OYiRa",
	"1-6mtt_fnc9czRRGsRqCqcURBZQUzczBy",
	"13xMtvrgt__qUUQ-U9PKGyUlq88x1CIPZ",
	"14OMrLCa7ef1jH7I39fouKG4lxwbd4K0b",
	"14HaSbb4fSHfUhUgKfNWJc66gNmqYgmPW",
	"1-E1mcGTX6_RCc5vEXOsDV2ODC059o6bF",
	"14Szrzz4CL3BBN1oQrH04cQ1zM1sNhx7s",
	"13UmjKL6oKSbDYJbOKr6qGfqJQgUoC-qa",
	"10BIFhf82pTFOq0Z1v4b-FFsPr877zsLo",
	"1-hHkePC6ukBhPTcaTKFlaJ5d5-aREthq",
	"1-bgjrQn6gfM7QOF-tAsu5t05KLwqK4_R",
	"14FeUarN4GoWwPQuv9ef3zdpAOu0p1PNi",
	"15C7IXIXsXwyC0Kj_CVsx-PHOuatPvjnx",
	"13W2XS8AxEcjKAX_MRD-rh4Sp00t_8XKq",
	"1-6Qh6CIsQ-Yhrb2sppnN4F7qhJ1tk3rO",
	"1-aI8DTnd2t1bmnyDAzq4VKb8Me0JaCPn",
	"1-884CM0iZpTAy6cSVA9MnLtfNHhILfov",
	"13McQhw-0wzraruEMKg7GxS8gudjLRA7c",
	"13kMv4G1hs0COispW70439SvAGKqv4XuA",
	"141f7fm8eUFvQl7C5XAk9-csm3PnaXaGT",
	"10R60lJzy8TfRGi48QJbTl68JdMTg21MU",
	"10V3eeUBXnW5N4UwtafHzgOjbnzWithX-",
	"11qS8wAi3HORxKQ4kZnwRlo-6HfrkS8tC",
	"119JOKHCHSDS9Hyuzrb586kxMQ4cbJPpx",
	"11-nUAWil79-wOLDtP-KwrlGF9xEGF6uh",
	"11G7osUuxilHaP8t4hGDVIQuH1iW9WKkw",
	"10a8nyCgJKN49ZBD1PxA1x2ZR6f-46oxR",
	"10z2V4bgJO23c5Nyc_-1Z4gDgmA4ZKXgk",
	"10fQP-HgzGTeSAhTRalFoBDi7cAoKrDO6",
	"11Y3RhXhlFjuc3hAH6haqw5u82Uz1j1rU",
	"12-YteljsOqh__Vcy7DCd1FrgZxhKjKVf",
	"11tllUwvnX_4W-sVq-QqYeaIpoF_cc9pJ",
	"119Da1fFnWTbDX4wCI0FUYlsyMaMjalXo",
	"144UKwffDum2KPi3wWNo_ArpdK-imnDOj",
	"13WNdC4KdInXvPRIETkuTi915MU8XHocS",
	"13MdC-fT1aYk6DlLZvJV9e_z-n25oSsW_",
	"13WO2JftbP129GR0fVmLpMAMfwx07K8fl",
	"15Bt2GrntjfOIswZRhQPuiBNfQ5NannK4",
	"14oWHvlsbsNaJLN_YaQGNVaUcerdUGrB8",
	"14tb-XgVWGcS63Jw0oNbm2hsqrQLw_gzL",
	"1520dma_yKw2ixGpb7wnktzrM20Kjo_3v",
	"1513P_XukMB6gPDf9lr20t8re3ScCL5Rw",
	"1-4yGIC7A0GKJHSUzaECF3d_bAWSp4Tl8",
	"1-xItCYLhq2oaR4tfiU8ap11CMDaJvMLq",
	"13qfO0aoXblNXXS-voJWj-8LqdYV4Gltu",
	"1-zgBe2_gCLh_Rl7DRBzKAG_CA914QbTQ",
	"10D9HinfwrtMjYo4fI7lWQYSStWrVllBQ",
	"107EjQ_uLg2Q5812NBux6QpAwx8ncS6JR",
	"14gr6fIUTYsF0nMOKtuOQqQmJ8Ggf71Tn",
	"14PgaietaupKI5jy89Y_VbENC_Zluy3D_",
	"13G9hyUkfx7oWWTbdD4AYQ6Vlk2f4EQ1Y",
	"13uE2XejtfWUJW6uzc83rXvcsPKoU3rek"
		];

		const randomID = links[Math.floor(Math.random() * links.length)];
		const videoURL = `https://drive.google.com/uc?export=download&id=${randomID}`;

		const caption = `✢━━━━━━━━━━━━━━━✢
😎 𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 𝐕𝐈𝐃𝐄𝐎 🎬
😈 𝐄𝐆𝐎 𝐌𝐎𝐎𝐃 𝐎𝐍 🔥
✢━━━━━━━━━━━━━━━✢`;

		const footer = `
--❖(✷‿𝐒𝐈𝐙𝐔𝐊𝐀-𝐁𝐎𝐓‿✷)❖--
(✷‿𝐎𝐖𝐍𝐄𝐑:-𝐑𝐉-𝐅𝐀𝐑𝐇𝐀𝐍‿✷)`;

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
