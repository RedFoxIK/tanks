import {BoardController} from "./controller/boardController";
import {GameController} from "./controller/gameController";
import {Game} from "./model/game";
import {AssetService} from "./service/asset.service";
import {StatisticService} from "./service/statistics.service";

const game = new Game();
const spriteService = new AssetService(document.body);
const statisticService = new StatisticService(spriteService);
new GameController(spriteService, statisticService, game);
new BoardController(spriteService, statisticService, game);
