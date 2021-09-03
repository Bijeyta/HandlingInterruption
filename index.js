const restify = require('restify');
const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const { BotActivityHandler } = require('./BotActivityHandler')
const { RootDialog } = require('./Dialogs/RootDialogs')
const adapter = new BotFrameworkAdapter({
    appId: '',
    appPassword: ''
})

adapter.onTurnError = async (context, error) => {
    await context.sendActivity('Error has been encountered by Bot');
    console.log('Error has been encountered', error);
}

const server = restify.createServer();

server.listen(3978, () => {
    console.log(`${server.name} is listing to the port ${server.url}`);
})

const memory = new MemoryStorage();
let conversationState = new ConversationState(memory);
const rootDialog = new RootDialog(conversationState)
const mainBot = new BotActivityHandler(conversationState, rootDialog);


server.post('/api/messages', (req,res) => {
    adapter.processActivity(req,res, async(context) => {
        await mainBot.run(context);
    })
})