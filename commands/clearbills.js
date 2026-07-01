const {

    SlashCommandBuilder,

    EmbedBuilder

} = require("discord.js");

const {

    getAccount,

    saveAccount

} = require("../core/accountsEngine");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("clearbills")

        .setDescription("Clear a customer's outstanding cafeteria bills.")

        .addUserOption(option =>

            option

                .setName("customer")

                .setDescription("Customer paying the bill")

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
                const customer = interaction.options.getUser(

            "customer"

        );

        const account = getAccount(

            interaction.guild.id,

            customer.id

        );

        if (!account) {

            return interaction.reply({

                content: "❌ That customer doesn't have a cafeteria account.",

                flags: 64

            });

        }

        if (account.outstandingBills <= 0) {

            return interaction.reply({

                content: "✅ That customer has no outstanding bills.",

                flags: 64

            });

        }

        const amountPaid = account.outstandingBills;

        account.outstandingBills = 0;

        saveAccount(account);

        const embed = new EmbedBuilder()

            .setColor(0x57F287)

            .setTitle("🧾 Bills Cleared")

            .setDescription(

                `**${customer.displayName || customer.username}** has successfully settled their cafeteria bill.`

            )

            .addFields(

                {

                    name: "💵 Amount Paid",

                    value: `₦${amountPaid.toLocaleString()}`,

                    inline: true

                },

                {

                    name: "📋 Remaining Bills",

                    value: "₦0",

                    inline: true

                },

                {

                    name: "👨‍🍳 Cleared By",

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