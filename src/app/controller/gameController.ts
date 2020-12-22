import {Game, GameState} from "../model/game";
import * as PIXI from 'pixi.js';
import {Ticker} from 'pixi.js';
import {Direction} from "../model/direction";
import {GameManagerService} from "../service/gameManager.service";
import {ViewRenderService} from "../service/viewRender.service";
import boardMapResponse from "../api/board-map.json";
import {SpriteService} from "../service/sprite.service";

export class GameController {
    private static movements = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyD", "KeyS", "KeyA"];

    readonly game: Game;
    private gameManagerService: GameManagerService;
    private viewRenderService: ViewRenderService;
    private ticker: Ticker;

    constructor(view: HTMLElement) {
        const app = new PIXI.Application({width: 1024, height: 768, backgroundColor: 0x123E67});
        this.ticker = app.ticker;
        this.ticker.autoStart = false;

        this.game = new Game();
        const spriteService = new SpriteService(app, view)
        this.gameManagerService = new GameManagerService(spriteService, this.game);
        this.viewRenderService = new ViewRenderService(spriteService, this.gameManagerService);
        this.game.changeState$.subscribe(state => this.resolveState(state))
        this.gameManagerService.successGameOver$.subscribe(result => result ? this.game.changeState(GameState.WIN) :  this.game.changeState(GameState.LOOSE));
        this.game.init();
    }

    private resolveState(state: GameState) {
        //TODO clear scene between statuses?
        switch (state) {
            case GameState.CREATED:
                this.game.changeState(GameState.PRELOADED);
                break;
            case GameState.PRELOADED:
                this.viewRenderService.renderPreloadScene(() => this.game.changeState(GameState.IN_PROGRESS));
                break;
            case GameState.IN_PROGRESS:
                this.viewRenderService.renderGameScene(boardMapResponse);

                //TODO another controller
                setTimeout(() => {
                    this.addEventListeners();
                    this.animateScene();
                }, 1000);
                break;
            case GameState.LOOSE:
                this.ticker.stop();
                this.viewRenderService.renderUnsuccessfulResultScene();
                this.game.changeState$.unsubscribe();
                break;
            case GameState.WIN:
                this.ticker.stop();
                this.viewRenderService.renderSuccessfulResultScene();
                this.game.changeState$.unsubscribe();
                break;
        }
    }

    //ONE more controller;
    private addEventListeners() {
        window.addEventListener('keydown', (e) => this.keyDown(e))
        window.addEventListener('keyup', (e) => this.keyUp(e))
    }

    private keyDown(e) {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                this.gameManagerService.board.getPlayerTank().setDirection(Direction.UP)
                break;
            case "ArrowDown":
            case "KeyS":
                this.gameManagerService.board.getPlayerTank().setDirection(Direction.DOWN);
                break;
            case "ArrowLeft":
            case "KeyA":
                this.gameManagerService.board.getPlayerTank().setDirection(Direction.LEFT);
                break;
            case "ArrowRight":
            case "KeyD":
                this.gameManagerService.board.getPlayerTank().setDirection(Direction.RIGHT);
                break;
            case "Space":
                this.gameManagerService.shoot();
        }
    }

    private keyUp(e) {
        if (GameController.movements.indexOf(e.code) > -1) {
            this.gameManagerService.board.getPlayerTank().setDirection(Direction.NONE);
        }
    }

    private animateScene() {
        this.ticker.add(() => {
            this.gameManagerService.everyTick();
        });
        this.ticker.start();
    }
}
