const fs = require("fs");
const path = require("path");

const FILE = path.join(
    __dirname,
    "..",
    "data",
    "stock.json"
);

function loadStock() {

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

function saveStock(stock) {

    fs.writeFileSync(

        FILE,

        JSON.stringify(
            stock,
            null,
            4
        )

    );

}
function getStock() {

    return loadStock();

}

function getItemStock(itemKey) {

    const stock = loadStock();

    return stock[itemKey] ?? 0;

}

function setItemStock(itemKey, quantity) {

    const stock = loadStock();

    stock[itemKey] = Math.max(

        0,

        Number(quantity)

    );

    saveStock(stock);

    return stock[itemKey];

}

function addStock(itemKey, quantity) {

    const stock = loadStock();

    stock[itemKey] =

        (stock[itemKey] || 0) +

        Number(quantity);

    saveStock(stock);

    return stock[itemKey];

}

function removeStock(itemKey, quantity) {

    const stock = loadStock();

    if (!stock[itemKey]) {

        return false;

    }

    if (stock[itemKey] < quantity) {

        return false;

    }

    stock[itemKey] -= Number(quantity);

    saveStock(stock);

    return true;

}
function restockAll(defaultQuantity = 20) {

    const stock = loadStock();

    const menu = require("./menuEngine").getMenu();

    for (const category of Object.values(menu)) {

        for (const [itemKey] of Object.entries(category)) {

            stock[itemKey] = defaultQuantity;

        }

    }

    saveStock(stock);

    return stock;

}

module.exports = {

    loadStock,

    saveStock,

    getStock,

    getItemStock,

    setItemStock,

    addStock,

    removeStock,

    restockAll

};