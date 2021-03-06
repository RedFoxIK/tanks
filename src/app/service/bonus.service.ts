import {SoundAsset} from "../model/asset";
import {Board} from "../model/board";
import {Point} from "../model/boardElement";
import {Bonus, BonusType} from "../model/bonus";
import {AssetService} from "./asset.service";
import {BoardElementsFactory} from "./boardElements.factory";
import {CollisionResolverService} from "./collisionResolver.service";
import {EnumService} from "./enum.service";

export class BonusService {
    private static readonly START_TICK_FOR_BONUSES = 150;
    private static readonly MAX_BONUSES_ON_BOARD = 3;

    private static retrieveRandomBonus(): number {
        const bonusTypes = EnumService.getNumericValues(BonusType);
        return bonusTypes[BonusService.getRandomInt(bonusTypes.length)];
    }

    private static retrieveRandomEmptyCeil(board: Board): Point | null {
        const emptyCeils = [];
        for (let i = 0; i < 32; i++) {
            for (let j = 0; j < Board.BOARD_SIZE; j++) {
                if (!board.getBoardElemToBoard(i, j)) {
                    emptyCeils.push(new Point(i, j));
                }
            }
        }
        return emptyCeils.length > 0 ? emptyCeils[BonusService.getRandomInt(emptyCeils.length)] : null;
    }

    private static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    private bonuses: Bonus[] = [];
    private appliedBonuses: Bonus[] = [];

    private spriteService: AssetService;
    private boardElementsFactory: BoardElementsFactory;

    private tick = 0;

    constructor(spriteService: AssetService, boardElementsFactory: BoardElementsFactory) {
        this.spriteService = spriteService;
        this.boardElementsFactory = boardElementsFactory;
    }

    public handleBonuses(board: Board) {
        this.tick += 1;
        if (this.tick > BonusService.START_TICK_FOR_BONUSES && this.bonuses.length < BonusService.MAX_BONUSES_ON_BOARD &&
            BonusService.getRandomInt(1000) % 300 === 0) {

            this.generateNewBonus(board, this.tick);
        }

        this.areIntersectionsWithBonuses(board);
        this.verifyAppliedBonusesActivity();
        this.updateBoardBonusStatuses();
    }

    private generateNewBonus(board: Board, tick: number) {
        const point = BonusService.retrieveRandomEmptyCeil(board);
        if (point) {
            const bonusType = BonusService.retrieveRandomBonus();
            this.bonuses.push(this.boardElementsFactory.createBonusElem(bonusType, point.x, point.y, tick));
        }
    }

    private areIntersectionsWithBonuses(board: Board): void {
        board.getAllTanks().forEach((tank) => {
            for (let i = 0; i < this.bonuses.length; i++) {
                const bonus = this.bonuses[i];
                if (CollisionResolverService.isBonusTakenByTank(bonus, tank)) {
                    this.spriteService.playSound(SoundAsset.BONUS_SOUND);
                    this.removeBonusFromBoard(bonus, i);
                    bonus.apply(tank);
                    this.appliedBonuses.push(bonus);
                }
            }
        });
    }

    private verifyAppliedBonusesActivity() {
        for (let i = 0; i < this.appliedBonuses.length; i++) {
            if (this.appliedBonuses[i].isFinished()) {
                const bonus = this.appliedBonuses[i];
                this.appliedBonuses.splice(i, 1);
                if (this.hasTankSameBonus(bonus)) {
                    bonus.finishEffect();
                }
            }
        }
    }

    private hasTankSameBonus(bonus: Bonus) {
        return this.appliedBonuses.filter((b) => typeof b === typeof bonus && bonus.getTank() === b.getTank()).length === 0;
    }

    private updateBoardBonusStatuses() {
        for (let i = 0; i < this.bonuses.length; i++) {
            const currentBonus = this.bonuses[i];
            currentBonus.boardSprite.sprite.alpha = currentBonus.isAlmostGone(this.tick) ? 0.5 : 1;

            if (!currentBonus.isActive(this.tick)) {
                this.removeBonusFromBoard(currentBonus, i);
            }
        }
    }

    private removeBonusFromBoard(bonus: Bonus, index: number): void {
        this.spriteService.removeSprites(bonus.boardSprite);
        this.bonuses.splice(index, 1);
    }
}
