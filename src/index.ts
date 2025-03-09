import { Block, BlockModel, BlockState, Direction, Directions, Identifier, loadBlockbenchModel, Mod, Writer } from "cosmic-reach-dag";
import { cablePaneling, corrugatedMetal, grate, industrialFan, industrialBulb, railing, structuralMetal, grateStairs, scaffolding } from "./blocks";

const mod = new Mod("hulls");
const writer = new Writer(mod, false);

main();

export function createNativeRotations(block: Block, model: BlockModel) {
    block.fallbackParams.catalogHidden = true;

    for(let direction of Directions.nativeRotation) {
        const state = block.createState({ direction: direction.name });
        state.setBlockModel(model);
        state.placementRules = "directional_towards";

        if(direction.z > 0) state.rotXZ = 180;
        if(direction.x < 0) state.rotXZ = 270;
        if(direction.z < 0) state.rotXZ = 0;
        if(direction.x > 0) state.rotXZ = 90;

        if(direction.x == 1) {
            block.fallbackParams.dropId = state.getFullId();
            state.catalogHidden = false;
        }
    }
}

export function createOmnidirectionalRotations(block: Block, model: BlockModel, defaultDirection: Direction = Directions.omnidirectionalRotation.getDirection("PosY")) {
    console.log(defaultDirection);
    block.fallbackParams.catalogHidden = true;

    const upModel = model.clone(model.id.getItem() + "_pos-y").rotateX(-90);
    const downModel = model.clone(model.id.getItem() + "_neg-y").rotateX(90);

    for(const direction of Directions.omnidirectionalRotation) {
        const state = block.createState({ direction: direction.name });
        state.placementRules = "omnidirectional_towards";

        if(direction.y != 0) {
            state.setBlockModel(direction.y > 0 ? upModel : downModel);
        } else {
            state.setBlockModel(model);
            
            if(direction.z > 0) state.rotXZ = 180;
            if(direction.x < 0) state.rotXZ = 270;
            if(direction.z < 0) state.rotXZ = 0;
            if(direction.x > 0) state.rotXZ = 90;
        }
        
        if(direction.is(defaultDirection)) {
            block.fallbackParams.dropId = state.getFullId();
            state.catalogHidden = false;
        }
    }
}

export async function createFixedShapes() {
    const blockShape = new Block(null, new Identifier(null, "shape"));
    await createFixedStairShapes(blockShape);
    await createFixedSlabShapes(blockShape);
}

export async function createFixedSlabShapes(blockShape: Block) {
    const slabBottomModel = await loadBlockbenchModel(mod, "shape/slab_bottom", "./assets/models/shapes/slab-bottom.bbmodel", { importTextures: false });
    const slabTopModel = await loadBlockbenchModel(mod, "shape/slab_top", "./assets/models/shapes/slab-top.bbmodel", { importTextures: false });
    const slabVerticalModel = await loadBlockbenchModel(mod, "shape/slab_vertical", "./assets/models/shapes/slab-vertical.bbmodel", { importTextures: false });

    const generator = mod.createBlockStateGenerator("all_slab");
    const slabAll = generator.createGroup("slabs_all");
    const slabHorizontal = generator.createGroup("slabs_horizontal");
    const slabVertical = generator.createGroup("slabs_vertical");
    slabAll.addIncludes(slabHorizontal, slabVertical);

    function defaultVerticalSlabs(state: BlockState) {
        state.isOpaque = false;
        state.dropParamOverrides = { slab_type: "verticalNegX" };
        state.catalogHidden = true;
        state.allowSwapping = false;
    }
    function defaultHorizontalSlabs(state: BlockState) {
        state.isOpaque = false;
        state.dropParamOverrides = { slab_type: "bottom" };
    }

    // Vertical Slabs
    {
        const state = blockShape.createState({ slab_type: "verticalPosZ" });
        state.setBlockModel(slabVerticalModel);
        defaultVerticalSlabs(state);
        slabVertical.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ slab_type: "verticalNegX" });
        state.setBlockModel(slabVerticalModel);
        defaultVerticalSlabs(state);
        state.rotXZ = 90;
        state.catalogHidden = false;
        state.allowSwapping = true;
        slabVertical.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ slab_type: "verticalNegZ" });
        state.setBlockModel(slabVerticalModel);
        defaultVerticalSlabs(state);
        state.rotXZ = 180;
        slabVertical.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ slab_type: "verticalPosX" });
        state.setBlockModel(slabVerticalModel);
        defaultVerticalSlabs(state);
        state.rotXZ = 270;
        slabVertical.addIncludes(generator.createTemplatedGenerator(state));
    }

    // Horizontal Slabs
    {
        const state = blockShape.createState({ slab_type: "bottom" });
        state.setBlockModel(slabBottomModel);
        defaultHorizontalSlabs(state);
        state.catalogHidden = false;
        state.allowSwapping = true;
        slabHorizontal.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ slab_type: "top" });
        state.setBlockModel(slabTopModel);
        defaultHorizontalSlabs(state);
        state.catalogHidden = true;
        state.allowSwapping = false;
        slabHorizontal.addIncludes(generator.createTemplatedGenerator(state));
    }
}

