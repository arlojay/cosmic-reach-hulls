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

import { Identifier, LangKeyLanguage, loadBlockbenchModel, Mod, Texture } from "cosmic-reach-dag";
import { createNativeRotations, createOmnidirectionalRotations, createShapeVariants } from ".";
import { sixConnectedBlock } from "./connectedBlock";

export async function cablePaneling(mod: Mod) {
    const block = mod.createBlock("cable_paneling");

    block.createDefaultLangKey().addTranslation("Cable Paneling", LangKeyLanguage.en_us);
    block.fallbackParams = {
        lightAttenuation: 1,
        isOpaque: false
    };
    const model = await loadBlockbenchModel(mod, "cable_paneling", "./assets/models/cable-paneling.bbmodel");    
    model.usesTransparency = true;
    
    createNativeRotations(
        block,
        model
    );
}

export async function structuralMetal(mod: Mod) {
    const block = mod.createBlock("structural_metal");

    block.createDefaultLangKey().addTranslation("Structural Metal", LangKeyLanguage.en_us);

    const model = await loadBlockbenchModel(mod, "structural_metal", "./assets/models/structural-metal.bbmodel");
    for(const cuboid of model.getCuboids()) {
        for(const face of cuboid.getAllFaces()) {
            face.receiveAO = true;
        }
    }
    createOmnidirectionalRotations(block, model);
}

export async function grate(mod: Mod) {
    const block = mod.createBlock("grate");

    block.createDefaultLangKey().addTranslation("Grate", LangKeyLanguage.en_us);
    block.fallbackParams = {
        lightAttenuation: 1,
        isOpaque: false
    };

    const model = await loadBlockbenchModel(mod, "grate", "./assets/models/grate.bbmodel");

    model.usesTransparency = true;

    createOmnidirectionalRotations(block, model);
}

export async function corrugatedMetal(mod: Mod) {
    const block = mod.createBlock("corrugated_metal");
    block.createDefaultLangKey().addTranslation("Corrugated Metal", LangKeyLanguage.en_us);

    const model = mod.createBlockModel("corrugated_metal");
    model.setParent(new Identifier("base", "cube"));
    
    const corrugatedMetalTexture = await Texture.loadFromFile("corrugated-metal", "./assets/textures/corrugated-metal.png");
    const metalTexture = await Texture.loadFromFile("metal", "./assets/textures/metal.png");

    model.addTextureOverride(metalTexture, "bottom");
    model.addTextureOverride(metalTexture, "top");
    model.addTextureOverride(corrugatedMetalTexture, "all")
    model.addTextureOverride(corrugatedMetalTexture, "slab_side");
    model.addTextureOverride(corrugatedMetalTexture, "stair_side");

    createShapeVariants(block, model);
}

export async function concrete(mod: Mod) {
    const block = mod.createBlock("concrete");
    block.createDefaultLangKey().addTranslation("Concrete", LangKeyLanguage.en_us);

    const model = mod.createBlockModel("concrete");
    model.setParent(new Identifier("base", "cube"));
    
    const concreteTexture = await Texture.loadFromFile("concrete", "./assets/textures/concrete.png");

    model.addTextureOverride(concreteTexture, "all");

    createShapeVariants(block, model);
}

export async function smoothTile(mod: Mod) {
    const block = mod.createBlock("smooth_tile");
    block.createDefaultLangKey().addTranslation("Smooth Tile", LangKeyLanguage.en_us);

    const model = mod.createBlockModel("smooth_tile");
    model.setParent(new Identifier("base", "cube"));
    
    const smoothTileTexture = await Texture.loadFromFile("smooth-tile", "./assets/textures/smooth-tile.png");

    model.addTextureOverride(smoothTileTexture, "all");

    createShapeVariants(block, model);
}

export async function connectedTile(mod: Mod) {
    const block = mod.createBlock("tank");
    block.createDefaultLangKey().addTranslation("Tank", LangKeyLanguage.en_us);

    block.fallbackParams = {
        lightAttenuation: 3,
        isOpaque: false
    };

    await sixConnectedBlock(mod, block, "./assets/textures/tank.png");

    for(const state of block.getStates()) {
        state.model.usesTransparency = true;
    }
}

export async function industrialFan(mod: Mod) {
    const block = mod.createBlock("industrial_fan");

    block.createDefaultLangKey().addTranslation("Industrial Fan", LangKeyLanguage.en_us);
    block.fallbackParams = {
        lightAttenuation: 3,
        isOpaque: false
    };

    const model = await loadBlockbenchModel(mod, "industrial_fan", "./assets/models/industrial-fan.bbmodel");

    model.usesTransparency = true;

    createOmnidirectionalRotations(block, model);
}

