from combo import get_combo_object


def is_blacklisted(combo):
    obj = get_combo_object(combo)
    if obj["headwear"] == "Metal Mask":
        return (
            obj["eyewear"] == "Robotic Eye" or obj["eyewear"] == "Power Level Scanner"
        )
