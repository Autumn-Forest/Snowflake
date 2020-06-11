import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const smartResponse = smartResponses.find(r => r.regex.test(msg.content))?.responses;

	const output = msg.client
		.newEmbed('BASIC')
		.setAuthor(msg.member?.displayName || msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
		.setDescription(
			smartResponse ? smartResponse[Math.floor(Math.random() * smartResponse.length)] : responses[Math.floor(Math.random() * responses.length)]
		);

	return msg.channel.send(output);
};

export const command: Command = {
	aliases: ['8b', 'eightball', 'fortune'],
	description: 'Let the magic 8ball predict your fate 🎱',
	usage: '<question>',
	args: 1,
	devOnly: false,
	guildOnly: false,
	nsfw: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

const smartResponses = [
	{
		regex: /(are you|is).*(snowflake|<@!?709570149107367966>)?.*(good|nice|well ?made|decent|better|best).*bot/i,
		responses: ['Did you really think I would say no?', 'Of course I am, silly.', 'Are you kidding? Yes, I am!', 'Yup!', 'Definitely!']
	},
	{
		regex: /(are you|is).*(snowflake|<@!?709570149107367966>)?.*(bad|shit|poor(ly)? ?made|trash|horrible|meh|worse).*bot/i,
		responses: [
			'Did you really think I would say yes?',
			'Of course not, silly.',
			'Are you kidding? No, I am not!',
			'Ruuude!',
			'How dare you?!',
			'Stoooooop bullying me (≧Д≦)'
		]
	},
	{
		regex: /(should|can|may).*((kms)?.*(kill|end).*my.*(self|life|live)|((commit|do).*(suicide|toaster ?bath|death|unalive))|kms)/i,
		responses: [
			"No, you shouldn't. You are cared for.\n[You can find some Mental Health Resources here!](https://gist.github.com/Mattis6666/64f8bac9da65cac64953bf0b0a5425aa)"
		]
	},
	{
		regex: /should.*i.*(learn|practice|study|work)/i,
		responses: ['You totally should!', 'Yup! Try to motivate yourself :3', 'Yessss!']
	}
];

const responses = [
	'As I see it, yes.',
	'Ask again later.',
	'Better not tell you now.',
	'Cannot predict now.',
	'Concentrate and ask again.',
	'Don’t count on it.',
	'It is certain.',
	'It is decidedly so.',
	'Most likely.',
	'My reply is no.',
	'My sources say no.',
	'Outlook not so good.',
	'Outlook good.',
	'Reply hazy, try again.',
	'Signs point to yes.',
	'Very doubtful.',
	'Without a doubt.',
	'Yes.',
	'Yes – definitely.',
	'You may rely on it.'
];
