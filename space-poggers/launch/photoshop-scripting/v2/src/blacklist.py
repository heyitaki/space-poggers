# type: ignore

import constants
from combo import get_combo_object


def is_blacklisted(combo):
    obj = get_combo_object(combo)
    if obj.mouthpiece == "Harmonica":
        return True
    elif obj.tribe == "Dog":
        return (
            obj.eyewear == "Sunglasses"
            or obj.eyewear == "3D Glasses"
            or obj.eyewear == "Prince Nez"
            or obj.eyewear == "Swim Goggles"
            or obj.eyewear == "Hypno Glasses"
        )
    elif obj.tribe == "Elephant":
        return (
            obj.eyewear == "Sunglasses"
            or obj.eyewear == "3D Glasses"
            or obj.eyewear == "Ski Goggles"
            or obj.eyewear == "Swim Goggles"
        )


# # Load blacklist once
# blacklist = {}
# for rule in constants.BLACKLIST_RULES:
#     curr = blacklist
#     for token in rule.split("-"):
#         token = token or constants.WILDCARD

#         # Create new branch
#         if token not in curr:
#             curr[token] = {}

#         # Step into branch
#         curr = curr[token]


# def is_blacklisted(combo):
#     return is_blacklisted_recursive(blacklist, combo)


# def is_blacklisted_recursive(start, combo):
#     if len(start) == 0 or len(combo) == 0:
#         return True

#     blacklisted = False
#     curr = start
#     trait = combo[0] or constants.WILDCARD
#     if trait in curr:
#         blacklisted = blacklisted or is_blacklisted_recursive(curr[trait], combo[1:])
#     elif trait != constants.WILDCARD and constants.WILDCARD in curr:
#         blacklisted = blacklisted or is_blacklisted_recursive(
#             curr[constants.WILDCARD], combo[1:]
#         )
#     else:
#         return False
#     return blacklisted


# print(blacklist)
# load_blacklist()
# print(blacklist)
# is_blacklisted("Llama-Lime-Crop Top-None--None-Party Blower")

# blacklist = {}
# blacklist["k1"] = {}
# blacklist["k1"]["k2"] = {}
# blacklist["k1"]["k2"]["*"] = {}
# blacklist["k1"]["k2"]["*"]["k4"] = {}
# blacklist["k1"]["k2"]["k3"] = {}

# blacklist = get_blacklist()
# print(is_blacklisted(("Llama", "Lime", "None", "None", "None", "None", "Pipe")))
# print(is_blacklisted(("Llxama", "Lime", "None", "None", "None", "None", "Pipe")))
