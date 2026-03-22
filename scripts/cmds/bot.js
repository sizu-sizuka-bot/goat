const axios = require('axios');

const baseApiUrl = async () => {
  return "https://your-baby-apixs.onrender.com";
};

module.exports.config = {
  name: "bot",
  aliases: ["Bot"],
  version: "0.0.1",
  author: "S AY EM",
  countDown: 0,
  role: 0,
  description: "update simsim api by Sayem",
  category: "CHARTING",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nmsg [YourMessage] OR\nlist OR\nlist all"
  }
};

module.exports.onStart = async ({
  api,
  event,
  args,
  usersData
}) => {

  const link = `${await baseApiUrl()}`;
  const sayem = args.join(" ").toLowerCase();

  try {

    if (!args[0]) {

      const ran = ["Bolo baby", "hum bby", "Yes' i am here", "type .help baby"];

      const msg = await api.sendMessage(
        ran[Math.floor(Math.random() * ran.length)],
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply ??= {};
      global.GoatBot.bbyReply[msg.messageID] = true;

      return;
    }

    if (args[0] === 'list') {

      if (args[1] === 'all') {

        const data = (await axios.get(`${link}/list-all`)).data;

        const limit = parseInt(args[2]) || 100;

        const teachers = data.teachers?.slice(0, limit) || [];

        const result = await Promise.all(
          teachers.map(async (item) => {

            const uid = item.uid;
            const value = item.teaches;

            const name = await usersData.getName(uid).catch(() => uid);

            return {
              name,
              value
            };

          })
        );

        result.sort((a, b) => b.value - a.value);

        const output = result
          .map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`)
          .join("\n");

        return api.sendMessage(
          `Total Teach = ${data.total_questions || 0}\n👑 | List of Teachers of baby\n${output}`,
          event.threadID,
          event.messageID
        );

      } else {

        const d = (await axios.get(`${link}/list-xs`)).data;

        return api.sendMessage(
          `❇️ | Total Teach = ${d.total_questions || "api off"}\n♻️ | Total Response = ${d.total_answers || "api off"}`,
          event.threadID,
          event.messageID
        );

      }

    }

    if (args[0] === 'msg') {

      const fuk = sayem.replace("msg ", "");

      const d = (await axios.get(`${link}/baby-xs`, {
        params: { ask: fuk }
      })).data;

      return api.sendMessage(`Message ${fuk} = ${d.respond}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach') {

      const text = sayem.replace("teach ", "");

      if (!text.includes("-"))
        return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);

      const [ask, answers] = text.split(/\s*-\s*/);

      const replyList = answers.split(",");

      let added = 0;
      let replyText = "";

      for (let i = 0; i < replyList.length; i++) {

        const ans = replyList[i].trim();

        await axios.get(`${link}/teach-xs`, {
          params: {
            ask: ask.trim(),
            ans: ans
          }
        });

        added++;
        replyText += `${i + 1}. ${ans}\n`;

      }

      return api.sendMessage(
`📚 | New Teach Added

❓ Question: ${ask}

💬 Replies Added: ${added}

${replyText}`,
        event.threadID,
        event.messageID
      );
    }

    const d = (await axios.get(`${link}/baby-xs`, {
      params: { ask: sayem }
    })).data;

    const msg = await api.sendMessage(d.respond, event.threadID, event.messageID);

    global.GoatBot.bbyReply ??= {};
    global.GoatBot.bbyReply[msg.messageID] = true;

  } catch (e) {

    console.log(e);

    api.sendMessage("Check console for error", event.threadID, event.messageID);

  }
};

module.exports.onChat = async ({
  api,
  event
}) => {

  try {

    const body = event.body ? event.body.toLowerCase() : "";

    const link = `${await baseApiUrl()}`;


    if (
      event.messageReply &&
      global.GoatBot.bbyReply &&
      global.GoatBot.bbyReply[event.messageReply.messageID]
    ) {

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: body }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply[msg.messageID] = true;

      return;
    }


    if (
      body.startsWith("bot") ||
      body.startsWith("Bot") ||
      body.startsWith("BOT") ||
      body.startsWith("বট") ||
      body.startsWith("𝐛𝐨𝐭") ||
      body.startsWith("𝐁𝐨𝐭") ||
      body.startsWith("𝐁𝐎𝐓")
    ) {

      const arr = body.replace(/^\S+\s*/, "");

      const randomReplies = [
        "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻","আমি এখন বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻","আমাকে না ডেকে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে একটা জি এফ দাও-😽🫶🌺","ঝাং থুমালে আইলাপিউ পেপি-💝😽","উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈","জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂","আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧","ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦","চুনা ও চুনা আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭","স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻","জান হাঙ্গা করবা-🙊😝🌻","জান মেয়ে হলে চিপায় আসো ইউটিউব থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽","ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼","আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর  জন্য দোয়া করবেন-💝💚🌺🌻","- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:- https://www.facebook.com/DEVIL.FARHAN.420","জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽","জান বাল ফালাইবা-🙂🥱🙆‍♂","-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦","oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂","-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে দান করেন-🥱🐰🍒","-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧","-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে-🐸😾🔪","-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧","-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸","তাকাই আছো কেন চুমু দিবা-🙄🐸😘","আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇","-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗","কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻","দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧","-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻","-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻","-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 ধরতে পারছে না-🐸🥲","-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️","—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর সাথে  প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗","—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️","-রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜","সুন্দর মাইয়া মানেই-🥱আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗","এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂","-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸","হুদাই আমারে  শয়তানে লারে-😝😑☹️","-𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸","-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦","-কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧","-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱","-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋","-ইস কেউ যদি বলতো-🙂-আমার শুধু  তোমাকেই লাগবে-💜🌸","-ওই বেডি তোমার বাসায় না আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে জানে মারার কি দরকার-🙄🤧","-একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে ওর মতো আর কেউ ভালবাসেনি-🙂😅","-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧","কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦","-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর মনটা ছাড়া-🥴😑😏","-🫵তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵","-আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸","বেশি Bot Bot করলে leave নিবো কিন্তু😒😒 " , "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺 " , "আমি আবাল দের সাতে কথা বলি না,ok😒" , "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈" , "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈💋 " , "বার বার ডাকলে মাথা গরম হয় কিন্তু😑", "হা বলো😒,কি করতে পারি😐😑?" , "এতো ডাকছিস কোনো?গালি শুনবি নাকি? 🤬","মেয়ে হলে বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর সাথে প্রেম করো🙈??. " ,  "আরে Bolo আমার জান ,কেমন আসো?😚 " , "Bot বলে অসম্মান করচ্ছিছ,😰😿" , "Hop bedi😾,Boss বল boss😼" , "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু" , "Bot না , জানু বল জানু 😘 " , "বার বার Disturb করেছিস কোনো😾,আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর এর সাথে ব্যাস্ত আসি😋" , "আমি গরীব এর সাথে কথা বলি না😼😼" , "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 " , "আরে আমি মজা করার mood এ নাই😒" , "হা জানু , এইদিক এ আসো কিস দেই🤭 😘" , "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣" , "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂 " , "আমাকে ডেকো না,আমি ব্যাস্ত আসি" , "কি হলো ,মিস টিস করচ্ছিস নাকি🤣" , "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏" , "কালকে দেখা করিস তো একটু 😈" , "হা বলো, শুনছি আমি 😏" , "আর কত বার ডাকবি ,শুনছি তো" , "বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে Ummmmha দে 😒" , "বলো কি করতে পারি তোমার জন্য" , "আমি তো অন্ধ কিছু দেখি না🐸 😎" , "Bot না জানু,বল 😌" , "বলো জানু 🌚" , "তোর কি চোখে পড়ে না আমি বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 এর সাথে ব্যাস্ত আসি😒" , "༊━━🦋নামাজি মানুষেরা সব থেকে বেশি সুন্দর হয়..!!😇🥀 🦋 কারণ.!! -অজুর পানির মত শ্রেষ্ঠ মেকআপ দুনিয়াতে নেই༊━ღ━༎🥰🥀 🥰-আলহামদুলিল্লাহ-🥰","- শখের নারী  বিছানায় মু'তে..!🙃🥴","-𝐈'𝐝 -তে সব 𝐖𝐨𝐰 𝐖𝐨𝐰 বুইড়া বেডি-🐸💦","🥛-🍍👈 -লে খাহ্..!😒🥺","- অনুমতি দিলে 𝚈𝚘𝚞𝚃𝚞𝚋𝚎-এ কল দিতাম..!😒","~আমি মারা গেলে..!🙂 ~অনেক মানুষ বিরক্ত হওয়া থেকে বেঁচে  যাবে..!😅💔","🍒---আমি সেই গল্পের বই-🙂 -যে বই সবাই পড়তে পারলেও-😌 -অর্থ বোঝার ক্ষমতা কারো নেই..!☺️🥀💔","~কার জন্য এতো মায়া...!😌🥀 ~এই শহরে আপন বলতে...!😔🥀 ~শুধুই তো নিজের ছায়া...!😥🥀","- কারেন্ট একদম বেডি'গো মতো- 🤧 -খালি ঢং করে আসে আবার চলে যায়-😤😾🔪","- সানিলিওন  আফারে ধর্ষনের হুমকি দিয়ে আসলাম - 🤗 -আর 🫵তুমি য়ামারে খেয়ে দিবা সেই ভয় দেখাও ননসেন বেডি..!🥱😼","- দুনিয়ার সবাই প্রেম করে.!🤧 -আর মানুষ আমার বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 কে সন্দেহ করে.!🐸","- আমার থেকে ভালো অনেক পাবা-🙂 -কিন্তু সব ভালো তে কি আর ভালোবাসা থাকে..!💔🥀","- পুরুষকে সবচেয়ে বেশি কষ্ট দেয় তার শখের নারী...!🥺💔👈","- তোমার লগে দেখা হবে আবার - 😌 -কোনো এক অচেনা গলির চিপায়..!😛🤣👈","- থাপ্পড় চিনোস থাপ্পড়- 👋👋😡 -চিন্তা করিস না তরে মারমু না-🤗 -বস 𝐑𝐉 𝐅𝐀𝐑𝐇𝐀𝐍 আমারে মারছে - 🥱 - উফফ সেই স্বাদ..!🥵🤤💦","- অবহেলা করিস না-😑😪 - যখন নিজেকে বদলে ফেলবো -😌 - তখন আমার চেয়েও বেশি কষ্ট পাবি..!🙂💔","- বন্ধুর সাথে ছেকা খাওয়া গান শুনতে শুনতে-🤧 -এখন আমিও বন্ধুর 𝙴𝚇 কে অনেক 𝙼𝙸𝚂𝚂 করি-🤕🥺","-৯৯টাকায় ৯৯জিবি ৯৯বছর-☺️🐸 -অফারটি পেতে এখনই আমাকে প্রোপস করুন-🤗😂👈","-প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧","•-কিরে🫵 তরা নাকি  prem করস..😐🐸•আমারে একটা করাই দিলে কি হয়-🥺","- যেই আইডির মায়ায় পড়ে ভুল্লি আমারে.!🥴- তুই কি যানিস সেই আইডিটাও আমি চালাইরে.!🙂"
      ];

      if (!arr) {

        const msg = await api.sendMessage(
          randomReplies[Math.floor(Math.random() * randomReplies.length)],
          event.threadID,
          event.messageID
        );

        global.GoatBot.bbyReply ??= {};
        global.GoatBot.bbyReply[msg.messageID] = true;

        return;
      }

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: arr }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply ??= {};
      global.GoatBot.bbyReply[msg.messageID] = true;

    }

  } catch (err) {

    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);

  }

};
