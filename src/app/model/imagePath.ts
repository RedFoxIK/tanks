import startButtonPath from "../../assets/images/loader_bar/button.png";
import allBoardElements from "../../assets/images/board/*.png";

export class ImagePath {
    static START_BTN = startButtonPath;

    static all = [ImagePath.START_BTN];

    static allBoardElems() {

        let boardElems = new Map();

        console.log(Object.values(allBoardElements)[0].split('.')[0].substring(1).toUpperCase())
        Object.values(allBoardElements).forEach(e => {
            boardElems.set(e.split('.')[0].substring(1).toUpperCase(), e);
        })
        console.log(boardElems);
        console.log(boardElems.keys())
        console.log('____----____' + boardElems.get('BLOCK'));
    }
}
