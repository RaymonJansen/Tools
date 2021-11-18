const Discord = require('discord.js');
let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    cooldown: '5',
    description: 'Shows all the items you have in your inventory',
    channelName: 'unknowntools',
    args: false,
    execute(con, message, args, client) {
        let userID = message.author.id;

        const invEmbed = new Discord.RichEmbed();

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        con.query(`SELECT * FROM inventory WHERE userID = '${userID}'`, (err, rows) => {
            if (err) throw err;

            let final = JSON.parse(JSON.stringify(rows));
            let entries = Object.entries(final[0])

            if (rows.length < 1) {
                message.reply('You have not bought anything yet, so you do not have anything in your inventory!');
                return;
            } else {
                invEmbed.setColor('#108000')
                invEmbed.setTitle(`**_User Inventory_**`);
                invEmbed.setThumbnail(message.author.avatarURL);
                invEmbed.setAuthor(`UnknownTools`, `${client.user.avatarURL}`, ``)
                invEmbed.setFooter('UnknownTools - User Inventory', `${client.user.avatarURL}`);
                invEmbed.setDescription(`These are the items you have in your inventory **${message.author.username}**.`);
                invEmbed.addBlankField();

                for (const [product, amount] of entries) {
                    if (product !== 'userID' && amount !== 0) {
                        invEmbed.addField(`${product}:`, `${amount}`, true);
                    }
                }
                message.channel.send(invEmbed);
            }
        });
    },
};