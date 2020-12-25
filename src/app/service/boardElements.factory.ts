import {BoardAsset, BonusAsset, TankAsset} from "../model/asset";
import {Block, BoardObject, Eagle, Leaf, Wall, Water} from "../model/boardElement";
import {BonusType, Life, Shield, Snail, Speed} from "../model/bonus";
import {Tank, TankType} from "../model/tank";
import {SpriteService} from "./sprite.service";

export class BoardElementsFactory {

    private static resolveWallByType(wallType: number): string {
        switch (wallType) {
            case 1:
               return BoardAsset.WALL_1;
            case 2:
               return BoardAsset.WALL_2;
            case 3:
                return BoardAsset.WALL_3;
            default:
                return BoardAsset.WALL_4;
        }
    }
    private spriteService: SpriteService;

    constructor(spriteService: SpriteService) {
        this.spriteService = spriteService;
    }

    public createBoardElem(name: string, x: number, y: number, wallType?: number) {
        switch (name) {
            case BoardObject.WATER:
                return new Water(this.spriteService.createBoardElem(BoardAsset, BoardAsset.WATER, x, y));
            case BoardObject.LEAF:
                return new Leaf(this.spriteService.createBoardElem(BoardAsset, BoardAsset.LEAVES, x, y));
            case BoardObject.WALL:
                return new Wall(this.spriteService.createBoardElem(BoardAsset,
                    BoardElementsFactory.resolveWallByType(wallType), x, y));
            case BoardObject.BLOCK:
                return new Block(this.spriteService.createBoardElem(BoardAsset, BoardAsset.BLOCK, x, y));
            case BoardObject.EAGLE:
                return new Eagle(this.spriteService.createBoardElem(BoardAsset, BoardAsset.EAGLE, x, y));
        }
    }

    public createBonusElem(bonusNumber: number, x: number, y: number, tick: number) {
        switch (bonusNumber) {

            case BonusType.SPEED:
                return new Speed(this.spriteService.createBoardElem(BonusAsset, BonusAsset.SPEED, x, y), tick);
            case BonusType.SNAIL:
                return new Snail(this.spriteService.createBoardElem(BonusAsset, BonusAsset.SNAIL, x, y), tick);
            case BonusType.SHIELD:
                return new Shield(this.spriteService.createBoardElem(BonusAsset, BonusAsset.SHIELD, x, y), tick);
            case BonusType.LIFE:
                return new Life(this.spriteService.createBoardElem(BonusAsset, BonusAsset.LIFE, x, y), tick);
        }
    }

    public createTank(x: number, y: number, tankType: TankType) {
        const typeBullet = tankType === TankType.PLAYER ? TankAsset.BULLET : TankAsset.ENEMY_BULLET;
        const bulletSprite = this.spriteService.createBoardElem(TankAsset, typeBullet, -1, -1, 0.5, true);

        const tankAssetType = tankType === TankType.PLAYER ? TankAsset.TANK : this.getRandomAssetForEnemyTank();
        const boardSprite = this.spriteService.createBoardElem(TankAsset, tankAssetType, x, y, 1, true, true);

        return new Tank(boardSprite, tankType, bulletSprite);
    }

    public getRandomAssetForEnemyTank(): string {
        return [TankAsset.ENEMY_TANK_1, TankAsset.ENEMY_TANK_2, TankAsset.ENEMY_TANK_3][Math.floor(Math.random() * 3)];
    }
}
