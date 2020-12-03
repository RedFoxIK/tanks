import {Game} from "../model/game";
import * as PIXI from 'pixi.js';
import {BoardGeneratorService} from "../service/board-generator.service";

export class GameController {
    private game: Game;

    private boardGeneratorService: BoardGeneratorService;

    constructor(view: HTMLElement) {
        this.game = new Game();
        const app = new PIXI.Application({width: 1024, height: 768, backgroundColor: 0x123E67});
        this.boardGeneratorService = new BoardGeneratorService(app, view);
    }

    startGame() {
        this.boardGeneratorService.generatePreloadedBoard();
    }
}
