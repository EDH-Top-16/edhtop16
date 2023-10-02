def wubrgify(color_string):
    """Parse colors in WUBRG(C) order; removes duplicates and misordering"""
    res = ''
    for c in ['W', 'U', 'B', 'R', 'G']:
        res += c if c in color_string else ''
    return res if res else "C" # return "C" for colorless if W, U, B, R, G all not in color string