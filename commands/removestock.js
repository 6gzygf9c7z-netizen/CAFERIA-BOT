const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    getAllItems

} = require("../core/menuEngine");

const {

    removeStock

} = require("../core/stockEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("removestock")

        .setDescription("Remove stock from a cafeteria item.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Item to remove stock from")

                .setRequired(true)

                .setAutocomplete(true)

        )

        .addIntegerOption(option =>

            option

                .setName("quantity")

                .setDescription("Quantity to remove")

                .setRequired(true)

                .setMinValue(1)

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

                value: item.currentEffect

            }))

        );

    },

    async execute(interaction) {

        const staffRole = interaction.guild.roles.cache.find(

            role => role.name === "Cafeteria Staff"

        );

        if (

            !staffRole ||

            !interaction.member.roles.cache.has(staffRole.id)

        ) {

            return interaction.reply({

                content: "❌ Only **Cafeteria Staff** can use this command.",

                flags: 64

            });

        }
                const itemKey = interaction.options.getString(

            "item"

        );

        const quantity = interaction.options.getInteger(

            "quantity"

        );

        const item = getAllItems().find(

            i => i.currentEffect === itemKey

        );

        if (!item) {

            return interaction.reply({

                content: "❌ Item not found.",

                flags: 64

            });

        }

        const success = removeStock(

            itemKey,

            quantity

        );

        if (!success) {

            return interaction.reply({

                content: "❌ Not enough stock available to remove.",

                flags: 64

            });

        }

        const embed = new EmbedBuilder()

            .setColor(0xE67E22)

            .setTitle("📦 Stock Updated")

            .setDescription(

                `Removed **${quantity}** × **${item.name}** from cafeteria stock.`

            )

            .addFields(

                {

                    name: "👨‍🍳 Updated By",

                    value: interaction.user.toString(),

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