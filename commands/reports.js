const Discord = require('discord.js');
let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'reports',
    aliases: ['r'],
    cooldown: '10',
    description: 'Shows help for Reports',
    channelName: 'reports',
    execute(con, message, args, client) {
        if(message.member.roles.cache.some(role => role.name === "Admin") || message.member.roles.cache.some(role => role.name === "Tools") || message.author.id === message.guild.ownerId) {
            if (message.channel.name !== module.exports.channelName) {
                errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
                return;
            }

            if (args.length > 1) {
                message.reply("This command only needs a maximum of one argument!")
                return;
            }

            switch (args[0]) {
                case undefined:
                    reportsNoArgs();
                    break;
                case 'help':
                    reportsHelp();
                    break;
                case 'setup':
                    reportsSetup();
                    break;
            }

            function reportsNoArgs() {

                message.channel.send("EMPTY")
            }

            function reportsHelp() {
                message.channel.send("HELP")
            }

            function reportsSetup() {
                message.channel.send("SETUP")
            }
        } else {
            message.reply('You are not allowed to use this command!');
        }
    },
};