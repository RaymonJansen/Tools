const Discord = require('discord.js');
const { prefix } = require('./../config.json')
const reportEmbed = new Discord.MessageEmbed();

exports.messageReport = function(messageData, userID, client, M_ID, C_ID) {
    const reportChannel = client.channels.cache.find(channel => channel.name === "reports");
    let reportedMessage = messageData.message.content;

    if (reportedMessage.length > 1000) {
        reportedMessage = reportedMessage.substring(0,500) + "...";
    } else if (reportedMessage.length === 0) {
        reportedMessage = "Click on the 'GoTo' link to see the message!";
    }

    reportEmbed.setColor('#c20000')
    reportEmbed.setTitle('**Tools - Reports**');
    reportEmbed.setFooter(`For more info on Reports type: ${prefix}reports help`);

    reportEmbed.addField(`Reported by`, `<@${userID.id}>`, true);
    reportEmbed.addField(`GoTo`, `https://discord.com/channels/` + messageData.message.guildId + `/` + messageData.message.channelId + `/` + messageData.message.id, true);
    reportEmbed.addField(`Message`, reportedMessage, false);
    reportEmbed.addField(M_ID, messageData.message.id, true);
    reportEmbed.addField(C_ID, messageData.message.channelId, true);

    reportChannel.send({ embeds: [reportEmbed] }).then(embedMessage => {
        embedMessage.react("✅");
        embedMessage.react("⚠");
        embedMessage.react("❌");
    });
}