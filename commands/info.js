const { version } = require('../config.json');

module.exports = {
	name: 'info',
	description: 'Display info about the bot.',
	execute(con, message, args) {
		message.channel.send(`**UnknownTools V${version}**\n\n**Servers:** ${version} | **Users:** ${version}\n**Created by:** MrWeeknie#6710`);
	},
};
