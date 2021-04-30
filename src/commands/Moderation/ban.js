const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class BanCommand extends Command {
	constructor() {
		super('ban', {
			aliases: ['ban', 'b'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'BAN_MEMBERS',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setDescription("Who's getting banned?")
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
					prompt: {
						start: (message) => {
							const reasonEmbed = new Discord.MessageEmbed()
								.setDescription('Why are you banning them?')
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
				description: 'Bans the member.',
				usage: 'ban <user> <reason>',
			},
		});
	}

	async exec(message, args) {
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
		const bannedEmbed = new Discord.MessageEmbed()
			.setTitle('**Action:** Ban')
			.setDescription(
				`**Banned:** ${args.member.user.tag}\n**Moderator:** ${
					message.author.tag
				}\n**Reason:** ${args.reason}\n**Banned At:** ${moment().format(
					'MMMM Do, hh:mm:ss a',
				)}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(`Their ID: ${args.member.id}`);
		const bannedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been banned from ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Banned At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
			)
			.setColor(15850433)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(
				`If you think you're wrongfully banned, please contact an Admin.`,
			);
		const cantBanStaffEmbed = new Discord.MessageEmbed()
			.setDescription(
				`Sorry but you can't ban other staff members/staff members that has higher perms than you.`,
			)
			.setColor(15850433);
		const bannedToChannelEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.setDescription(
				`${args.member} is successfully banned, check ${modLogChannel} for details.`,
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
		if (
			args.member.roles.highest.position >=
			message.member.roles.highest.position
		)
			return message.channel.send(cantBanStaffEmbed);
		try {
			const banList = await message.guild.fetchBans();

			const bannedUser = banList.find((user) => user.id === args.member.id);

			if (bannedUser)
				return await message.channel.send(
					`${bannedUser.tag} is already banned!`,
				);
			else
				await args.member.ban({ reason: args.reason }).catch((err) => {
					message.channel.send(
						new Discord.MessageEmbed({
							color: 15850433,
							description: `There was an error occurred while trying to ban ${args.member}.\n**Error**: \`${err.message}\``,
						}),
					);
				});

			args.member.send(bannedToDMEmbed).catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed({
						color: 15850433,
						description: `Their DM's set to closed, therefore I couldn't DM them about their ban.\nError: ${err.message}`,
					}),
				);
			});

			modLogChannel.send(bannedEmbed).catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed({
						color: 15850433,
						description: `I could not find a mod log channel to issue the incident.\nError: ${err.message}`,
					}),
				);
			});

			message.channel.send(bannedToChannelEmbed).catch((err) => {
				message.channel.send(err.message);
			});
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = BanCommand;
