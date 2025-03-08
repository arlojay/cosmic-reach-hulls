import { Mod, Writer } from "cosmic-reach-dag";

const mod = new Mod("mymod"); // Also update in package.json!
const writer = new Writer(mod, true);

main();

async function main() {
    // Write your mod here

    writer.write("./mod/"); // Change to your Cosmic Reach mods folder to automatically update it
}