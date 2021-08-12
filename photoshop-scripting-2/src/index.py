import multiprocessing as mp
import os
from functools import partial
from random import randrange, uniform

from PIL import Image

import constants


def get_random_accessory(list):
    rand = uniform(0, 1) / sum(tup[1] for tup in list)
    for i in range(len(list)):
        rand -= list[i][1]
        if rand <= 0:
            return list[i][0]
    raise Exception()


def get_image(parent, name):
    return Image.open(f"./Layers/{parent}/{name}.png")


def create_image(memo, special):
    # Select combo
    background = get_random_accessory(constants.BACKGROUND_LIST)
    tribe = (constants.SPECIAL_TRIBE_LIST if special else constants.TRIBE_LIST)[
        mp.current_process()._identity[0] - 1
    ]
    clothing = get_random_accessory(constants.CLOTHING_LIST)
    neckwear = get_random_accessory(constants.NECKWEAR_LIST)
    headwear = get_random_accessory(constants.HEADWEAR_LIST)
    eyewear = get_random_accessory(constants.EYEWEAR_LIST)
    mouthpiece = get_random_accessory(constants.MOUTHPIECE_LIST)

    # Ensure this is unique combo
    filename = f"./Combined/{tribe}-{background}-{clothing}-{neckwear}-{headwear}-{eyewear}-{mouthpiece}.PNG"
    key = hash(filename)
    if key in memo:
        return False
    memo.add(key)

    # Create image by superimposing layers
    background_image = get_image("Background", background)
    tribe_image = get_image("SpecialTribes" if special else "Tribes", tribe)
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
    return True


def create_images(_):
    special = True
    memo = set()
    while len(memo) < (
        constants.MAX_SPECIAL_TRIBE_COUNT if special else constants.MAX_TRIBE_COUNT
    ):
        create_image(memo, special)


if __name__ == "__main__":
    pool = mp.Pool(12)
    pool.map(create_images, range(12))
    pool.close()
    pool.join()
