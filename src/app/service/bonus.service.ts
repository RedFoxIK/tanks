import {Bonus, BonusType} from "../model/bonus";
import {BoardElement, Point} from "../model/boardElement";
import {SpriteService} from "./sprite.service";
import {EnumUtilsService} from "./enum-utils.service";
import {BoardElementsFactory} from "./boardElements.factory";
import {Tank} from "../model/tank";
import {SoundAsset} from "../model/asset";

export class BonusService {
    readonly startWithBonuses = 500;
    readonly maxBonusesOnBoard = 2;

    private bonuses: Array<Bonus> = [];
    private appliedBonuses: Array<Bonus> = [];

    private spriteService: SpriteService;
    private boardElementsFactory: BoardElementsFactory;

    tick = 0;

    constructor(spriteService: SpriteService, boardElementsFactory: BoardElementsFactory) {
        this.spriteService = spriteService;
        this.boardElementsFactory = boardElementsFactory;
    }

    handleBonuses(board: BoardElement | null [][], tanks: Array<Tank>) {
        this.tick += 1;
        if (this.tick > this.startWithBonuses && this.bonuses.length < this.maxBonusesOnBoard && BonusService.getRandomInt(1000) % 300 == 0) {
            this.generateNewBonus(board, this.tick);
        }

        this.areIntersectionsWithBonuses(tanks);

        for (let i = 0; i < this.appliedBonuses.length; i++) {
            if (this.appliedBonuses[i].isFinished()) {
                this.appliedBonuses.slice(i, 1);
            }
        }

        for (let i = 0; i < this.bonuses.length; i++) {
            let currentBonus = this.bonuses[i];
            currentBonus.boardSprite.sprite.alpha = currentBonus.isAlmostGone(this.tick) ? 0.5 : 1;

            if (!currentBonus.isActive(this.tick)) {
                this.removeBonusFromBoard(currentBonus, i);
            }
        }
    }

    private areIntersectionsWithBonuses(tanks: Array<Tank>): void {
        tanks.forEach(tank => {
            for (let i = 0; i < this.bonuses.length; i++) {
                const bonus = this.bonuses[i];
                // TODO: COLLISION
                if (Math.round(tank.boardSprite.boardX) == bonus.boardSprite.boardX && Math.round(tank.boardSprite.boardY) == bonus.boardSprite.boardY) {
                    this.spriteService.playSound(SoundAsset.BONUS_SOUND)
                    this.removeBonusFromBoard(bonus, i);
                    bonus.apply(tank);
                    this.appliedBonuses.push(bonus)
                }
            }
        })
    }

    private removeBonusFromBoard(bonus: Bonus, index: number): void {
        this.spriteService.removeSprites(bonus.boardSprite)
        console.log('BEFORE SLICE = ' + this.bonuses);

        this.bonuses.splice(index, 1);

        console.log('AFTER SLICE = ' + this.bonuses);
    }

    private generateNewBonus(board: BoardElement | null [][], tick: number) {
        const point = BonusService.retrieveRandomEmptyCeil(board);
        if (point) {
            const bonusType = BonusService.retrieveRandomBonus();
            this.bonuses.push(this.boardElementsFactory.createBonusElem(bonusType, point.x, point.y, tick));
        }
    }

    private static retrieveRandomBonus(): number {
        const bonusTypes = EnumUtilsService.getValues(BonusType);
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