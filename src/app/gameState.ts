import {GameApp} from "./controller/gameApp";
import images from '../assets/images/board/*.png';
import bonuses from '../assets/images/bonus/*.png';
import sounds from '../assets/sounds/*.wav';
import otherImages from '../assets/other/*.png';
import screens from '../assets/screenes/*.png';
// import btn from '../assets/images/loader_bar/button.png';
import loaderBarPath from '../assets/images/loader_bar/loader-bar.png';
import loaderBgPath from '../assets/images/loader_bar/loader-bg.png';
import * as PIXI from 'pixi.js';
import {ImagePath} from "./model/imagePath";

// import imagePath from '../assets/images/board';

export interface GameState {
    load(gameApp: GameApp);
}

export class LoadGame implements GameState {
    load(gameApp: GameApp) {
        console.info('Start loading');
        console.log('enum = ' + ImagePath.allBoardElems())

        const stage = gameApp.app.stage;

        gameApp.loader
            .add(Object.values(images))
            .add(ImagePath.all)
            .add(Object.values(sounds))
            .add(Object.values(bonuses))
            .add(Object.values(otherImages));

        gameApp.loader.load();

        const progressBar = new PIXI.Graphics();
        stage.addChild(progressBar);

        const progressBarBorder = new PIXI.Graphics();
        stage.addChild(progressBarBorder);
        progressBar.beginFill(0x000000);
        progressBar.drawRect(210, 498, 604, 64);
        progressBar.endFill();


        gameApp.loader.onProgress.add(e => {
            progressBar.beginFill(0xFFFF00);
            progressBar.drawRect(212, 500, e.progress * 6, 60);
            progressBar.endFill();
            gameApp.app.renderer.render(stage);
        })

        gameApp.loader.onComplete.add(e => {
            console.log('DISPLAY BUTTON');
            stage.removeChild(progressBar);

            const button = new PIXI.Sprite(PIXI.Texture.from(ImagePath.START_BTN));
            // const button2 = new PIXI.Sprite(PIXI.Texture.from(ImagePath.START_BTN));
            button.x = 10;
            button.y = 15
            gameApp.app.stage.addChild(button);

        })

        gameApp.loader.onError.add(e => {
            console.log(e);
        })
    }

}

export class PlayGame
    implements GameState {
    load(gameApp: GameApp) {
    }

}

export class FinishGame implements GameState {
    load(gameApp: GameApp) {
    }

}