export async function createFixedStairShapes(blockShape: Block) {
    const stairBottomModel = await loadBlockbenchModel(mod, "shape/stair_bottom", "./assets/models/shapes/stair-bottom.bbmodel", { importTextures: false });
    const stairTopModel = await loadBlockbenchModel(mod, "shape/stair_top", "./assets/models/shapes/stair-top.bbmodel", { importTextures: false });

    const generator = mod.createBlockStateGenerator("all_stairs");
    const stairsAll = generator.createGroup("stairs_all");
    const stairsBottom = generator.createGroup("stairs_bottom");
    const stairsTop = generator.createGroup("stairs_top");
    stairsAll.addIncludes(stairsBottom, stairsTop);

    function defaultStairs(state: BlockState) {
        state.isOpaque = false;
        state.placementRules = "stairs";
        state.dropParamOverrides = { stair_type: "bottom_NegX" };
        state.catalogHidden = true;
        state.allowSwapping = false;
    }

    // Bottom Stairs
    {
        const state = blockShape.createState({ stair_type: "bottom_PosZ" });
        state.setBlockModel(stairBottomModel);
        defaultStairs(state);
        stairsBottom.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ stair_type: "bottom_NegX" });
        state.setBlockModel(stairBottomModel);
        defaultStairs(state);
        state.rotXZ = 90;
        state.catalogHidden = false;
        state.allowSwapping = true;
        stairsBottom.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ stair_type: "bottom_NegZ" });
        state.setBlockModel(stairBottomModel);
        defaultStairs(state);
        state.rotXZ = 180;
        stairsBottom.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ stair_type: "bottom_PosX" });
        state.setBlockModel(stairBottomModel);
        defaultStairs(state);
        state.rotXZ = 270;
        stairsBottom.addIncludes(generator.createTemplatedGenerator(state));
    }

    // Top Stairs
    {
        const state = blockShape.createState({ stair_type: "top_PosZ" });
        state.setBlockModel(stairTopModel);
        defaultStairs(state);
        stairsTop.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ stair_type: "top_NegX" });
        state.setBlockModel(stairTopModel);
        defaultStairs(state);
        state.rotXZ = 90;
        stairsTop.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ stair_type: "top_NegZ" });
        state.setBlockModel(stairTopModel);
        defaultStairs(state);
        state.rotXZ = 180;
        stairsTop.addIncludes(generator.createTemplatedGenerator(state));
    }
    {
        const state = blockShape.createState({ stair_type: "top_PosX" });
        state.setBlockModel(stairTopModel);
        defaultStairs(state);
        state.rotXZ = 270;
        stairsTop.addIncludes(generator.createTemplatedGenerator(state));
    }
}

export function createShapeVariants(block: Block, model: BlockModel) {
    const state = block.createState("default");
    state.setBlockModel(model);
    state.stateGenerators.add(new Identifier(mod, "stairs_all"));
    state.stateGenerators.add(new Identifier(mod, "slabs_all"));
}

async function main() {
    await createFixedShapes();

    await cablePaneling(mod);
    await structuralMetal(mod);
    await grate(mod);
    await corrugatedMetal(mod);
    await industrialFan(mod);
    await railing(mod);
    await industrialBulb(mod);
    await grateStairs(mod);
    await scaffolding(mod);

    writer.write(process.env.LOCALAPPDATA + "/cosmic-reach/mods/");
}