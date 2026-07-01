const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    getMenu

} = require("../core/menuEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("menu")

        .setDescription("View the cafeteria menu."),

    async execute(interaction) {

        const menu = getMenu();

        const embed = new EmbedBuilder()

            .setColor(0x2ECC71)

            .setTitle(`🍽 ${interaction.guild.name} Cafeteria`)

            .setDescription(

                "Browse today's available menu."

            );
                    for (const [categoryName, category] of Object.entries(menu)) {

            const items = Object.values(category)
                .map(item =>
                    `• **${item.name}** ... ₦${item.price.toLocaleString()}`
                )
                .join("\n");

            embed.addFields({

                name:
                    categoryName.charAt(0).toUpperCase() +
                    categoryName.slice(1),

                value:
                    items || "*No items available.*",

                inline: false

            });

        }

        embed.setFooter({

            text: "Use /buy to purchase any menu item."

        });

        embed.setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};