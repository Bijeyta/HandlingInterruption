
const { InputHints } = require('botbuilder');
const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');
const { payrollDialog, applyLeaveDialog, helpDialog, otherDialog } = require('../Constants/DialogIds')

class CancelAndHelpDialog extends ComponentDialog {
    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {
        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.toLowerCase();
            console.log(text);
            switch (text) {
            case 'help':
            case '?': {
                const helpMessageText = 'Show help here';
                await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                return { status: DialogTurnStatus.waiting };
            }
            case 'cancel':
            case 'quit': {
                const cancelMessageText = 'Cancelling...';
                await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                return await innerDc.cancelAllDialogs();
            }
            // case 'apply leave': {
            //     return await innerDc.beginDialog(applyLeaveDialog);
            // }
            // case 'payroll': {
            //     return await innerDc.beginDialog(payrollDialog);
            // }
            default: {
                if(text === 'apply leave' || text === 'payroll') {
                    console.log('Heloooo');
                    return await innerDc.beginDialog(otherDialog,text);
                } 
                
            }
            }
        }
    }
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;