import {Board} from "../model/board";
import {BoardElement, Point, Water} from "../model/boardElement";
import {Bonus} from "../model/bonus";
import {Direction} from "../model/direction";
import {Bullet, Tank, TankType} from "../model/tank";

export class CollisionResolverService {

    public static isCollisionDetectedForTank(tank: Tank, newPoint: Point, board: Board,
                                             direction?: Direction): boolean {
        if (!tank.isElemOnBoard()) {
            return false;
        }
        let leftCell;
        let rightCell;
        const tankDirection = direction ? direction : tank.getDirection();
        switch (tankDirection) {
            case Direction.UP:
                leftCell = board.getBoardElemToBoard(this.floor(newPoint.x), this.floor(newPoint.y));
                rightCell = board.getBoardElemToBoard(this.ceil(newPoint.x), this.floor(newPoint.y));
                break;
            case Direction.DOWN:
                leftCell = board.getBoardElemToBoard(this.floor(newPoint.x), this.ceil(newPoint.y));
                rightCell = board.getBoardElemToBoard(this.ceil(newPoint.x), this.ceil(newPoint.y));
                break;
            case Direction.LEFT :
                leftCell = board.getBoardElemToBoard(this.floor(newPoint.x), this.floor(newPoint.y));
                rightCell = board.getBoardElemToBoard(this.floor(newPoint.x), this.ceil(newPoint.y));
                break;
            case Direction.RIGHT:
                leftCell = board.getBoardElemToBoard(this.ceil(newPoint.x), this.floor(newPoint.y));
                rightCell = board.getBoardElemToBoard(this.ceil(newPoint.x), this.ceil(newPoint.y));
                break;
            default:
                return false;
        }
        return this.isCollisionWithNeighBorCellsOrOtherTanks(tank, newPoint, leftCell, rightCell, board);

    }

    public static retrieveTargetForBullet(bullet: Bullet,  board: Board): void {
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
            bullet.explode$.next(bullet);
        }
        if (nextCeil != null && !nextCeil.isDestroyable && !nextCeil.isSkippedByBullet) {
            bullet.explode$.next(bullet);
        }
    }

    public static calculateBulletsWithTankCollisions(board: Board) {
        const playerBullet = board.getPlayerTank().getBullet();
        const enemyBullets = board.getOthersTanks().map((tank) => tank.getBullet()).filter((b) => b.isActive());

        if (playerBullet.isActive()) {
            board.getOthersTanks().forEach((tank) => {
                if (this.isIntersectionsBetween(tank, playerBullet)) {
                    board.getPlayerTank().getBullet().explode();
                    playerBullet.killTank$.next(tank);
                }
            });
        }
        enemyBullets.forEach((enemyBullet) => {
            if (this.isIntersectionsBetween(playerBullet, enemyBullet)) {
                playerBullet.explode$.next(playerBullet);
                enemyBullet.explode$.next(enemyBullet);
            }
            if (this.isIntersectionsBetween(board.getPlayerTank(), enemyBullet)) {
                board.getPlayerTank().getBullet().explode();
                enemyBullet.killTank$.next(board.getPlayerTank());
            }
        });
    }

    public static tanksCollisionDetected(tank1: Tank, tank2: Tank): boolean {
        let tank1NextMovement = tank1.retrieveNextMovement();
        let tank2NextMovement = tank2.retrieveNextMovement();

        tank1NextMovement = tank1NextMovement ? tank1NextMovement :
            new Point(tank1.boardSprite.boardX, tank1.boardSprite.boardY);
        tank2NextMovement = tank2NextMovement ? tank2NextMovement :
            new Point(tank2.boardSprite.boardX, tank2.boardSprite.boardY);

        return Math.round(tank1NextMovement.x) === Math.round(tank2NextMovement.x) &&
            Math.round(tank1NextMovement.y) === Math.ceil(tank2NextMovement.y);
    }

    public static isBonusTakenByTank(bonus: Bonus, tank: Tank) {
        return Math.round(tank.boardSprite.boardX) === bonus.boardSprite.boardX &&
            Math.round(tank.boardSprite.boardY) === bonus.boardSprite.boardY;
    }

    private static isIntersectionsBetween(boardElem1: BoardElement, boardElem2: BoardElement) {
        return Math.round(boardElem1.boardSprite.boardX) === Math.round(boardElem2.boardSprite.boardX)
            && Math.round(boardElem1.boardSprite.boardY) === Math.round(boardElem2.boardSprite.boardY);
    }

    private static isCollisionWithNeighBorCellsOrOtherTanks(tank: Tank, newPoint: Point, leftCell: BoardElement | null,
                                                            rightCell: BoardElement | null, board: Board): boolean {
        if (leftCell != null && leftCell.isBarrier || rightCell != null && rightCell.isBarrier) {
            return true;
        }
        if (tank.tankType === TankType.ENEMY && (leftCell instanceof Water || rightCell instanceof Water)) {
            return true;
        }
        if (tank.tankType === TankType.PLAYER) {
            const water = board.getBoardElemToBoard(Math.round(newPoint.x), Math.round(newPoint.y));
            if (water != null && water instanceof Water) {
                tank.takeLife();
                return true;
            }
        }
        return board.getAllTanks()
            .filter((t) => tank !== t)
            .filter((t) => this.tanksCollisionDetected(t, tank)).length > 0;
    }

    private static floor(coordinate: number): number {
        return Math.floor(coordinate) > 0 ? Math.floor(coordinate) : 0;
    }

    private static ceil(coordinate: number) {
        return Math.ceil(coordinate) < Board.BOARD_SIZE ? Math.ceil(coordinate) : Board.BOARD_SIZE - 1;
    }

    private constructor() {}
}
