from random import uniform

import constants


def get_random_accessory(list):
    rand = uniform(0, 1) / sum(tup[1] for tup in list)
    for i in range(len(list)):
        rand -= list[i][1]
        if rand <= 0:
            return list[i][0]
    raise Exception()


def get_combo(special, tribe_idx):
    tribe = (constants.SPECIAL_TRIBE_LIST if special else constants.TRIBE_LIST)[
        tribe_idx
    ]
    background = get_random_accessory(constants.SPECIAL_BACKGROUND_LIST if special else constants.BACKGROUND_LIST)
    clothing = get_random_accessory(constants.CLOTHING_LIST)
    neckwear = get_random_accessory(constants.NECKWEAR_LIST)
    headwear = get_random_accessory(constants.HEADWEAR_LIST)
    eyewear = get_random_accessory(constants.EYEWEAR_LIST)
    mouthpiece = get_random_accessory(constants.MOUTHPIECE_LIST)
    return (tribe, background, clothing, neckwear, headwear, eyewear, mouthpiece)


def get_combo_object(combo_tuple):
    return {
        "tribe": combo_tuple[0],
        "background": combo_tuple[1],
        "clothing": combo_tuple[2],
        "neckwear": combo_tuple[3],
        "headwear": combo_tuple[4],
        "eyewear": combo_tuple[5],
        "mouthpiece": combo_tuple[6],
    }
