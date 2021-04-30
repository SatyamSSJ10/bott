const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Your bot is online on Replit.com'));

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
/*const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');*/

class MyClient extends AkairoClient {
	constructor() {
		super(
			{ /*Discord Bot's Owner Id - 649999259193573399*/
				ownerID: '649999259193573399',
			},
			{
				disableMentions: 'everyone',
			},
		);
		this.commandHandler = new CommandHandler(this, {
			directory: './src/commands',
			//prefix: 's!',
			prefix: '',
			automateCategories: true,
			allowMention: true,
			blockBots: true,
			blockClient: true,
		});
		this.commandHandler.handle = async function (message) {
			if (
				!(await this.client.db.ssBlacklists.findOne({
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
				//'mongodb+srv://zyla:6931528Erencan34@ganyu.nvee0.mongodb.net/GanyuBot_Database?retryWrites=true&w=majority',
			//process.env.MONGOOSE_URL,
			process.env.MONGODB,
				{
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				},
			)
			.then(() => console.log('Connected to the database!'));

		this.db = {
			ssWarns: mongoose.model(
				'ssWarns',
				new mongoose.Schema({
					_id: mongoose.Schema.Types.ObjectId,
					warnedStaff: String,
					warnedMember: String,
					reason: String,
					when: Date,
				}),

				'ssWarns',
			),
			ssBlacklists: mongoose.model(
				'ssBlacklists',
				new mongoose.Schema({
					channel_id: String,
					blacklistedBy: String,
				}),
				'ssBlacklists',
			),
		};
	}
}

const client = new MyClient();
client.login();
//PASS488699894023061516
