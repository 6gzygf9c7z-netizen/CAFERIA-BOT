const {

    PermissionsBitField

} = require("discord.js");

async function updateMemberRoles(member, account) {

    if (!member) {

        return;

    }

    const guild = member.guild;

    const roleNames = {

        high: "High",

        drunk: "Drunk",

        hungry: "Hungry",

        thirsty: "Thirsty",

        tired: "Tired"

    };

    const roles = {};

    for (const [key, name] of Object.entries(roleNames)) {

        roles[key] = guild.roles.cache.find(

            role => role.name === name

        ) || null;

    }
        const botMember = guild.members.me;

    if (

        !botMember.permissions.has(

            PermissionsBitField.Flags.ManageRoles

        )

    ) {

        return;

    }

    async function syncRole(role, shouldHave) {

        if (!role) {

            return;

        }

        if (

            role.position >=

            botMember.roles.highest.position

        ) {

            return;

        }

        if (

            shouldHave &&

            !member.roles.cache.has(role.id)

        ) {

            await member.roles.add(role);

        }

        if (

            !shouldHave &&

            member.roles.cache.has(role.id)

        ) {

            await member.roles.remove(role);

        }

    }

    await syncRole(

        roles.high,

        account.highness > 0

    );

    await syncRole(

        roles.drunk,

        account.intoxication > 0

    );

    await syncRole(

        roles.hungry,

        account.satisfaction <= 0

    );

    await syncRole(

        roles.thirsty,

        account.hydration <= 0

    );

    await syncRole(

        roles.tired,

        account.energy <= 0

    );
    }

module.exports = {

    updateMemberRoles

};