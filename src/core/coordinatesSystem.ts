import { Container } from 'pixi.js';

//Here im cetering the coordinates on the stage and inverting the y axis
//This way, the y axis is pointing up and the origin is in the center of the stage

export function createCoordinatesRoot(stageW: number, stageH: number): Container {
    const screenCoordinates = new Container();

    screenCoordinates.position.set(stageW / 2, stageH / 2);
    screenCoordinates.scale.y = -1;
    return screenCoordinates;
}
