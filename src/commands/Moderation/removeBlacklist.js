const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class RemoveBlacklistCommand extends Command {
	constructor() {
		super('removeblacklist', {
			aliases: ['blacklistremove', 'blr'],
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
					'Remove a channel from the database "Blacklists" to enable the bot in that specific channel.',
				usage: 'blacklistremove <channel>',
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
		if (
			await this.client.db.hdBlacklists.findOne({
				channel_id: args.channel.id,
			})
		) {
			await this.client.db.hdBlacklists.deleteOne(
				{ channel_id: args.channel.id },
				function (err) {
					if (err) console.log(err);
				},
			);
			return message.channel.send(
				new Discord.MessageEmbed()
					.setColor(15850433)
					.setDescription(
						`${args.channel} is removed from blacklisted channels, I am now enabled in there.`,
					),
			);
		} else
			return message.channel.send(
				new Discord.MessageEmbed()
					.setColor(15850433)
					.setDescription(
						`${args.channel} is already removed from blacklists!`,
					),
			);
	}
}

module.exports = RemoveBlacklistCommand;
