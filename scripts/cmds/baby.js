const axios = require('axios');

const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot chan"],
    version: "6.9.0",
    author: "FARHAN-KHAN",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NewMessage]"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type #baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit);
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event, Reply }) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event, message, usersData }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const triggers = ["baby", "বট", "bby", "বাবু", "jan", "babu", "সিজুকা", "সিজু", "জানু", "জান", "বেবি", "sizuka", "sizu", "bbz", "janu"];

        if (triggers.some(trigger => body.startsWith(trigger))) {
            const arr = body.replace(/^\S+\s*/, "");
            const name = await usersData.getName(event.senderID).catch(() => "Unknown");

            const randomReplies = [
                "𝗕𝗮𝗯𝘆 𝗞𝗵𝘂𝗱𝗮 𝗟𝗮𝗴𝗰𝗵𝗲🥺",
"𝗛𝗼𝗽 𝗕𝗲𝗱𝗮😾,𝗕𝗼𝘀𝘀 বল 𝗕𝗼𝘀𝘀😼",
"আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",
"𝗡𝗮𝘄 𝗔𝗺𝗮𝗿 𝗕𝗼𝘀𝘀 𝗞 𝗠𝗲𝗮𝘀𝘀𝗮𝗴𝗲 𝗗𝗮𝘄 https://www.facebook.com/MR.FARHAN.420",
"গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
"বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
"𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__😘😘",
"এটায় দেখার বাকি সিলো_🙂🙂🙂",
"𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒",
"𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
"বেশি 𝗕𝗯𝘆 𝗕𝗲𝗯𝘆 করলে 𝗟𝗲𝗮𝘃𝗲 নিবো কিন্তু 😒😒",
"বেশি বেবি বললে কামুর দিমু 🤭🤭",
"𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
"আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
"𝗕𝗯𝘆 বললে চাকরি থাকবে না",
"𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, ফারহান, ফারহান ও তো করতে পারো😑?",
"আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
"🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
"হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿",
"𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
"আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
"খাওয়া দাওয়া করসো 🙄",
"এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
"আরে আমি মজা করার 𝗠𝗼𝗼𝗱 এ নাই😒",
"𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
"আরে Bolo আমার জান, কেমন আসো? 😚",
"একটা 𝗕𝗙 খুঁজে দাও 😿",
"𝗢𝗶 𝗠𝗮𝗺𝗮 𝗔𝗿 𝗗𝗮𝗸𝗶𝘀 𝗡𝗮 𝗣𝗶𝗹𝗶𝘇 😿",
"𝗔𝗺𝗮𝗿 𝗝𝗮𝗻𝘂 𝗟𝗮𝗴𝗯𝗲 𝗧𝘂𝗺𝗶 𝗞𝗶 𝗦𝗶𝗻𝗴𝗲𝗹 𝗔𝗰𝗵𝗼?",
"আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
"তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
"আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না🙄",
"চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
"আমি অন্যের জিনিসের সাথে কথা বলি না_😏ওকে",
"বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
"ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗",
"শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
"আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
"বলো কি করতে পারি তোমার জন্য 😚",
"কথা দেও আমাকে পটাবা...!! 😌",
"বার বার Disturb করেছিস কোনো, আমার জানু এর সাথে ব্যাস্ত আসি 😋",
"আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺",
"বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
"Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
"আজকে আমার mন ভালো নেই 🙉",
"আমি হাজারো মশার 𝗖𝗿𝘂𝘀𝗵😓",
"ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
"__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
"মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚"
            ];

            let messageBody;
            if (!arr) {
                const rand = randomReplies[Math.floor(Math.random() * randomReplies.length)];
                messageBody = {
                    body: `𓆩» ${name} «𓆪\n\n${rand}`,
                    mentions: [{ tag: name, id: event.senderID }]
                };
            } else {
                const link = await baseApiUrl();
                const a = (await axios.get(`${link}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
                messageBody = {
                    body: `𓆩» ${name} «𓆪\n\n${a}`,
                    mentions: [{ tag: name, id: event.senderID }]
                };
            }

            await api.sendMessage(messageBody, event.threadID, (error, info) => {
                if (!info) return;
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
