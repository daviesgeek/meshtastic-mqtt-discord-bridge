import mqtt from "mqtt";
import dotenv from "dotenv";
import { getChannel } from "./discord";
import { decodeUser, decrypt } from "./meshtastic";
import { checkConfig } from "./config";

dotenv.config({
  path: [".env"],
});

checkConfig();

// MQTT broker URL
const brokerUrl = process.env.MQTT_BROKER_URL!;

// MQTT client options
const options: mqtt.IClientOptions = {
  username: process.env.MQTT_USERNAME!,
  password: process.env.MQTT_PASSWORD!,
};

async function main() {
  // Create MQTT client
  const client = mqtt.connect(brokerUrl, options);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    // Subscribe to a topic
    console.log("Subscribing to topic", process.env.MQTT_TOPIC!);
    client.subscribe(process.env.MQTT_TOPIC!);
  });

  const discordChannel = await getChannel(process.env.DISCORD_CHANNEL_ID!);

  client.on("message", async (_topic, message) => {
    try {
      const { decoded, _packet, gatewayId } = await decrypt(message);
      if (!decoded) {
        return;
      }

      if (decoded.portnum === 1) {
        discordChannel.send(
          `:satellite: ${gatewayId.slice(1)}: ${decoded.payload.toString()}`
        );
      }

      if (decoded.portnum === 4) {
        const user = decodeUser(decoded.payload);
        discordChannel.send(
          `:information_source: ${gatewayId.slice(1)}: ${user["longName"]} `
        );
      }
    } catch {
      console.error(`Error decrypting packet`);
    }
  });
}
main();
