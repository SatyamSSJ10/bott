const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistsCommand extends Command {
	constructor() {
		super('blacklists', {
			aliases: ['blacklists', 'blist'],
			category: 'Moderation',
			channel: 'guild',
			description: {
				description: 'List blacklisted channels.',
				usage: 'blacklists',
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
		const blacklists = await this.client.db.hdBlacklists.find();
		const noBlacklistsEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription(`There are no blacklisted channels in the database.`);
		if (!blacklists.length) return message.channel.send(noBlacklistsEmbed);
		const blacklistsListEmbed = new Discord.MessageEmbed()
			.setTitle(`List of Blacklisted Channels`)
			.setColor(15850433)
			.setDescription(
				blacklists
					.map(
						(x) =>
							`**Blacklisted Channel: **<#${x.channel_id}>\n**Blacklisted By: ** <@${x.blacklistedBy}>`,
					)
					.join('\n\n'),
			);
		message.channel.send(blacklistsListEmbed);
	}
}

module.exports = BlacklistsCommand;
