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

import { BlockEventPredicate, BlockModel, DirectionList, Directions, Identifier, loadBlockbenchModel, LogicPredicate, Mod, SetBlockStateParamsAction } from "cosmic-reach-dag";
import { Vector3, Euler } from "three";


interface PipeModel {
    model: BlockModel,
    directions: Vector3[]
}
type PipeModelList = Record<number, PipeModel[]>;

function isSimilar(listA: Vector3[], listB: Vector3[]) {
    const remainingA: Set<Vector3> = new Set(listA);
    const remainingB: Set<Vector3> = new Set(listB);

    for(const bVector of listB) {
        for(const aVector of listA) {
            if(aVector.clone().sub(bVector).lengthSq() < 0.1) {
                remainingA.delete(aVector);
                remainingB.delete(bVector);
                break;
            }
        }
    }
    
    return remainingA.size == 0 && remainingB.size == 0;
}
function rotateGlobal(vector: Vector3, euler: Euler) {
    vector.applyAxisAngle(new Vector3(1, 0, 0), euler.x);
    vector.applyAxisAngle(new Vector3(0, 1, 0), euler.y);
    vector.applyAxisAngle(new Vector3(0, 0, 1), euler.z);
    
    return vector;
}
function getRotationWeight(rotation: Euler) {
    let axesUsed = 0;
    if(rotation.x != 0) axesUsed++;
    if(rotation.y != 0) axesUsed++;
    if(rotation.z != 0) axesUsed++;

    return new Vector3().copy(rotation).lengthSq() ** axesUsed;
}
function findBestTransform(inputDirections: Vector3[][], directions: Vector3[]) {
    const allPossibleRotations: Euler[] = [];
    
    for(let x = -1; x < 3; x++) for(let y = -1; y < 3; y++) for(let z = -1; z < 3; z++) {
        const euler = new Euler(
            x / 2 * Math.PI,
            y / 2 * Math.PI,
            z / 2 * Math.PI,
            "XYZ"
        );
        allPossibleRotations.push(euler);
    }

    const working: { input: Vector3[], euler: Euler }[] = new Array;

    for(const input of inputDirections) {
        for(const euler of allPossibleRotations) {
            const transformedVectors = input.map(v => rotateGlobal(v.clone(), euler));
            if(isSimilar(transformedVectors, directions)) {
                working.push({ input, euler: euler.clone() });
            }
        }
    }

    if(working.length == 0) {
        console.error("Cannot find best transform for pipe with " + directions.length + " direction(s)");
        console.error(directions);
        return { input: inputDirections[0], euler: new Euler };
    }

    return working.sort((a, b) => {
        return getRotationWeight(b.euler) - getRotationWeight(a.euler);
    }).pop();
}

function createPipeModel(modelListMap: PipeModelList, directions: DirectionList, namespace: string = "pipe") {
    const modelList = modelListMap[directions.size];
    
    const modelMap: Map<Vector3[], PipeModel> = new Map;
    for(const model of modelList) modelMap.set(model.directions, model);

    const directionVectors = directions.array().map(d => new Vector3(...d));

    const bestTransform = findBestTransform(modelMap.keys().toArray(), directionVectors);
    const bestModel = modelMap.get(bestTransform.input);

    const rotation = new Vector3().copy(bestTransform.euler);

    const clonedModel = bestModel.model.clone(namespace + "/" + directions.toString());
    clonedModel.rotateX(Math.round(-rotation.x * 180 / Math.PI));
    clonedModel.rotateY(Math.round(-rotation.y * 180 / Math.PI));
    clonedModel.rotateZ(Math.round(-rotation.z * 180 / Math.PI));

    return {
        model: bestModel.model,
        transformedModel: clonedModel,
        rotation: new Vector3(
            Math.round(-rotation.x * 180 / Math.PI),
            Math.round(-rotation.y * 180 / Math.PI),
            Math.round(-rotation.z * 180 / Math.PI)
        )
    };
}


