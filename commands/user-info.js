module.exports = {
	name: 'user-info',
	description: 'Display info about yourself.',
	execute(con, message, args) {
		message.reply(`\nYour username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};
