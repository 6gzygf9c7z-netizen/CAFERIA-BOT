const accountsEngine = require("./accountsEngine");
const effectsEngine = require("./effectsEngine");

let scheduler = null;

function startScheduler(client) {

    if (scheduler) {

        return;

    }

    scheduler = setInterval(

        () => runScheduler(client),

        60000

    );

}

function stopScheduler() {

    if (!scheduler) {

        return;

    }

    clearInterval(scheduler);

    scheduler = null;

}
async function runScheduler(client) {

    const guilds = accountsEngine.getAllAccounts();

    for (const guildId of Object.keys(guilds)) {

        const users = guilds[guildId];

        const guild = client.guilds.cache.get(guildId);

        if (!guild) {

            continue;

        }

        for (const userId of Object.keys(users)) {

            const account = users[userId];

            account.satisfaction = Math.max(

                0,

                account.satisfaction - 1

            );

            account.hydration = Math.max(

                0,

                account.hydration - 1

            );

            account.energy = Math.max(

                0,

                account.energy - 1

            );

            account.highness = Math.max(

                0,

                account.highness - 1

            );

            account.intoxication = Math.max(

                0,

                account.intoxication - 1

            );

            accountsEngine.saveAccount(account);

            try {

                const member = await guild.members.fetch(userId);

                await effectsEngine.updateMemberRoles(

                    member,

                    account

                );

            } catch {

                continue;

            }

        }

    }

}
function restartScheduler(client) {

    stopScheduler();

    startScheduler(client);

}

function isRunning() {

    return scheduler !== null;

}

module.exports = {

    startScheduler,

    stopScheduler,

    restartScheduler,

    isRunning,

    runScheduler

};