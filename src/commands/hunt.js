import { SlashCommandBuilder } from '@discordjs/builders';

const huntCommand = new SlashCommandBuilder()
  .setName('hunt')
  .setDescription('hunt command')
  .addStringOption((option) => option.setName('user').setDescription('user'));

export default huntCommand.toJSON();