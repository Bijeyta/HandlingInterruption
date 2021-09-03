const { ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, ConfirmPrompt, ChoicePrompt, ChoiceFactory } = require('botbuilder-dialogs');
const { rootDialog, helpDialog, applyLeaveDialog, payrollDialog, otherDialog } = require('../Constants/DialogIds');
const { CancelAndHelpDialog } = require('./CancelAndHelpDialogs')
const INTERRUPT_DIALOG = 'INTERRUPT_DIALOG'
const ConfirmPromptDialog = 'ConfirmPromptDialog'
const ChoicePromptDialog = 'ChoicePromptDialog'
class OtherDialog extends CancelAndHelpDialog {
    constructor(conversationState) {
        super(otherDialog);
        if(!conversationState) throw new Error('ConversationState is required');
        this.conversationState = conversationState;

        this.otherDialogStateAccessor = this.conversationState.createProperty('OtherDialogStateAccessor');

        this.addDialog(new ConfirmPrompt(ConfirmPromptDialog))
        this.addDialog(new WaterfallDialog(INTERRUPT_DIALOG, [
            this.intentStep.bind(this),
            this.summaryStep.bind(this),
            this.demoStep.bind(this)
        ]));

        this.initialDialogId = INTERRUPT_DIALOG;
    }

    async intentStep(stepContext) {
        const text = stepContext.options;
        console.log(stepContext.options)
        switch(text) {
            case 'apply leave':
                return await stepContext.beginDialog(applyLeaveDialog);
            case 'payroll':
                return await stepContext.beginDialog(payrollDialog);
        }
    }

    async summaryStep(stepContext) {
        await stepContext.prompt(ChoicePromptDialog, {
            prompt: `Do you want to continue previous flow`,
            choices: ChoiceFactory.toChoices(['Yes', 'No'])
        });
        return ComponentDialog.EndOfTurn;
    }

    // async summaryStep(stepContext) {
    //     return await stepContext.prompt(ConfirmPromptDialog, `You want to continue previous flow`);
    // }

    async demoStep(stepContext) {
        let dialogData = await this.otherDialogStateAccessor.get(stepContext.context, {});
        dialogData.promptSelected = stepContext.result.value;
        console.log(dialogData.promptSelected, 'bbbbbbbbbbbbbbbbbbbbbbbb');
        if(dialogData.promptSelected === 'Yes'){
            console.log(dialogData.promptSelected, 'uuuuuuuuuuuuuuuuuuuu')
            return await stepContext.continueDialog();
        } else if(dialogData.promptSelected === 'No') {
            await stepContext.context.sendActivity("What else can I do for you?");
            return await stepContext.parent.cancelAllDialogs();
        }
    }   
    
//     async demoStep(stepContext) {            "Both will works"
//         console.log(stepContext.result)  
//         if (stepContext.result) {
//             console.log(stepContext.result, 'if parttttt');
//              return await stepContext.endDialog();
//         } else {
//              await stepContext.context.sendActivity(`OK, please let me know if there is anything else I can do for you.`);
//              return await stepContext.parent.cancelAllDialogs();
//         }
//    } 
}

module.exports.OtherDialog = OtherDialog;