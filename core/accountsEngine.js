const fs = require("fs");
const path = require("path");

const FILE = path.join(
    __dirname,
    "..",
    "data",
    "accounts.json"
);

function loadAccounts() {

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

function saveAccounts(accounts) {

    fs.writeFileSync(

        FILE,

        JSON.stringify(
            accounts,
            null,
            4
        )

    );

}
function createAccount(guildId, userId) {

    const accounts = loadAccounts();

    if (!accounts[guildId]) {

        accounts[guildId] = {};

    }

    if (accounts[guildId][userId]) {

        return accounts[guildId][userId];

    }

    accounts[guildId][userId] = {

        guildId,

        userId,

        outstandingBills: 0,

        satisfaction: 0,

        hydration: 0,

        energy: 0,

        intoxication: 0,

        highness: 0,

        statistics: {

            foodConsumed: 0,

            drinksConsumed: 0,

            alcoholConsumed: 0,

            smokeConsumed: 0,

            totalSpent: 0

        },

        createdAt: Date.now(),

        updatedAt: Date.now()

    };

    saveAccounts(accounts);

    return accounts[guildId][userId];

}
function getAccount(guildId, userId) {

    const accounts = loadAccounts();

    if (!accounts[guildId]) {

        return null;

    }

    return accounts[guildId][userId] || null;

}

function saveAccount(account) {

    const accounts = loadAccounts();

    if (!accounts[account.guildId]) {

        accounts[account.guildId] = {};

    }

    account.updatedAt = Date.now();

    accounts[account.guildId][account.userId] = account;

    saveAccounts(accounts);

    return account;

}

function accountExists(guildId, userId) {

    return getAccount(guildId, userId) !== null;

}

function getAllAccounts(guildId) {

    const accounts = loadAccounts();

    return accounts[guildId] || {};

}
module.exports = {

    loadAccounts,

    saveAccounts,

    createAccount,

    getAccount,

    saveAccount,

    accountExists,

    getAllAccounts

};