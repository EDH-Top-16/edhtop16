import strawberry
from strawberry.fastapi import GraphQLRouter
from typing import List, Optional, cast
from utils.types import (
    Commander,
    TournamentFilters,
    OperatorType,
    AllFilters,
    Tournament,
    Entry,
    Player,
)
from db.tournaments_db import get_commanders, get_tournaments, get_entries


@strawberry.experimental.pydantic.type(model=Commander, all_fields=True)
class CommanderType:
    name: str


@strawberry.experimental.pydantic.type(model=Entry, all_fields=True)
class EntryType:
    pass


@strawberry.experimental.pydantic.type(model=Tournament, all_fields=True)
class TournamentType:
    TID: Optional[str]

    @strawberry.field
    async def entries(self) -> List[EntryType]:
        filters = AllFilters(tournament_filters=TournamentFilters(TID=self.TID))
        return [EntryType.from_pydantic(entry) for entry in await get_entries(filters)]


@strawberry.experimental.pydantic.type(model=Player, all_fields=True)
class PlayerType:
    pass


@strawberry.experimental.pydantic.input(
    model=OperatorType[int], use_pydantic_alias=False
)
class OperatorTypeIntInput:
    lte: strawberry.auto
    lt: strawberry.auto
    eq: strawberry.auto
    gte: strawberry.auto
    gt: strawberry.auto
    ne: strawberry.auto
    in_: strawberry.auto
    nin: strawberry.auto
    regex: strawberry.auto
    exists: strawberry.auto
    mod: strawberry.auto
    all_: strawberry.auto
    size: strawberry.auto

    def to_pydantic(self) -> OperatorType[int]:
        return OperatorType[int](
            **{
                "$lte": self.lte,
                "$lt": self.lt,
                "$eq": self.eq,
                "$gte": self.gte,
                "$gt": self.gt,
                "$ne": self.ne,
                "$in": self.in_,
                "$nin": self.nin,
                "$regex": self.regex,
                "$exists": self.exists,
                "$mod": self.mod,
                "$all": self.all_,
                "$size": self.size,
            }
        )


@strawberry.experimental.pydantic.input(model=TournamentFilters)
class TournamentFiltersInput:
    # TODO: Allow date filter.
    dateCreated: strawberry.auto
    size: strawberry.auto
    TID: strawberry.auto
    tournamentName: strawberry.auto
    swissNum: strawberry.auto
    topCut: strawberry.auto


@strawberry.experimental.pydantic.input(model=AllFilters)
class AllFiltersInput:
    name: strawberry.auto
    profile: strawberry.auto
    decklist: strawberry.auto
    wins: strawberry.auto
    winsSwiss: strawberry.auto
    winsBracket: strawberry.auto
    winRate: strawberry.auto
    winRateSwiss: strawberry.auto
    winRateBracket: strawberry.auto
    draws: strawberry.auto
    losses: strawberry.auto
    lossesSwiss: strawberry.auto
    lossesBracket: strawberry.auto
    standing: strawberry.auto
    colorID: strawberry.auto
    commander: strawberry.auto
    tournament_filters: strawberry.auto


@strawberry.type
class Query:
    @strawberry.field
    async def commanders(
        root, tournament_filters: Optional[TournamentFiltersInput] = None
    ) -> List[CommanderType]:
        all_filters = (
            AllFilters()
            if tournament_filters is None
            else AllFilters(tournament_filters=tournament_filters.to_pydantic())
        )
        commanders = await get_commanders(all_filters)
        return [
            CommanderType.from_pydantic(commander, extra={"name": name})
            for name, commander in commanders.items()
        ]

    @strawberry.field
    async def tournaments(
        root, tournament_filters: Optional[TournamentFiltersInput] = None
    ) -> List[TournamentType]:
        filters = (
            TournamentFilters()
            if tournament_filters is None
            else tournament_filters.to_pydantic()
        )
        return [TournamentType.from_pydantic(t) for t in await get_tournaments(filters)]

    @strawberry.field
    async def entries(
        root, filters: Optional[AllFiltersInput] = None
    ) -> List[EntryType]:
        filters_input = AllFilters() if filters is None else filters.to_pydantic()
        return [EntryType.from_pydantic(e) for e in await get_entries(filters_input)]

    @strawberry.field
    async def player(root, profile: str) -> Optional[PlayerType]:
        data = await get_entries(AllFilters(profile=profile))
        if not data:
            return None

        player = Player(
            wins=0,
            winsSwiss=0,
            winsBracket=0,
            draws=0,
            losses=0,
            lossesSwiss=0,
            lossesBracket=0,
        )
        player.tournaments = []
        player.name = data[0].name or ""
        player.profile = profile

        topCuts = 0

        for entry in data:
            player.wins = (player.wins or 0) + (entry.wins or 0)
            player.winsSwiss = (player.winsSwiss or 0) + (entry.winsSwiss or 0)
            player.winsBracket = (player.winsBracket or 0) + (entry.winsBracket or 0)
            player.draws = (player.draws or 0) + (entry.draws or 0)
            player.losses = (player.losses or 0) + (entry.losses or 0)
            player.lossesSwiss = (player.lossesSwiss or 0) + (entry.lossesSwiss or 0)
            player.lossesBracket = (player.lossesBracket or 0) + (
                entry.lossesBracket or 0
            )

            if (entry.standing or float("inf")) <= (entry.topCut or 0):
                topCuts += 1

            player.tournaments.append(entry)

        player.winRate = (player.wins or 0) / (
            (player.wins or 0) + (player.draws or 0) + (player.losses or 0)
        )
        player.winRateSwiss = (player.winsSwiss or 0) / (
            (player.winsSwiss or 0) + (player.draws or 0) + (player.lossesSwiss or 0)
        )
        player.winRateBracket = (player.winsBracket or 0) / (
            (player.winsBracket or 0) + (player.lossesBracket or 0)
        )
        player.conversionRate = topCuts / len(player.tournaments)
        player.topCuts = topCuts

        return PlayerType.from_pydantic(player)


schema = strawberry.Schema(Query)
graphql_app = cast(GraphQLRouter[None, None], GraphQLRouter(schema))
