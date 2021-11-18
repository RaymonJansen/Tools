let errorReply = require("./../functions/errorReply.js");

module.exports = {
    name: 'buy',
    aliases: ['b'],
    description: 'Buy an product from the store.',
    usage: '<product_name> <amount>',
    guildOnly: true,
    args: true,
    channelName: 'unknowntools',
    execute(con, message, args, client) {
        let userID = message.author.id;
        let serverID = message.guild.id;
        let product = args[0];
        let totalCost, totalAmount, balance, prodID;

        if (message.channel.name !== module.exports.channelName) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, true)
            return;
        }

        if (args.length !== 2) {
            errorReply.errorReply(module.exports.name, module.exports.usage, message, module.exports.channelName, false);
            return;
        }

        if (isNaN(args[1])) {
            message.reply('The amount must be a number!');
            return;
        }

        con.query(`SELECT * FROM store WHERE productName = '${product}'`, (err, rows) => {
            if (rows.length < 1) {
                message.reply(`There is no product called **${product}** in our store.`);
                return;
            }
        });

        con.query(`SELECT * FROM userdata INNER JOIN store WHERE userdata.userID = '${userID}' AND userdata.serverID = '${serverID}' AND store.serverID = '${serverID}' AND store.productName = '${product}'`, (err, rows) => {
            if (err) throw err;

            totalCost = args[1] * rows[0].cost;
            balance = rows[0].moneys - totalCost;

            totalAmount = args[1] * rows[0].quantity;

            prodID = rows[0].id;

            if (rows[0].moneys >= totalCost) {
                con.query(`SELECT * FROM user_inventory WHERE serverID = '${serverID}' AND userID = '${userID}' AND productID = '${prodID}'`, (err, rows) => {
                    if (err) throw err;

                    if (rows.length < 1) {
                        con.query(`INSERT INTO user_inventory (serverID, userID, productID, quantity) VALUES ("${serverID}","${userID}", "${prodID}", "${totalAmount}")`);
                        con.query(`UPDATE userdata SET moneys = '${balance}' WHERE userID = '${userID}' AND serverID = '${serverID}'`);
                        message.channel.send(`:shopping_cart: **` + message.author.username + `** I have added **${totalAmount} ${product}** to your inventory. You have paid **€${totalCost}**, your pocket balance is now **€${balance}**.`)
                        return;
                    } else {
                        let newQuantity = rows[0].quantity + totalAmount;
                        con.query(`UPDATE user_inventory SET quantity = '${newQuantity}' WHERE serverID = '${serverID}' AND userID = '${userID}' AND productID = '${prodID}'`);
                        con.query(`UPDATE userdata SET moneys = '${balance}' WHERE userID = '${userID}' AND serverID = '${serverID}'`);
                        message.channel.send(`:shopping_cart: **` + message.author.username + `** I have added **${totalAmount} ${product}** to your inventory. You have paid **€${totalCost}**, your pocket balance is now **€${balance}**.`)
                        return;
                    }
                })
            } else {
                message.channel.send(`**` + message.author.username + `** You are not able to pay **€${totalCost}**`);
            }
        });
    },
};