const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`),
);

const {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
} = require('discord-akairo');
require('dotenv').config();
const mongoose = require('mongoose');
class MyClient extends AkairoClient {
	constructor() {
		super(
			{
				ownerID: '488699894023061516',
			},
			{
				disableMentions: 'everyone',
			},
		);
		this.commandHandler = new CommandHandler(this, {
			directory: './src/commands',
			prefix: 's!',
			automateCategories: true,
			allowMention: true,
			blockBots: true,
			blockClient: true,
		});
		this.commandHandler.handle = async function (message) {
			if (
				!(await this.client.db.hdBlacklists.findOne({
					channel_id: message.channel.id,
				}))
			)
				return CommandHandler.prototype.handle.call(this, message);
		};
		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listeners/',
			automateCategories: true,
		});
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});
		this.commandHandler.loadAll();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();

		mongoose
			.connect(
				'mongodb+srv://zyla:6931528Erencan34@ganyu.nvee0.mongodb.net/GanyuBot_Database?retryWrites=true&w=majority',
				{
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				},
			)
			.then(() => console.log('Connected to the database!'));

		this.db = {
			hdWarns: mongoose.model(
				'hdWarns',
				new mongoose.Schema({
					_id: mongoose.Schema.Types.ObjectId,
					warnedStaff: String,
					warnedMember: String,
					reason: String,
					when: Date,
				}),

				'hdWarns',
			),
			hdBlacklists: mongoose.model(
				'hdBlacklists',
				new mongoose.Schema({
					channel_id: String,
					blacklistedBy: String,
				}),
				'hdBlacklists',
			),
		};
	}
}

const client = new MyClient();
client.login();
