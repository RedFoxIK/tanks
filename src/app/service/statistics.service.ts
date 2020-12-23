import {SpriteService} from "./sprite.service";
import {BoardAsset, TankAsset} from "../model/asset";
import {SpriteWrapper} from "../model/spriteWrapper";

export class StatisticService {
    private spriteService: SpriteService;

    readonly TANK_COST = 100;
    readonly WALL_COST = 10;

    private scores = 0;

    private killedTanks = 0;
    private destroyedWalls = 0;

    private killedTankAmountSprite: SpriteWrapper;
    private removedWallAmountSprite: SpriteWrapper;

    constructor(spriteService: SpriteService) {
        this.spriteService = spriteService;
    }

    initializeStatisticsBoard() {
        this.spriteService.addSprite(TankAsset, TankAsset.ENEMY_TANK_1, 800, 110, 36, 36);
        this.spriteService.addText('X', 870, 100, 48);
        this.killedTankAmountSprite = this.spriteService.addText('0', 940, 100, 48);

        this.spriteService.addSprite(BoardAsset, BoardAsset.WALL_1, 800, 310, 36, 36);
        this.spriteService.addText('X', 870, 300, 48);
        this.removedWallAmountSprite = this.spriteService.addText('0', 940, 300, 48);

    }

    addTankToStatistics() {
        this.killedTanks++;
        (this.killedTankAmountSprite.sprite as PIXI.Text).text = this.killedTanks.toString();
        this.scores += this.TANK_COST;
    }

    addWallToStatistics() {
        this.destroyedWalls++;
        (this.removedWallAmountSprite.sprite as PIXI.Text).text = this.destroyedWalls.toString();
        this.scores += this.WALL_COST;
    }

    retrieveTotalScores(): number {
        return this.scores;
    }
}