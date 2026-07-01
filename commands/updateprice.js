const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    getAllItems,

    updatePrice

} = require("../core/menuEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("updateprice")

        .setDescription("Update the price of a cafeteria item.")

        .addStringOption(option =>

            option

                .setName("item")

                .setDescription("Menu item")

                .setRequired(true)

                .setAutocomplete(true)

        )

        .addIntegerOption(option =>

            option

                .setName("price")

                .setDescription("New price")

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

                value: item.name

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
                const itemName = interaction.options.getString(

            "item"

        );

        const newPrice = interaction.options.getInteger(

            "price"

        );

        const item = getAllItems().find(

            i => i.name === itemName

        );

        if (!item) {

            return interaction.reply({

                content: "❌ Item not found.",

                flags: 64

            });

        }

        updatePrice(

            item.currentEffect,

            newPrice

        );

        const embed = new EmbedBuilder()

            .setColor(0x3498DB)

            .setTitle("💰 Price Updated")

            .setDescription(

                `Updated **${item.name}** successfully.`

            )

            .addFields(

                {

                    name: "New Price",

                    value: `₦${newPrice.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "Updated By",

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