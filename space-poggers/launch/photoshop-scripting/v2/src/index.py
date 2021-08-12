import multiprocessing as mp
from random import uniform

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

    def composite_layer(parent, name):
        if name != "None":
            image = get_image(parent, name)
            background_image.paste(image, (0, 0), image)

    composite_layer("SpecialTribes" if special else "Tribes", tribe)
    composite_layer("Clothing", clothing)
    composite_layer("Neckwear", neckwear)
    composite_layer("Headwear", headwear)
    composite_layer("Eyewear", eyewear)
    composite_layer("Mouthpiece", mouthpiece)

    # Save image
    background_image.save(filename, "PNG")
    return True


def create_images(special):
    memo = set()
    while len(memo) < (
        constants.MAX_SPECIAL_TRIBE_COUNT if special else constants.MAX_TRIBE_COUNT
    ):
        create_image(memo, special)


if __name__ == "__main__":
    generate_special = False
    pool = mp.Pool(12)
    pool.map(create_images, [generate_special] * 12)
    pool.close()
    pool.join()
