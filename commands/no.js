const Discord = require('discord.js');

module.exports = {
    name: 'no',
    description: 'Returns a "No" gif.',
    execute(con, message, args) {
        message.channel.send(
            new Discord.Attachment('https://media1.giphy.com/media/ToMjGpx9F5ktZw8qPUQ/200.gif')
        );
    },
};