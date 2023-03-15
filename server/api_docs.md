# cEDH Top 16 API

Our endpoint is available at `https://www.cedhtop16.com/api/`. Data is returned in json format, and are generally arrays of objects. Please include content type and accept headers for `application/json` in all requests.

Please limit requests to 120/min (around 2 per second). Any more will result in `429: Too Many Requests`.

Examples provided are using the Python requests library, but any HTTP request should do. Most of our endpoints with filtering are done through MongoDB-style filters. Invalid filters will result in `400: Bad Request`.

```python
import json
import requests
base_url = "https://www.edhtop16.com/api/"
headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
```

## Getting Tournaments

Tournament objects generally have an ID, associated name, as well as information on when the tournament was created and how many entries there were. Their format is as follows:

```json
{TID: <string: tournament ID>,
tournamentName: <string: tournament name>,
size: <int: # entries>,
date: <ISO date object or string>,
dateCreated: <int: Unix timestamp>}
```

## Example - Get tournaments of at least 50 entries played since 2023-01-14

While the `date` field is easier to read, it is much easier to convert dates to Unix timestamp and use integer filtering. You cannot filter using both `date` and `dateCreated` fields; you need to pick one.

```python
data = {
'size': {'$gte': 50},
'dateCreated': {'$gte': 1673715600}
}
tourneys = json.loads(requests.post(base_url + 'list_tourneys', json=data, headers=headers).text)
print(tourneys)
```

Gives:

```python
[{'TID': 'SiliconDynasty',
  'tournamentName': 'Silicon Dynasty',
  'size': 161,
  'date': '2023-01-14T12:00:00.000Z',
  'dateCreated': 1673715600},
 {'TID': 'rybklRiX5tZLBCCSgcqQ',
  'tournamentName': 'ka0s 6! Sponsored by The cEDH Nexus',
  'size': 148,
  'date': '2023-01-20T22:43:25.000Z',
  'dateCreated': 1674272605},
 {'TID': 'MM123',
  'tournamentName': 'Mox Masters January 23',
  'size': 127,
  'date': '2023-01-28T10:00:00.000Z',
  'dateCreated': 1674918000},
 {'TID': 'Fia6JR9cwYZdoLeDbg3B',
  'tournamentName': 'ka0s Treasure Series',
  'size': 74,
  'date': '2023-01-29T03:55:20.000Z',
  'dateCreated': 1674982520}]
```

## Example - Get all Mox Masters tournaments (1)

You might notice that Eminence-run tournaments generally have a special, human-readable tournament ID instead of a hash-like string. We can take advanatage of the fact that all Mox Masters tournaments are simply `MM` followed by 3 or four digits (1-2 digit month, 2 digit year). Let's create a regex for that and pass it with the mongoDB filter `$regex` for `TID`.

```python
data = {'TID': {'$regex': r'MM\d{3,4}'}}
tourneys = json.loads(requests.post(base_url + 'list_tourneys', json=data, headers=headers).text)
print(tourneys)
```

Gives:

```python
[{'TID': 'MM1022',
  'tournamentName': 'Mox Masters October 22',
  'size': 127,
  'date': '2022-10-01T03:00:01.000Z',
  'dateCreated': 1664607601},
 {'TID': 'MM1222',
  'tournamentName': 'Mox Masters December 22',
  'size': 127,
  'date': '2022-12-03T03:00:00.000Z',
  'dateCreated': 1670054400},
 {'TID': 'MM123',
  'tournamentName': 'Mox Masters January 23',
  'size': 127,
  'date': '2023-01-28T10:00:00.000Z',
  'dateCreated': 1674918000},
 {'TID': 'MM223',
  'tournamentName': 'Mox Masters February 23',
  'size': 127,
  'date': '2023-02-25T09:00:00.000Z',
  'dateCreated': 1677333600}]
```

## Example - Get all Mox Masters tournaments (2)

We can also create a regex using the `tournamentName` field:

