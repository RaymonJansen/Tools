const Discord = require('discord.js');

exports.shopListReply = function(args, rows, message, hasValue, client){
    const shopEmbed = new Discord.MessageEmbed();

    let cat = [];
    let catDef;

    shopEmbed.setColor('#c20000')
    shopEmbed.setTitle('**UnknownTools - Shop**');
    shopEmbed.setFooter('UnknownTools - Shop', ``);

    if (hasValue === true) {
        shopEmbed.setDescription(`Here are all the items you can buy in the **${args}** category.`);

        Object.keys(rows).forEach((key) => {
            const row = rows[key];
            shopEmbed.addField(`${row.productName}`, `€${row.cost} per ${row.quantity}.`, true);
        });
    } else if (hasValue === false) {
        shopEmbed.setDescription(`**${args}** is not one of the categories you can choose from, use **.store** to see what categories you can choose from.`);
    } else {
        Object.keys(rows).forEach((key) => {
            const row = rows[key].category;
            cat.push(row);

            catDef = cat.join(' - ');
        });

        shopEmbed.setDescription('To see the items you could buy in the shop, use: **.store <Category>**');
        // shopEmbed.addBlankField();
        shopEmbed.addField(`**All categories:**`, `${catDef}`);
        // shopEmbed.addBlankField();
    }

    message.channel.send({ embeds: [shopEmbed] });
}