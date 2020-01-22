const Twitter = require("twitter-lite");

async function getTweets() {

    const client = new Twitter({
        subdomain: "api",
        consumer_key: process.env.TWTR_CKEY,
        consumer_secret: process.env.TWTR_CSECRET,
        access_token_key: process.env.TWTR_ATOKEN,
        access_token_secret: process.env.TWTR_ASECRET
    });

    let timeline;
    
    timeline = await client.get("statuses/user_timeline", {
        screen_name: "JosefBiehler",
        exclude_replies: true,
        include_rts: false,
        tweet_mode: "extended",
        count: 30,
        //since_id: <id of the latest tweet stored on your disc> 
    });

    for (var i = 0; i < timeline.length; i++) {
        let tweet = timeline[i];
        timeline[i] = await client.get(`statuses/show/${tweet.id_str}`, {
            tweet_mode: "extended"
        });
    }

    const getHashtags = x => {
        if (x.entities && x.entities.hashtags) {
            return x.entities.hashtags.map(x => x.text);
        }
        return [];
    }

    return timeline.map(x => ({
        fullText: x.full_text,
        createdAt: x.created_at,
        id: x.id_str,
        twitterMediaUrl: x.extended_entities ? x.extended_entities.media[0].media_url : null,
        hashtags: getHashtags(x)
    }));
}

module.exports = getTweets;
