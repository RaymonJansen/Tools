let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'stream',
    aliases: ['str'],
    cooldown: '240',
    description: 'Creates all needed channels to stream.',
    guildOnly: true,
    args: false,
    channelName: 'unknowntools',
    execute(con, message, args, client) {
        let server = message.guild;
        let cat = message.author.username + '\'s stream';
        let startInterval;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        let rooms = [
            ["Chat", "text"],
            ["Waiting Room", "voice"],
            ["Stream Room", "voice"],
        ];
        let servers = [];

        let checkCategory = server.channels.find(c => c.name == cat && c.type == 'category');
        if (!checkCategory){
            message.reply('I will now create all the rooms you need, give me a second!');

            server.createChannel(`${cat}`, "category");

            Object.keys(rooms).forEach(async (key) => {
                const row = rooms[key];

                await server.createChannel(`${row[0]}`, `${row[1]}`)
                    .then(async channel => {
                        let category = server.channels.find(c => c.name == cat && c.type == 'category');

                        servers.push(channel.id);

                        await channel.setParent(category.id);
                    }).catch(console.error);
            });
            message.reply('There now should be a category called: **#' + cat + '** \n\nThese channels will be removed after **5 minutes** when you are not in one of the newly made channels! \n\nHave a nice stream!');
        } else {
            message.reply('There already is a room for you!');
            return;
        }

        setTimeout(deleteMessages, 30000);

        function deleteMessages() {
            startInterval = setInterval(deleteChannels, 300000);
            message.channel.bulkDelete(3, true).catch(err => {
                console.error(err);
                message.channel.send('there was an error trying to prune messages in this channel!');
            });
        }

        function deleteChannels() {
            let streamChannels = [];

            servers.forEach(function(serverId) {
                const fetchedChannel = message.guild.channels.find(r => r.id === serverId);

                if (message.member.voiceChannel === fetchedChannel) {
                    streamChannels.push('Yes');
                } else {
                    streamChannels.push('No');
                }
            });

            if (streamChannels.includes('Yes')) message.reply('I cant remove the channels when you are in on of them!');

            if (!streamChannels.includes('Yes')) {
                servers.forEach(function(serverId) {
                    const fetchedChannel = message.guild.channels.find(r => r.id === serverId);

                    fetchedChannel.delete();
                    clearInterval(startInterval);
                });
            }
        }
    },
};