const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class KickCommand extends Command {
	constructor() {
		super('kick', {
			aliases: ['kick', 'k'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'KICK_MEMBERS',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setDescription("Who's getting kicked?")
								.setFooter('Type cancel to cancel the command.')
								.setColor(15850433);
							message.channel.send(member);
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
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (message) => {
							const reasonEmbed = new Discord.MessageEmbed()
								.setDescription('Why are you kicking them?')
								.setFooter('Type cancel to cancel the command.')
								.setColor(15850433);
							message.channel.send(reasonEmbed);
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
				description: 'Kicks the member.',
				usage: 'kick <user> <reason>',
			},
		});
	}

	async exec(message, args) {
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
		const kickedEmbed = new Discord.MessageEmbed()
			.setTitle('**Action:** Kick')
			.setDescription(
				`**Kicked:** ${args.member.user.tag}\n**Moderator:** ${
					message.author.tag
				}\n**Reason:** ${args.reason}\n**Kicked At:** ${moment().format(
					'MMMM Do, hh:mm:ss a',
				)}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		const kickedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been kicked from ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Kicked At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(
				`If you think you're wrongfully kicked, please contact an Admin.`,
			);
		const cantKickStaffEmbed = new Discord.MessageEmbed()
			.setDescription(
				`Sorry but you can't kick other staff members/staff members that has higher perms than you.`,
			)
			.setColor(15850433);
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
			args.member.roles.highest.position >=
			message.member.roles.highest.position
		)
			return message.channel.send(cantKickStaffEmbed);
		args.member.send(kickedToDMEmbed).catch((err) => {
			message.channel.send(
				new Discord.MessageEmbed({
					color: 15850433,
					description: `Their DM's set to closed, therefore I couldn't DM them about their ban.\nError: ${err.message}`,
				}),
			);
		});
		const kickedToChannelEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription(
				`${args.member} is successfully kicked, check ${modLogChannel} channel for details.`,
			);
		await args.member
			.kick()
			.then(() => {
				modLogChannel.send(kickedEmbed);
				message.channel.send(kickedToChannelEmbed);
			})
			.catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed({
						color: 15850433,
						description: `There was an error occurred while trying to kick ${args.member}.\n**Error**: \`${err.message}\``,
					}),
				);
			});
	}
}

module.exports = KickCommand;
