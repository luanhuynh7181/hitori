

// export class DataCell {
//     private _value: number;
//     private _isShaded: boolean = false;
//     constructor(value: number) {
//         this._value = value;
//     }

//     public set value(value: number) {
//         this._value = value;
//     }

//     public get value(): number {
//         return this._value;
//     }

//     public get isShaded(): boolean {
//         return this._isShaded;
//     }

//     public set isShaded(value: boolean) {
//         this._isShaded = value;
//     }
// }

export interface IDataCell {
    value: number;
    isShaded: boolean;
}