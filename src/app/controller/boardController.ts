import {Game, GameState} from "../model/game";

export class BoardController {
    private gameStateInProgress = false;

    constructor(game: Game) {
        game.changeState$.subscribe((state) => {
            if (GameState.IN_PROGRESS === state) {
                this.gameStateInProgress = true;
                console.log("IN_PROGRESS");
            } else if (this.gameStateInProgress) {
                game.changeState$.unsubscribe();
            }
        });
    }
}
