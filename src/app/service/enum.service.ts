export class EnumService {

    static getKey(e: any, eValue: string | number): string {
        return Object.keys(e).filter(key => e[key] === eValue)[0];
    }

    static getNumericValues(e: any): Array<number> {
        return Object.values(e)
            .map(value => Number(value))
            .filter(value => !isNaN(value));
    }

    static applyFunction(callback: Function, ...enums: any) {
        enums.forEach(e => Object.keys(e).forEach(key => callback(key, e[key])));
    }
}
