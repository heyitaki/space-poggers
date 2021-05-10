import csv
import json
import sys
from collections import Counter


# Quick debug method
def print_file(x, file):
    original_stdout = sys.stdout
    with open(f"./{file}.json", "w") as f:
        sys.stdout = f
        print(json.dumps(x))
        sys.stdout = original_stdout


with open("./tweet-info.json") as f:
    batches = json.load(f)

all_mentions = []
tweet_id_to_tweet_info = {}
user_id_to_username = {}
for batch in batches:
    for tweet in batch["data"]:
        tweet_id = tweet["id"]
        try:
            parent_id = [
                x for x in tweet["referenced_tweets"] if x["type"] == "replied_to"
            ][0]["id"]
            tweet_id_to_tweet_info[tweet_id] = {
                "mentions": list(
                    map(lambda x: x["username"], tweet["entities"]["mentions"])
                ),
                "parent_id": parent_id,
                "user_id": tweet["author_id"],
            }
        except:
            # Handling root tweet
            tweet_id_to_tweet_info[tweet_id] = {
                "mentions": [],
                "parent_id": tweet_id,
                "user_id": tweet["author_id"],
            }

    for user in batch["includes"]["users"]:
        user_id_to_username[user["id"]] = user["username"]

# print_file(tweet_id_to_tweet_info, "x")
# print_file(user_id_to_username, "x1")

for tweet_id in tweet_id_to_tweet_info:
    tweet_info = tweet_id_to_tweet_info[tweet_id]

    # Handle root tweet
    if not tweet_info["parent_id"]:
        continue

    mentions = tweet_info["mentions"]
    new_mentions = [item for item, count in Counter(mentions).items() if count > 1]

    parent_tweet_info = tweet_id_to_tweet_info[tweet_info["parent_id"]]
    parent_username = user_id_to_username[parent_tweet_info["user_id"]]
    parent_mentions = set(parent_tweet_info["mentions"] + [parent_username])
    for mention in set(mentions):
        if mention not in parent_mentions:
            new_mentions.append(mention)
    all_mentions.extend(new_mentions)

data = []
for name, count in dict(Counter(all_mentions)).items():
    data.append(
        {
            "username": name,
            "num_nominations": count,
            "url": f"https://twitter.com/{name}",
        }
    )

with open("./nominations.csv", "w", newline="") as f:
    csv_writer = csv.DictWriter(f, fieldnames=["username", "num_nominations", "url"])
    csv_writer.writeheader()
    for datum in data:
        csv_writer.writerow(datum)
