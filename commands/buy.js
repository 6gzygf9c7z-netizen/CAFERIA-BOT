const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    getItem,

    getAllItems

} = require("../core/menuEngine");

const {

    getItemStock,

    removeStock

} = require("../core/stockEngine");

const {

    addItem

} = require("../core/inventoryEngine");

const {

    createAccount,

    getAccount,

    saveAccount

} = require("../core/accountsEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("buy")

        .setDescription("Purchase an item from the cafeteria.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Select an item")

                .setRequired(true)

                .setAutocomplete(true)

        ),
            async autocomplete(interaction) {

        const focused = interaction.options
            .getFocused()
            .toLowerCase();

        const choices = getAllItems()
            .filter(item =>
                item.name
                    .toLowerCase()
                    .includes(focused)
            )
            .slice(0, 25);

        await interaction.respond(

            choices.map(item => ({

                name: item.name,

                value: item.name

            }))

        );

    },
        async execute(interaction) {

        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        let account = getAccount(guildId, userId);

        if (!account) {

            account = createAccount(
                guildId,
                userId
            );

        }

        const itemName = interaction.options.getString("item");

        const item = getItem(itemName);

        if (!item) {

            return interaction.reply({

                content: "❌ That item doesn't exist.",

                flags: 64

            });

        }

        const itemKey = item.currentEffect;

        if (getItemStock(itemKey) <= 0) {

            return interaction.reply({

                content: `❌ **${item.name}** is currently out of stock.`,

                flags: 64

            });

        }

        account.outstandingBills += item.price;

        account.statistics.totalSpent += item.price;

        saveAccount(account);

        addItem(

            guildId,

            userId,

            itemKey,

            1

        );

        removeStock(

            itemKey,

            1

        );

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle("🛒 Purchase Successful")

            .setDescription(

                `You purchased **${item.name}**.\n\n` +

                `💳 Added to Outstanding Bills: **₦${item.price.toLocaleString()}**`

            )

            .addFields({

                name: "Outstanding Bills",

                value: `₦${account.outstandingBills.toLocaleString()}`

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