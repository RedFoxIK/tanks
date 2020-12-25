import {TankModel} from "../api/tankModel";
import {SoundAsset} from "../model/asset";
import {Board} from "../model/board";
import {Direction} from "../model/direction";
import {Tank, TankType} from "../model/tank";
import {AssetService} from "./asset.service";
import {BoardElementsFactory} from "./boardElements.factory";
import {CollisionResolverService} from "./collisionResolver.service";
import {EnumService} from "./enum.service";

export class TankManagerService {
    private static readonly MAX_TANK_AMOUNT = 10;
    private static readonly SAME_DIRECTION_POSSIBILITY = 60;

    private totalAmount;

    private boardElementFactory: BoardElementsFactory;
    private spriteService: AssetService;
    private previousEnemiesDirections: Map<Tank, Direction> = new Map<Tank, Direction>();

    private readonly board: Board;

    constructor(board: Board, boardElementFactory: BoardElementsFactory, spriteService: AssetService) {
        this.board = board;
        this.boardElementFactory = boardElementFactory;
        this.spriteService = spriteService;
    }

    public initializeTanks(tankModel: TankModel) {
        this.createTank(tankModel.player.x, tankModel.player.y, TankType.PLAYER);
        tankModel.enemies.forEach((enemy) => this.createTank(enemy.x, enemy.y, TankType.ENEMY));
        this.totalAmount = tankModel.enemies.length;
    }

    public replaceTank(tank: Tank): Tank | null {
        this.board.removeTank(tank);
        this.spriteService.removeSprites(tank.boardSprite, tank.getBullet().boardSprite);

        if (this.totalAmount < TankManagerService.MAX_TANK_AMOUNT) {
            this.totalAmount++;
            const newTank = this.boardElementFactory.createTank(tank.startX, tank.startY, TankType.ENEMY);
            this.board.addTankToBoard(newTank);
            return newTank;
        }
        return null;
    }

    public moveTanks() {
        const newPlayerTankPoint = this.board.getPlayerTank().retrieveNextMovement();
        if (newPlayerTankPoint && !CollisionResolverService.isCollisionDetectedForTank(this.board.getPlayerTank(),
            newPlayerTankPoint, this.board)) {

            this.board.getPlayerTank().move(newPlayerTankPoint);
        }

        this.board.getOthersTanks().forEach((tank) => this.moveEnemy(tank));
    }

    public handleBullets() {
        const bullets = this.board.getAllTanks().map((tank) => tank.getBullet());
        bullets.forEach((b) => {
            const nextPoint = b.retrieveNextMovement();
            b.move(nextPoint);
            CollisionResolverService.retrieveTargetForBullet(b, this.board);
        });
        CollisionResolverService.calculateBulletsWithTankCollisions(this.board);
    }

    private moveEnemy(tank: Tank) {
        let previousDirection = this.previousEnemiesDirections.get(tank);
        previousDirection = previousDirection ? previousDirection : Direction.DOWN;
        const nextDirection = this.retrieveNextDirection(tank, previousDirection);
        if (this.previousEnemiesDirections.get(tank) && !tank.getBullet().isActive()) {
            this.spriteService.playSound(SoundAsset.SHOOT_SOUND);
            tank.activateBullet();
        }
        tank.setDirection(nextDirection);
        tank.move(tank.retrieveNextMovement());
        this.previousEnemiesDirections.set(tank, nextDirection);
    }

    private retrieveNextDirection(tank: Tank, direction: Direction): Direction {
        const oppositeDirection = direction + -1 * Math.sign(direction - 0.00001) * Math.PI;
        let possibleDirections = EnumService.getNumericValues(Direction)
            .filter((d) => d !== oppositeDirection && d !== Direction.NONE);

        possibleDirections = possibleDirections.filter((d) => {
            const newPoint = tank.retrieveNextMovement(d);
            return !CollisionResolverService.isCollisionDetectedForTank(tank, newPoint, this.board, d);
        });
        const arrayForRandomDirectionsChoice = [];
        arrayForRandomDirectionsChoice.push(...possibleDirections);
        if (possibleDirections.indexOf(direction) >= 0) {
            arrayForRandomDirectionsChoice.push(...Array(TankManagerService.SAME_DIRECTION_POSSIBILITY).fill(direction));
        }
        arrayForRandomDirectionsChoice.push(...possibleDirections);
        return arrayForRandomDirectionsChoice[Math.floor(Math.random()
            * Math.floor(arrayForRandomDirectionsChoice.length))];
    }

    private createTank(x: number, y: number, tankType: TankType) {
        const tank = this.boardElementFactory.createTank(x, y, tankType);
        this.board.addTankToBoard(tank);
    }
}
