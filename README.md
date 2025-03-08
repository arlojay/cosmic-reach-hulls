# Cosmic Reach Dynamic Asset Generator - Mod Template
An empty mod project configuration to begin development with [CRDAG](https://npmjs.com/cosmic-reach-dag).

## Installation
1) Clone this repository to your local machine
2) Run `npm install`
3) Change the package.json name
4) Set the mod name in `src/index.ts`, line 3
5) Set the writer output to your Cosmic Reach instance's `mods` folder in `src/index.ts`, line 11
6) Change the launch script in package.json to a command which starts Cosmic Reach

## Running
Run the command `npm run game`. If you set the launch command, then it will also launch the game.