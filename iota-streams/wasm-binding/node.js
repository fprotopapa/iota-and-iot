const streams = require('./node/streams');
streams.set_panic_hook();

const fs = require('fs');
const { type } = require('os');
const configPath = './config/default.json';
const config = require(configPath);


async function main() {
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
      config.author.annLinkMsgIndexHex = annLinkMsgIndexHex;
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
    // Get msg meta
    //let details = await auth.clone().get_client().get_link_details(announcementLink);
    //console.log("Announce message id: " + details.get_metadata().message_id);
    //
    // Generate subscriber
    let seed_sub = makeSeed(81);
    let options = new streams.SendOptions(nodeUrl);
    let sub = new streams.Subscriber(seed_sub, options);
    await sub.clone().receive_announcement(announcementLink.copy());
    let author_pk = sub.author_public_key();
    console.log("Channel registered by subscriber, author's public key: ", author_pk);

    // copy state for comparison after reset later
    let start_state = sub.fetch_state();
    console.log("Subscribing...");
    response = await sub.clone().send_subscribe(announcementLink.copy());
    let subLink = response.link;
    console.log("Subscription message at: ", subLink.toString());
    console.log("Subscription message index: " + subLink.toMsgIndexHex());
    // Author receiving subscription
    await auth.clone().receive_subscribe(subLink.copy());
    console.log("Subscription processed");

    // Keyload
    console.log("Sending Keyload");
    response = await auth.clone().send_keyload_for_everyone(announcementLink.copy());
    let keyloadLink = response.link;
    console.log("Keyload message at: ", keyloadLink.toString());
    console.log("Keyload message index: " + keyloadLink.toMsgIndexHex());
    let n = 0;
    while(n <= 5) {
      n++;
      console.log("Send and Receive");
      //await auth.clone().sync_state();

      let publicPayload = toBytes("Public");
      let maskedPayload = toBytes("Masked");
      response = await auth
      .clone()
      .send_signed_packet(keyloadLink, publicPayload, maskedPayload);
      keyloadLink = response.link;
      
      console.log("Tag packet at: ", keyloadLink.toString());
      console.log("Tag packet index: " + keyloadLink.toMsgIndexHex());
      
      console.log("\Subscriber fetching next messages");
      let nextMsgs = await sub.clone().fetch_next_msgs();
      console.log(nextMsgs);
      for (var i = 0; i < nextMsgs.length; i++) {
        console.log("Found a message...");
        console.log(
          "Public: ",
          fromBytes(nextMsgs[i].get_message().get_public_payload()),
          "\tMasked: ",
          fromBytes(nextMsgs[i].get_message().get_masked_payload())
        );
    }
  }
    //////////////////////////////////////////////////////////////////
    // Local utility functions
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