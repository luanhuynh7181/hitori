import { ChangeTypeCommand } from "./ChangeTypeCommand";

export class ChangeTypeHistory {
    private commandHistory: ChangeTypeCommand[] = [];
    private index: number = 0;
    executeCommand(command: ChangeTypeCommand): void {
        this.commandHistory.splice(this.index + 1);
        command.execute();
        this.commandHistory.push(command);
        this.index = this.commandHistory.length - 1;
    }

    next(): ChangeTypeCommand {
        const command = this.commandHistory[this.index + 1];
        if (command) {
            this.index++;
            command.execute();
        }
        return command;
    }

    undo(): ChangeTypeCommand {
        const command = this.commandHistory[this.index];
        if (command) {
            this.index--;
            command.undo();
        }
        return command;
    }
}