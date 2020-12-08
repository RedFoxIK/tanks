import {Game, GameState} from "../model/game";
import * as PIXI from 'pixi.js';
import {BoardGeneratorService} from "../service/boardGenerator.service";
import {Direction} from "../model/direction";

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
        console.log(this.boardGeneratorService);
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
                this.addEventListeners();
                break;
        }
    }

    private addEventListeners() {
        window.addEventListener('keydown', (e) => this.keyDown(e))
        window.addEventListener('keyup', (e) => this.keyUp(e))
    }

    private keyDown(e) {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                this.boardGeneratorService.moveTank(Direction.UP);
                break;
            case "ArrowDown":
            case "KeyS":
                this.boardGeneratorService.moveTank(Direction.DOWN);
                break;
            case "ArrowLeft":
            case "KeyA":
                this.boardGeneratorService.moveTank(Direction.LEFT);
                break;
            case "ArrowRight":
            case "KeyD":
                this.boardGeneratorService.moveTank(Direction.RIGHT);
                break;
        }
    }

    private keyUp(e) {
    }
}
