const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const ms = require('ms');
const moment = require('moment');

class AddRoleCommand extends Command {
	constructor() {
		super('addrole', {
			aliases: ['addrole', 'ar'],
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
									description: `Who do you want to add a role to?`,
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
									description: `What role you want to add to them?`,
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
				description: 'Adds given role to a member.',
				usage: 'addrole <user> <role>',
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
			if (!args.member.roles.cache.some((r) => r.id === args.role.id)) {
				await args.member.roles.add(args.role.id).then(async () => {
					await modLogChannel
						.send(
							new Discord.MessageEmbed({
								color: 15850433,
								title: '**Action:** Add Role',
								description: `**Added Role to:** ${
									args.member.user.tag
								}\n**Moderator:** ${message.author.tag}\n**Role Added:** ${
									args.role
								}\n**Added At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
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
									description: `Successfully added ${args.role} to ${args.member}, check ${modLogChannel} for details.`,
								}),
							);
						})
						.catch((err) => {
							return message.channel.send(
								new Discord.MessageEmbed({
									color: 15850433,
									description: `There was an error occurred while trying to add ${args.role} to ${args.member}.\n**Error:** ${err.message}`,
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
			console.log(err);
		}
	}
}

module.exports = AddRoleCommand;
