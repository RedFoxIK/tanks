import {BoardAsset, TankAsset} from "../model/asset";
import {SpriteWrapper} from "../model/spriteWrapper";
import {AssetService} from "./asset.service";

export class StatisticService {

    public readonly TANK_COST = 100;
    public readonly WALL_COST = 10;
    private spriteService: AssetService;

    private scores = 0;

    private killedTanks = 0;
    private destroyedWalls = 0;

    private killedTankAmountSprite: SpriteWrapper;
    private removedWallAmountSprite: SpriteWrapper;

    constructor(spriteService: AssetService) {
        this.spriteService = spriteService;
    }

    public initializeStatisticsBoard() {
        this.spriteService.addSprite(TankAsset, TankAsset.ENEMY_TANK_1, 800, 110, 36, 36);
        this.spriteService.addText("X", 870, 100, 48);
        this.killedTankAmountSprite = this.spriteService.addText("0", 940, 100, 48);

        this.spriteService.addSprite(BoardAsset, BoardAsset.WALL_1, 800, 310, 36, 36);
        this.spriteService.addText("X", 870, 300, 48);
        this.removedWallAmountSprite = this.spriteService.addText("0", 940, 300, 48);

    }

    public addTankToStatistics() {
        this.killedTanks++;
        (this.killedTankAmountSprite.sprite as PIXI.Text).text = this.killedTanks.toString();
        this.scores += this.TANK_COST;
    }

    public addWallToStatistics() {
        this.destroyedWalls++;
        (this.removedWallAmountSprite.sprite as PIXI.Text).text = this.destroyedWalls.toString();
        this.scores += this.WALL_COST;
    }

    public retrieveTotalScores(): number {
        return this.scores;
    }
}
