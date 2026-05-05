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
"https://i.postimg.cc/gwVPCH1R/1237111-2d6f0d4-640x.jpg",

"https://i.postimg.cc/2bCfrBDz/1257106-f592249-640x.jpg",

"https://i.postimg.cc/phkMTXWP/1517001-6a67d21-640x.jpg",

"https://i.postimg.cc/06RsXBX7/1598376-c87d14b-640x.jpg",

"https://i.postimg.cc/phPtRnHy/1603858-ec52c3b-640x.jpg",

"https://i.postimg.cc/sQKCXDjj/1796281-7575877-640x.jpg",

"https://i.postimg.cc/sQ3RsZRt/2012550-7d41ce3-640x.jpg",

"https://i.postimg.cc/TyM6N4NV/2061939-e444bc1-640x.jpg",

"https://i.postimg.cc/BLNf6QS3/2138545-4ca0ee2-640x.jpg",

"https://i.postimg.cc/zbq18R1M/2347535-687ca26-640x.jpg",

"https://i.postimg.cc/VSqcxW29/2574465-db71b0b-640x.jpg",

"https://i.postimg.cc/hzKqc7qY/2588380-df4ef94-640x.jpg",

"https://i.postimg.cc/LqtMc3G1/2591716-3ab71c0-640x.jpg",

"https://i.postimg.cc/LqKpQbQL/2593424-f687dd5-640x.jpg",

"https://i.postimg.cc/67rNkfFj/2594540-474da42-640x.jpg",

"https://i.postimg.cc/XGn04y0L/2594620-c528768-640x.jpg",

"https://i.postimg.cc/PLWkgQ0L/2606103-34375f3-640x.jpg",

"https://i.postimg.cc/KkQhzvGj/2608454-ab10673-640x.jpg",

"https://i.postimg.cc/94dj6YsY/2615741-5fb4349-640x.jpg",

"https://i.postimg.cc/yJmzMy2r/2616428-c41eb13-640x.jpg",

"https://i.postimg.cc/HJwCq9FR/2624056-d6c4d56-640x.jpg",

"https://i.postimg.cc/5YfMbFMs/2632756-1b2d7cd-640x.jpg",

"https://i.postimg.cc/PLsjVRVm/2671660-2b9323a-640x.jpg",

"https://i.postimg.cc/67rNkfF4/2677853-dcfae09-640x.jpg",

"https://i.postimg.cc/Ny6w3kZx/2955904-b7f4b4f-640x.jpg",

"https://i.postimg.cc/zLC1sF40/3118748-e5410cc-640x.jpg",

"https://i.postimg.cc/bGxj794m/3193363-2e10ffe-640x.jpg",

"https://i.postimg.cc/bGxj794T/3292627-8ddd847-640x.jpg",

"https://i.postimg.cc/jWHrp4Bv/3538134-3c852d4-640x.jpg",

"https://i.postimg.cc/1nyZsNQz/493219-4119634-640x.jpg",

"https://i.postimg.cc/mcYGvyK7/5057574-5ad9515-640x.jpg",

"https://i.postimg.cc/JyVLY2Yy/5130746-ec58ea3-640x.jpg",

"https://i.postimg.cc/5YpW0N42/5184683-720fa2f-640x.jpg",

"https://i.postimg.cc/kVQd0vL6/5184685-0cd2736-640x.jpg",

"https://i.postimg.cc/0MZ1Q2kr/5411898-186b3cc-640x.jpg",

"https://i.postimg.cc/9RcjCqh0/5616280-08ce42f-640x.jpg",

"https://i.postimg.cc/Q9SZtx83/5617854-89dc676-640x.jpg",

"https://i.postimg.cc/1nM1t5m5/5939306-7c8988d-640x.jpg",

"https://i.postimg.cc/yg7zsSHH/6008451-f16f18f-640x.jpg",

"https://i.postimg.cc/62BNtGXK/6011933-e04c288-640x.jpg",

"https://i.postimg.cc/wy9dgsp8/6014402-8e28019-640x.jpg",

