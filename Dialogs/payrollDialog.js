const { ComponentDialog, WaterfallDialog,ChoicePrompt, ChoiceFactory, TextPrompt, ConfirmPrompt } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./CancelAndHelpDialogs')
const { payrollDialog } = require('../Constants/DialogIds')

const payrollDialogWF1 = 'helpDialogWF1';
const ChoicePromptDialog = 'ChoicePromptDialog';
const TextPromptDialog = 'TextPromptDialog';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT'

class PayrollDialog extends CancelAndHelpDialog {
    constructor(conversationState) {
        super(payrollDialog);
        if(!conversationState) throw new Error('ConversationState is required');

        this.conversationState = conversationState;

        this.payrollStateAccessor = this.conversationState.createProperty('PayrollStateAccessor');

        this.addDialog(new ChoicePrompt(ChoicePromptDialog));
        this.addDialog(new TextPrompt(TextPromptDialog));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        
        this.addDialog(new WaterfallDialog(payrollDialogWF1, [
            this.someSuggesstions.bind(this),
            this.askanything.bind(this),
            // this.askfurtherprocess.bind(this)
        ]));

        this.initialDialogId = payrollDialogWF1;
    }

    async someSuggesstions(stepContext) {
        return await stepContext.prompt(ChoicePromptDialog, {
            prompt: 'Please help me with the type of option you want for the Payroll',
            choices: ChoiceFactory.toChoices(['RTF', 'CTF', 'MTF'])
        })

    }

    async askanything(stepContext) {
        let dialogData = await this.payrollStateAccessor.get(stepContext.context, {});
        dialogData.promptSelected = stepContext.result.value;
        await stepContext.context.sendActivity(`So you have choosen this prompt ${dialogData.promptSelected}`)
        return stepContext.endDialog();

    }

    // async askfurtherprocess(step) {
    //     await step.context.sendActivity(CONFIRM_PROMPT, `You want to continue previous flow`);
    //     return ComponentDialog.EndOfTurn;
    // }
}

module.exports.PayrollDialog = PayrollDialog;