import {Subject} from "rxjs";

export class Game {
    private state: GameState;
    changeState$: Subject<GameState>;

    constructor() {
        this.changeState$ = new Subject<GameState>();
        this.changeState(GameState.CREATED)
    }

    init() {
        this.changeState(GameState.CREATED);
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
    LOOSE,
    WIN
}
