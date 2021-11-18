const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./auth.json');
const { Intents } = require('discord.js');
const { prefix } = require('./config.json');
const database = require('./database.json');
const mysql = require('mysql');
const cooldowns = new Discord.Collection();

const messageReport = require("./functions/messageReport.js");
const messageDecision = require("./functions/messageDecision.js");

const M_ID = "M_ID", C_ID = "C_ID";

const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
    client.user.setStatus('available')
    client.user.setPresence({

        game: {
            name: 'https://www.twitch.tv/monstercat',
            type: "LISTENING",
        }
    });
});

let con = mysql.createConnection({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.database
});

con.connect(err => {
    if (err) {
        throw err;
    }
    console.log("Connected to Database!");
});

con.on('error', function(err) {
    console.log("[mysql error]",err);
    client.channels.cache.find(channel => channel.name === "unknowntools").send(new Discord.Attachment('https://thumbs.gfycat.com/ActualWelltodoGermanshorthairedpointer-size_restricted.gif'));
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    // if (!command.guildOnly) {
    //     return message.reply(':x: I can\'t execute that command inside DMs!');
    // }

    // if (command.args && !args.length) {
    //     let reply = `You didn't provide any arguments, ${message.author}!`;
    //
    //     if (command.usage) {
    //         reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    //     }
    //
    //     return message.channel.send(reply);
    // }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`:x: please wait **${timeLeft.toFixed(0)}** more second(s) before using the \`.${command.name}\` command again.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(con, message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.on('interactionCreate', interaction => {
    console.log('TEST' + interaction)
});

// make sure it's an async function
client.on('messageReactionAdd', async (messageData, user) => {
    // fetch the message if it's not cached
    const message = !messageData.message.author ?
        await messageData.message.fetch() :
        messageData.message;

    console.log(messageData)
    console.log(user)

    if (user != '851864697275154452') {
        console.log("NOT BOT")
        if (messageData.emoji.name === "rep") {
            messageReport.messageReport(messageData, user, client, M_ID, C_ID)
        } else if (messageData.emoji.name === "✅" || messageData.emoji.name === "⚠" || messageData.emoji.name === "❌") {
            if (messageData.message.channelId == client.channels.cache.find(channel => channel.name === "reports")) {
                messageDecision.messageDecision(messageData, user, client, M_ID, C_ID);
            }
        }
    } else {
        console.log("BOT")
    }

});

client.login(token).then(console.log('DONE'));