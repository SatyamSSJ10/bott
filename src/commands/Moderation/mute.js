const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');

class MuteCommand extends Command {
	constructor() {
		super('mute', {
			aliases: ['mute', 'm'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES', 'MUTE_MEMBERS'],
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(`Who's getting muted?`)
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
					id: 'duration',
					type: 'string',
					prompt: {
						start: (message) => {
							const duration = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(`For how long are you muting them?`)
								.setFooter('Type cancel to cancel the command.');
							message.channel.send(duration);
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
								.setDescription(`Why are you muting them?`)
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
				description: 'Mutes the member for a given duration.',
				usage: 'mute <user> <duration> <reason>',
			},
		});
	}

	async exec(message, args) {
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
		const muteRole = message.guild.roles.cache.get('786045122679668758');
		const unMutedToLogsChannelEmbed = new Discord.MessageEmbed()
			.setTitle('**Action:** Unmute')
			.setDescription(
				`**Muted:** ${args.member.user.tag}\n**Moderator:** ${
					message.author.tag
				}\n**Mute Reason was:** ${args.reason}\n**Mute Duration Was:** ${ms(
					ms(args.duration),
					{ long: true },
				)}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		const muteEmbed = new Discord.MessageEmbed()
			.setTitle('**Action:** Mute')
			.setDescription(
				`**Muted:** ${args.member.user.tag}\n**Moderator:** ${
					message.author.tag
				}\n**Reason:** ${args.reason}\n**Muted At:** ${moment().format(
					'MMMM Do, hh:mm:ss a',
				)}\n**Duration:** ${ms(ms(args.duration), {
					long: true,
				})}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		const mutedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been muted in ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Muted At:** ${moment().format(
					'MMMM Do, hh:mm:ss a',
				)}\n**Duration:** ${ms(ms(args.duration), { long: true })}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(
				`If you think you're wrongfully muted, please contact an Admin.`,
			);
		const cantMuteStaffEmbed = new Discord.MessageEmbed()
			.setDescription(
				`Sorry but you can't mute other staff members/staff members that has higher perms than you.`,
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
		try {
			if (
				args.member.roles.highest.position >=
				message.member.roles.highest.position
			)
				return message.channel.send(cantMuteStaffEmbed);
			await args.member.roles.add(muteRole.id).catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed()
						.setcolor(15850433)
						.setDescription(
							`There was an error occurred while trying to mute ${args.member}.\n**Error:** ${err.message}`,
						),
				);
			});
			await setTimeout(async () => {
				await args.member.roles
					.remove(
						message.guild.roles.cache.find(
							(r) => r.id === '786045122679668758',
						),
					)
					.catch((err) => {
						message.channel.send(
							new Discord.MessageEmbed()
								.setcolor(15850433)
								.setDescription(
									`There was an error occurred while trying to unmute ${args.member}.\n**Error:** ${err.message}`,
								),
						);
					})
					.then(() => {
						modLogChannel.send(unMutedToLogsChannelEmbed);
					});
			}, ms(args.duration));
		} catch (err) {
			console.log(err);
		}
		args.member
			.send(mutedToDMEmbed)
			.catch(async (err) =>
				message.channel.send(
					new Discord.MessageEmbed()
						.setColor(15850433)
						.setDescription(
							`${args.member}'s DMs are closed, therefore I could not DM them about this.`,
						),
				),
			);

		modLogChannel.send(muteEmbed);
		const mutedToChannelEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription(
				`${args.member} is successfully muted, check ${modLogChannel} channel for details.`,
			);
		message.channel.send(mutedToChannelEmbed);
	}
}

module.exports = MuteCommand;
