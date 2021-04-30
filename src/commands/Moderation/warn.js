const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');
const mongoose = require('mongoose');

class WarnCommand extends Command {
	constructor() {
		super('warn', {
			aliases: ['warn', 'w'],
			ownerOnly: false,
			category: 'Moderation',
			clientPermissions: 'KICK_MEMBERS',
			channel: 'guild',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('Who is getting warned?')
								.setFooter('Type cancel to cancel the command.');
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
								.setDescription('Why are you warning them?')
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
				description: 'Warns a member and saving the warn in their warn list.',
				usage: 'warn <member> <reason>',
			},
		});
	}

	async exec(message, args) {
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
		const cantWarnStaffEmbed = new Discord.MessageEmbed()
			.setDescription(
				`Sorry but you can't warn other staff members/staff members that has higher perms than you.`,
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
			return message.channel.send(cantWarnStaffEmbed);
		const warnedEmbed = new Discord.MessageEmbed()
			.setTitle('**Action:** Warn')
			.setDescription(
				`**Warned:** ${args.member.user.tag}\n**Moderator:** ${
					message.author.tag
				}\n**Reason:** ${args.reason}\n**Warned At:** ${moment().format(
					'MMMM Do, hh:mm:ss a',
				)}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		const warnedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been warned in ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Warned At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(
				`Their ID: ${message.author.id}\nIf you think you're wrongfully warned, please contact an Admin.`,
			);
		args.member
			.send(warnedToDMEmbed)
			.catch(async (err) =>
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor(15850433)
						.setDescription(
							`${args.member}'s DMs are closed, therefore I could not DM them about this.`,
						),
				),
			);
		modLogChannel.send(warnedEmbed).catch((err) => {
			message.channel.send(
				new Discord.MessageEmbed()
					.setColor(15850433)
					.setDescription(
						`There was an error occurred while trying to log the incident.\n**Error:** ${err.message}`,
					),
			);
		});
		const warnedToChannelEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription(
				`${args.member} is successfully warned, check ${modLogChannel} channel for details.`,
			);
		message.channel.send(warnedToChannelEmbed);
		await this.client.db.hdWarns.create({
			_id: mongoose.Types.ObjectId(),
			warnedMember: args.member.id,
			warnedStaff: message.author.id,
			reason: args.reason,
			when: message.createdAt,
		});
	}
}

module.exports = WarnCommand;
