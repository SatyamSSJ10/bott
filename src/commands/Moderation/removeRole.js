const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const ms = require('ms');
const moment = require('moment');

class RemoveRoleCommand extends Command {
	constructor() {
		super('removerole', {
			aliases: ['removerole', 'rr'],
			category: 'Moderation',
			clientPermissions: ['MANAGE_ROLES'],
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							message.channel.send(
								new Discord.MessageEmbed({
									color: 15850433,
									description: `Who do you want to remove a role from?`,
									footer: 'Type cancel to cancel the command.',
								}),
							);
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
					id: 'role',
					type: 'role',
					prompt: {
						start: (message) => {
							message.channel.send(
								new Discord.MessageEmbed({
									color: 15850433,
									description: `What role you want to remove from them?`,
									footer: 'Type cancel to cancel the command.',
								}),
							);
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
				description: 'Removes given role from a member.',
				usage: 'removerole <user> <role>',
			},
		});
	}

	async exec(message, args) {
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
		const cantARStaffEmbed = new Discord.MessageEmbed()
			.setDescription(
				`Sorry but you can't add role to other staff members/staff members that has higher perms than you.`,
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
			return message.channel.send(cantARStaffEmbed);
		try {
			if (args.member.roles.cache.some((r) => r.id === args.role.id)) {
				await args.member.roles.remove(args.role.id).then(async () => {
					await modLogChannel
						.send(
							new Discord.MessageEmbed({
								color: 15850433,
								title: '**Action:** Remove Role',
								description: `**Removed Role from:** ${
									args.member.user.tag
								}\n**Moderator:** ${message.author.tag}\n**Role Removed:** ${
									args.role
								}\n**Removed At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
								thumbnail: {
									url: args.member.user.displayAvatarURL({
										dynamic: true,
									}),
								},
								footer: {
									text: `Their ID: ${args.member.id}`,
								},
							}),
						)
						.then(async () => {
							await message.channel.send(
								new Discord.MessageEmbed({
									color: 15850433,
									description: `Successfully removed ${args.role} from ${args.member}, check ${modLogChannel} for details.`,
								}),
							);
						})
						.catch((err) => {
							return message.channel.send(
								new Discord.MessageEmbed({
									color: 15850433,
									description: `There was an error occurred while trying to remove ${args.role} from ${args.member}.\n**Error:** ${err.message}`,
								}),
							);
						});
				});
			} else {
				return message.channel.send(
					new Discord.MessageEmbed({
						color: 15850433,
						description: `${args.member} already has ${args.role}!`,
					}),
				);
			}
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = RemoveRoleCommand;