"https://i.postimg.cc/tZ9HpVjp/6015323-cf9e0bd-640x.jpg",

"https://i.postimg.cc/k67dqtmg/6372275-6256644-640x.jpg",

"https://i.postimg.cc/WDGPBwxM/6430641-8cd4563-640x.jpg",

"https://i.postimg.cc/wy9dgspx/6464506-2b46693-640x.jpg",

"https://i.postimg.cc/343HYDTM/802131-3277ea1-640x.jpg",

‎"https://i.postimg.cc/4xL0JjfS/2389368-a2e02dc-640x.jpg",

‎"https://i.postimg.cc/ryx7Shj5/5566146-e376eaf-640x.jpg",

‎"https://i.postimg.cc/bJ2WVLhX/723663-fac2789-640x.jpg",

‎"https://i.postimg.cc/q7q9y4Dn/5296068-889f869-640x.jpg",

‎"https://i.postimg.cc/pLWNVDD9/3120403-315d70c-640x.jpg",

‎"https://i.postimg.cc/QCC9rB0Y/2944216-1ce93c0-640x.jpg",
			
‎"https://i.postimg.cc/3RCCwDj1/5129081-372e6d6-640x.jpg",

‎"https://i.postimg.cc/JzvQY84N/2071191-e879a7f-640x.jpg",
‎
"https://i.postimg.cc/Dyf585Y9/6398948-b97db40-640x.jpg",
‎
"https://i.postimg.cc/4xL0JjfS/2389368-a2e02dc-640x.jpg",

"https://i.postimg.cc/9FTXwtRK/3289703-5a7e995-640x.jpg",
			
"https://i.postimg.cc/ZRN79xP1/97420.jpg",  
  
"https://i.postimg.cc/tCB54cQs/27712360-320x180.jpg",  
  
"https://i.postimg.cc/Mp4myjGx/556-contact-01749889097.jpg",  
  
"https://i.postimg.cc/rm2GHXWP/images-2022-08-16-T112453-202.jpg",  
  
"https://i.postimg.cc/ZYcPwQqw/www-bangla-xxx-com.jpg",  
  
"https://i.postimg.cc/SQvRQL1y/990-young.jpg",  
  
"https://i.postimg.cc/FHQSb5tW/horny-booby-girl-moaning-hard-fingering-pussy.jpg",  
  
"https://i.postimg.cc/0NzwGp5n/Hot-Indian-lovers-standing-sex-MMS.jpg",  
  
"https://i.postimg.cc/02H5Yh6g/Hot-Desi-girl-striptease-nude-dance.jpg",  
  
"https://i.postimg.cc/CMQ9m044/naughty-Bhabhi-licking-own-nipples.jpg",  
  
"https://i.postimg.cc/RFjyCQhD/cute-girl-showing-her-big-round-boobs.jpg",  
  
"https://i.postimg.cc/VsqDbcV6/beautiful-Pakistani-girl-salwar-striptease-show.jpg",  
  
"https://i.postimg.cc/kXZ6J2vt/sexy-Girl-shows-boobs-and-pussy-many-clips-merged.jpg",  
  
"https://i.postimg.cc/XYkrws09/sexy-horny-girl-fingering-masturbating-with-bottle.jpg",  
  
"https://i.postimg.cc/g03mvQWD/10-272.jpg",  
  
"https://i.postimg.cc/7L1jPT0H/young-lovers-enjoying-nude-sex-on-selfie-cam.jpg",  
  
"https://i.postimg.cc/fRnH3RwJ/foreplay-sex-with-beautiful-Bhabhi-before-fucking.jpg",  
  
"https://i.postimg.cc/Hkgfq28Z/NRI-Punjabi-girl-showing-her-big-boobies.jpg",  
  
"https://i.postimg.cc/yNWntgjp/unsatisfied-Desi-Milf-showing-her-big-clit.jpg",  
  
"https://i.postimg.cc/NjCk6Gt6/Desi-girl-showing-her-cute-small-boobies-on-VC.jpg",  
  
