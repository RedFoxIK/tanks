import {Subject} from "rxjs";

export class Game {
    public changeState$: Subject<GameState>;
    private state: GameState;

    constructor() {
        this.changeState$ = new Subject<GameState>();
        this.changeState(GameState.CREATED);
    }

    public init() {
        this.changeState(GameState.CREATED);
    }

    public changeState(state: GameState) {
        this.state = state;
        this.changeState$.next(this.state);
    }
}

export enum GameState {
    CREATED,
    PRELOADED,
    IN_PROGRESS,
    LOOSE,
    WIN,
}
