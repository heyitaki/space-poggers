from random import randrange, uniform

from PIL import Image

import constants

background_list = [
    ("Apple", 0.1625),
    ("Blueberry", 0.1625),
    ("Dragonfruit", 0.1625),
    ("Lemon", 0.1625),
    ("Lime", 0.1625),
    ("Peach", 0.1625),
    ("Rainbow", 0.02),
    ("Starry Space", 0.005),
]
tribe_list = [
    "Bee",
    "Cat",
    "Dog",
    "Elephant",
    "Frog",
    "Gorilla",
    "Llama",
    "Mouse",
    "Owl",
    "Penguin",
    "Red Panda",
    "Turtle",
]
tribe_counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
special_tribe_list = [
    "Alien Cat",
    "Bubblegum Gorilla",
    "Diamond Owl",
    "Driftwood Turtle",
    "Flaming Red Panda",
    "Golden Frog",
    "Ice Penguin",
    "Jellophant",
    "Marble Mouse",
    "Rainbow Llama",
    "Silver Bee",
    "Zombie Dog",
]
special_tribe_counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
clothing_list = [
    ("Astronaut Suit", 0.0025),
    ("Band Shirt", 0.04),
    ("Blouse", 0.04),
    ("Crewneck Sweater", 0.04),
    ("Crop Top", 0.04),
    ("Dress", 0.04),
    ("Hawaiian Shirt", 0.01),
    ("Hoodie", 0.04),
    ("Kimono", 0.04),
    ("Latex Suit", 0.01),
    ("Leather Jacket", 0.01),
    ("Loose Top", 0.04),
    ("Mesh Shirt", 0.04),
    ("Nifty Hoodie", 0.0025),
    ("None", 0.38),
    ("Polo", 0.04),
    ("Shaggy Sweater", 0.04),
    ("Smoking Jacket", 0.0025),
    ("Spaghetti Strap", 0.04),
    ("Suit", 0.04),
    ("Tactical Vest", 0.0025),
    ("Tank Top", 0.04),
    ("Tie Dye Shirt", 0.01),
    ("Wetsuit", 0.01),
    ("White Shirt", 0.04),
]
neckwear_list = [
    ("Bandana", 0.04),
    ("Bib", 0.04),
    ("Choker", 0.04),
    ("Cross Pendant", 0.01),
    ("Evil Eye Pendant", 0.01),
    ("Fine Gold Chain", 0.04),
    ("Fine Silver Chain", 0.04),
    ("Hawaiian Lei", 0.0025),
    ("Headphones", 0.04),
    ("Heavy Gold Chain", 0.01),
    ("Heavy Silver Chain", 0.01),
    ("Kings Necklace", 0.0025),
    ("Leather Strap", 0.04),
    ("None", 0.435),
    ("Pearl Necklace", 0.04),
    ("Pool Noodle", 0.04),
    ("Scarf", 0.04),
    ("Shark Necklace", 0.04),
    ("Shell Necklace", 0.04),
    ("Towel", 0.04),
]
headwear_list = [
    ("#1 Hat", 0.01),
    ("Baseball Cap", 0.04),
    ("Beanie", 0.04),
    ("Bike Helmet", 0.04),
    ("Bird Nest", 0.0025),
    ("Boonie Hat", 0.04),
    ("Deerstalker", 0.04),
    ("Fedora", 0.04),
    ("Fisherman Hat", 0.04),
    ("Miner Hat", 0.01),
    ("None", 0.38),
    ("Pickelhaube", 0.04),
    ("Propeller Hat", 0.01),
    ("Rainbow Afro", 0.01),
    ("Ramen Bowl", 0.0025),
    ("Straw Hat", 0.04),
    ("Sweatband", 0.04),
    ("Top Hat", 0.04),
    ("Tricorne", 0.01),
    ("Trojan Helmet", 0.04),
    ("Visor", 0.04),
    ("Volcano", 0.0025),
    ("Whale Head", 0.0025),
]
eyewear_list = [
    ("3D Glasses", 0.04),
    ("Cateye Glasses", 0.04),
    ("Eye Mask", 0.04),
    ("Heart Sunglasses", 0.04),
    ("Hypno Glasses", 0.04),
    ("Monocle", 0.04),
    ("Nerd Glasses", 0.04),
    ("None", 0.5325),
    ("Power Level Scanner", 0.0025),
    ("Prince Nez", 0.04),
    ("Robotic Eye", 0.0025),
    ("Ski Goggles", 0.04),
    ("Sleazy Sunglasses", 0.01),
    ("Sunglasses", 0.04),
    ("Swim Goggles", 0.04),
    ("Tree Wizard Spectacles", 0.0025),
    ("VR Goggles", 0.01),
]
mouthpiece_list = [
    ("Bamboo Shoot", 0.04),
    ("Cigar", 0.0025),
    ("Frilly Party Blower", 0.01),
    ("Gum", 0.04),
    ("Harmonica", 0.04),
    ("Kazoo", 0.04),
    ("None", 0.645),
    ("Pacifier", 0.01),
    ("Party Blower", 0.04),
    ("Piece of Straw", 0.04),
    ("Pipe", 0.04),
    ("Rose", 0.01),
    ("Space Vape", 0.0025),
    ("Spoon", 0.04),
]

