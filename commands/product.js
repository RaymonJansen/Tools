let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'product',
    aliases: ['p'],
    usage: '<add|edit> <product_name> <cost> <store_category> <sell_price> <quantity>',
    cooldown: 3,
    description: 'Adds a product to the store, or Edits a product from the store.',
    guildOnly: true,
    args: true,
    channelName: 'unknowntools',
    execute(con, message, args, client) {
        let serverID = message.guild.id;

        if(message.member.roles.cache.some(role => role.name === "Admin") || message.member.roles.cache.some(role => role.name === "Tools") || message.author.id === message.guild.ownerId) {
            let productPrice, productCategory, productSellPrice, productQuantity;

            if (message.channel.name !== module.exports.channelName) {
                errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
                return;
            }

            if (args.length !== 6) {
                errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, false);
                return;
            }

            if (isNaN(args[2])){
                sendMessage(`<cost> must be a number!`);
            } else if (isNaN(args[4])) {
                sendMessage(`<sell_price> must be a number!`);
            } else if (isNaN(args[5])) {
                sendMessage(`<quantity> must be a number!`);
            } else if (!isNaN(args[0])) {
                sendMessage(`<add|edit> can not be a number!`);
            } else if (!isNaN(args[1])) {
                sendMessage(`<product_name> can not be a number!`);
            } else if (!isNaN(args[3])) {
                sendMessage(`<store_category> can not be a number!`);
            }

            con.query(`SELECT * FROM store WHERE productName = '${args[1]}' AND serverID = '${serverID}'`, (err, rows) => {
                if (err) throw err;

                if (args[0] === 'add') {
                    if (rows.length < 1) {
                        con.query(`INSERT INTO store (serverID, productName, cost, category, sell, quantity) VALUES ("${serverID}", "${args[1]}", "${args[2]}", "${args[3]}", "${args[4]}", "${args[5]}")`);
                        sendMessage(`A new product has been added to the store:
                    **Product Name:** ${args[1]}
                    **Product Price:** €${args[2]}
                    **Category:** ${args[3]}
                    **Sell Price:** €${args[4]}
                    **Quantity** ${args[5]}`);
                    } else {
                        sendMessage(`There already is a product called: **${args[1]}**`);
                    }
                }

                if (args[0] === 'edit') {
                    if (rows.length === 1) {
                        productPrice = rows[0].cost;
                        productCategory = rows[0].category;
                        productSellPrice = rows[0].sell;
                        productQuantity = rows[0].quantity;

                        con.query(`UPDATE store SET cost = '${args[2]}', category = '${args[3]}', sell = '${args[4]}', quantity = '${args[5]}' WHERE productName = '${args[1]}' AND serverID = '${serverID}'`);
                        sendMessage(`The following product has been edited:
                    **Product Name:** ${args[1]}
                    **Product Price:** €${productPrice} -> €${args[2]}
                    **Category:** ${productCategory} -> ${args[3]}
                    **Sell Price:** €${productSellPrice} -> €${args[4]}
                    **Quantity** ${productQuantity} -> ${args[5]}`);
                    } else {
                        sendMessage(`There is no product called: **${args[1]}**, Try using **.product add** or **.p add** instead!`);
                    }
                }
            });
        } else {
            sendMessage('You are not allowed to use this command!');
        }

        function sendMessage(newMessage) {
            message.reply(newMessage);
        }
    },
}