const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    addItem

} = require("../core/menuEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("addmenu")

        .setDescription("Add a new cafeteria menu item.")

        .addStringOption(option =>

            option

                .setName("category")

                .setDescription("food, drinks, alcohol, smoke or cigarettes")

                .setRequired(true)

        )

        .addStringOption(option =>

            option

                .setName("name")

                .setDescription("Item name")

                .setRequired(true)

        )

        .addIntegerOption(option =>

            option

                .setName("price")

                .setDescription("Item price")

                .setRequired(true)

                .setMinValue(1)

        )

        .addStringOption(option =>

            option

                .setName("effect")

                .setDescription("Unique item effect ID")

                .setRequired(true)

        ),

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
                const category = interaction.options.getString(

            "category"

        );

        const name = interaction.options.getString(

            "name"

        );

        const price = interaction.options.getInteger(

            "price"

        );

        const effect = interaction.options.getString(

            "effect"

        );

        const itemKey = effect.toLowerCase();

        addItem(

            category,

            itemKey,

            {

                name,

                price,

                currentEffect: effect

            }

        );

        const embed = new EmbedBuilder()

            .setColor(0x57F287)

            .setTitle("📋 Menu Updated")

            .setDescription(

                `**${name}** has been added to the **${category}** menu.`

            )

            .addFields(

                {

                    name: "💵 Price",

                    value: `₦${price.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "🆔 Effect ID",

                    value: effect,

                    inline: true

                },

                {

                    name: "👨‍🍳 Added By",

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