"https://i.postimg.cc/7YW5X5CZ/Desi-couple-hot-romance-in-shower.jpg",  
  
"https://i.postimg.cc/xTCkKv1Z/Bangladeshi-cute-village-girl-showing-boobs-on-video-call.jpg",  
  
"https://i.postimg.cc/V6kw3FpQ/Indian-girl-shows-her-boobs-and-pussy.jpg",  
  
"https://i.postimg.cc/hjQnDGDp/sexy-ass-Bhabhi-fucked-doggy-style-with-moanings-1.jpg",  
  
"https://i.postimg.cc/13W1DF4v/cute-college-girl-showing-her-shaved-pussy-on-VC.jpg",  
  
"https://i.postimg.cc/Hn0fncf4/beautiful-college-girl-showing-her-tiny-tits.jpg",  
  
"https://i.postimg.cc/8PKZHmBf/Pakistani-mature-girl-paid-to-expose-her-assets.jpg",  
  
"https://i.postimg.cc/QMLk44BC/skinny-Desi-girl-masturbating-pussy-with-brinjal.jpg",  
  
"https://i.postimg.cc/tJ7xCW18/Indian-lovers-hot-foreplay-sex-in-front-of-mirror.jpg",  
  
"https://i.postimg.cc/RC31mxch/sweet-looking-Desi-girl-boobs-show-for-lover.jpg",  
  
"https://i.postimg.cc/d0HdM53G/beautiful-Pakistani-bitch-showing-her-naked-beauty.jpg",  
  
"https://i.postimg.cc/9fn4gzgp/Bangladeshi-chubby-girl-fingering-her-fat-pussy.jpg",  
  
"https://i.postimg.cc/TYdRmfCY/shaggy-tits-Bangladeshi-girl-showing-her-boobies.jpg",  
  
"https://i.postimg.cc/8C89RbNB/sexy-Bangladeshi-girl-playing-with-her-boobs.jpg",  
  
"https://i.postimg.cc/SsxrCX2f/beautiful-Pakistani-girl-showing-her-big-melons.jpg",  
  
"https://i.postimg.cc/kM6nvTdL/Desi-girl-pumping-her-own-boobs-on-selfie-cam.jpg",  
  
"https://i.postimg.cc/gkWfLscV/Beautiful-Bangladeshi-sexy-girl-leaked-video.jpg",  
  
"https://i.postimg.cc/fb9KK4BJ/beautiful-Bangladeshi-girl-toying-with-her-big-boobs.jpg",  
  
"https://i.postimg.cc/zvXK44Sw/cute-BD-girl-full-nude-show-for-lover.jpg",  
  
"https://i.postimg.cc/15XDBhzs/busty-sexy-escort-Bhabhi-captured-nude-after-sex.jpg",  
  
"https://i.postimg.cc/k4wtNf32/Sexy-Desi-eunuch-shows-her-boobs.jpg",  
  
"https://i.postimg.cc/90K01kxQ/mature-Indian-girl-Shows-boobs-and-pussy.jpg",  
  
"https://i.postimg.cc/3wtKn6NQ/mature-village-girl-showing-her-hunger-for-dick.jpg",  
  
"https://i.postimg.cc/qR9gxYDM/beautiful-sexy-girl-showing-her-cute-titties.jpg",  
  
"https://i.postimg.cc/NfxfK5t0/cute-skinny-girl-fingering-her-small-pussy-on-VC.jpg",  
  
"https://i.postimg.cc/h41qr65y/beautiful-girl-fingering-pussy-with-horny-expressions.jpg",  
  
"https://i.postimg.cc/9f5xsF4G/beautiful-Bangladeshi-wife-showing-her-topless-beauty.jpg",  
  
"https://i.postimg.cc/0jTmrr1n/Dehati-wife-showing-her-white-pussy-on-video-call.jpg",  
  
"https://i.postimg.cc/T2FsvX4Y/Dehati-cute-wife-showing-her-sexy-white-boobs.jpg",  
  
"https://i.postimg.cc/x14Jttd7/beautiful-Bengali-girl-saree-striptease-show.jpg",  
  