```python
data = {'tournamentName': {'$regex': r'Mox Masters (January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}'}}
tourneys = json.loads(requests.post(base_url + 'list_tourneys', json=data, headers=headers).text)
print(tourneys)
```

Gives the same as the previous example.

## Getting Players/Entries

Players and Entries have a number of fields. All columns from Eminence's API are included (found [here](https://eminence.events/api/docs)), in addition to two more fields:

```json
{colorID: <commander(s) color identity, in WUBRG order, or C for colorless (mutally exclusive). 'N/A' for unknown or erroneous commander names>,
commander: <commander(s) name. 'Unknown Commander' for unkown or erroneous decklist links.>}
```

You can filter by any of these columns in addition to any filters for tournamnets in a separate entry with key `tourneyFilters` and value of the json object containing all tournament metadata-related filters.

## Example - all 5-color commander entries that have top 16'd a tournament with at least 64 entries

```python
data = {
    'standing': {'$lte': 16}, 
    'colorID': 'WUBRG',
    'tourney_filter': {
        'size': {'$gte': 64}
    }
}
entries = json.loads(requests.post(base_url + 'req', json=data, headers=headers).text)
print(entries)
```

Gives

```python
[{'name': 'Takato Mitsuda',
  'profile': 'KnEzdraHD2V9Czv8PCuqhohTa7F2',
  'decklist': 'https://www.moxfield.com/decks/zHocFJxZb0uruHtZhbitrw',
  'wins': 2,
  'winsSwiss': 2,
  'winsBracket': 0,
  'winRate': 0.3333333333333333,
  'winRateSwiss': 0.4,
  'winRateBracket': 0,
  'draws': 2,
  'losses': 2,
  'lossesSwiss': 1,
  'lossesBracket': 1,
  'standing': 12,
  'colorID': 'WUBRG',
  'commander': 'Najeela, the Blade-Blossom',
  'tournamentName': 'Mox Masters October 22'},
 {'name': 'Alexander Rice',
  'profile': 'vc1IkW3bXYdKfplUKozjTmFjNQa2',
  'decklist': 'https://www.moxfield.com/decks/8W6rxWnuU0Sn0WMcYDK_5g',
  'wins': 3,
  'winsSwiss': 2,
  'winsBracket': 1,
  'winRate': 0.42857142857142855,
  'winRateSwiss': 0.4,
  'winRateBracket': 0.5,
  'draws': 2,
  'losses': 2,
  'lossesSwiss': 1,
  'lossesBracket': 1,
  'standing': 4,
  'colorID': 'WUBRG',
  'commander': 'Kenrith, the Returned King',
  'tournamentName': 'Mox Masters December 22'},
  # And so on
]
```

## Getting commanders

We also provide an endpoint to get commander names, color identities, and number of entries. This endpoint does not support filtering, and is only useful for at-a-glance analysis. Any more significant analysis should be done through `req` as that includes performance information.

```python
commanders = json.loads(requests.get(base_url + 'get_commanders', headers=headers).text)
print(commanders)
```

gives

```python
[
  {'commander': 'Malcolm, Keen-Eyed Navigator / Tymna the Weaver', 'colorID': 'WUB', 'count': 23},
  {'commander': 'Malcolm, Keen-Eyed Navigator / Tana, the Bloodsower', 'colorID': 'URG', 'count': 28},
  {'commander': 'Rograkh, Son of Rohgahh / Tevesh Szat, Doom of Fools', 'colorID': 'BR', 'count': 10},
  {'commander': 'Kenrith, the Returned King', 'colorID': 'WUBRG', 'count': 24},
  {'commander': 'Teferi, Temporal Archmage', 'colorID': 'U', 'count': 2},
  {'commander': 'Krark, the Thumbless / Sakashima of a Thousand Faces', 'colorID': 'UR', 'count': 31},
  {'commander': 'Inalla, Archmage Ritualist', 'colorID': 'UBR', 'count': 17}
# And so on
]
```

_Note: for now, 'Minsc & Boo' seems to be breaking an upstream API, likely due to the ampersand in its name. We're waiting for this issue to be resolved._
