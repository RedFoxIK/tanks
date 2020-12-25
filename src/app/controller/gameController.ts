import {Game, GameState} from "../model/game";
import {SpriteService} from "../service/sprite.service";
import {StatisticService} from "../service/statistics.service";
import {ViewRenderService} from "../service/viewRender.service";

export class GameController {
    public readonly game: Game;
    private viewRenderService: ViewRenderService;
    private statisticService: StatisticService;

    constructor(spriteService: SpriteService, statisticService: StatisticService, game: Game) {
        this.game = game;
        this.statisticService = statisticService;

        this.viewRenderService = new ViewRenderService(spriteService);
        this.game.changeState$.subscribe((state) => this.resolveState(state));

        this.game.init();
    }

    private resolveState(state: GameState) {
        switch (state) {
            case GameState.CREATED:
                this.game.changeState(GameState.PRELOADED);
                break;
            case GameState.PRELOADED:
                this.viewRenderService.renderPreloadScene(() => this.game.changeState(GameState.IN_PROGRESS));
                break;
            case GameState.IN_PROGRESS:
                this.viewRenderService.renderGameScene();
                break;
            case GameState.LOOSE:
                this.viewRenderService.renderUnsuccessfulResultScene(this.statisticService.retrieveTotalScores());
                this.game.changeState$.unsubscribe();
                break;
            case GameState.WIN:
                this.viewRenderService.renderSuccessfulResultScene(this.statisticService.retrieveTotalScores());
                this.game.changeState$.unsubscribe();
                break;
        }
    }
}
