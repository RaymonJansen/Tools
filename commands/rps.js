let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'rps',
    aliases: ['rps'],
    cooldown: '3',
    description: 'Rock, Paper, Scissors against the bot.',
    usage: '<rock, paper or scissor> <amount>',
    args: true,
    channelName: 'unknowntools',
    execute(con, message, args) {
        let userID = message.author.id;
        let serverID = message.guild.id;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        if (!['paper', 'rock', 'scissor'].includes(args[0])) return message.channel.send('The first argument must be **rock**, **paper** or **scissor**.');
        if ([null, '', undefined].includes(args[1])) return message.channel.send('There must be a second argument.');
        if (args[1] === NaN) return message.channel.send('The second argument must be a number.');

        con.query(`SELECT * FROM userdata WHERE userID = '${userID}' AND serverID = '${serverID}'`, (err, rows) => {
            if (err) throw err;

            let arg = args[1];
            let balance = rows[0].moneys;
            let newBalance, channelMessage, min = 10, extraMessage = 'now';

            if (arg.includes('k')) {
                arg = arg.replace('k', '000');
            }

            if (arg.includes('m')) {
                arg = arg.replace('m', '000000');
            }

            if (arg === 'all') {
                arg = rows[0].moneys;
            }

            if (parseInt(arg) < min) {
                message.channel.send(':x: The amount to use **.rps** must be at least **' + min + '**.');
            } else {
                if (balance >= arg || arg === 'all') {
                    let botsAnswer = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
                    let botChoose;
                    if (botsAnswer === 1) botChoose = 'Rock';
                    if (botsAnswer === 2) botChoose = 'Paper';
                    if (botsAnswer === 3) botChoose = 'Scissor';

                    // USER WINS
                    if ((args[0] === 'rock' && botsAnswer === 3) || (args[0] === 'paper' && botsAnswer === 1) || (args[0] === 'scissor' && botsAnswer === 2)) {
                        newBalance = balance + parseInt(arg);
                        con.query(`UPDATE userdata SET moneys = '${newBalance}' WHERE userID = '${userID}' AND userdata.serverID = '${serverID}'`);
                        channelMessage = 'You won!';
                        message.channel.send(':confetti_ball: The bot chose: **' + botChoose + '**, You won!')
                    }
                    // TIE
                    else if ((args[0] === 'rock' && botsAnswer === 1) || (args[0] === 'paper' && botsAnswer === 2) || (args[0] === 'scissor' && botsAnswer === 3)) {
                        channelMessage = ':scales: The bot also chose: **' + botChoose + '**, It was a Tie! You did not win or lose anything!';
                        extraMessage = 'still'
                    }
                    // USER LOSES
                    else if ((args[0] === 'rock' && botsAnswer === 2) || (args[0] === 'paper' && botsAnswer === 3) || (args[0] === 'scissor' && botsAnswer === 1)) {
                        newBalance = balance - arg;
                        con.query(`UPDATE userdata SET moneys = '${newBalance}' WHERE userID = '${userID}' AND userdata.serverID = '${serverID}'`);
                        channelMessage = ':wastebasket: The bot chose: **' + botChoose + '**, You lost! #SadLife,';
                    }

                    con.query(`SELECT * FROM userdata WHERE userID = '${userID}' AND serverID = '${serverID}'`, (err, rows) => {
                        if (err) throw err;

                        message.channel.send(channelMessage + ' Your pocket balance is ' + extraMessage + ' **€'
                            + rows[0].moneys + '**.');
                    });
                } else {
                    message.reply('You do not have this amount in your bank!')
                }
            }
        });
    },
};