const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class SetNicknameCommand extends Command {
	constructor() {
		super('setnickname', {
			aliases: ['setnickname', 'setnick', 'sn', 'nick'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'CHANGE_NICKNAME',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(`Who's name do you want to change?`)
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
					id: 'newName',
					type: 'string',
					match: 'phrase',
					prompt: {
						start: (message) => {
							const newName = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('What do you want me to change their name to?')
								.setFooter('Type cancel to cancel the command.');
							message.channel.send(newName);
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
							const reason = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription('Why do you want me to change their name?')
								.setFooter('Type cancel to cancel the command.');
							message.channel.send(reason);
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
				description: "Change's people's name.",
				usage: 'setnickname <member> <newName>',
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
		const changedNickEmbed = new Discord.MessageEmbed()
			.setTitle('**Action:** Set Nickname')
			.setDescription(
				`**Changed Nickname of:** ${args.member.user.tag}\n**New Nickname**: ${
					args.newName
				}\n**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Changed At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
		await args.member
			.setNickname(args.newName)
			.then(() => {
				modLogChannel.send(changedNickEmbed).catch((err) => {
					message.channel.send(
						new Discord.MessageEmbed()
							.setColor(15850433)
							.setDescription(
								`There was an error while trying to log the nickname changes.\n**Error:** ${err.message}`,
							),
					);
				});
			})
			.catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor(15850433)
						.setDescription(
							`There was an error while trying to change their nickname.\n**Error:** ${err.message}`,
						),
				);
			});
	}
}

module.exports = SetNicknameCommand;
