# Twitter nominations

## The problem
On April 24th, Nifty posted [this](https://twitter.com/NiftyWhaleNFT/status/1386066503255138312) tweet asking for nominations for female and NB individuals in the NFT space to Club Nifty. Very quickly the number of replies rocketed past anything we could handle manually (1k+). This is a attempt to approximate the number of nominations for each person by summing the number of times their handle appeared in the conversation.

## Technical challenges
1. Twitter API sucks. There's a 7 day tweet lookup endpoint, but we allowed nominations for 2 weeks. Rather than use the 30 day end point, which has a limited number of calls at a free tier AND less information than the 7 day, I used Selenium to scrape the conversation (in `get_tweet_ids.py`).
2. Once I had the tweet IDs, I used the tweet lookup by id endpoint, but again, Twitter API sucks. For each tweet I got a text field that included every handle from the thread before it (shown below). In this case, @a, @b, @c are double counted, and @123username would be counted despite not being nominated, just replied to. Fixed this by computing a set difference of the mentions in a child and its parent.
```
{id: '1', text: 'had such a good time with @a @b @c', authorId: '123'}
{id: '2', text: '@a @b @c @123username wish I couldve been there!', replyingTo: '1', authorId: '456}
```


## License
Feel free to use this code as you please.