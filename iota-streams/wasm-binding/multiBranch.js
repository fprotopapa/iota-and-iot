/* multiBranch.js
*
*  SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
*  SPDX-License-Identifier: MIT
*
*  ToDo: 
*        - Store or retrieve index to work with reloaded instances
*        - Multi Branch
*/

const streams = require('./node/streams');
streams.set_panic_hook();

const fs = require('fs');
const path = require('path');
const configPath = './config/default.json';
const config = require(configPath);

async function main() {
    /*
      Initizialization (Multi Branch)

      Loading configuration, generating or loading author
      author -> announces channel
 
    */
    // Read env variable name from config file
    nodeUrlEnv = config.env.nodeUrl; 
    // Get node url from environment, if not defined fall back to default
    let nodeUrl = process.env[nodeUrlEnv];
    if (nodeUrl === undefined) {
      nodeUrl = 'https://chrysalis-nodes.iota.org';
    }
    // Build client from node url
    const client = await new streams.ClientBuilder().node(nodeUrl).build();
    // Load author password from env
    authorPasswdEnv = config.env.authorPasswd;
    let authorPasswd = process.env[authorPasswdEnv];
    if (authorPasswd === undefined) {
        authorPasswd = '123456';
    }
    // Get list of saved instances
    dirWD = path.resolve(__dirname);
    dirbinary = 'binary_instance';
    dirPath = path.join(dirWD, dirbinary);
    var files = fs.readdirSync(dirPath);
    foundInstances = files.filter(e => path.extname(e) === '.bin');
    console.log(foundInstances);
    // Generate author
    // Check for existing author seed
    let isAuthorInstance = false;
    if (foundInstances.filter(e => path.basename(e) === 'author.bin').length) {
        isAuthorInstance = true;
    }
    if (!isAuthorInstance || config.author.setSeed) {
        // Generate new seed
        var seed = makeSeed(81);
        console.log("New seed for author created.");
        // Generating author for new channel
        var auth = streams.Author.fromClient(streams.StreamsClient.fromClient(client),
                                            seed, streams.ChannelType.MultiBranch);
        // Send announcment
        let response = await auth.clone().send_announce();
        // Export author instance and save to encrypted binary
        let expAuthor = auth.clone().export(authorPasswd);
        fs.writeFileSync(path.join(dirPath, 'author.bin'), expAuthor, 'binary');
        console.log("Author instance exported.");
      } else {
        // Load existing seed
        impAuthor = new Uint8Array(fs.readFileSync(path.join(dirPath, 'author.bin')));
        streams.Author.import(streams.StreamsClient.fromClient(client), 
                                                        impAuthor, authorPasswd);
        console.log("Loaded author instance from binary.");
      }
    /************************* 

      Local utility functions

     *************************/
    // Show fetched messages
    function showMessages(messages, subName) {
        console.log("Message for " + subName);
        for (var i = 0; i < messages.length; i++) {
          let next = messages[i];
          for (var j = 0; j < next.length; j++) {
            console.log("Found a message...");
            if (next[j].message == null) {
              console.log("Message undefined");
              console.log("Address: ", next[j].link.toString());
            } else {
              console.log(
                "Address: ",
                next[j].link.toString(),
                "Public: ",
                fromBytes(next[j].message.get_public_payload()),
                "\tMasked: ",
                fromBytes(next[j].message.get_masked_payload())
              );
            }
          }
        }
      }
      // Synch state before publishing
      async function syncState(sender) {
        console.log("Syncing state ...");
        await sender.clone().sync_state();
      }
      // Fetch messages for receiver
      async function fetchNextMessages(receiver) {
        // Catch timeout, undefined
        let isMessage = true;
        let nextMsgs = [];
        while (isMessage) {
          let msg = await receiver.clone().fetch_next_msgs();
          if (msg.length === 0) {
            isMessage = false;
          } else {
            nextMsgs.push(msg);
          }
        }
        return nextMsgs;
      }
      // Subscriber receiving announcement
      async function receiveAnnouncement(announcementLink, subscriber) {
        await subscriber.clone().receive_announcement(announcementLink.copy());
      }
      // Author receiving subscription
      async function receiveSubscription(subscribtionLink, author) {
        await author.clone().receive_subscribe(subscribtionLink.copy());
      }
      // Publisher sending signed packet
      async function sendSignedPacket(msgLink, sender, publicPayload, maskedPayload) {
        response = await sender
                  .clone()
                  .send_signed_packet(msgLink, publicPayload, maskedPayload);
        return response.link;
      }
      // Subscribe to channel -> Return subscribtion link
      async function subscripeToChannel(announcementLink, subscriber) {
        // catch timeout
        console.log("Subscribing...");
        response = await subscriber.clone().send_subscribe(announcementLink.copy());
        subLink = response.link
        console.log("Subscription message at: ", subLink.toString());
        console.log("Subscription message index: " + subLink.toMsgIndexHex());
        return subLink;
      }
      // Generate Subscriber
      function generateNewSubscriber(nodeUrl, seed) {
        const options = new streams.SendOptions(nodeUrl);
        return new streams.Subscriber(seed, options.clone());
      }
      // Make bytes out of string
      function toBytes(str) {
        var bytes = [];
        for (var i = 0; i < str.length; ++i) {
          bytes.push(str.charCodeAt(i));
        }
        return bytes;
      }
      // Make string out of bytes
      function fromBytes(bytes) {
        var str = "";
        for (var i = 0; i < bytes.length; ++i) {
          str += String.fromCharCode(bytes[i]);
        }
        return str;
      }
      // Save json file
      function writeJsonFile(file, path) {
        fs.writeFile(path, JSON.stringify(file, null, 2), function writeJSON(err) {
          if (err) return console.log(err);
          console.log("File at " + path + " written.");
        });
      }
      // Create new random seed
      function makeSeed(size) {
          const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let seed = "";
          for (i = 9; i < size; i++) {
            seed += alphabet[Math.floor(Math.random() * alphabet.length)];
          }
          return seed;
        }
    }

    main();