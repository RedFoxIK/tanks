export class Game {
    private state: string;

    constructor() {
        this.state = 'CREATED';
    }

    changeState(state: string) {
        this.state = state;
    }
}