export async function railing(mod: Mod) {
    const fallbackParams = {
        lightAttenuation: 3,
        isOpaque: false
    };

    {
        const edge = mod.createBlock("edge_railing");
        edge.fallbackParams = fallbackParams;
        edge.createDefaultLangKey().addTranslation("Edge Railing", LangKeyLanguage.en_us);
        
        const model = await loadBlockbenchModel(mod, "railing_edge", "./assets/models/railing-edge.bbmodel");
        model.usesTransparency = true;
        createNativeRotations(edge, model);
    }

    {
        const straight = mod.createBlock("straight_railing");
        straight.fallbackParams = fallbackParams;
        straight.createDefaultLangKey().addTranslation("Straight Railing", LangKeyLanguage.en_us);

        const model = await loadBlockbenchModel(mod, "railing_straight", "./assets/models/railing-straight.bbmodel");
        model.usesTransparency = true;
        createNativeRotations(straight, model);
    }

    {
        const corner = mod.createBlock("corner_railing");
        corner.fallbackParams = fallbackParams;
        corner.createDefaultLangKey().addTranslation("Corner Railing", LangKeyLanguage.en_us);

        const model = await loadBlockbenchModel(mod, "railing_corner", "./assets/models/railing-corner.bbmodel");
        model.usesTransparency = true;
        createNativeRotations(corner, model);
    }

    {
        const end = mod.createBlock("end_railing");
        end.fallbackParams = fallbackParams;
        end.createDefaultLangKey().addTranslation("End Railing", LangKeyLanguage.en_us);

        const model = await loadBlockbenchModel(mod, "railing_end", "./assets/models/railing-end.bbmodel");
        model.usesTransparency = true;
        createNativeRotations(end, model);
    }
}

export async function industrialBulb(mod: Mod) {
    const block = mod.createBlock("industrial_bulb");

    block.createDefaultLangKey().addTranslation("Industrial Bulb", LangKeyLanguage.en_us);
    block.fallbackParams = {
        isOpaque: false,
        lightLevelRed: 10,
        lightLevelGreen: 8,
        lightLevelBlue: 7
    };

    const model = await loadBlockbenchModel(mod, "industrial_bulb", "./assets/models/industrial-bulb.bbmodel");
    model.rotateX(90);

    model.usesTransparency = true;

    createOmnidirectionalRotations(block, model);
}

export async function grateStairs(mod: Mod) {
    const supportedStairs = mod.createBlock("supported_grate_stairs");

    supportedStairs.createDefaultLangKey().addTranslation("Grate Stairs", LangKeyLanguage.en_us);
    supportedStairs.fallbackParams = {
        isOpaque: false,
        lightAttenuation: 1
    };

    const supportedStairsModel = await loadBlockbenchModel(mod, "supported_grate_stairs", "./assets/models/supported-grate-stairs.bbmodel");

    supportedStairsModel.cullsSelf = false;
    
    createNativeRotations(supportedStairs, supportedStairsModel);


    const stairs = mod.createBlock("grate_stairs");

    stairs.createDefaultLangKey().addTranslation("Grate Stairs", LangKeyLanguage.en_us);
    stairs.fallbackParams = {
        isOpaque: false,
        lightAttenuation: 1
    };

    const stairsModel = await loadBlockbenchModel(mod, "grate_stairs", "./assets/models/grate-stairs.bbmodel");

    stairsModel.cullsSelf = false;
    
    createNativeRotations(stairs, stairsModel);
}

export async function scaffolding(mod: Mod) {
    const fallbackParams = {
        lightAttenuation: 0,
        isOpaque: false,
        isFluid: true,
        walkThrough: true
    };

    const verticalScaffolding = mod.createBlock("scaffolding");
    verticalScaffolding.createDefaultLangKey().addTranslation("Scaffolding", LangKeyLanguage.en_us);
    Object.assign(verticalScaffolding.fallbackParams, fallbackParams);

    const verticalModel = await loadBlockbenchModel(mod, "scaffolding", "./assets/models/scaffolding.bbmodel");

    const verticalState = verticalScaffolding.createState("default");
    verticalState.setBlockModel(verticalModel);

    

    const horizontalScaffolding = mod.createBlock("horizontal_scaffolding");
    horizontalScaffolding.createDefaultLangKey().addTranslation("Horizontal Scaffolding", LangKeyLanguage.en_us);
    Object.assign(horizontalScaffolding.fallbackParams, fallbackParams);

    const horizontalModel = await loadBlockbenchModel(mod, "horizontal_scaffolding", "./assets/models/horizontal-scaffolding.bbmodel");

    horizontalModel.cullsSelf = true;

    createNativeRotations(horizontalScaffolding, horizontalModel);
}

export async function pipes(mod: Mod) {
    const straightPipe = mod.createBlock("brass_straight_pipe");

    straightPipe.createDefaultLangKey().addTranslation("Straight Pipe", LangKeyLanguage.en_us);
    straightPipe.fallbackParams = {
        isOpaque: false
    };

    const straightPipeModel = await loadBlockbenchModel(mod, "brass_pipe_straight", "./assets/models/brass-pipe.bbmodel");
    straightPipeModel.rotateX(90);

    createOmnidirectionalRotations(straightPipe, straightPipeModel);


    
    const cornerPipe = mod.createBlock("brass_corner_pipe");

    cornerPipe.createDefaultLangKey().addTranslation("Corner Pipe", LangKeyLanguage.en_us);
    cornerPipe.fallbackParams = {
        isOpaque: false
    };

    const cornerPipeModel = await loadBlockbenchModel(mod, "brass_pipe_corner", "./assets/models/brass-pipe-corner.bbmodel");
    cornerPipeModel.rotateX(90);

    createOmnidirectionalRotations(cornerPipe, cornerPipeModel);
}