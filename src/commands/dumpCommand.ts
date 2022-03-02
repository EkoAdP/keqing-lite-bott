import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders'
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types'
import { CommandInteraction, Guild, GuildMember, Message, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { discordBot } from '..'
import { Constants } from '../constants'
import { MessageLiveInteraction } from '../models/MessageLiveInteraction'
import { hasPermission } from '../utils'
import { Command } from './command'

export default class DumpCommand implements Command {
    getCommandMetadata(): RESTPostAPIApplicationCommandsJSONBody {
        return new SlashCommandBuilder()
            .setName('dump')
            .setDescription('dump the contents of the file')
            .addStringOption(
                new SlashCommandStringOption()
                    .setName('file')
                    .setDescription('path to the file')
                    .setRequired(true)
            )
            .toJSON()
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        if (!hasPermission(undefined, interaction.member as GuildMember, 'MANAGE_GUILD')) {
            await interaction.reply({ content: 'You are not allowed to use this command', ephemeral: true })
            return
        }
        
        await interaction.deferReply()

        const file = interaction.options.getString('file', true)
        if (file.includes('..')) {
            await interaction.editReply('You cant go up a directory')
            return
        }

        const filePath = path.join(
            Constants.LIVE_COMMANDS_REPO_EXTRACT_DIR,
            Constants.LIVE_COMMANDS_REPO_BASE_FOLDER_NAME,
            file
        )


        await interaction.editReply({
            content: `**File**: ${interaction.options.getString('file', true)}`,
            files: [
                new MessageAttachment(filePath),
            ]
        })
    }

}