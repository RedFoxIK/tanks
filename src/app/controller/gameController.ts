import {Game, GameState} from "../model/game";
import * as PIXI from 'pixi.js';
import {BoardGeneratorService} from "../service/boardGenerator.service";
import {Direction} from "../model/direction";
import {Ticker} from "pixi.js";

export class GameController {
    readonly game: Game;
    private boardGeneratorService: BoardGeneratorService;
    private ticker: Ticker;

    constructor(view: HTMLElement) {
        const app = new PIXI.Application({width: 1024, height: 768, backgroundColor: 0x123E67});
        this.ticker = app.ticker;
        this.ticker.autoStart = false;

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
                this.addEventListeners();
                this.animateScene();
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
            case "Space":
                this.boardGeneratorService.shoot();
        }
    }

    private keyUp(e) {
    }

    private animateScene() {
        this.ticker.add((deltaTime) => {
            this.boardGeneratorService.everyTick(deltaTime);
        });
        this.ticker.start();
    }
}
