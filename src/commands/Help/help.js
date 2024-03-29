const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');

class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'h'],
			description: {
				usage: 'help',
				description: 'Summons the help menu or shows info about a command.',
			},
			args: [
				{
					id: 'command',
					type: 'commandAlias',
				},
			],
		});
	}

	async exec(message, args) {
		message.delete();

		const InfoCommands = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields([
				{
					name: 'botinfo',
					value: 'Shows information about the bot.',
				},
				{
					name: 'serverinfo',
					value: 'Shows information about the server.',
				},
			]);
		const ModerationCommands = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields([
				{
					name: 'ban',
					value: 'Bans the user.',
					inline: true,
				},
				{
					name: 'kick',
					value: 'Kicks the user.',
					inline: true,
				},
				{
					name: 'mute',
					value: 'Mute a member for a given duration.',
					inline: true,
				},
				{
					name: 'addrole',
					value: 'Add a role to a member.',
					inline: true,
				},
				{
					name: 'removerole',
					value: 'Remove a role from a member.',
					inline: true,
				},
				{
					name: 'warn',
					value: 'Logs a warn to a member.',
					inline: true,
				},
				{
					name: 'removewarn',
					value: 'Removes a warn from a member.',
					inline: true,
				},
				{
					name: 'warns',
					value: 'Lists warns of a member.',
					inline: true,
				},
				{
					name: 'blacklist',
					value: 'Disables the bot entirely in a given channel.',
					inline: true,
				},
				{
					name: 'removeblacklist',
					value: 'Enables the bot in a given channel.',
					inline: true,
				},
				{
					name: 'blacklists',
					value: 'Lists current blacklisted channels.',
					inline: true,
				},
				{
					name: 'purge',
					value: 'Deletes given amount of messages in a channel.',
					inline: true,
				},
				{
					name: 'setnickname',
					value: "Changes a member's nickname.",
					inline: true,
				},
			]);

		const OwnerOnlyCommands = new Discord.MessageEmbed()
			.setColor(15850433)
			.addField('shutdown', 'Shuts down the bot, requires manual reboot.');

		const RandomCommands = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields([
				{ name: 'cat', value: 'Sends a random cat image/gif.' },
				{ name: 'dog', value: 'Sends a random dog image/gif.' },
			]);

		const ServerCommands = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields([
				{
					name: 'createinvite',
					value: 'Creates and sends an invite link for this server.',
				},
				{
					name: 'membercount',
					value:
						'Shows a total amount of members. (Might not be %100 accurate!)',
				},
			]);

		const SocialCommands = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields([
				{
					name: 'cry',
					value: 'Express your sadness.',
					inline: true,
				},
				{
					name: 'cuddle',
					value: 'Cuddle your best friend!',
					inline: true,
				},
				{
					name: 'hug',
					value: 'Hug your bestie!',
					inline: true,
				},
				{
					name: 'pat',
					value: "Pat your lil bros and sis'",
					inline: true,
				},
				{
					name: 'poke',
					value: 'Is this facebook?',
					inline: true,
				},
				{
					name: 'punch',
					value: 'Punch them in the face!',
					inline: true,
				},
				{
					name: 'slap',
					value: 'Slap slap slap.',
					inline: true,
				},
				{
					name: 'smug',
					value: ':Smug:',
					inline: true,
				},
				{
					name: 'tickle',
					value: 'Tickle them until they die by laughter!',
					inline: true,
				},
			]);

		const UtilityCommands = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields([
				{
					name: 'addquote',
					value:
						'Adds a quote to the database for future use, can be embed but optional.',
					inline: true,
				},
				{
					name: 'removequote',
					value: 'Removes a quote from the database.',
					inline: true,
				},
				{
					name: 'quotes',
					value: 'Lists currently added quotes.',
					inline: true,
				},

				{
					name: 'embed',
					value:
						'Nadeko based embed command, takes JSON input and sends embed.',
					inline: true,
				},
				{
					name: 'reply',
					value: 'Used to DM members anonymously.',
					inline: true,
				},
				{
					name: 'say',
					value: 'Resends the message in the given channel.',
					inline: true,
				},
			]);

		const pages = [
			InfoCommands,
			ModerationCommands,
			OwnerOnlyCommands,
			RandomCommands,
			ServerCommands,
			SocialCommands,
			UtilityCommands,
		];
		const emojiList = ['⬅️', '➡️'];
		const filter = (reaction, user) => {
			return (
				['810658334986338334'].includes(reaction.emoji.id) &&
				user.id === message.author.id
			);
		};
		if (!args.command)
			return paginationEmbed(message, pages, emojiList, 120000).then(
				async (message) => {
					await message.react('810658334986338334');
					message
						.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
						.then((collected) => {
							const reaction = collected.first();

							if (reaction.emoji.id === '810658334986338334')
								return message.delete();
						});
				},
			);

		const helpCmdWithoutAliasesEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields(
				{
					name: `\`${args.command.id}\``,
					value: `${args.command.description.description}`,
				},
				{
					name: 'Usage',
					value: `\`${
						this.client.commandHandler.prefix + args.command.description.usage
					}\``,
				},
			)
			.setFooter(`Category: ${args.command.categoryID}`);

		if (args.command.aliases == args.command.id)
			return message.channel.send(helpCmdWithoutAliasesEmbed);

		const helpCmdWithAliasesEmbed = new Discord.MessageEmbed()
			.setColor(15850433)
			.addFields(
				{
					name: `\`${args.command}\` **/** \`${args.command.aliases[1]}\``,
					value: `${args.command.description.description}`,
				},
				{
					name: 'Usage',
					value: `\`${
						this.client.commandHandler.prefix + args.command.description.usage
					}\``,
				},
			)
			.setFooter(`Category: ${args.command.categoryID}`);

		if (args.command.aliases)
			return message.channel.send(helpCmdWithAliasesEmbed);
	}
}

module.exports = HelpCommand;
