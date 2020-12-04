import {Game, GameState} from "../model/game";
import * as PIXI from 'pixi.js';
import {BoardGeneratorService} from "../service/boardGenerator.service";

export class GameController {
    readonly game: Game;
    private boardGeneratorService: BoardGeneratorService;

    constructor(view: HTMLElement) {
        const app = new PIXI.Application({width: 1024, height: 768, backgroundColor: 0x123E67});
        this.game = new Game();
        this.boardGeneratorService = new BoardGeneratorService(this.game, app, view);
        this.game.changeState$.subscribe(state => this.resolveState(state))
        this.game.init();
    }

    private resolveState(state: GameState) {
        //TODO clear scene between statuses?
        switch (state) {
            case GameState.CREATED:
                this.game.changeState(GameState.PRELOADED);
                break;
            case GameState.PRELOADED:
                this.boardGeneratorService.generatePreloadedBoard()
                break;
            case GameState.IN_PROGRESS:
                this.boardGeneratorService.generateBoard();
                break;
        }
    }
}
