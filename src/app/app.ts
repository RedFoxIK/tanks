import {BoardController} from "./controller/boardController";
import {GameController} from "./controller/gameController";
import {Game} from "./model/game";

const game = new Game();
new GameController(document.body, game);
new BoardController(game);
