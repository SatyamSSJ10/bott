const { Command } = require('discord-akairo');
const mongoose = require('mongoose');
const Discord = require('discord.js');
const moment = require('moment');

class RemoveWarnCommand extends Command {
	constructor() {
		super('removewarn', {
			aliases: ['removewarn', 'rw'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription("Who's warn you want to remove?")
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
					id: 'warnID',
					type: 'string',
					match: 'rest',
					prompt: {
						start: (message) => {
							const whichWarnEmbed = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(
									`Which warn did you want to remove? (Supply Warn ID)`,
								)
								.setFooter('Type cancel to cancel the command.');
							message.channel.send(whichWarnEmbed);
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
					"Remove a warn from a member's warn list using their Warn ID.",
				usage: 'removewarn <member> <warnID>',
			},
		});
	}

	async exec(message, args) {
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
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
		const warnID = args.warnID.toString();
		const warns = await this.client.db.hdWarns.find({
			warnedMember: args.member.id,
		});
		const warnRemovedEmbed = new Discord.MessageEmbed()
			.setTitle('**Action:** Remove Warn')
			.setColor(15850433)
			.setDescription(
				`**Removed Warn from:** ${args.member.user.tag}\n**Moderator:** ${
					message.author.tag
				}\n**At:** ${moment().format(
					'MMMM Do, hh:mm:ss a',
				)}\n**Warn Reason was:** ${warns.map((x) => x.reason)}`,
			)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		await this.client.db.hdWarns
			.deleteOne({ _id: warnID }, function (err) {
				if (err) return handleError(err);
			})
			.then(() => {
				modLogChannel.send(warnRemovedEmbed);
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor(15850433)
						.setDescription(
							`**${warnID}** successfully removed from ${args.member}, check ${modLogChannel} for details.`,
						),
				);
			});
	}
}

module.exports = RemoveWarnCommand;
