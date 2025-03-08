import { Directions, LangKeyLanguage, loadBlockbenchModel, Mod, Writer } from "cosmic-reach-dag";

const mod = new Mod("hulls");
const writer = new Writer(mod, true);

main();

async function main() {
    const block = mod.createBlock("cable_paneling");
    const baseModel = await loadBlockbenchModel(mod, "cable_paneling", "./assets/models/cable-paneling.bbmodel");

    block.createDefaultLangKey().addTranslation("Cable Paneling", LangKeyLanguage.en_us);
    block.fallbackParams = {
        lightAttenuation: 1,
        isOpaque: false
    };

    for(let direction of Directions.nativeRotation) {
        const state = block.createState({ direction: direction.name });
        state.setBlockModel(baseModel);
        state.placementRules = "default";

        if(direction.z > 0) state.rotXZ = 0;
        if(direction.x < 0) state.rotXZ = 90;
        if(direction.z < 0) state.rotXZ = 180;
        if(direction.x > 0) state.rotXZ = 270;
    }

    writer.write(process.env.LOCALAPPDATA + "/cosmic-reach/mods/");
}