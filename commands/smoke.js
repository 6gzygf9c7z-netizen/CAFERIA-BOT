const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    getInventory,

    removeItem

} = require("../core/inventoryEngine");

const {

    getAllItems

} = require("../core/menuEngine");

const {

    getAccount,

    saveAccount

} = require("../core/accountsEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("smoke")

        .setDescription("Smoke an item from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Smoke to consume")

                .setRequired(true)

                .setAutocomplete(true)

        ),
            async autocomplete(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const inventory = getInventory(

            guildId,

            userId

        );

        const smokeItems = getAllItems()

            .filter(item =>

                inventory[item.currentEffect] > 0

            )

            .filter(item =>

                item.currentEffect.includes("og_kush") ||
                item.currentEffect.includes("purple_haze") ||
                item.currentEffect.includes("blue_dream") ||
                item.currentEffect.includes("white_widow") ||
                item.currentEffect.includes("girl_scout_cookies") ||
                item.currentEffect.includes("marlboro") ||
                item.currentEffect.includes("dunhill") ||
                item.currentEffect.includes("benson") ||
                item.currentEffect.includes("camel") ||
                item.currentEffect.includes("rothmans")

            )

            .filter(item =>

                item.name
                    .toLowerCase()
                    .includes(focused)

            )

            .slice(0, 25);

        await interaction.respond(

            smokeItems.map(item => ({

                name: item.name,

                value: item.name

            }))

        );

    },
        async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const itemName = interaction.options.getString("item");

        const inventory = getInventory(

            guildId,

            userId

        );

        const item = getAllItems().find(

            smoke => smoke.name === itemName

        );

        if (!item) {

            return interaction.reply({

                content: "❌ Smoke item not found.",

                flags: 64

            });

        }

        if (

            !inventory[item.currentEffect] ||

            inventory[item.currentEffect] <= 0

        ) {

            return interaction.reply({

                content: "❌ You don't have that item in your inventory.",

                flags: 64

            });

        }

        removeItem(

            guildId,

            userId,

            item.currentEffect,

            1

        );

        const account = getAccount(

            guildId,

            userId

        );

        account.highness = Math.min(

            100,

            account.highness + 25

        );

        account.statistics.smokeConsumed += 1;

        saveAccount(account);

        const messages = [

            "😌 You take a slow puff and relax.",

            "💨 The smoke settles in nicely.",

            "🌿 You feel the effects beginning to kick in.",

            "😮‍💨 That hit was smooth.",

            "🍃 You lean back and enjoy the moment."

        ];

        const randomMessage =

            messages[

                Math.floor(

                    Math.random() * messages.length

                )

            ];

        const embed = new EmbedBuilder()

            .setColor(0x9B59B6)

            .setTitle("🌿 Smoke Consumed")

            .setDescription(

                `You smoked **${item.name}**.\n\n${randomMessage}`

            )

            .addFields({

                name: "🌿 Highness",

                value: `${account.highness}/100`,

                inline: true

            })

            .setFooter({

                text: `${interaction.guild.name} Cafeteria`

            })

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};