"https://i.postimg.cc/Y0RjgxVd/Indian-girl-showing-boobs-while-bathing-nude.jpg",  
  
"https://i.postimg.cc/g2nrX8KK/cute-Desi-girl-showing-pussy-for-BF.jpg",  
  
"https://i.postimg.cc/FsbwyBTr/received-834398520401522.jpg",  
  
"https://i.postimg.cc/K8mYBwJ1/beautiful-big-boob-Bangladeshi-sexy-girl-showing.jpg",  
  
"https://i.postimg.cc/gkNCt7GX/Bengali-tall-girl-riding-dick-of-lover-MMS.jpg",  
  
"https://i.postimg.cc/63rSrjHQ/Bangladeshi-cute-girl-showing-her-topless-beauty.jpg",  
  
"https://i.postimg.cc/ydyQgJdg/big-boobs-wife-screaming-in-pain-and-pleasure.jpg",  
  
"https://i.postimg.cc/43q76wYj/Beautiful-sweet-GF-showing-her-naked-pussy-on-VC.jpg",  
  
"https://i.postimg.cc/gJ7D6vp0/hot-super-sexy-maal-showing-her-cute-boobies.jpg",  
  
"https://i.postimg.cc/65x9dgYd/big-boobs-sexy-girl-teasing-with-her-huge-melons.jpg",  
  
"https://i.postimg.cc/76cL8L3c/horny-Bangla-girl-fingering-pussy-thinking-of-BF.jpg",  
  
"https://i.postimg.cc/6pyBrvDv/Beautiful-Bangladeshi-girl-boob-sucking-by-lover.jpg",  
  
"https://i.postimg.cc/pVh7JBTx/naughty-Bhabhi-inserting-bottle-inside-pussy-on-video-call.jpg",  
  
"https://i.postimg.cc/pXvZ5Q5s/super-chubby-Bengali-girl-showing-boobs-and-pussy.jpg",  
  
"https://i.postimg.cc/VL7CsXqr/cute-looking-Desi-girl-naked-bath-show-in-bathroom.jpg",  
  
"https://i.postimg.cc/dVkLqpQp/Beautiful-big-boob-Pakistani-wife-showing-her-melons.jpg",  
  
"https://i.postimg.cc/NGdMRB5Z/super-cute-Bengali-girl-showing-her-shaved-pussy.jpg",  
  
"https://i.postimg.cc/yNKBwbDF/pimple-girl-showing-her-nude-beauty-for-her-lover.jpg",  
  
"https://i.postimg.cc/yYSHWH9m/She-felt-a-hot-prickle-of-desire-while-making-nude-video.jpg",  
  
"https://i.postimg.cc/DZZVhknb/super-chubby-wife-juggling-with-her-big-boobies.jpg",  
  
"https://i.postimg.cc/DZZVhknb/super-chubby-wife-juggling-with-her-big-boobies.jpg",  
  
"https://i.postimg.cc/mDvGypWz/sweet-looking-girl-teasing-her-lover-with-sexy-nude-act.jpg",  
  
"https://i.postimg.cc/1zbdkgCb/horny-chubby-girl-showing-her-volutous-boobs.jpg",  
  
"https://i.postimg.cc/WpGyy1Mf/college-girl-showing-boobs-to-BF-during-her-studies.jpg",  
  
"https://i.postimg.cc/wvKWWC3p/Bangladeshi-Beautiful-Cute-Girl-Showing.jpg",  
  
"https://i.postimg.cc/fyy0YLZT/Bangladeshi-Cute-Girl-Showing-For-Lover-With-Bangla-talk.jpg",  
  
"https://i.postimg.cc/ZRK9hRWF/shaggy-boobed-Desi-bitch-teasing-with-banana.jpg",  
  
"https://i.postimg.cc/m2FP4Kgq/BBW-Bhabhi-showing-her-melons-while-dancing.jpg",  
  
"https://i.postimg.cc/tCPFksWY/south-Indian-wife-shows-her-boobs-on-video-call.jpg",  
  
