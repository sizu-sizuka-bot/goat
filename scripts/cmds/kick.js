module.exports = {
	config: {
		name: "kick",
		version: "1.3",
		author: "MR-FARHAN",
		countDown: 5,
		role: 1,
		description: {
			vi: "গ্রুপ থেকে সদস্যকে কিক করবে",
			en: "গ্রুপ থেকে সদস্যকে কিক করবে"
		},
		category: "owner",
		guide: {
			vi: "ব্যবহার:\n{pn} @মেনশন\nঅথবা কোনো মেসেজে রিপ্লাই দিয়ে {pn}",
			en: "ব্যবহার:\n{pn} @মেনশন\nঅথবা কোনো মেসেজে রিপ্লাই দিয়ে {pn}"
		}
	},

	langs: {
		vi: {
			needAdmin: "⚠️ এই কমান্ড ব্যবহার করতে হলে আগে বটকে গ্রুপের অ্যাডমিন করতে হবে।",
			noUser: "⚠️ কাউকে মেনশন করুন অথবা তার মেসেজে রিপ্লাই দিন।",
			kickSuccess: "✅ সদস্যকে সফলভাবে গ্রুপ থেকে বের করে দেওয়া হয়েছে।"
		},
		en: {
			needAdmin: "⚠️ এই কমান্ড ব্যবহার করতে হলে আগে বটকে গ্রুপের অ্যাডমিন করতে হবে।",
			noUser: "⚠️ কাউকে মেনশন করুন অথবা তার মেসেজে রিপ্লাই দিন।",
			kickSuccess: "✅ সদস্যকে সফলভাবে গ্রুপ থেকে বের করে দেওয়া হয়েছে।"
		}
	},

	onStart: async function ({ message, event, args, threadsData, api, getLang }) {
		const adminIDs = await threadsData.get(event.threadID, "adminIDs");

		if (!adminIDs.includes(api.getCurrentUserID()))
			return message.reply(getLang("needAdmin"));

		async function kickAndCheckError(uid) {
			try {
				await api.removeUserFromGroup(uid, event.threadID);
				return true;
			}
			catch (e) {
				message.reply(getLang("needAdmin"));
				return false;
			}
		}

		if (!args[0]) {
			if (!event.messageReply)
				return message.reply(getLang("noUser"));

			const success = await kickAndCheckError(event.messageReply.senderID);

			if (success)
				message.reply(getLang("kickSuccess"));
		}
		else {
			const uids = Object.keys(event.mentions);

			if (uids.length === 0)
				return message.reply(getLang("noUser"));

			const firstUser = uids.shift();

			const success = await kickAndCheckError(firstUser);

			if (!success)
				return;

			for (const uid of uids) {
				api.removeUserFromGroup(uid, event.threadID);
			}

			message.reply(getLang("kickSuccess"));
		}
	}
};
