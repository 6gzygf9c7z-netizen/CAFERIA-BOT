const fs = require("fs");
const path = require("path");

const FILE = path.join(
    __dirname,
    "..",
    "data",
    "menu.json"
);

function loadMenu() {

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

function saveMenu(menu) {

    fs.writeFileSync(

        FILE,

        JSON.stringify(
            menu,
            null,
            4
        )

    );

}
function getMenu() {

    return loadMenu();

}

function getCategory(category) {

    const menu = loadMenu();

    return menu[category] || {};

}

function getItem(itemName) {

    const menu = loadMenu();

    const search = itemName.toLowerCase();

    for (const category of Object.values(menu)) {

        for (const item of Object.values(category)) {

            if (

                item.name.toLowerCase() === search

            ) {

                return item;

            }

        }

    }

    return null;

}

function getAllItems() {

    const menu = loadMenu();

    const items = [];

    for (const category of Object.values(menu)) {

        items.push(

            ...Object.values(category)

        );

    }

    return items;

}
function addItem(category, itemKey, itemData) {

    const menu = loadMenu();

    if (!menu[category]) {

        menu[category] = {};

    }

    menu[category][itemKey] = itemData;

    saveMenu(menu);

    return menu[category][itemKey];

}

function updatePrice(itemName, newPrice) {

    const menu = loadMenu();

    const search = itemName.toLowerCase();

    for (const category of Object.values(menu)) {

        for (const item of Object.values(category)) {

            if (item.name.toLowerCase() === search) {

                item.price = newPrice;

                saveMenu(menu);

                return item;

            }

        }

    }

    return null;

}

module.exports = {

    loadMenu,

    saveMenu,

    getMenu,

    getCategory,

    getItem,

    getAllItems,

    addItem,

    updatePrice

};