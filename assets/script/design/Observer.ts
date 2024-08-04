/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISignal<T = number> {
    addHandler(handler: (data?: T) => void, thisArg?: any): void;
    removeHandler(handler: (data?: T) => void): void;
}

export class Signal<T = void> implements ISignal<T> {
    private handlers: ((data: T) => void)[] = [];
    private thisArgs: any[] = [];

    public addHandler(handler: (data: T) => void, thisArg?: any): void {
        this.handlers.push(handler);
        this.thisArgs.push(thisArg);
    }

    public removeHandler(handler: (data: T) => void): void {
        const index: number = this.handlers.indexOf(handler);
        if (index === -1) return;
        this.handlers.splice(index, 1);
        this.thisArgs.splice(index, 1);
    }

    public trigger(data: T): void {
        const handlers = [...this.handlers];
        const thisArgs = [...this.thisArgs];
        handlers.forEach((handler, index) => {
            handler.call(thisArgs[index], data);
        });
    }
}
