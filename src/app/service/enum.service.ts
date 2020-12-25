export class EnumService {

    public static getKey(e: any, eValue: string | number): string {
        return Object.keys(e).filter((key) => e[key] === eValue)[0];
    }

    public static getNumericValues(e: any): number[] {
        return Object.values(e)
            .map((value) => Number(value))
            .filter((value) => !isNaN(value));
    }

    public static applyFunction(callback: Function, ...enums: any) {
        enums.forEach((e) => Object.keys(e).forEach((key) => callback(key, e[key])));
    }
}
