from typing import List


def oIdToString(list: List):
    """
    Converts the _id field of a list of dictionaries from ObjectId to string.
    """
    for i in range(len(list)):
        list[i]["_id"] = str(list[i]["_id"])
    return list
