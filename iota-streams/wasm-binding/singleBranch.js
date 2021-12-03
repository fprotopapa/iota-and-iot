/* singleBranch.js
*
*  SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
*  SPDX-License-Identifier: MIT
*
*  ToDo: 
*        - Refactor way of loading existing instance -> use import and export
*        - Store pwd etc with stronghold
*        - Store or retrieve index to work with reloaded instances
*        - Multi Branch
*/

const streams = require('./node/streams');
streams.set_panic_hook();

const fs = require('fs');
const configPath = './config/default.json';
const config = require(configPath);


async function main() {
    /*
      Initizialization (Single Branch Pub)

      
      Loading configuration, generating or loading author
      author -> announces channel
 
    */
    // Read env variable name from config file
    nodeUrlEnv = config.env.nodeUrl; 
    // Get node url from environment, if not defined fall back to default
    let nodeUrl = process.env[nodeUrlEnv];
    if (nodeUrl === undefined) {
      nodeUrl = "https://chrysalis-nodes.iota.org";
    }
    // Build client from node url
    const client = await new streams.ClientBuilder().node(nodeUrl).build();
    //
    // Generate author
    // Check for existing author seed
    if ((config.author.seed === null) || config.author.setSeed) {
      // Generate new seed and save to config.json
      var seed = makeSeed(81);
      config.author.seed = seed;
      console.log("New seed for author created.");
      // Generating author for new channel
      var auth = streams.Author.fromClient(streams.StreamsClient.fromClient(client), seed, streams.ChannelType.SingleBranch);
      config.author.channelAddress = auth.channel_address();
      config.author.channelType = streams.ChannelType.SingleBranch;
      // Send announcment and get link
      let response = await auth.clone().send_announce();
      let announcementLink = response.link;
      let announcementLinkStr = announcementLink.toString();
      // Update config.json
      config.author.announcementLink = announcementLinkStr;
      
      writeJsonFile(config, configPath);
    } else {
      // Load existing seed
      var seed = config.author.seed;
      console.log("Existing seed for author loaded.");
      // Generating author for existing channel
      let announcementLinkStr = config.author.announcementLink;
      let announcementLink = streams.Address.parse(announcementLinkStr)
      let channelType = config.author.channelType;
      const options = new streams.SendOptions(nodeUrl);
      // Recover author !! announcementLink is freed !!
      var auth = await streams.Author.recover(seed, announcementLink, channelType, options);  
    }
    let announcementLink = streams.Address.parse(auth.announcementLink())
    // Log Channel details
    console.log("-----------------------------------------------------------------------")
    console.log("Channel address: ", auth.channel_address());
    console.log("Multi branching: ", auth.is_multi_branching());
    console.log("Announced at: ", auth.announcementLink());
    console.log("Announce message index (hashed hex): " + announcementLink.toMsgIndexHex());
    console.log("Announce message id: " + announcementLink.msgId);
    console.log("-----------------------------------------------------------------------")
    // Log node details
    //console.log("IOTA client info:", await client.getInfo());
    /*

      Generating Subscriber

      Subscriber -> receives annnouncement -> subscribes to channel
    */
    // Generate subscriber
    subA = generateNewSubscriber(nodeUrl, makeSeed(81));
    subB = generateNewSubscriber(nodeUrl, makeSeed(81));
    await receiveAnnouncement(announcementLink, subA);
    await receiveAnnouncement(announcementLink, subB);
    // Get Authors Public Key 
    let author_pk = subA.author_public_key();
    console.log("Channel registered by subscriber, author's public key: ", author_pk);
    
    subLinkA = await subscripeToChannel(announcementLink, subA);
    subLinkB = await subscripeToChannel(announcementLink, subB);
    /*

      Author receives subscribtions & sends out keyload (needed to attach messages)

      Subscriber -> receives annnouncement -> subscribes to channel
    */
    await receiveSubscription(subLinkA, auth);
    await receiveSubscription(subLinkB, auth);
    console.log("Subscription processed");
  
    console.log("Sending Keyload");
    response = await auth.clone().send_keyload_for_everyone(announcementLink.copy());
    let keyload_link = response.link;
    console.log("Keyload message at: ", keyload_link.toString());
    console.log("Keyload message index: " + keyload_link.toMsgIndexHex());
    /*

      Author sends messages 

      Author -> synch state -> build payload in bytes ->
      sends messages and attaches to link (single branch: attach to last message)
    */
    await syncState(auth);

    let public_payload = toBytes("Public");
    let masked_payload = toBytes("Masked");

    console.log("Author sending tagged packet");
    response = await auth.clone().send_tagged_packet(keyload_link, public_payload, masked_payload);
    let tag_link = response.link;
    console.log("Tag packet at: ", tag_link.toString());
    console.log("Tag packet index: " + tag_link.toMsgIndexHex());
  
    console.log("Author Sending multiple signed packets");
    let msgLink = tag_link;
    for (var x = 0; x < 3; x++) {
      msgLink = await sendSignedPacket(msgLink, auth, public_payload, masked_payload);
      console.log("Signed packet at: ", msgLink.toString());
      console.log("Signed packet index: " + msgLink.toMsgIndexHex());
    }
    /*

      Subscriber receives messages

      Subscriber -> fetch messages
    */
    console.log("\Subscriber fetching next messages");
    let messagesA = await fetchNextMessages(subA);
    showMessages(messagesA, "SubA");
    let messagesB = await fetchNextMessages(subB);
    showMessages(messagesB, "SubB");
    // Print out received msgs

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