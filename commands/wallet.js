module.exports = {
    name: 'wallet',
    aliases: ['wallet'],
    cooldown: '3',
    description: 'Shows your wallet',
    usage: 'wallet',
    args: false,
    channelName: 'unknowntools',
    execute(con, message, args) {
        let userID = message.author.id;
        let serverID = message.guild.id;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        con.query(`SELECT * FROM userdata WHERE userID = '${userID}' AND serverID = '${serverID}'`, (err, rows) => {
            if (err) throw err;

            message.reply('Your pocket balance is €' + rows[0].moneys);
        });
    },
};