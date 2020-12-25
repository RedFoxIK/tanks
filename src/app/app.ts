import {BoardController} from "./controller/boardController";
import {GameController} from "./controller/gameController";
import {Game} from "./model/game";
import {SpriteService} from "./service/sprite.service";
import {StatisticService} from "./service/statistics.service";

const game = new Game();
const spriteService = new SpriteService(document.body)
const statisticService = new StatisticService(spriteService)
new GameController(spriteService, statisticService, game);
new BoardController(spriteService, statisticService, game);
