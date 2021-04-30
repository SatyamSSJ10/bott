const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistCommand extends Command {
	constructor() {
		super('blacklist', {
			aliases: ['blacklist', 'bl'],
			category: 'Moderation',
			channel: 'guild',
			args: [
				{
					id: 'channel',
					type: 'channel',
					prompt: {
						start: (message) => {
							const channel = new Discord.MessageEmbed()
								.setDescription('Which channel you want me to disable in?')
								.setFooter('Type cancel to cancel the command.')
								.setColor(15850433);
							message.channel.send(channel);
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
			description: {
				description:
					'Add a channel to the database "Blacklists" to disable the bot in that specific channel. (Can be more than one channel)',
				usage: 'blacklist <channel>',
			},
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
		const channelBlacklistedEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription(
				`${args.channel} is added to blacklists, I am now disabled in there.`,
			);
		if (
			!(await this.client.db.hdBlacklists.findOne({
				channel_id: args.channel.id,
			}))
		) {
			await this.client.db.hdBlacklists.create({
				channel_id: args.channel.id,
				blacklistedBy: message.author.id,
			});
			return message.channel.send(channelBlacklistedEmbed);
		} else
			return message.channel.send(
				new Discord.MessageEmbed()
					.setColor(15850433)
					.setDescription(`${args.channel} is already blacklisted!`),
			);
	}
}

module.exports = BlacklistCommand;
