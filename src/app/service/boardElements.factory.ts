import {Block, BoardElement, BoardObject, Eagle, Leaf, Wall, Water} from "../model/boardElement";
import {BoardSprite, SpriteWrapper} from "../model/spriteWrapper";
import {SpriteService} from "./sprite.service";
import {BoardAsset, TankAsset} from "../model/asset";

export class BoardElementsFactory {
    private spriteService: SpriteService;

    constructor(spriteService: SpriteService) {
        this.spriteService = spriteService;
    }

    createBoardElem(name: string, x: number, y: number, wallType?: number) {
        switch (name) {
            case BoardObject.WATER:
                return new Water(this.spriteService.createBoardElem(BoardAsset, BoardAsset.WATER, x, y));
            case BoardObject.LEAF:
                return new Leaf(this.spriteService.createBoardElem(BoardAsset, BoardAsset.LEAVES, x, y));
            case BoardObject.WALL:
                return new Wall(this.spriteService.createBoardElem(BoardAsset, BoardElementsFactory.resolveWallByType(wallType), x, y));
            case BoardObject.BLOCK:
                return new Block(this.spriteService.createBoardElem(BoardAsset, BoardAsset.BLOCK, x, y));
            case BoardObject.EAGLE:
                return new Eagle(this.spriteService.createBoardElem(BoardAsset, BoardAsset.EAGLE, x, y));
        }
    }

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
}