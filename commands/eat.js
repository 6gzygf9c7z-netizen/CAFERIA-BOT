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

        .setName("eat")

        .setDescription("Eat food from your inventory.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Food to eat")

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

        const foods = getAllItems()

            .filter(item =>

                inventory[item.currentEffect] > 0

            )

            .filter(item =>

                item.price >= 2500

            )

            .filter(item =>

                item.name

                    .toLowerCase()

                    .includes(focused)

            )

            .slice(0, 25);

        await interaction.respond(

            foods.map(item => ({

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

            food => food.name === itemName

        );

        if (!item) {

            return interaction.reply({

                content: "❌ Food not found.",

                flags: 64

            });

        }

        if (

            !inventory[item.currentEffect] ||

            inventory[item.currentEffect] <= 0

        ) {

            return interaction.reply({

                content: "❌ You don't have that food in your inventory.",

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

        account.satisfaction = Math.min(

            100,

            account.satisfaction + 25

        );

        account.statistics.foodConsumed += 1;

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(0x57F287)

            .setTitle("🍔 Meal Enjoyed")

            .setDescription(

                `You enjoyed **${item.name}**.`

            )

            .addFields(

                {

                    name: "🍔 Satisfaction",

                    value: `${account.satisfaction}/100`,

                    inline: true

                }

            )

            .setFooter({

                text: `${interaction.guild.name} Cafeteria`

            })

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};