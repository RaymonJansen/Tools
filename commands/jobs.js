module.exports = {
    name: 'jobs',
    aliases: ['jobs'],
    cooldown: '3',
    description: 'Shows all Jobs from this server',
    usage: 'jobs',
    args: false,
    channelName: 'unknowntools',
    execute(con, message, args) {
        let serverID = message.guild.id;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        con.query(`SELECT * FROM jobs WHERE serverID = '${serverID}'`, (err, rows) => {
            if (err) throw err;

            let jobs = '', char = '', i = 1;

            rows.forEach((row) => {
                if (i == rows.length) { char = '**.'; } else { char = ', '; }

                jobs += row['name'] + char;
                i++;
            });

            message.reply('These are our jobs: **' + jobs);
        });
    },
};