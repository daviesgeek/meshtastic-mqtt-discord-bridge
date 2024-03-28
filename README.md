# mqtt-discord-broker

## Overview

This is a simple bridge from a [Meshtastic](https://meshtastic.org/) MQTT server to a specified Discord channel. Huge shoutout to Liam Cottle's [meshtastic-map](https://github.com/liamcottle/meshtastic-map), where most, if not all of the decryption logic is sourced.
The protobufs under `src/protos/meshtastic` are copied from [the meshtastic protobufs repository](https://github.com/meshtastic/protobufs/tree/master/meshtastic)

## Setup

### Setup `.env` file

Copy .env.sample to .env and fill in the necessary values

### Install dependencies

This project uses Yarn 4. Make sure it's installed by following [the Yarn docs](https://yarnpkg.com/getting-started/install).

Then install dependencies:

```bash
yarn
```

### Start the app

And start the app:

```bash
yarn start
```

If all goes well, you should see the typical nodemon output and then the app will output the below:

```
Connected to MQTT broker
Subscribing to topic <your_topic>
Logged in as <discord_bot_name>
```

## Development

For intellisnse to work in VSCode, you'll need to install the recommended ZipFS extension (it'll pop up when you open in VSCode). You may also need to generate the sdk for VSCode. See also [the docs on editor SDKs](https://yarnpkg.com/getting-started/editor-sdks).

```bash
yarn dlx @yarnpkg/sdks vscode
```

## Known Issues

This app is very dumb. It doesn't store any information about past messages or known users, etc. Thus, you will only see the node id in the Discord message and if the message is retried, you'll see it appear multiple times in Discord. I'd like to add support for saving a node's long/short name and for de-duplicating retried messages, but at the time it doesn't support any of this.

## Legal

This project is not affiliated with or endorsed by the Meshtastic project.

## References

- https://github.com/liamcottle/meshtastic-map
