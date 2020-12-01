export class EnumUtilsService {

    static getKey(e: any, eValue: string): string {
        return Object.keys(e).filter(key => e[key] === eValue)[0];
    }

    static applyFunction(callback: Function, ...enums: any) {
        enums.forEach(e =>
            Object.keys(e).forEach(key => {
                callback(key, e[key]);
            })
        );
    }
}
