import {Subject} from "rxjs";

export class Game {
    private state: GameState;
    changeState$: Subject<GameState>;

    constructor() {
        this.changeState$ = new Subject<GameState>();
    }

    changeState(state: GameState) {
        this.state = state;
        this.changeState$.next(this.state);
    }
}

export enum GameState {
    CREATED,
    PRELOADED,
    IN_PROGRESS,
    FINISHED
}
