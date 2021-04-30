const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class PurgeCommand extends Command {
	constructor() {
		super('purge', {
			aliases: ['purge', 'clear'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			description: {
				description: 'Purges the given amount of messages.',
				usage: 'purge <amount>',
			},
			args: [
				{
					id: 'amount',
					type: 'number',
					prompt: {
						start: (message) => {
							const amount = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(
									`How many messages do you want to purge? (Has to be between 1-100)`,
								)
								.setFooter('Type cancel to cancel the command.');
							message.channel.send(amount);
						},
						retry: (message) => {
							const retryEmbed = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(`Please supply a correct argument.`);
							message.channel.send(retryEmbed);
						},
						cancelWord: 'cancel',
						cancel: (message) => {
							const cancelEmbed = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('Command has been canceled.');
							message.channel.send(cancelEmbed);
						},
					},
				},
			],
		});
	}

	async exec(message, args) {
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
						.setColor(15850433)
						.setDescription("You can't do that with the permissions you have."),
				);
		}
		const purgedEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription(`Successfully purged ${args.amount} messages.`);
		message.delete();
		await message.channel.bulkDelete(args.amount).catch((err) => {
			message.channel.send(
				`There was an error occurred while trying to purge.\n**Error:** ${err.message}`,
			);
		});
		message.channel.send(purgedEmbed).then((msg) => {
			msg.delete({ timeout: 5000 });
		});
	}
}

module.exports = PurgeCommand;
