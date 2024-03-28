const keys = [
  "MQTT_BROKER_URL",
  "MQTT_USERNAME",
  "MQTT_PASSWORD",
  "MQTT_TOPIC",

  "DISCORD_BOT_TOKEN",
  "DISCORD_CHANNEL_ID",
];

export const checkConfig = () => {
  for (const key of keys) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
};
