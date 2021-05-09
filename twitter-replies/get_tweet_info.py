import json
import os

import requests
from dotenv import load_dotenv

load_dotenv()

with open("./tweet-ids.json") as f:
    ids = json.load(f)

i = 0
MAX_TWEET_NUM = 100
tweet_info = []
while i < len(ids):
    print(",".join(ids[i : i + MAX_TWEET_NUM]))
    res = requests.get(
        "https://api.twitter.com/2/tweets",
        params={
            "ids": ",".join(ids[i : i + MAX_TWEET_NUM]),
            "expansions": "referenced_tweets.id",
        },
        headers={"Authorization": "Bearer %s" % os.getenv("TWITTER_API_BEARER_TOKEN")},
    )
    tweet_info.extend(res.json()["data"])
    i += MAX_TWEET_NUM

with open("./tweet-info.json", "w") as f:
    f.write(json.dumps(tweet_info))
