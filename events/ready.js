const {

    Events

} = require("discord.js");

module.exports = {

    name: Events.ClientReady,

    once: true,

    async execute(client) {

        console.log("");

        console.log("========================================");

        console.log("🍽 CAFETERIA BOT V3");

        console.log("========================================");

        console.log(`🤖 Logged in as ${client.user.tag}`);

        console.log(`🌍 Serving ${client.guilds.cache.size} server(s)`);

        console.log("========================================");

        console.log("");

    }

};
        client.user.setPresence({

            activities: [

                {

                    name: "🍽 Serving fresh meals",

                    type: 0

                }

            ],

            status: "online"

        });