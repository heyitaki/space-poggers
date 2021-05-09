import json
import re
import time
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from selenium import webdriver

driver = webdriver.Chrome()
done_urls = set()
url_stack = set(["https://twitter.com/NiftyWhaleNFT/status/1386066503255138312"])


def scrape_tweet_urls(url):
    driver.get(url)
    time.sleep(10)
    scroll_pause_time = 1
    screen_height = driver.execute_script("return window.screen.height;")
    i = 1
    urls = set()

    while True:
        # Scroll one screen height each time
        driver.execute_script(
            "window.scrollTo(0, {screen_height}*{i});".format(
                screen_height=screen_height, i=i
            )
        )
        i += 1
        time.sleep(scroll_pause_time)

        # Update scroll height each time after scrolled, as the scroll height can change after we scrolled the page
        scroll_height = driver.execute_script("return document.body.scrollHeight;")

        soup = BeautifulSoup(driver.page_source, "html.parser")
        for a in soup.find_all(
            "a", {"href": re.compile(r"^/[a-zA-Z0-9_]+/status/\d+$")}
        ):
            try:
                href = a.attrs["href"]
                if href.split("/")[1] != "NiftyWhaleNFT":
                    urls.add(urljoin("https://twitter.com/", href))
            except:
                continue

        # Break the loop when the height we need to scroll to is larger than the total scroll height
        if (screen_height) * i > scroll_height:
            break

    return urls


while len(url_stack) > 0:
    url = url_stack.pop()
    urls = scrape_tweet_urls(url)
    done_urls.add(url)

    new_urls = list(filter(lambda url: url not in done_urls, urls))
    print("+" + str(len(new_urls)))
    url_stack.update(new_urls)
    print(len(url_stack))

output = list(map(lambda x: x.split("/")[-1], done_urls))
print("found " + str(len(output)) + " tweets")
f = open("tweets.json", "w")
f.write(json.dumps(output))
f.close()