"https://i.postimg.cc/VLyCJzp1/Beautiful-girl-showing-her-sexy-soft-boobies-on-selfie-cam.jpg",  
  
"https://i.postimg.cc/2jWqRP6t/sexy-Indian-Insta-girl-showing-her-big-melons.jpg",  
  
"https://i.postimg.cc/k5Z5Lcd9/Cute-girl-showing-boobs-for-lover-with-Bangla-talk.jpg",  
  
"https://i.postimg.cc/50L3LKb0/Rajasthani-housewife-ginving-handjob-while-masturbating-pussy.jpg",  
  
"https://i.postimg.cc/vBF7Y7fd/Desi-slum-girl-showing-boobies-on-video-call.jpg",  
  
"https://i.postimg.cc/y82cjhfS/beautiful-cute-girl-boobs-show-selfie-MMS.jpg",  
  
"https://i.postimg.cc/hP5d4bR3/Beautiful-sexy-Bangladeshi-girl-showing-boobs.jpg",  
  
"https://i.postimg.cc/52z6xh36/cute-college-girl-in-glasses-showing-boobs.jpg",  
  
"https://i.postimg.cc/4NDxF8gZ/sexy-boobs-show-by-cute-Bangladeshi-girl.webp",  
  
"https://i.postimg.cc/XNcM0Qd4/Bangladeshi-girl-sucking-black-dick-of-BF.jpg",  
  
"https://i.postimg.cc/QtGz2TMF/big-boob-young-girl-getting-nude-on-cam.jpg",  
  
"https://i.postimg.cc/JnYkybBn/super-sexy-girl-showing-her-hot-big-boobs.jpg",  
  
"https://i.postimg.cc/wj5R5Ksn/hot-sexy-girl-showing-her-big-melons.jpg",  
  
"https://i.postimg.cc/pLkzbbXz/super-busty-Bengali-girl-boobs-pressing-outdoors.jpg",  
  
"https://i.postimg.cc/4ybn6VYV/big-boob-nude-Bhabhi-showing-her-melons.jpg",  
  
"https://i.postimg.cc/BQSvW887/sexy-cute-girl-shows-her-big-round-boobs.jpg",  
  
"https://i.postimg.cc/nrLN2tz2/Beautiful-Pakistani-girl-taking-cum-in-mouth.jpg",  
  
"https://i.postimg.cc/wBcPdBRF/cute-Bhabhi-sucking-big-red-dick-of-hubby.jpg",  
  
"https://i.postimg.cc/JnFQwwxP/Beautiful-Pakistani-girl-teasing-with-sexy-boobs-show.jpg",  
  
"https://i.postimg.cc/qBtPN4PB/horny-Desi-girl-masturbating-with-long-brinjal.jpg",  
  
"https://i.postimg.cc/CxMJf4RC/sexy-Indian-girl-fingering-pussy.webp",  
  
"https://i.postimg.cc/nhwK9fbZ/She-is-just-God-gifted.jpg",  
  
"https://i.postimg.cc/dt5rgc0d/BD-girl-showing-her-big-melons-on-VC.jpg",  
  
"https://i.postimg.cc/zBNyVxB8/innocent-Bangladeshi-girl-showing-boobs-pussy.jpg",  
  
"https://i.postimg.cc/43kdSWpV/beautiful-Bhabhi-showing-her-big-titties-on-video-call.jpg",  
  
"https://i.postimg.cc/ZqxTD4bz/playing-with-sexy-boobs-of-beautiful-Bhabhi.jpg",  
  
"https://i.postimg.cc/qRq9XTgL/horny-girl-fingering-pussy-on-video-call.jpg",  
  
"https://i.postimg.cc/PqJjKZRY/innocent-looking-girl-showing-her-erect-nipples.jpg",  
  
"https://i.postimg.cc/7PMWGhBk/Mehendi-girl-fingering-pussy-on-video-call.jpg",  
  
"https://i.postimg.cc/fR6KgQHC/big-boobs-of-sexy-Pakistani-girl-exposed.jpg"
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