export async function pipes(mod: Mod) {
    const baseId = "pipe";

    const models: PipeModelList = {
        0: [
            {
                model: await loadBlockbenchModel(mod, "pipe/none", "./assets/models/pipe/none.bbmodel"),
                directions: [] as Vector3[]
            }
        ],
        1: [
            {
                model: await loadBlockbenchModel(mod, "pipe/straight", "./assets/models/pipe/straight.bbmodel"),
                directions: [ new Vector3(0, 1, 0) ]
            }
        ],
        2: [
            {
                model: await loadBlockbenchModel(mod, "pipe/straight", "./assets/models/pipe/straight.bbmodel"),
                directions: [ new Vector3(0, -1, 0), new Vector3(0, 1, 0) ]
            },
            {
                model: await loadBlockbenchModel(mod, "pipe/turn", "./assets/models/pipe/turn.bbmodel"),
                directions: [ new Vector3(0, -1, 0), new Vector3(0, 0, -1) ]
            }
        ],
        3: [
            {
                model: await loadBlockbenchModel(mod, "pipe/tee", "./assets/models/pipe/tee.bbmodel"),
                directions: [ new Vector3(0, -1, 0), new Vector3(0, 1, 0), new Vector3(0, 0, -1) ]
            },
            {
                model: await loadBlockbenchModel(mod, "pipe/corner", "./assets/models/pipe/corner.bbmodel"),
                directions: [ new Vector3(-1, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 0, -1) ]
            }
        ],
        4: [
            {
                model: await loadBlockbenchModel(mod, "pipe/cross", "./assets/models/pipe/cross.bbmodel"),
                directions: [ new Vector3(0, -1, 0), new Vector3(0, 1, 0), new Vector3(0, 0, -1), new Vector3(0, 0, 1) ]
            },
            {

                model: await loadBlockbenchModel(mod, "pipe/cross_alt", "./assets/models/pipe/cross-alt.bbmodel"),
                directions: [ new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 0, -1) ]
            }
        ],
        5: [
            {
                model: await loadBlockbenchModel(mod, "pipe/five", "./assets/models/pipe/five.bbmodel"),
                directions: [ new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 1, 0), new Vector3(0, 0, -1) ]
            }
        ],
        6: [
            {
                model: await loadBlockbenchModel(mod, "pipe/all", "./assets/models/pipe/all.bbmodel"),
                directions: [
                    new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(0, -1, 0),
                    new Vector3(0, 1, 0), new Vector3(0, 0, -1), new Vector3(0, 0, 0)
                ]
            }
        ]
    };

    const block = mod.createBlock(baseId);
    const defaultParams = {
        north: "false",
        east: "false",
        south: "false",
        west: "false",
        up: "false",
        down: "false"
    };

    const triggerSheet = mod.createTriggerSheet(baseId);
    triggerSheet.setParent(new Identifier("base", "block_events_default"));

    triggerSheet.onUpdate(new SetBlockStateParamsAction({ params: defaultParams }));
    
    for(const direction of Directions.cardinals) {
        triggerSheet.onUpdate(
            new SetBlockStateParamsAction({
                params: { [direction.name]: "true" }
            })
            .if(new LogicPredicate({
                or: [
                    new BlockEventPredicate({
                        block_at: {
                            xOff: direction.x, yOff: direction.y, zOff: direction.z,
                            has_tag: "hulls:connectable/" + baseId
                        }
                    }),
                    new BlockEventPredicate({
                        block_at: {
                            xOff: direction.x, yOff: direction.y, zOff: direction.z,
                            has_tag: "hulls:connectable"
                        }
                    })
                ]
            }))
        );
    }

    block.fallbackParams = {
        catalogHidden: true,
        isOpaque: false,
        lightAttenuation: 1
    };

    for(const directionList of Directions.cardinals.combinations()) {
        const state = block.createState(defaultParams);
        state.tags.push("hulls:connectable/" + baseId);
        state.setTriggerSheet(triggerSheet);

        if(directionList.size == 0) state.catalogHidden = false;
        for(const direction of directionList) {
            state.params.set(direction.name, "true");
        }

        const { model, transformedModel, rotation } = createPipeModel(models, directionList, baseId);
        state.setBlockModel(transformedModel);
        // state.setBlockModel(model);
        // state.rotation = rotation.toArray();
    }
}