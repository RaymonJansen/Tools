let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'coinflip',
    aliases: ['cf', 'flip'],
    description: 'Gamble your money against a 50/50 chance to win double your betting amount.',
    usage: '<amount>',
    guildOnly: true,
    args: true,
    channelName: 'unknowntools',
    execute(con, message, args) {
        let userID = message.author.id;
        let serverID = message.guild.id;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        if (args.length !== 1) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message );
            return;
        }

        con.query(`SELECT * FROM userdata WHERE userID = '${userID}' AND serverID = '${serverID}'`, (err, rows) => {
            if (err) throw err;
            let min = 10;
            let moneys = rows[0].moneys;

            if (args[0] !== undefined) {
                let arg = args[0];

                if (arg.includes('k')) {
                    arg = arg.replace('k', '000');
                }

                if (arg.includes('m')) {
                    arg = arg.replace('m', '000000');
                }

                if (arg === 'all') {
                    arg = moneys;
                }

                if (parseInt(arg) < min) {
                    message.channel.send(':x: The amount to use **.coinflip** must be at least **100**.');
                } else {
                    if (moneys >= arg || arg === 'all') {
                        let change = Math.random() < 0.5;
                        let answer = ':moneybag: You won!';
                        let balance;

                        if (change == false) {
                            answer = ':money_with_wings: You Lost!';
                            balance = moneys - parseInt(arg);
                        } else {
                            balance = moneys + parseInt(arg);
                        }

                        con.query(`UPDATE userdata SET moneys = '${balance}' WHERE userID = '${userID}' AND userdata.serverID = '${serverID}'`);

                        con.query(`SELECT * FROM userdata WHERE userID = '${userID}' AND serverID = '${serverID}'`, (err, rows) => {
                            if (err) throw err;

                            message.channel.send(answer + ' Your pocket balance is now **€' + rows[0].moneys + '**');
                        });
                    } else {
                        message.reply('You do not have this amount in your bank!')
                    }
                }
            } else {
                message.reply('We are missing an argument, you should use: **.coinflip <amount>**');
            }
        });

    },
};