let errorReply = require("./../functions/errorReply.js");

// CHECK this all!

module.exports = {
    name: 'work',
    aliases: ['w'],
    cooldown: '180',
    description: 'Just your job, #sadlife!',
    usage: '- No argument(s) needed',
    guildOnly: true,
    args: false,
    channelName: 'unknowntools',
    execute(con, message) {
        let userID = message.author.id;
        let userName = message.author.username;
        let serverID = message.guild.id;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        con.query(`SELECT * FROM userdata WHERE userID = '${userID}' AND serverID = '${serverID}'`, (err, rows) => {
            console.log(rows);
        })

        con.query(`SELECT * FROM userdata INNER JOIN jobs WHERE userdata.userID = '${userID}' AND jobs.jobID = userdata.userLevel AND userdata.serverID = '${serverID}'`, (err, rows) => {
            if (err) throw err;
            let pay;

            console.log(rows);
            return;

            if (rows.length < 1) {
                con.query(`SELECT * FROM jobs WHERE jobID = 1`, (err, rows) => {
                    pay = Math.floor(Math.random() * (rows[0].max - rows[0].min + 1)) + rows[0].min;
                    let moneys = pay;
                    let exp = 1;

                    con.query(`INSERT INTO userdata (serverID, userID, userName, moneys, exp, userLevel) VALUES ("${serverID}", "${userID}", "${userName}", "${pay}", "${exp}", 1)`);

                    sendMessage(con, message, moneys, pay, rows);
                });
            } else {
                if (rows[0].exp === rows[0].reqExp) {
                    let bonus = rows[0].bonus;
                    let moneys = rows[0].moneys + bonus;
                    let newLevel = rows[0].userLevel + 1;
                    let exp = 0;

                    con.query(`UPDATE userdata SET moneys = '${moneys}', exp = '${exp}', userLevel = '${newLevel}'  WHERE userID = '${userID}' AND userdata.serverID = '${serverID}'`);

                    message.channel.send(':confetti_ball: **'
                        + message.author.username + '**, Its your lucky day! You advanced as an employee and have recieved **€'
                        + rows[0].bonus +'** as a one time bonus! You will now work as an **'
                        + rows[0].nextJobName + '**. Your pocket balance is now **€'
                        + moneys + '**.');
                } else {
                    pay = Math.floor(Math.random() * (rows[0].max - rows[0].min + 1)) + rows[0].min;
                    let moneys = rows[0].moneys + pay;
                    let exp = rows[0].exp + 1;

                    con.query(`UPDATE userdata SET moneys = '${moneys}', exp = '${exp}' WHERE userID = '${userID}' AND userdata.serverID = '${serverID}'`);

                    sendMessage(con, message, moneys, pay, rows);
                }
            }
        });

        function sendMessage(con, message, moneys, pay, rows) {
            message.channel.send(':moneybag: **'
                + message.author.username + '**, Its Pay day! You have earned €**'
                + pay +'** working as an **'
                + rows[0].name + '**. Your pocket balance is now **€'
                + moneys + '**.');
        }
    },
};