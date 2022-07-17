const Discord = require("discord.js");
const client = new Discord.Client({

    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
    ]

})

const { MessageEmbed } = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require("fs");
const config = require("./config.json");

const helpembed = new MessageEmbed()
 .setTitle('Reska help embed')
 .addFields(
 { name: 'Public commands', value: '\`$stats\` \- **shows bot\'s status**\n\`$ping\` \- **shows the heartbeat ping**\n\`$help\` \- **shows this embed**'},
		{ name: 'Special commands', value: '\`$rgb on/off\` \- **assigns/deassigns the rgb role**\n> Booster role required!'},
	)

    client.once("ready", async () => {

        /////////////////////////////Status//////////////////////////////
    
        setInterval(() => {
    
        client.user.setPresence({status: config.status, afk: "false", activities: [{name: config.presence, type: config.presencetype}] })
        }, 20000)
    
        //////////////////////////RGB Role////////////////////////
    
        const Reska = client.guilds.cache.get(config.guild)
        const role = Reska.roles.cache.get(config.RGBrole)
    
        setInterval(() => {
    
            role.edit({ color: 'RANDOM' }).catch(() => { console.log(`An error occurred during the role change.`) });
        }, 120000)
    
        //////////////////////////voice connection////////////////////////
    
        setInterval(() => {
    
        const connection = joinVoiceChannel({
    
            channelId: config.vcchannel,
            guildId: config.guild,
            selfDeaf: false,
    
            adapterCreator: client.guilds.cache.get(config.guild).voiceAdapterCreator,
    
        });
        }, 15000)
    
        console.log("Voice setup ready!");
    
        //////////////////////////Online Log////////////////////////
    
        console.log("Reska is all set and ready")
    
    
    });

/////////////////////////////stats cmd//////////////////////////////

client.on("messageCreate", async (message) => {

    if (message.channel.type !== "dm") {

        if (message.content.toLowerCase() === config.prefix + "stats") {

                const days = Math.floor(client.uptime / 86400000);
                const hours = Math.floor(client.uptime / 3600000) % 24;
                const minutes = Math.floor(client.uptime / 60000) % 60;
                const seconds = Math.floor(client.uptime / 1000) % 60;

                message.reply(`**__Uptime:__** ${days}d ${hours}h ${minutes}m ${seconds}s\n**__Ram:__** Using ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / 512 MB`);

            }

        if (message.content.toLowerCase() === config.prefix + "ping") {

            message.reply("Im working on it...").then(message => {
                setTimeout(function () {
                    message.edit(`here! ${client.ws.ping}ms`);
                }, 2500);
            });
        }

        /////////////////////////////help cmd//////////////////////////////

      if (message.content.toLowerCase() === config.prefix + "help") {

        message.reply({ embeds: [helpembed] }) }

        if (message.content.toLowerCase() === config.prefix + "rgb on") {

            const Reska = client.guilds.cache.get(config.guild)
            const role = Reska.roles.cache.get(config.RGBrole)
            const booster = fiction.roles.cache.get(config.boosterrole)
    
            if (message.member.roles.cache.some(role => role.id === config.boosterrole)) {
    
              message.member.roles.add(role);
              message.reply("RGB set! enjoy your role colors.")
    
            } else {
    
             if (message.member.permissions.has("ADMINISTRATOR")) {
              message.member.roles.add(role);
              message.reply("RGB set! enjoy your role colors.")
    
            }
          } 
        }
    
            if (message.content.toLowerCase() === config.prefix + "rgb off") {
    
              const Reska = client.guilds.cache.get(config.guild)
              const role = Reska.roles.cache.get(config.RGBrole)
    
              if (message.member.roles.cache.some(role => role.id === config.RGBrole)) {
    
                message.member.roles.remove(role);
                message.reply("Got you! RGB is off.")
    
              }
            }
        }
    });

/////////////////////////////login & debug//////////////////////////////

client.on('debug', console.log)
client.login(process.env.TOKEN);