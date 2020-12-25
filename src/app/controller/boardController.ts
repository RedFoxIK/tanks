import {Ticker} from "pixi.js";
import boardMapResponse from "../api/board-map.json";
import tanksResponse from "../api/tanks.json";
import {Direction} from "../model/direction";
import {Game, GameState} from "../model/game";
import {GameManagerService} from "../service/gameManager.service";
import {SpriteService} from "../service/sprite.service";
import {StatisticService} from "../service/statistics.service";

export class BoardController {
    private static MOVEMENTS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyD", "KeyS", "KeyA"];
    private gameManagerService: GameManagerService;

    private game: Game;
    private ticker: Ticker;
    private gameStateInProgress = false;

    constructor(spriteService: SpriteService, statisticService: StatisticService, game: Game) {
        this.game = game;

        this.gameManagerService = new GameManagerService(spriteService, statisticService, game);
        this.ticker = spriteService.ticker;

        this.gameManagerService.successGameOver$.subscribe((result) => result ? game.changeState(GameState.WIN)
            :  game.changeState(GameState.LOOSE));
        this.subscribeOnGameStateChange();
    }

    private subscribeOnGameStateChange() {
        this.game.changeState$.subscribe((state) => {
            if (GameState.IN_PROGRESS === state) {
                this.gameStateInProgress = true;
                setTimeout(() => {
                    this.addEventListeners();
                    this.animateScene();
                    this.gameManagerService.generateBoard(boardMapResponse, tanksResponse);
                }, 500);
            } else if (this.gameStateInProgress) {
                this.game.changeState$.unsubscribe();
                this.gameManagerService.successGameOver$.unsubscribe();
                this.ticker.stop();
            }
        });
    }

    private addEventListeners() {
        window.addEventListener("keydown", (e) => this.keyDown(e));
        window.addEventListener("keyup", (e) => this.keyUp(e));
    }

    private keyDown(e) {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                this.gameManagerService.board.getPlayerTank().setDirection(Direction.UP);
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
        if (BoardController.MOVEMENTS.indexOf(e.code) > -1) {
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
