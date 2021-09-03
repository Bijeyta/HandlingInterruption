const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, ConfirmPrompt } = require('botbuilder-dialogs');
const { rootDialog, helpDialog, applyLeaveDialog, payrollDialog } = require('../Constants/DialogIds');
const { HelpDialog } = require('./helpDialog');
const { ApplyLeaveDialog } = require('./applyLeave')
const { PayrollDialog } = require('./payrollDialog')
const { OtherDialog } = require('./otherDialog')

const parseMessage = 'parseMessage';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT'

class RootDialog extends ComponentDialog {
    constructor(conversationState) {
        super(rootDialog);
        if(!conversationState) throw new Error('ConversationState is required');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(parseMessage, [
            this.routeMessage.bind(this)
        ]));


        this.addDialog(new HelpDialog(conversationState));
        this.addDialog(new ApplyLeaveDialog(conversationState));
        this.addDialog(new PayrollDialog(conversationState));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new OtherDialog(conversationState));

        this.initialDialogId = parseMessage;

    }

    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dContext = await dialogSet.createContext(context);
        const result = await dContext.continueDialog();
        if(result.status === DialogTurnStatus.empty){
            await dContext.beginDialog(this.id);
        }
    }

    async routeMessage(stepContext) {
        switch(stepContext.context.activity.text.toLowerCase()) {
            case 'apply leave':
                console.log('hiiiiiiiiiii');
                return await stepContext.beginDialog(applyLeaveDialog);
            case 'leave status':
                break;
            case 'help':
                return await stepContext.beginDialog(helpDialog);
            case 'payroll':
                return await stepContext.beginDialog(payrollDialog);
            default:
                await stepContext.context.sendActivity('You have entered something wrong');
        }
        return await stepContext.endDialog();
    }
}

module.exports.RootDialog = RootDialog;