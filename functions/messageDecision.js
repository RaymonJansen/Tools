exports.messageDecision = function(messageData, user, client, M_ID, C_ID) {
    let CID, MID;
    switch (messageData.emoji.name) {
        case "✅":
            decisionAccept();
            break;
        case "⚠":
            decisionWarn(messageData);
            break;
        case "❌":
            decisionWarnDelete(messageData);
            break;
    }

    function decisionAccept() {

    }

    function decisionWarn(messageData) {
        getMessageContent(messageData);

    }

    function decisionWarnDelete(messageData) {
        getMessageContent(messageData);
        client.channels.cache.get(CID).messages.fetch(MID).then(message  => {
            let userId = message.author.id;
            let channelId = message.channelId;
            message.delete().then(message => {
                client.channels.cache.get(channelId).send(`<@${userId}> **One of your messages has been deleted by a Moderator. This is also a warning!**`)
            });
        });
    }

    function getMessageContent(messageData) {
        console.log("MID")
        console.log("MID")
        messageData.message.embeds[0].fields.forEach(field => {
            if (field.name === C_ID) {
                CID = field.value
            }
            if (field.name === M_ID) {
                MID = field.value
            }
        })
    }
}