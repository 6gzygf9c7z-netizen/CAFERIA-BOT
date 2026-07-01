const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    createAccount,

    getAccount

} = require("../core/accountsEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("status")

        .setDescription("View your cafeteria status."),

    async execute(interaction) {

        const guildId = interaction.guild.id;

        const userId = interaction.user.id;

        let account = getAccount(

            guildId,

            userId

        );

        if (!account) {

            account = createAccount(

                guildId,

                userId

            );

        }

        const embed = new EmbedBuilder()

            .setColor(0xF1C40F)

            .setTitle(`📊 ${interaction.user.displayName}'s Status`)

            .setFooter({

                text: `${interaction.guild.name} Cafeteria`

            })

            .setTimestamp();
                    embed.addFields(

            {

                name: "🍔 Satisfaction",

                value: `${account.satisfaction}/100`,

                inline: true

            },

            {

                name: "💧 Hydration",

                value: `${account.hydration}/100`,

                inline: true

            },

            {

                name: "⚡ Energy",

                value: `${account.energy}/100`,

                inline: true

            },

            {

                name: "🌿 Highness",

                value: `${account.highness}/100`,

                inline: true

            },

            {

                name: "🍺 Intoxication",

                value: `${account.intoxication}/100`,

                inline: true

            },

            {

                name: "💳 Outstanding Bills",

                value: `₦${account.outstandingBills.toLocaleString()}`,

                inline: true

            }

        );

        await interaction.reply({

            embeds: [embed]

        });

    }

};