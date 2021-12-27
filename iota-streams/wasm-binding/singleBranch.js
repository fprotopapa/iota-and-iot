/* singleBranch.js
*
*  SPDX-FileCopyrightText: Copyright 2021 Fabbio Protopapa
*  SPDX-License-Identifier: MIT
*
*  ToDo: 
*  Clean up
*/

const streams = require('./node/streams');
streams.set_panic_hook();

const fs = require('fs');
const path = require('path');
const configPath = './config/default.json';
const config = require(configPath);
const sendAuthor = false;

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
    //console.log(foundInstances);
    // Generate author
    // Check for existing author seed
    let isAuthorInstance = false;
    if (foundInstances.filter(e => path.basename(e) === 'author.bin').length) {
        isAuthorInstance = true;
    }
    if (!isAuthorInstance || config.author.setSeed) {
      // Generate new seed and save to config.json
      var seed = makeSeed(81);
      config.author.seed = seed;
      console.log("New seed for author created.");
      // Generating author for new channel
      var auth = streams.Author.fromClient(streams.StreamsClient.fromClient(client), 
                                            seed, streams.ChannelType.SingleBranch);

      // Send announcment and get link
      let response = await auth.clone().send_announce();
      // Export author instance and save to encrypted binary
      let expAuthor = auth.clone().export(authorPasswd);
      fs.writeFileSync(path.join(dirPath, 'author.bin'), expAuthor, 'binary');
      console.log("Author instance exported.");
    } else {
      // Load existing seed
      impAuthor = new Uint8Array(fs.readFileSync(path.join(dirPath, 'author.bin')));
      var auth = streams.Author.import(streams.StreamsClient.fromClient(client), 
                                                      impAuthor, authorPasswd);
      console.log("Loaded author instance from binary.");
    }
    annLinkStr = auth.announcementLink();
    console.log("Announcement Link: ", annLinkStr);
    let announcementLink = streams.Address.parse(annLinkStr)
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
    console.log("Public Key Sub A : ", subA.get_public_key());
    console.log("Public Key Sub B : ", subB.get_public_key());
    console.log("Public Key Author: ", auth.get_public_key());
    if (sendAuthor) {
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
    } else {
    /*

      Subscriber sending messages 

      Sub -> synch state -> build payload in bytes ->
      sends messages and attaches to link (single branch: attach to last message)
    */
     // await syncState(subA);

      let public_payloadA = toBytes("PublicA");
      let masked_payloadA = toBytes("MaskedA");
      let public_payloadB = toBytes("PublicB");
      let masked_payloadB = toBytes("MaskedB");
    
      console.log("SubA Sending multiple signed packets");
      // response = await subA.clone().send_tagged_packet(keyload_link, 
      //                                                 public_payloadA, masked_payloadA);
      // let msgLink = response.link;
      let msgLink = await fetchState(subA, 'subA');//keyload_link;
      for (var x = 0; x < 1; x++) {
        msgLink = await sendSignedPacket(msgLink, subA, public_payloadA, masked_payloadA);
        console.log("Signed packet at: ", msgLink.toString());
        console.log("Signed packet index: " + msgLink.toMsgIndexHex());
      }
      await syncState(subB);
      console.log("SubB Sending multiple signed packets");
      // response = await subB.clone().send_tagged_packet(msgLink, 
      //                                                 public_payloadB, masked_payloadB);
      // msgLink = response.link;
      //let msgLink = keyload_link;
      msgLink = await fetchState(subB, 'subB');
      for (var x = 0; x < 1; x++) {
        msgLink = await sendSignedPacket(msgLink, subB, public_payloadB, masked_payloadB);
        console.log("Signed packet at: ", msgLink.toString());
        console.log("Signed packet index: " + msgLink.toMsgIndexHex());
      }
    }

    /*

      Subscriber receives messages

      Subscriber -> fetch messages
    */
   if (sendAuthor) {
    console.log("\Subscriber fetching next messages");
    let messagesA = await fetchNextMessages(subA);
    showMessages(messagesA, "SubA");
    let messagesB = await fetchNextMessages(subB);
    showMessages(messagesB, "SubB");
    // Print out received msgs
   } else {
    /*

      Author receives messages

      Author -> fetch messages
    */
      console.log("\Author fetching next messages");
      let messages = await fetchNextMessages(auth);
      console.log(messages);
      showMessages(messages, "Author");
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
    // Fetch state
    async function fetchState(caller, name) {
      // Fetch publisher states (sync to get same results)
      console.log('States for ', name);
      await syncState(caller);
      let currStates = caller.fetch_state();
      console.log(currStates);
      states = {};
      for (var i=0; i < currStates.length; i++) {
        states[i] = {};
        states[i]["id"] = currStates[i].identifier;
        states[i]["link"] = currStates[i].link.toString();
        states[i]["seq"] = currStates[i].seqNo;
        states[i]["branch"] = currStates[i].branchNo;
      }
      console.log(JSON.stringify(states));
      return streams.Address.parse(states[0]["link"]);
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