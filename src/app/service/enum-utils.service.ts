export class EnumUtilsService {

    static getKey(e: any, eValue: string): string {
        return Object.keys(e).filter(key => e[key] === eValue)[0];
    }

    static getValues(e: any): Array<any> {
        const values = Object.values(e);
        return values.slice(values.length / 2);
    }

    static applyFunction(callback: Function, ...enums: any) {
        enums.forEach(e =>
            Object.keys(e).forEach(key => {
                callback(key, e[key]);
            })
        );
    }
}
