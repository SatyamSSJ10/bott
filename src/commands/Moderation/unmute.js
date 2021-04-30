const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class UnmuteCommand extends Command {
	constructor() {
		super('unmute', {
			aliases: ['unmute', 'um'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'MANAGE_ROLES',
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: (message) => {
							const member = new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(`Who's getting unmuted?`)
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
			],
			description: {
				description: 'Unmutes the member.',
				usage: 'unmute <member>',
			},
		});
	}

	async exec(message, args) {
		const modLogChannel = this.client.channels.cache.find(
			(c) => c.id === '796208075651678222',
		);
		const muteRole = message.guild.roles.cache.get('786045122679668758');
		args.member.timeout = message.client.setTimeout(async () => {
			try {
				const permRoles = [
					'803065968426352640', // Qixing Secretary
					'795102781346021376', // Head Admin
					'786025543124123698', // Server Admin
					'786025543124123699', // Network Admin
					'786025543085981705', // Moderator
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
								.setDescription(
									"You can't do that with the permissions you have.",
								),
						);
				}
				await args.member.roles.remove(muteRole.id);
				const unmuteEmbed = new Discord.MessageEmbed()
					.setTitle('**Action:** Unmute')
					.setDescription(
						`**Unmuted:** ${args.member.user.tag}\n**Moderator:** ${message.author.tag}`,
					)
					.setColor(15850433)
					.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
					.setFooter(`Their ID: ${args.member.id}`);
				const unmutedToDMEmbed = new Discord.MessageEmbed()
					.setTitle(`You are now unmuted in ${message.guild.name}`)
					.setDescription(`**Moderator:** ${message.author.tag}`)
					.setColor(15850433)
					.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
					.setFooter(`Their ID: ${message.author.id}\n`);
				args.member
					.send(unmutedToDMEmbed)
					.catch(async (err) =>
						message.channel.send(
							new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(
									`${args.member}'s DMs are closed, therefore I could not DM them about this.`,
								),
						),
					);
				modLogChannel
					.send(unmuteEmbed)
					.catch(async (err) =>
						message.channel.send(
							new Discord.MessageEmbed()
								.setColor(15850433)
								.setDescription(
									`There was an error while trying to log the issue in ${modLogChannel}.\n**Error:** ${err.message}`,
								),
						),
					);
				const mutedToChannelEmbed = new Discord.MessageEmbed()
					.setColor(15850433)
					.setDescription(`${args.member} is now unmuted.`);
				message.channel.send(mutedToChannelEmbed);
			} catch (err) {
				console.log(err);
			}
		});
	}
}

module.exports = UnmuteCommand;