# Helpers
def get_random_accessory(list):
    rand = uniform(0, 1) / sum(tup[1] for tup in list)
    for i in range(len(list)):
        rand -= list[i][1]
        if rand <= 0:
            return list[i][0]
    raise Exception()


def get_random_tribe(special=False):
    counts = special_tribe_counts if special else tribe_counts
    list = special_tribe_list if special else tribe_list
    rand = randrange(len(counts))
    counts[rand] += 1
    ret = list[rand]
    if (
        counts[rand]
        == (constants.MAX_SPECIAL_TRIBE_COUNT if special else constants.MAX_TRIBE_COUNT)
        - 1
    ):
        counts.pop(rand)
        list.pop(rand)
    return ret


def get_image(parent, name):
    return Image.open(f"./Layers/{parent}/{name}.png")


memo = set()
for _ in range(constants.NUM_TOKENS_TO_CREATE):
    # Select combo
    background = get_random_accessory(background_list)
    tribe = get_random_tribe()
    clothing = get_random_accessory(clothing_list)
    neckwear = get_random_accessory(neckwear_list)
    headwear = get_random_accessory(headwear_list)
    eyewear = get_random_accessory(eyewear_list)
    mouthpiece = get_random_accessory(mouthpiece_list)

    # Ensure this is unique combo
    filename = f"./Combined/{tribe}-{background}-{clothing}-{neckwear}-{headwear}-{eyewear}-{mouthpiece}.PNG"
    key = hash(filename)
    if key in memo:
        continue
    memo.add(key)

    # Create image by superimposing layers
    background_image = get_image("Background", background)
    tribe_image = get_image("Tribes", tribe)
    background_image.paste(tribe_image, (0, 0), tribe_image)

    if clothing != "None":
        clothing_image = get_image("Clothing", clothing)
        background_image.paste(clothing_image, (0, 0), clothing_image)

    if neckwear != "None":
        neckwear_image = get_image("Neckwear", neckwear)
        background_image.paste(neckwear_image, (0, 0), neckwear_image)

    if headwear != "None":
        headwear_image = get_image("Headwear", headwear)
        background_image.paste(headwear_image, (0, 0), headwear_image)

    if eyewear != "None":
        eyewear_image = get_image("Eyewear", eyewear)
        background_image.paste(eyewear_image, (0, 0), eyewear_image)

    if mouthpiece != "None":
        mouthpiece_image = get_image("Mouthpiece", mouthpiece)
        background_image.paste(mouthpiece_image, (0, 0), mouthpiece_image)

    # Save image
    background_image.save(filename, "PNG")
