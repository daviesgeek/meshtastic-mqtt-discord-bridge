import * as protobufjs from "protobufjs";
import * as path from "path";
import { createDecipheriv } from "crypto";

const root = new protobufjs.Root();
root.resolvePath = (_origin, target) => path.join(__dirname, "protos", target);
root.loadSync("meshtastic/mqtt.proto");
const ServiceEnvelope = root.lookupType("ServiceEnvelope");
const Data = root.lookupType("Data");
const User = root.lookupType("User");

export const decrypt = async (message: Buffer): Promise<any> => {
  const envelope = ServiceEnvelope.decode(message) as any;
  if (!envelope.packet) {
    throw new Error("No packet found in the message");
  }

  const decoded = decryptPacket(envelope.packet);
  if (!decoded) {
    throw new Error("Failed to decrypt packet");
  }

  return { ...envelope, decoded };
};

export function decodeUser(payload: any): any {
  return User.decode(payload);
}

const decryptionKeys = [
  "1PG7OiApB1nwvP+rz05pAQ==", // add default "AQ==" decryption key
];

function decryptPacket(packet: any) {
  // attempt to decrypt with all available decryption keys
  for (const decryptionKey of decryptionKeys) {
    try {
      // convert encryption key to buffer
      const key = Buffer.from(decryptionKey, "base64");

      // create decryption iv/nonce for this packet
      const nonceBuffer = createNonce(packet.id, packet.from);

      // create aes-128-ctr decipher
      const decipher = createDecipheriv("aes-128-ctr", key, nonceBuffer);

      // decrypt encrypted packet
      const decryptedBuffer = Buffer.concat([
        decipher.update(packet.encrypted),
        decipher.final(),
      ]);

      // parse as data message
      return Data.decode(decryptedBuffer);
    } catch (e) {}
  }

  // couldn't decrypt
  return null;
}

function createNonce(packetId: any, fromNode: any) {
  // Expand packetId to 64 bits
  const packetId64 = BigInt(packetId);

  // Initialize block counter (32-bit, starts at zero)
  const blockCounter = 0;

  // Create a buffer for the nonce
  const buf = Buffer.alloc(16);

  // Write packetId, fromNode, and block counter to the buffer
  buf.writeBigUInt64LE(packetId64, 0);
  buf.writeUInt32LE(fromNode, 8);
  buf.writeUInt32LE(blockCounter, 12);

  return buf;
}
