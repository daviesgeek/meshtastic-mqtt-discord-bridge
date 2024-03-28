import { Client, GatewayIntentBits, VoiceBasedChannel } from "discord.js";

export const getChannel = async (
  channelId: string
): Promise<VoiceBasedChannel> => {
  return new Promise((resolve, reject) => {
    const client = new Client({
      intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
    });

    client.on("ready", () => {
      console.log(`Logged in as ${client.user?.tag}!`);

      client.channels.fetch(channelId).then((channel) => {
        if (channel && channel.isTextBased()) {
          resolve(channel as VoiceBasedChannel);
        } else {
          reject();
        }
      });
    });

    client.login(process.env.DISCORD_BOT_TOKEN!);
  });
};
