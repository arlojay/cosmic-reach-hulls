/*
Copyright 2025 arlojay

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { addDefaultEvents, Block, BlockEventPredicate, BlockModel, Direction, DirectionList, Directions, loadBlockbenchModel, Mod, SetBlockStateParamsAction } from "cosmic-reach-dag";
import { SixConnectingTexture } from "./connectingTexture";
import path from "path";
import fs from "node:fs";


const face2d = new DirectionList([
    new Direction("up", 0, 1, 0),
    new Direction("down", 0, -1, 0),
    new Direction("left", -1, 0, 0),
    new Direction("right", 1, 0, 0)
]);

export async function sixConnectedBlock(mod: Mod, block: Block, texturePath: string) {
    const id = block.id.getItem();
    const sheet = mod.createTriggerSheet(id);
    addDefaultEvents(sheet);

    sheet.onUpdate(
        new SetBlockStateParamsAction({
            params: {
                north: "false",
                east: "false",
                south: "false",
                west: "false",
                up: "false",
                down: "false"
            }
        })
    );

    block.fallbackParams.tags ??= [];
    block.fallbackParams.tags.push(block.id.toString());
    block.fallbackParams.catalogHidden = true;
    
    for(const direction of Directions.cardinals) {
        sheet.onUpdate(
            new SetBlockStateParamsAction({
                params: { [direction.name]: "true" }
            })
            .if(new BlockEventPredicate({
                block_at: {
                    xOff: direction.x, yOff: direction.y, zOff: direction.z,
                    has_tag: block.id.toString()
                }
            }))
        );
    }
    
    const texture = await SixConnectingTexture.loadFromFile(id, texturePath);
    for(const combination of Directions.cardinals.combinations()) {
        const north = combination.hasDirection("north");
        const east = combination.hasDirection("east");
        const south = combination.hasDirection("south");
        const west = combination.hasDirection("west");
        const up = combination.hasDirection("up");
        const down = combination.hasDirection("down");

        const state = block.createState({
            north: north.toString(),
            east: east.toString(),
            south: south.toString(),
            west: west.toString(),
            up: up.toString(),
            down: down.toString()
        });
        if(combination.size == 0) {
            state.catalogHidden = false;
        }

        state.setTriggerSheet(sheet);

        const model = state.createBlockModel(id + "/" + combination);
        const cuboid = model.createCuboid();

        cuboid.north.texture = texture.getTexture(up, down, east, west);
        cuboid.east.texture = texture.getTexture(up, down, south, north);
        cuboid.south.texture = texture.getTexture(up, down, west, east);
        cuboid.west.texture = texture.getTexture(up, down, north, south);
        cuboid.up.texture = texture.getTexture(north, south, west, east);
        cuboid.down.texture = texture.getTexture(south, north, west, east);
    }
}

export async function connectedModelBlock(
    mod: Mod, block: Block,
    modelDirectory: string,
    upModelDirectory: string = modelDirectory,
    downModelDirectory: string = upModelDirectory
) {
    const id = block.id.getItem();
    const sheet = mod.createTriggerSheet(id);
    addDefaultEvents(sheet);

    sheet.onUpdate(
        new SetBlockStateParamsAction({
            params: {
                north: "false",
                east: "false",
                south: "false",
                west: "false",
                up: "false",
                down: "false"
            }
        })
    );

    block.fallbackParams.tags ??= [];
    block.fallbackParams.tags.push(block.id.toString());
    block.fallbackParams.catalogHidden = true;
    
    for(const direction of Directions.cardinals) {
        sheet.onUpdate(
            new SetBlockStateParamsAction({
                params: { [direction.name]: "true" }
            })
            .if(new BlockEventPredicate({
                block_at: {
                    xOff: direction.x, yOff: direction.y, zOff: direction.z,
                    has_tag: block.id.toString()
                }
            }))
        );
    }

    const loadedModels: Map<string, BlockModel> = new Map;
    async function getModel(up: boolean, down: boolean, left: boolean, right: boolean, directory: string, _recursive?: boolean): Promise<BlockModel> {
        let modelDirections = new Array;
        if(up) modelDirections.push("up");
        if(down) modelDirections.push("down");
        if(left) modelDirections.push("left");
        if(right) modelDirections.push("right");

        const modelName = modelDirections.length == 0 ? "none" : modelDirections.join("-");
        
        const fileName = path.join(directory, modelName + ".bbmodel");

        if(loadedModels.has(fileName)) return loadedModels.get(fileName);

        if(fs.existsSync(fileName)) {
            const model = await loadBlockbenchModel(mod, id + "/" + modelName, fileName);
            loadedModels.set(fileName, model);

            return model;
        } else if(!_recursive) {
            try {
                console.log("No model found for " + fileName + "; defaulting to none.bbmodel");
                
                const defaultModel = await getModel(false, false, false, false, directory, true);
                loadedModels.set(fileName, defaultModel);

                return defaultModel;
            } catch(e) {
                throw new Error("Cannot find a model for " + fileName, { cause: e });
            }
        } else {
            throw new Error("Cannot find a default model for models in directory " + directory);
        }
    }

    for await(const combination of Directions.cardinals.combinations()) {
        const north = combination.hasDirection("north");
        const east = combination.hasDirection("east");
        const south = combination.hasDirection("south");
        const west = combination.hasDirection("west");
        const up = combination.hasDirection("up");
        const down = combination.hasDirection("down");

        const state = block.createState({
            north: north.toString(),
            east: east.toString(),
            south: south.toString(),
            west: west.toString(),
            up: up.toString(),
            down: down.toString()
        });
        if(combination.size == 0) {
            state.catalogHidden = false;
        }

        state.setTriggerSheet(sheet);
        

        const northModel = await getModel(up, down, east, west, modelDirectory);
        const eastModel = await getModel(up, down, south, north, modelDirectory);
        const southModel = await getModel(up, down, west, east, modelDirectory);
        const westModel = await getModel(up, down, north, south, modelDirectory);
        const upModel = await getModel(north, south, west, east, upModelDirectory);
        const downModel = await getModel(south, north, west, east, downModelDirectory);
        
        const model = state.createBlockModel();
        if(!north) model.addModel(northModel.clone());
        if(!east) model.addModel(eastModel.clone().rotateY(90));
        if(!south) model.addModel(southModel.clone().rotateY(180));
        if(!west) model.addModel(westModel.clone().rotateY(-90));
        if(!up) model.addModel(upModel.clone().rotateX(-90));
        if(!down) model.addModel(downModel.clone().rotateX(90));
    }
}