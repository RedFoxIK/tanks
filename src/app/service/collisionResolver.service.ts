import {Direction} from "../model/direction";
import {BoardElement, Point, Water} from "../model/boardElement";
import {Bullet, Tank} from "../model/tank";
import {Board} from "../model/board";
import {Bonus} from "../model/bonus";

export class CollisionResolverService {

    static isCollisionDetectedForTank(tank: Tank, newPoint: Point, board: Board): boolean {
        if (!tank.isElemOnBoard()) {
            return false;
        }
        let leftCeil, rightCeil;
        switch (tank.getDirection()) {
            case Direction.UP:
                leftCeil = board.getBoardElemToBoard(this.floor(newPoint.x), this.floor(newPoint.y));
                rightCeil = board.getBoardElemToBoard(this.ceil(newPoint.x), this.floor(newPoint.y));
                break;
            case Direction.DOWN:
                leftCeil = board.getBoardElemToBoard(this.floor(newPoint.x), this.ceil(newPoint.y));
                rightCeil = board.getBoardElemToBoard(this.ceil(newPoint.x), this.ceil(newPoint.y));
                break;
            case Direction.LEFT :
                leftCeil = board.getBoardElemToBoard(this.floor(newPoint.x), this.floor(newPoint.y));
                rightCeil = board.getBoardElemToBoard(this.floor(newPoint.x), this.ceil(newPoint.y));
                break;
            case Direction.RIGHT:
                leftCeil = board.getBoardElemToBoard(this.ceil(newPoint.x), this.floor(newPoint.y));
                rightCeil = board.getBoardElemToBoard(this.ceil(newPoint.x), this.ceil(newPoint.y));
                break;
            default:
                return false;
        }
        const water = board.getBoardElemToBoard(Math.round(newPoint.x), Math.round(newPoint.y));
        if (water != null && water instanceof Water) {
            tank.takeLife();
        }
        if (leftCeil != null && leftCeil.isBarrier || rightCeil != null && rightCeil.isBarrier) {
            return true;
        }
        return board.getAllTanks()
            .filter(t => tank !== t)
            .filter(t => this.tanksCollisionDetected(t, tank)).length > 0;
    }

    static retrieveTargetForBullet(bullet: Bullet,  board: Board): BoardElement | null {
        if (!bullet.isElemOnBoard() || !bullet.isActive()) {
            return null;
        }
        let currentCeil;
        let nextCeil;
        const newPoint = bullet.retrieveNextMovement();
        switch (bullet.getDirection()) {
            case Direction.UP:
                currentCeil = board.getBoardElemToBoard(Math.round(newPoint.x), this.ceil(newPoint.y));
                nextCeil = board.getBoardElemToBoard(Math.round(newPoint.x), this.ceil(newPoint.y) - 1);
                break;
            case Direction.DOWN:
                currentCeil = board.getBoardElemToBoard(Math.round(newPoint.x), this.floor(newPoint.y));
                nextCeil = board.getBoardElemToBoard(Math.round(newPoint.x), this.floor(newPoint.y) + 1);
                break;
            case Direction.LEFT :
                currentCeil = board.getBoardElemToBoard(this.ceil(newPoint.x), Math.round(newPoint.y));
                nextCeil = board.getBoardElemToBoard(this.ceil(newPoint.x) - 1, Math.round(newPoint.y));
                break;
            case Direction.RIGHT:
                currentCeil = board.getBoardElemToBoard(this.floor(newPoint.x), Math.round(newPoint.y));
                nextCeil = board.getBoardElemToBoard(this.floor(newPoint.x) + 1, Math.round(newPoint.y));
                break;
        }
        if (currentCeil != null && !currentCeil.isSkippedByBullet) {
            return currentCeil;
        }
        return nextCeil != null && !nextCeil.isDestroyable && !nextCeil.isSkippedByBullet ? nextCeil : null;
    }

    static calculateBulletsWithTankCollisions(board: Board) {
        if (board.getPlayerTank().getBullet().isActive()) {
            const bullet = board.getPlayerTank().getBullet();

            //TODO filter and first tank
            board.getOthersTanks().forEach(tank => {
                //TODO function
                if (Math.round(tank.boardSprite.boardX) == Math.round(bullet.boardSprite.boardX)
                    && Math.round(tank.boardSprite.boardY) == Math.round(bullet.boardSprite.boardY)) {
                    tank.takeLife();
                    board.getPlayerTank().getBullet().explode();
                }
            })
        }
    }

    static tanksCollisionDetected(tank1: Tank, tank2: Tank): boolean {
        let tank1NextMovement = tank1.retrieveNextMovement();
        let tank2NextMovement = tank2.retrieveNextMovement();

        tank1NextMovement = tank1NextMovement ? tank1NextMovement : new Point(tank1.boardSprite.boardX, tank1.boardSprite.boardY);
        tank2NextMovement = tank2NextMovement ? tank2NextMovement : new Point(tank2.boardSprite.boardX, tank2.boardSprite.boardY);

        return Math.round(tank1NextMovement.x) == Math.round(tank2NextMovement.x) &&
            Math.round(tank1NextMovement.y) == Math.ceil(tank2NextMovement.y);
    }

    static isBonusTakenByTank(bonus: Bonus, tank: Tank) {
        return Math.round(tank.boardSprite.boardX) == bonus.boardSprite.boardX &&
            Math.round(tank.boardSprite.boardY) == bonus.boardSprite.boardY;
    }

    private static floor(coordinate: number): number {
        return Math.floor(coordinate) > 0 ? Math.floor(coordinate) : 0;
    }

    private static ceil(coordinate: number) {
        return Math.ceil(coordinate) < 32 ? Math.ceil(coordinate) : 31;
    }
}
