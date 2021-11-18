let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'lottery',
    description: 'Gamble your money against a 1/1000 chance to multiply it by 1000.',
    aliases: ['lot', 'jackpot'],
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

        if (args.length < 1) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, false);
            return;
        }

        con.query(`SELECT * FROM userdata WHERE userID = '${userID}' AND serverID = '${serverID}'`, (err, rows) => {
            if (err) throw err;
            let min = 10;
            let moneys = rows[0].moneys;
            let numberToWinNew, numberThrown, numberInDB;

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
                    message.channel.send(':x: The amount to use **.lottery** must be at least **10**.');
                } else {
                    if (moneys >= arg || arg === 'all') {
                        con.query(`SELECT numberToWin FROM lottery WHERE serverID = ${serverID}`, (err, rows) => {
                            if (err) throw err;
                            numberToWinNew = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

                            if (rows.length < 1) {
                                con.query(`INSERT INTO lottery (serverID, numberToWin) VALUES ("${serverID}", "${numberToWinNew}")`)
                            }

                            con.query(`SELECT * FROM lottery INNER JOIN userdata WHERE userdata.userID = '${userID}' AND userdata.serverID = ${serverID} AND lottery.serverID = ${serverID}`, (err, rows) => {
                                numberInDB = rows[0].numberToWin;
                                numberThrown = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

                                if (rows[0].numberToWin === numberThrown) {
                                    moneys = rows[0].moneys * 1000;
                                    con.query(`UPDATE userdata SET moneys = '${moneys}' WHERE userID = '${userID}' AND userdata.serverID = '${serverID}'`);
                                    con.query(`UPDATE lottery SET numberToWin = '${numberToWinNew}' WHERE serverID = '${serverID}'`);
                                    win(numberThrown, rows[0].numberToWin, moneys);
                                } else {
                                    moneys = rows[0].moneys - parseInt(arg);
                                    con.query(`UPDATE userdata SET moneys = '${moneys}' WHERE userID = '${userID}' AND userdata.serverID = '${serverID}'`);
                                    lost(numberThrown, rows[0].numberToWin, moneys);
                                }
                            });
                        });
                    } else {
                        message.reply('You do not have this amount in your bank!')
                    }
                }
            }
        });

        function win(numberThrown, winningNumber, balance) {
            message.channel.send('Congrats, your number was **'
                + numberThrown + '** and the winning number was also **'
                + winningNumber + '**! Your pocket balance is now **€'
                + balance + '**.');
        }

        function lost(numberThrown, winningNumber, balance) {
            message.channel.send('#BadLuck, your number was **'
                + numberThrown + '**, but the winning number is **'
                + winningNumber + '**. Your pocket balance is now **€'
                + balance + '**.');
        }
    },
};