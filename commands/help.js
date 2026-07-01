const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("help")

        .setDescription("View all available cafeteria commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()

            .setColor(0x3498DB)

            .setTitle("📖 Cafeteria Help")

            .setDescription(

                "Welcome to the cafeteria. Here are the available commands."

            )

            .setFooter({

                text: `${interaction.guild.name} Cafeteria`

            })

            .setTimestamp();
                    embed.addFields(

            {

                name: "👤 Customer Commands",

                value:
                    "`/menu`\n" +
                    "`/buy`\n" +
                    "`/inventory`\n" +
                    "`/eat`\n" +
                    "`/drink`\n" +
                    "`/smoke`\n" +
                    "`/status`\n" +
                    "`/wallet`\n" +
                    "`/help`"

            },

            {

                name: "👨‍🍳 Cafeteria Staff",

                value:
                    "`/clearbills`\n" +
                    "`/restock`\n" +
                    "`/removestock`\n" +
                    "`/addmenu`\n" +
                    "`/updateprice`"

            },

            {

                name: "📌 How the Cafeteria Works",

                value:
                    "• Buy now... Pay later.\n" +
                    "• Purchases are added to your **Outstanding Bills**.\n" +
                    "• Visit Cafeteria Staff to settle your bills.\n" +
                    "• Eating increases Satisfaction.\n" +
                    "• Drinking increases Hydration.\n" +
                    "• Smoking increases Highness.\n" +
                    "• Alcohol also increases Intoxication."

            }

        );

        await interaction.reply({

            embeds: [embed]

        });

    }

};