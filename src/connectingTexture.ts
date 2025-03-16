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

import { createCanvas, loadImage, Image } from "canvas";
import { Identifier, Texture } from "cosmic-reach-dag";

interface SixConnectingTextureEntry {
    texture: Texture;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export class SixConnectingTexture {
    public id: string;
    public image: Image;
    public textures: Set<SixConnectingTextureEntry> = new Set;

    public static async loadFromFile(id: string, fullPath: string) {
        const image = await loadImage(fullPath);
        const connectingTexture = new SixConnectingTexture(id, image);
        await connectingTexture.create();
        return connectingTexture;
    }

    constructor(id: string, image: Image) {
        this.id = id;
        this.image = image;
    }

    private async slice(x: number, y: number, mask: number): Promise<SixConnectingTextureEntry> {
        const canvas = createCanvas(16, 16);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.image, x * 16, y * 16, 16, 16, 0, 0, 16, 16);

        const     up = (mask & 0b1000) != 0;
        const   down = (mask & 0b0100) != 0;
        const   left = (mask & 0b0010) != 0;
        const  right = (mask & 0b0001) != 0;

        const texture = await Texture.createFromCanvas(this.id + "/" + mask, canvas);
        texture.getAsBlockTextureId(null);
        return {
            texture,
            up, down, left, right
        };
    }

    public async create() {
        this.textures.add(await this.slice(0, 0, 0b0000));
        this.textures.add(await this.slice(0, 3, 0b1000));
        this.textures.add(await this.slice(0, 1, 0b0100));
        this.textures.add(await this.slice(3, 0, 0b0010));
        this.textures.add(await this.slice(1, 0, 0b0001));
        this.textures.add(await this.slice(0, 2, 0b1100));
        this.textures.add(await this.slice(2, 0, 0b0011));
        this.textures.add(await this.slice(3, 3, 0b1010));
        this.textures.add(await this.slice(1, 3, 0b1001));
        this.textures.add(await this.slice(3, 1, 0b0110));
        this.textures.add(await this.slice(1, 1, 0b0101));
        this.textures.add(await this.slice(2, 1, 0b0111));
        this.textures.add(await this.slice(2, 3, 0b1011));
        this.textures.add(await this.slice(1, 2, 0b1101));
        this.textures.add(await this.slice(3, 2, 0b1110));
        this.textures.add(await this.slice(2, 2, 0b1111));
    }

    public getTexture(up: boolean, down: boolean, left: boolean, right: boolean) {
        for(const entry of this.textures) {
            if(entry.up != up) continue;
            if(entry.down != down) continue;
            if(entry.left != left) continue;
            if(entry.right != right) continue;

            return entry.texture;
        }

        return new Texture("debug", new Identifier("base", "debug"));
    }
}



/*
interface FourteenConnectingTextureEntry {
    texture: Texture;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;

    topLeft: boolean;
    topRight: boolean;
    bottomLeft: boolean;
    bottomRight: boolean;
}

export class FourteenConnectingTexture {
    public id: string;
    public image: Image;
    public textures: Set<FourteenConnectingTextureEntry> = new Set;

    public static async loadFromFile(id: string, fullPath: string) {
        const image = await loadImage(fullPath);
        const connectingTexture = new FourteenConnectingTexture(id, image);
        await connectingTexture.create();
        return connectingTexture;
    }

    constructor(id: string, image: Image) {
        this.id = id;
        this.image = image;
    }

    private async slice(x: number, y: number, mask: number): Promise<FourteenConnectingTextureEntry> {
        const canvas = createCanvas(16, 16);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.image, x * 16, y * 16, 16, 16, 0, 0, 16, 16);

        const             up = (mask & 0b00001000) != 0;
        const           down = (mask & 0b00000100) != 0;
        const           left = (mask & 0b00000010) != 0;
        const          right = (mask & 0b00000001) != 0;
        const        topLeft = (mask & 0b10000000) != 0;
        const       topRight = (mask & 0b01000000) != 0;
        const     bottomLeft = (mask & 0b00100000) != 0;
        const    bottomRight = (mask & 0b00010000) != 0;

        const texture = await Texture.createFromCanvas(this.id + "/" + mask, canvas);
        texture.getAsBlockTextureId(null);
        return {
            texture,
            up, down, left, right,
            topLeft, topRight, bottomLeft, bottomRight
        };
    }

    public async create() {
        this.textures.add(await this.slice(1, 1, 0b00000000));
        this.textures.add(await this.slice(3, 6, 0b00001000));
        this.textures.add(await this.slice(3, 4, 0b00000100));
        this.textures.add(await this.slice(2, 3, 0b00000010));
        this.textures.add(await this.slice(0, 3, 0b00000001));
        this.textures.add(await this.slice(4, 5, 0b00001100));
        this.textures.add(await this.slice(1, 3, 0b00000011));
        this.textures.add(await this.slice(2, 6, 0b00001010));
        this.textures.add(await this.slice(0, 6, 0b00001001));
        this.textures.add(await this.slice(2, 4, 0b00000110));
        this.textures.add(await this.slice(0, 4, 0b00000101));
        this.textures.add(await this.slice(1, 4, 0b00000111));
        this.textures.add(await this.slice(1, 6, 0b00001011));
        this.textures.add(await this.slice(0, 5, 0b00001101));
        this.textures.add(await this.slice(2, 5, 0b00001110));
        this.textures.add(await this.slice(1, 5, 0b00001111));

        this.textures.add(await this.slice(6, 3, 0b10001010));
        this.textures.add(await this.slice(6, 1, 0b10001110));
        this.textures.add(await this.slice(4, 3, 0b10001011));
        this.textures.add(await this.slice(4, 1, 0b10001111));

        this.textures.add(await this.slice(3, 3, 0b01001001));
        this.textures.add(await this.slice(5, 3, 0b01001011));
        this.textures.add(await this.slice(3, 1, 0b01001101));
        this.textures.add(await this.slice(5, 1, 0b01001111));

        this.textures.add(await this.slice(6, 0, 0b00100110));
        this.textures.add(await this.slice(4, 0, 0b00100111));
        this.textures.add(await this.slice(6, 2, 0b00101110));
        this.textures.add(await this.slice(4, 2, 0b00101111));

        this.textures.add(await this.slice(3, 0, 0b00010101));
        this.textures.add(await this.slice(5, 0, 0b00010111));
        this.textures.add(await this.slice(3, 2, 0b00011101));
        this.textures.add(await this.slice(5, 2, 0b00011111));
    }

    public getTexture(
        up: boolean, down: boolean, left: boolean, right: boolean,
        topLeft: boolean, topRight: boolean, bottomLeft: boolean, bottomRight: boolean
    ) {
        for(const entry of this.textures) {
            if(entry.up != up) continue;
            if(entry.down != down) continue;
            if(entry.left != left) continue;
            if(entry.right != right) continue;
            
            if(up && left && entry.topLeft != topLeft) continue;
            if(up && right && entry.topRight != topRight) continue;
            if(down && left && entry.bottomLeft != bottomLeft) continue;
            if(down && right && entry.bottomRight != bottomRight) continue;

            return entry.texture;
        }

        return new Texture("debug", new Identifier("base", "debug"));
    }
}
*/