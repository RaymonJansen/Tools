let shopListReply = require("./../functions/shopListReply.js");
let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'store',
    aliases: ['s'],
    cooldown: '10',
    description: 'Shows all the items you can buy in the store',
    channelName: 'unknowntools',
    execute(con, message, args, client) {
        let rowsHasAValue;
        let serverID = message.guild.id;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        if (args.length === 0) {
            console.log("test")
            con.query(`SELECT DISTINCT category FROM store WHERE serverID = '${serverID}'`, (err, rows) => {
                if (err) throw err;
                shopListReply.shopListReply(args, rows, message, rowsHasAValue, client);
            });
        }

        if (args.length === 1) {
            console.log("test 2")
            con.query(`SELECT * FROM store WHERE category = '${args[0]}' AND serverID = '${serverID}'`, (err, rows) => {
                if (err) throw err;


                rowsHasAValue = (rows.length !== 0);

                shopListReply.shopListReply(args, rows, message, rowsHasAValue, client);
            });
        }
    },
};