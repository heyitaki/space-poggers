import multiprocessing as mp

from PIL import Image

import constants
from blacklist import is_blacklisted
from combo import get_combo


def get_image(parent, name):
    return Image.open(f"./Layers/{parent}/{name}.png")


def create_image(memo, special):
    # Select combo
    # combo = get_combo(special)
    # (
    #     tribe,
    #     background,
    #     clothing,
    #     neckwear,
    #     headwear,
    #     eyewear,
    #     mouthpiece,
    # ) = combo

    (tribe, background, clothing, neckwear, headwear, eyewear, mouthpiece,) = (
        "Artemis",
        "Murder Spiral",
        "None",
        "Cyberking Necklace",
        "None",
        "Metal Monocle",
        "None",
    )

    # Ensure this is unique combo
    filename = f"./{'Special' if special else 'Combined'}/{tribe}-{background}-{clothing}-{neckwear}-{headwear}-{eyewear}-{mouthpiece}.PNG"
    key = hash(filename)
    if key in memo:  # or is_blacklisted(combo):
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
        print(
            f"Finished creating image {len(memo)}/{constants.MAX_SPECIAL_TRIBE_COUNT if special else constants.MAX_TRIBE_COUNT}"
        )


if __name__ == "__main__":
    generate_special = True
    create_images(generate_special)
