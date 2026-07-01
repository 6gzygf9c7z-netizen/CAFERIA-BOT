const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    getInventory

} = require("../core/inventoryEngine");

const {

    getMenu

} = require("../core/menuEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("inventory")

        .setDescription("View your cafeteria inventory."),

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        const inventory = getInventory(

            guildId,

            userId

        );

        const menu = getMenu();

        const embed = new EmbedBuilder()

            .setColor(0x3498DB)

            .setTitle(`🎒 ${interaction.user.displayName}'s Inventory`)

            .setFooter({

                text: `${interaction.guild.name} Cafeteria`

            })

            .setTimestamp();
                    let hasItems = false;

        for (const category of Object.values(menu)) {

            for (const item of Object.values(category)) {

                const quantity = inventory[item.currentEffect];

                if (!quantity) {

                    continue;

                }

                hasItems = true;

                embed.addFields({

                    name: item.name,

                    value: `Quantity: **${quantity}**`,

                    inline: true

                });

            }

        }

        if (!hasItems) {

            embed.setDescription(

                "📦 Your inventory is empty."

            );

        }

        await interaction.reply({

            embeds: [embed]

        });

    }

};