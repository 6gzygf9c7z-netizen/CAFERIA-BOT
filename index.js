require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]

});

client.commands = new Collection();
/*
========================================
Load Slash Commands
========================================
*/

const commands = [];

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(path.join(commandsPath, file));

        if (command.data && command.execute) {

            client.commands.set(command.data.name, command);

            commands.push(command.data.toJSON());

        }

    }

}
/*
========================================
Register Slash Commands
========================================
*/

const {
    REST,
    Routes
} = require("discord.js");

async function registerCommands() {

    try {

        const rest = new REST({ version: "10" })
            .setToken(process.env.TOKEN);

        await rest.put(

            Routes.applicationCommands(

                process.env.CLIENT_ID

            ),

            {

                body: commands

            }

        );

        console.log(`✅ Registered ${commands.length} application commands.`);

    } catch (error) {

        console.error("❌ Failed to register commands.");

        console.error(error);

    }

}
/*
========================================
Load Events
========================================
*/

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {

        const event = require(path.join(eventsPath, file));

        if (event.once) {

            client.once(

                event.name,

                (...args) => event.execute(...args, client)

            );

        } else {

            client.on(

                event.name,

                (...args) => event.execute(...args, client)

            );

        }

    }

}
/*
========================================
Start Cafeteria Bot V3
========================================
*/

(async () => {

    await registerCommands();

    await client.login(process.env.TOKEN);

})();