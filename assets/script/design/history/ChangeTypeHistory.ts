import { ChangeTypeCommand } from "./ChangeTypeCommand";

export class ChangeTypeHistory {
    private commandHistory: ChangeTypeCommand[] = [];
    private index: number = -1;
    add(command: ChangeTypeCommand): void {
        this.commandHistory.splice(this.index + 1);
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
        const command = this.commandHistory[this.index - 1];
        if (command) {
            this.index--;
            command.execute();
        }
        return command;
    }

    getState(): { canUndo: boolean, canRedo: boolean } {
        return {
            canUndo: this.index > 0,
            canRedo: this.index < this.commandHistory.length - 1
        }
    }
}