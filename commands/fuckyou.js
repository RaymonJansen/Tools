const Discord = require('discord.js');

module.exports = {
    name: 'fuckyou',
    description: 'Returns a Gif with middlefinger.',
    aliases: ['fu'],
    execute(con, message, args) {
        if (args[0] === '<@505836645052973057>') {
            message.react('😭');
            return message.reply('No FU',
                new Discord.Attachment('https://media3.giphy.com/media/x1kS7NRIcIigU/giphy.gif?cid=790b76115d1fb3856164347855a3dc6b&rid=giphy.gif')
            );
        }

        message.channel.send(
            new Discord.Attachment('https://media3.giphy.com/media/x1kS7NRIcIigU/giphy.gif?cid=790b76115d1fb3856164347855a3dc6b&rid=giphy.gif')
        );
    },
};