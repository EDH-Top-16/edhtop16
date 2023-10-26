import strawberry
from strawberry.fastapi import GraphQLRouter
from typing import List, Optional, cast
from utils.types import Commander, TournamentFilters, OperatorType, AllFilters, Tournament, Entry
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
    

@strawberry.experimental.pydantic.input(model=OperatorType[int], use_pydantic_alias=False)
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
        return OperatorType[int](**{
            '$lte': self.lte,
            '$lt': self.lt,
            '$eq': self.eq,
            '$gte': self.gte,
            '$gt': self.gt,
            '$ne': self.ne,
            '$in': self.in_,
            '$nin': self.nin,
            '$regex': self.regex,
            '$exists': self.exists,
            '$mod': self.mod,
            '$all': self.all_,
            '$size': self.size
        })

@strawberry.experimental.pydantic.input(model=TournamentFilters)
class TournamentFiltersInput:
    # TODO: Allow date filter.
    dateCreated: strawberry.auto
    size: strawberry.auto
    TID: strawberry.auto
    tournamentName: strawberry.auto
    swissNum: strawberry.auto
    topCut: strawberry.auto

@strawberry.type
class Query:
    @strawberry.field
    async def commanders(root, tournament_filters: Optional[TournamentFiltersInput] = None) -> List[CommanderType]:
        all_filters = AllFilters() if tournament_filters is None else AllFilters(tournament_filters=tournament_filters.to_pydantic())
        commanders = await get_commanders(all_filters)
        return [CommanderType.from_pydantic(commander, extra={'name':name}) for name, commander in commanders.items()]

    @strawberry.field
    async def tournaments(root, tournament_filters: Optional[TournamentFiltersInput] = None) -> List[TournamentType]:
        filters = TournamentFilters() if tournament_filters is None else tournament_filters.to_pydantic()
        return [TournamentType.from_pydantic(t) for t in await get_tournaments(filters)]


schema = strawberry.Schema(Query)
graphql_app = cast(GraphQLRouter[None, None], GraphQLRouter(schema))
