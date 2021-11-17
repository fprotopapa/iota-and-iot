const streams = require("./node/streams");

streams.set_panic_hook();

async function main() {
    let node = process.env.HORNET_NODE_ADDRESS;//"https://chrysalis-nodes.iota.org/";
    // Options include: (node-url, depth, local pow, # of threads)
    let options = new streams.SendOptions(node, 3, true, 1);
    const client = await new streams.ClientBuilder()
    .node(node)
    .build();
    let seed = make_seed(81);
    console.log("Random seed: ", seed);
    // Author generated with: (Seed, Options, Multi-branching flag)
    let auth = streams.Author.fromClient(streams.StreamsClient.fromClient(client), seed, streams.ChannelType.SingleBranch);
    
    console.log("channel address: ", auth.channel_address());
    console.log("multi branching: ", auth.is_multi_branching());
    console.log("IOTA client info:", await client.getInfo());
    
    // Response formatting: { link, sequence link, msg }
    let response = await auth.clone().send_announce();
    let ann_link = response.link;

    console.log("announced at: ", ann_link.toString());
    console.log("Announce message index: " + ann_link.toMsgIndexHex());

    let details = await auth.clone().get_client().get_link_details(ann_link);
    console.log("Announce message id: " + details.get_metadata().message_id);

    //console.log("Channel Announcement at: ", ann_link.to_string());


    function make_seed(size) {
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let seed = "";
        for (i = 9; i < size; i++) {
          seed += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return seed;
      }
}

main();