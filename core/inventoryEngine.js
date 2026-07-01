const fs = require("fs");
const path = require("path");

const FILE = path.join(
    __dirname,
    "..",
    "data",
    "inventory.json"
);

function loadInventory() {

    if (!fs.existsSync(FILE)) {

        fs.writeFileSync(
            FILE,
            JSON.stringify({}, null, 4)
        );

    }

    return JSON.parse(

        fs.readFileSync(
            FILE,
            "utf8"
        )

    );

}

function saveInventory(inventory) {

    fs.writeFileSync(

        FILE,

        JSON.stringify(
            inventory,
            null,
            4
        )

    );

}
function getInventory(guildId, userId) {

    const inventory = loadInventory();

    if (!inventory[guildId]) {

        inventory[guildId] = {};

    }

    if (!inventory[guildId][userId]) {

        inventory[guildId][userId] = {};

        saveInventory(inventory);

    }

    return inventory[guildId][userId];

}

function addItem(guildId, userId, itemKey, quantity = 1) {

    const inventory = loadInventory();

    if (!inventory[guildId]) {

        inventory[guildId] = {};

    }

    if (!inventory[guildId][userId]) {

        inventory[guildId][userId] = {};

    }

    inventory[guildId][userId][itemKey] =

        (inventory[guildId][userId][itemKey] || 0) +

        Number(quantity);

    saveInventory(inventory);

    return inventory[guildId][userId];

}

function removeItem(guildId, userId, itemKey, quantity = 1) {

    const inventory = loadInventory();

    if (

        !inventory[guildId] ||

        !inventory[guildId][userId] ||

        !inventory[guildId][userId][itemKey]

    ) {

        return false;

    }

    if (

        inventory[guildId][userId][itemKey] < quantity

    ) {

        return false;

    }

    inventory[guildId][userId][itemKey] -= Number(quantity);

    if (

        inventory[guildId][userId][itemKey] <= 0

    ) {

        delete inventory[guildId][userId][itemKey];

    }

    saveInventory(inventory);

    return true;

}
module.exports = {

    loadInventory,

    saveInventory,

    getInventory,

    addItem,

    removeItem

};