const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class EmbedCommand extends Command {
	constructor() {
		super('embed', {
			aliases: ['embed'],
			ownerOnly: false,
			category: 'Utility',
			channel: 'guild',
			description: {
				description: 'Takes json input and returns embedded message.',
				usage: 'embed <JSONinput>',
			},
		});
	}

	exec(message, args) {
		const permRoles = [
			'796208075463196689', // Admin
			'796208075463196687', // Discord Moderator
			'796208075463196685', // Moderator
			'796208075451007044', // Trial Moderator
			'811337136397221909', // Bot Dev
		];
		var i;
		for (i = 0; i <= permRoles.length; i++) {
			if (
				message.member.roles.cache
					.map((x) => x.id)
					.filter((x) => permRoles.includes(x)).length === 0
			)
				return message.channel.send(
					new Discord.MessageEmbed()
						.setColor(29128)
						.setDescription("You can't do that with the permissions you have."),
				);
		}
		try {
			message.channel.send(
				new Discord.MessageEmbed(
					JSON.parse(message.content.split(' ').splice(1).join(' ')),
				),
			);
		} catch (err) {
			message.channel.send(
				new Discord.MessageEmbed({
					color: 29128,
					description: `There was an error occurred while trying to send given embed.\n**Error:** ${err.message}`,
				}),
			);
		}
	}
}

module.exports = EmbedCommand;
