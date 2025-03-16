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

import { addDefaultEvents, Block, BlockEventPredicate, Directions, Mod, SetBlockStateParamsAction } from "cosmic-reach-dag";
import { SixConnectingTexture } from "./connectingTexture";


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


/*
export async function fourteenConnectedBlock(mod: Mod, block: Block, texturePath: string) {
    const id = block.id.getItem();
    const sheet = mod.createTriggerSheet(id);
    addDefaultEvents(sheet);

    sheet.onUpdate(new SetBlockStateParamsAction({
        params: {
            a: "f", b: "f", c: "f", d: "f",
            e: "f", f: "f", g: "f", h: "f",
            i: "f", j: "f", k: "f", l: "f",
            m: "f", n: "f", o: "f", p: "f",
            q: "f", r: "f",
        }
    }));

    const paramMapping: Map<Direction, string> = new Map;
    {
        let i = 0;
        const chars = "abcdefghijklmnopqr";
        for(const direction of Directions.rings) {
            paramMapping.set(direction, chars[i++]);
        }
    }

    block.fallbackParams = {
        tags: [ block.id.toString() ],
        catalogHidden: true,
        blockEventsId: sheet.getTriggerSheetId()
    };
    
    for(const direction of Directions.rings) {
        sheet.onUpdate(
            new SetBlockStateParamsAction({
                params: { [paramMapping.get(direction)]: "t" }
            })
            .if(new BlockEventPredicate({
                block_at: {
                    xOff: direction.x, yOff: direction.y, zOff: direction.z,
                    has_tag: block.id.toString()
                }
            }))
        );
    }

    const baseModel = mod.createBlockModel(id + "/base");
    const baseCuboid = baseModel.createCuboid();
    baseCuboid.north.texture = new Texture("n", new Identifier("base", "debug"));
    baseCuboid.south.texture = new Texture("s", new Identifier("base", "debug"));
    baseCuboid.east.texture = new Texture("e", new Identifier("base", "debug"));
    baseCuboid.west.texture = new Texture("w", new Identifier("base", "debug"));
    baseCuboid.up.texture = new Texture("u", new Identifier("base", "debug"));
    baseCuboid.down.texture = new Texture("d", new Identifier("base", "debug"));
    
    const texture = await FourteenConnectingTexture.loadFromFile(id, texturePath);
    for(const combination of Directions.rings.combinations()) {
        const params = {};
        for(const [ direction, shorthand ] of paramMapping) {
            params[shorthand] = combination.has(direction) ? "t" : "f";
        }

        const state = block.createState(params);
        if(combination.size == 0) {
            state.catalogHidden = false;
            state.setTriggerSheet(sheet);
        }

        const shortCombination = combination.array().map(v => paramMapping.get(v)).join("");

        const model = state.createBlockModel(id + "/" + shortCombination);
        model.setParent(baseModel);

        model.addTextureOverride(texture.getTexture(
            combination.hasDirection("up"),
            combination.hasDirection("down"),
            combination.hasDirection("east"),
            combination.hasDirection("west"),

            
            combination.hasDirection("upwest"),
            combination.hasDirection("upeast"),
            combination.hasDirection("downwest"),
            combination.hasDirection("downeast")
        ), "n");
        model.addTextureOverride(texture.getTexture(
            combination.hasDirection("up"),
            combination.hasDirection("down"),
            combination.hasDirection("south"),
            combination.hasDirection("north"),

            
            combination.hasDirection("southup"),
            combination.hasDirection("northup"),
            combination.hasDirection("southdown"),
            combination.hasDirection("northdown")
        ), "e");
        model.addTextureOverride(texture.getTexture(
            combination.hasDirection("up"),
            combination.hasDirection("down"),
            combination.hasDirection("west"),
            combination.hasDirection("east"),

            
            combination.hasDirection("upeast"),
            combination.hasDirection("upwest"),
            combination.hasDirection("downeast"),
            combination.hasDirection("downwest")
        ), "s");
        model.addTextureOverride(texture.getTexture(
            combination.hasDirection("up"),
            combination.hasDirection("down"),
            combination.hasDirection("north"),
            combination.hasDirection("south"),

            
            combination.hasDirection("northup"),
            combination.hasDirection("southup"),
            combination.hasDirection("northdown"),
            combination.hasDirection("southdown")
        ), "w");
        model.addTextureOverride(texture.getTexture(
            combination.hasDirection("north"),
            combination.hasDirection("south"),
            combination.hasDirection("west"),
            combination.hasDirection("east"),

            
            combination.hasDirection("northwest"),
            combination.hasDirection("northeast"),
            combination.hasDirection("southwest"),
            combination.hasDirection("southeast")
        ), "u");
        model.addTextureOverride(texture.getTexture(
            combination.hasDirection("south"),
            combination.hasDirection("north"),
            combination.hasDirection("west"),
            combination.hasDirection("east"),

            
            combination.hasDirection("southwest"),
            combination.hasDirection("southeast"),
            combination.hasDirection("northwest"),
            combination.hasDirection("northeast")
        ), "d");
    }
}
*/