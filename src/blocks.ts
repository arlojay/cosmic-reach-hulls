import { Directions, Identifier, LangKeyLanguage, loadBlockbenchModel, Mod, Texture } from "cosmic-reach-dag";
import { createNativeRotations, createOmnidirectionalRotations, createShapeVariants } from ".";

export async function cablePaneling(mod: Mod) {
    const block = mod.createBlock("cable_paneling");

    block.createDefaultLangKey().addTranslation("Cable Paneling", LangKeyLanguage.en_us);
    block.fallbackParams = {
        lightAttenuation: 1,
        isOpaque: false
    };
    createNativeRotations(
        block,
        await loadBlockbenchModel(mod, "cable_paneling", "./assets/models/cable-paneling.bbmodel")
    );
}

export async function structuralMetal(mod: Mod) {
    const block = mod.createBlock("structural_metal");

    block.createDefaultLangKey().addTranslation("Structural Metal", LangKeyLanguage.en_us);

    createOmnidirectionalRotations(
        block,
        await loadBlockbenchModel(mod, "structural_metal", "./assets/models/structural-metal.bbmodel")
    );
}

export async function grate(mod: Mod) {
    const block = mod.createBlock("grate");

    block.createDefaultLangKey().addTranslation("Grate", LangKeyLanguage.en_us);
    block.fallbackParams = {
        lightAttenuation: 1,
        isOpaque: false
    };

    const model = await loadBlockbenchModel(mod, "grate", "./assets/models/grate.bbmodel");

    model.cullsSelf = true;
    model.transparent = true;

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

export async function industrialFan(mod: Mod) {
    const block = mod.createBlock("industrial_fan");

    block.createDefaultLangKey().addTranslation("Industrial Fan", LangKeyLanguage.en_us);
    block.fallbackParams = {
        lightAttenuation: 3,
        isOpaque: false
    };

    const model = await loadBlockbenchModel(mod, "industrial_fan", "./assets/models/industrial-fan.bbmodel");

    model.cullsSelf = true;
    model.transparent = true;

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
        createNativeRotations(edge, model);
    }

    {
        const straight = mod.createBlock("straight_railing");
        straight.fallbackParams = fallbackParams;
        straight.createDefaultLangKey().addTranslation("Straight Railing", LangKeyLanguage.en_us);

        const model = await loadBlockbenchModel(mod, "railing_straight", "./assets/models/railing-straight.bbmodel");
        createNativeRotations(straight, model);
    }

    {
        const corner = mod.createBlock("corner_railing");
        corner.fallbackParams = fallbackParams;
        corner.createDefaultLangKey().addTranslation("Corner Railing", LangKeyLanguage.en_us);

        const model = await loadBlockbenchModel(mod, "railing_corner", "./assets/models/railing-corner.bbmodel");
        createNativeRotations(corner, model);
    }

    {
        const end = mod.createBlock("end_railing");
        end.fallbackParams = fallbackParams;
        end.createDefaultLangKey().addTranslation("End Railing", LangKeyLanguage.en_us);

        const model = await loadBlockbenchModel(mod, "railing_end", "./assets/models/railing-end.bbmodel");
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

    model.cullsSelf = true;
    model.transparent = true;

    createOmnidirectionalRotations(block, model);
}

export async function grateStairs(mod: Mod) {
    const block = mod.createBlock("grate_stairs");

    block.createDefaultLangKey().addTranslation("Grate Stairs", LangKeyLanguage.en_us);
    block.fallbackParams = {
        isOpaque: false,
        lightAttenuation: 1
    };

    const model = await loadBlockbenchModel(mod, "grate_stairs", "./assets/models/grate-stairs.bbmodel");

    model.cullsSelf = false;
    
    createNativeRotations(block, model);
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

    verticalModel.cullsSelf = true;
    verticalModel.transparent = true;

    const verticalState = verticalScaffolding.createState("default");
    verticalState.setBlockModel(verticalModel);

    

    const horizontalScaffolding = mod.createBlock("horizontal_scaffolding");
    horizontalScaffolding.createDefaultLangKey().addTranslation("Horizontal Scaffolding", LangKeyLanguage.en_us);
    Object.assign(horizontalScaffolding.fallbackParams, fallbackParams);

    const horizontalModel = await loadBlockbenchModel(mod, "horizontal_scaffolding", "./assets/models/horizontal-scaffolding.bbmodel");

    horizontalModel.cullsSelf = true;
    horizontalModel.transparent = true;

    createNativeRotations(horizontalScaffolding, horizontalModel);
}