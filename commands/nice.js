const Discord = require('discord.js');

module.exports = {
    name: 'nice',
    description: 'Returns a thumbsup gif.',
    aliases: ['nice'],
    args: false,
    execute(con, message, args) {
        message.channel.send(
            new Discord.Attachment('https://media.giphy.com/media/yJFeycRK2DB4c/giphy.gif')
        );
    },
};