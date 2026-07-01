const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    restockAll

} = require("../core/stockEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("restock")

        .setDescription("Restock every cafeteria item."),

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
                const stock = restockAll();

        const totalItems = Object.keys(stock).length;

        const embed = new EmbedBuilder()

            .setColor(0x57F287)

            .setTitle("📦 Cafeteria Restocked")

            .setDescription(

                "Every cafeteria item has been restocked."

            )

            .addFields(

                {

                    name: "📋 Items Restocked",

                    value: `${totalItems}`,

                    inline: true

                },

                {

                    name: "👨‍🍳 Restocked By",

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