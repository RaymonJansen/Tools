const Discord = require('discord.js');

exports.crypto = function(con, client){

    let worth, messageID;

    con.query(`SELECT * FROM crypto`, (err, rows) => {
        if (err) throw err;

        worth = rows[0].worth;

        sendCryptoMessage(rows, false);
    });

    let startCryptoInterval = setInterval(checkCrypto, 300000);
    let channel = client.channels.find('name', 'unknown-crypto');

    channel.bulkDelete(99, true).catch(err => {
        console.error(err);
        channel.send('there was an error trying to prune messages in this channel!');
    });

    function checkCrypto() {
        con.query(`SELECT * FROM crypto`, (err, rows) => {
            if (err) throw err;

            let newValue, upOrDownSymbol;

            let percentage = Math.round(Math.random() * 9) + 1;
            let upOrDown = Math.round(Math.random() * 1);
            let getValue = worth / 100 * percentage;

            if (upOrDown === 0) {
                newValue = worth - getValue;
                upOrDownSymbol = '-';
            } else {
                newValue = worth + getValue;
                upOrDownSymbol = '+';
            }

            con.query(`UPDATE crypto SET worth = '${newValue}'`);

            sendCryptoMessage(percentage, upOrDownSymbol);
        });
    }

    function sendCryptoMessage(percentage, upOrDownSymbol) {
        const cryptoEmbed = new Discord.RichEmbed();

        cryptoEmbed.setColor('#108000')
        cryptoEmbed.setTitle(`**_UnknownCrypto Worth_**`);
        cryptoEmbed.setAuthor(`UnknownCrypto`, `${client.user.avatarURL}`, ``)
        cryptoEmbed.setFooter('UnknownCrypto', `${client.user.avatarURL}`);
        cryptoEmbed.addBlankField();

        let today = new Date();
        let date = today.getDate() + '-' + (today.getMonth()+1) + '-'+today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;
        // let timeToday = today.getTime()
        let timeStamp = date + ' ' + time;

        console.log(messageID);

        con.query(`SELECT * FROM crypto`, (err, rows) => {
            if (err) throw err;

            if (messageID) {
                channel.fetchMessage(messageID).then(msg => {
                    if (msg) {
                        cryptoEmbed.addField('Last Update:', `${timeStamp}`, true);
                        cryptoEmbed.addField('Changed With:', `${upOrDownSymbol}${percentage}%`, true);
                        cryptoEmbed.addField('Current Value:', `€${rows[0].worth}`, true);

                        msg.edit(cryptoEmbed);
                    }
                });
            } else {
                cryptoEmbed.addField('Last Update:', `${timeStamp}`, true);
                cryptoEmbed.addField('Current Value:', `€${rows[0].worth}`, true);

                channel.send(cryptoEmbed).then(sent => {
                    messageID = sent.id;
                })
            }
        });
    }
}