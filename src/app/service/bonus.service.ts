import {Bonus, BonusType} from "../model/bonus";
import {BoardElement, Point} from "../model/boardElement";
import {SpriteService} from "./sprite.service";
import {EnumUtilsService} from "./enum-utils.service";
import {BoardElementsFactory} from "./boardElements.factory";

export class BonusService {
    readonly startWithBonuses = 500;
    readonly maxBonusesOnBoard = 2;

    private bonuses: Array<Bonus> = [];
    private spriteService: SpriteService;
    private boardElementsFactory: BoardElementsFactory;

    tick = 0;

    constructor(spriteService: SpriteService, boardElementsFactory: BoardElementsFactory) {
        this.spriteService = spriteService;
        this.boardElementsFactory = boardElementsFactory;
    }

    handleBonuses(board: BoardElement | null [][]) {
        this.tick += 1;
        if (this.tick > this.startWithBonuses && this.bonuses.length < this.maxBonusesOnBoard && BonusService.getRandomInt(1000) % 20 == 0) {
            this.generateNewBonus(board, this.tick);
        }

        for (let i = 0; i < this.bonuses.length; i++) {
            if (!this.bonuses[i].isActive(this.tick)) {
                this.spriteService.removeSprites(this.bonuses[i].boardSprite)
                this.bonuses.splice(i, 1);
            }
        }
    }

    private generateNewBonus(board: BoardElement | null [][], tick: number) {
        const point = BonusService.retrieveRandomEmptyCeil(board);
        if (point) {
            const bonusType = BonusService.retrieveRandomBonus();
            console.log(bonusType);
            this.bonuses.push(this.boardElementsFactory.createBonusElem(bonusType, point.x, point.y, tick));
            console.log(this.bonuses)
        }
    }

    private static retrieveRandomBonus(): number {
        const bonusTypes = EnumUtilsService.getValues(BonusType);
        console.log(bonusTypes);
        return bonusTypes[BonusService.getRandomInt(bonusTypes.length)];
    }

    private static retrieveRandomEmptyCeil(board: BoardElement | null [][]): Point | null {
        const emptyCeils = [];
        for (let i = 0; i < 32; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (!board[i][j]) {
                    emptyCeils.push(new Point(i, j));
                }
            }
        }
        return emptyCeils.length > 0 ? emptyCeils[BonusService.getRandomInt(emptyCeils.length)] : null;
    }

    private static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}