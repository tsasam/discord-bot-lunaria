import { config } from 'dotenv';
import { REST } from '@discordjs/rest';
import HuntCommand from './commands/hunt.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import  {executablePath} from 'puppeteer';
import { parse } from 'node-html-parser';
import {
    EmbedBuilder,
    Client,
    GatewayIntentBits,
    Routes,
    Events
  } from 'discord.js';




const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const ANKAMA_URL= process.env.ANKAMA_URL;
const THUMBNAIL= process.env.THUMBNAIL;

const rest = new REST({ version: '10' }).setToken(TOKEN);


client.on('ready', () => console.log(`${client.user.tag} has logged in!`));


puppeteer.use(StealthPlugin())

client.on(Events.InteractionCreate, async interaction  => {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'hunt') {
    
        let userAccount = interaction.options.getString('user');
        let sanitizedAccount = userAccount.replace('#','-')
        
        await interaction.deferReply();

       const browser = await puppeteer.launch({ headless: true, executablePath: executablePath(), })
            const page = await browser.newPage();
            await page.goto(ANKAMA_URL +`${sanitizedAccount}`);
             
            const texts = await page.evaluate(() => {
              let data = [];
              let elementsOdd = document.getElementsByClassName('ak-bg-odd');
              for (var element of elementsOdd)
                  data.push(element.innerText);
              let elementsEven = document.getElementsByClassName('ak-bg-even');
              for (var elemento of elementsEven)
                  data.push(elemento.innerText);
              return data;
            });
          
           
            const exampleEmbed = new EmbedBuilder()
	            .setColor(0x0099FF)
	            .setTitle(userAccount)
	            .setURL(ANKAMA_URL +`${sanitizedAccount}`)
              .setThumbnail('https://static.ankama.com/dofus/renderer/look/7b317c35312c323038342c343037312c333036312c333534352c333131387c313d31323136373830332c323d353834373834362c333d31313530343533332c343d31303933313434392c353d31313337323034382c373d323233373734352c383d31353236353236352c393d323130353634342c31303d31353436313631367c3131307d/face/2/48_48-0.png')
              .setDescription('Personnages:')
	      
              for (let i = 0; i < texts.length; i++) 
              {
                exampleEmbed.addFields({ name: texts[i].substring(0, texts[i].indexOf('\t')), value: texts[i].substring(texts[i].indexOf('\t') + 1), inline:true})
              }
            await interaction.editReply({ embeds: [exampleEmbed] });
      }   
     
    } 
});



async function main() {
    const commands = [
      HuntCommand
    ];
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });
      client.login(TOKEN);
     
    } catch (err) {
      console.log(err);
    }
  }
  
  main();