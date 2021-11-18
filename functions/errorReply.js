exports.errorReply = function(name, usage, message, wrongChannel){
    let reply;

    if (wrongChannel === true) {
        reply = `:x: I can not use \`.${name}\` here!`;

    } else {
        reply = `You didn't provide any arguments, ${message.author}!`;

        if (usage) {
            reply += `\nThe proper usage would be: \`.${name} ${usage}\``;
        }
    }
    return message.channel.send(reply);
}
