import {
  resolveCursorConnection,
  ResolveCursorConnectionArgs,
  resolveOffsetConnection,
} from "@pothos/plugin-relay";
import { subYears } from "date-fns";
import { sql } from "kysely";
import { db } from "../db";
import { DB } from "../db/__generated__/types";
import { builder } from "./builder";
import { Card } from "./card";
import { Entry } from "./entry";
import { minDateFromTimePeriod, TimePeriod } from "./types";

const CommandersSortBy = builder.enumType("CommandersSortBy", {
  values: ["POPULARITY", "CONVERSION", "TOP_CUTS"] as const,
});

const EntriesSortBy = builder.enumType("EntriesSortBy", {
  values: ["NEW", "TOP"] as const,
});

const CommanderStatsFilters = builder.inputType("CommanderStatsFilters", {
  fields: (t) => ({
    colorId: t.string(),
    minSize: t.int(),
    minDate: t.string(),
    maxSize: t.int(),
    maxDate: t.string(),
    timePeriod: t.field({ type: TimePeriod }),
  }),
});

const EntriesFilter = builder.inputType("EntriesFilter", {
  fields: (t) => ({
    timePeriod: t.field({ type: TimePeriod, defaultValue: "ALL_TIME" }),
    minEventSize: t.int({ defaultValue: 60 }),
    maxStanding: t.int(),
  }),
});

export const Commander = builder.loadableNodeRef("Commander", {
  id: { parse: (id) => Number(id), resolve: (parent) => parent.id },
  load: async (ids: number[]) => {
    const nodes = await db
      .selectFrom("Commander")
      .selectAll()
      .where("id", "in", ids)
      .execute();

    const nodesById = new Map<number, (typeof nodes)[number]>();
    for (const node of nodes) nodesById.set(node.id, node);

    return ids.map((id) => nodesById.get(id)!);
  },
});

Commander.implement({
  fields: (t) => ({
    name: t.string({
      resolve: (parent) => {
        return APRIL_FOOLS_UWU_NAMES[parent.name] || parent.name;
      },
    }),
    colorId: t.exposeString("colorId"),
    breakdownUrl: t.string({
      resolve: (parent) => `/commander/${encodeURIComponent(parent.name)}`,
    }),
    entries: t.connection({
      type: Entry,
      args: {
        filters: t.arg({ type: EntriesFilter }),
        sortBy: t.arg({
          type: EntriesSortBy,
          defaultValue: "TOP",
        }),
      },
      resolve: (parent, args) =>
        resolveOffsetConnection({ args }, ({ limit, offset }) => {
          const minEventSize = args.filters?.minEventSize ?? 60;
          const maxStanding =
            args.filters?.maxStanding ?? Number.MAX_SAFE_INTEGER;
          const minDate = minDateFromTimePeriod(
            args.filters?.timePeriod ?? "ALL_TIME",
          );

          return db
            .selectFrom("Entry")
            .selectAll("Entry")
            .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
            .where("Entry.commanderId", "=", parent.id)
            .where("standing", "<=", maxStanding)
            .where("Tournament.tournamentDate", ">=", minDate.toISOString())
            .where("Tournament.size", ">=", minEventSize)
            .orderBy(
              args.sortBy === "NEW"
                ? ["Tournament.tournamentDate desc"]
                : ["Entry.standing asc", "Tournament.size desc"],
            )
            .limit(limit)
            .offset(offset)
            .execute();
        }),
    }),
    cards: t.loadableList({
      type: Card,
      load: async (commanders: string[]) => {
        if (commanders.length === 0) return [];

        const names = commanders.map((c) =>
          c === "Unknown Commander" ? [] : c.split(" / "),
        );

        const cards = await db
          .selectFrom("Card")
          .selectAll()
          .where("name", "in", names.flat())
          .execute();

        const cardByName = new Map<string, DB["Card"]>();
        for (const card of cards) cardByName.set(card.name, card);

        return names.map((ns) =>
          ns.map((n) => cardByName.get(n)!).filter(Boolean),
        );
      },
      resolve: (parent) => parent.name,
    }),
    staples: t.connection({
      type: Card,
      resolve: async (parent, args) => {
        return resolveOffsetConnection({ args }, async ({ limit, offset }) => {
          const oneYearAgo = subYears(new Date(), 1).toISOString();

          const { totalEntries } = await db
            .selectFrom("Entry")
            .select([(eb) => eb.fn.countAll<number>().as("totalEntries")])
            .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
            .where("Entry.commanderId", "=", parent.id)
            .where("Tournament.tournamentDate", ">=", oneYearAgo)
            .executeTakeFirstOrThrow();

          let query = db
            .with("entries", (eb) => {
              return eb
                .selectFrom("DecklistItem")
                .leftJoin("Card", "Card.id", "DecklistItem.cardId")
                .leftJoin("Entry", "Entry.id", "DecklistItem.entryId")
                .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
                .where("Entry.commanderId", "=", parent.id)
                .where("Tournament.tournamentDate", ">=", oneYearAgo)
                .groupBy("Card.id")
                .select((eb) => [
                  eb.ref("Card.id").as("cardId"),
                  eb(
                    eb.cast(eb.fn.count<number>("Card.id"), "real"),
                    "/",
                    totalEntries,
                  ).as("playRateLastYear"),
                ]);
            })
            .selectFrom("Card")
            .leftJoin("entries", "entries.cardId", "Card.id")
            .where((eb) =>
              eb(
                eb.fn("json_extract", ["Card.data", sql`'$.type_line'`]),
                "not like",
                "%Land%",
              ),
            )
            .orderBy(
              (eb) =>
                eb(
                  "entries.playRateLastYear",
                  "-",
                  eb.ref("Card.playRateLastYear"),
                ),
              "desc",
            )
            .selectAll("Card");

          return query.limit(limit).offset(offset).execute();
        });
      },
    }),
  }),
});

builder.queryField("commander", (t) =>
  t.field({
    type: Commander,
    args: { name: t.arg.string({ required: true }) },
    resolve: async (_root, args) => {
      return db
        .selectFrom("Commander")
        .selectAll()
        .where("name", "=", args.name)
        .executeTakeFirstOrThrow();
    },
  }),
);

builder.queryField("commanders", (t) =>
  t.connection({
    type: Commander,
    args: {
      minEntries: t.arg.int(),
      minTournamentSize: t.arg.int(),
      timePeriod: t.arg({ type: TimePeriod, defaultValue: "ONE_MONTH" }),
      sortBy: t.arg({ type: CommandersSortBy, defaultValue: "CONVERSION" }),
      colorId: t.arg.string(),
    },
    resolve: async (_root, args) => {
      return resolveCursorConnection(
        { args, toCursor: (parent) => `${parent.id}` },
        async ({
          before,
          after,
          limit,
          inverted,
        }: ResolveCursorConnectionArgs) => {
          const minDate = minDateFromTimePeriod(args.timePeriod ?? "ONE_MONTH");
          const minTournamentSize = args.minTournamentSize || 0;
          const minEntries = args.minEntries || 0;
          const sortBy =
            args.sortBy === "POPULARITY"
              ? "stats.count"
              : args.sortBy === "TOP_CUTS"
              ? "stats.topCuts"
              : "stats.conversionRate";

          let query = db
            .with("stats", (eb) =>
              eb
                .selectFrom("Commander")
                .leftJoin("Entry", "Entry.commanderId", "Commander.id")
                .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
                .where("Tournament.tournamentDate", ">=", minDate.toISOString())
                .where("Tournament.size", ">=", minTournamentSize)
                .groupBy("Commander.id")
                .select((eb) => [
                  eb.ref("Commander.id").as("commanderId"),
                  eb.fn.count("Entry.id").as("count"),
                  eb.fn
                    .sum(
                      eb
                        .case()
                        .when(
                          "Entry.standing",
                          "<=",
                          eb.ref("Tournament.topCut"),
                        )
                        .then(1)
                        .else(0)
                        .end(),
                    )
                    .as("topCuts"),
                  eb(
                    eb.cast(
                      eb.fn.sum(
                        eb
                          .case()
                          .when(
                            "Entry.standing",
                            "<=",
                            eb.ref("Tournament.topCut"),
                          )
                          .then(1)
                          .else(0)
                          .end(),
                      ),
                      "real",
                    ),
                    "/",
                    eb.fn.count("Entry.id"),
                  ).as("conversionRate"),
                ]),
            )
            .selectFrom("Commander")
            .selectAll("Commander")
            .leftJoin("stats", "stats.commanderId", "Commander.id")
            .where("Commander.name", "!=", "Unknown Commander")
            .where("Commander.name", "!=", "Nadu, Winged Wisdom")
            .where("stats.count", ">=", minEntries);

          if (args.colorId) {
            query = query.where("Commander.colorId", "=", args.colorId);
          }

          if (before) {
            query = query.where((eb) =>
              eb(
                eb.tuple(eb.ref(sortBy), eb.ref("Commander.id")),
                ">",
                eb.tuple(
                  eb
                    .selectFrom("stats")
                    .select(sortBy)
                    .where("commanderId", "=", Number(after)),
                  Number(after),
                ),
              ),
            );
          }

          if (after) {
            query = query.where((eb) =>
              eb(
                eb.tuple(eb.ref(sortBy), eb.ref("Commander.id")),
                "<",
                eb.tuple(
                  eb
                    .selectFrom("stats")
                    .select(sortBy)
                    .where("commanderId", "=", Number(after)),
                  Number(after),
                ),
              ),
            );
          }

          query = query
            .orderBy(sortBy, inverted ? "asc" : "desc")
            .orderBy("Commander.id", inverted ? "asc" : "desc")
            .limit(limit);

          return query.execute();
        },
      );
    },
  }),
);

interface CommanderCalculatedStats {
  count: number;
  topCuts: number;
  conversionRate: number;
  metaShare: number;
}

const CommanderStats = builder
  .objectRef<CommanderCalculatedStats>("CommanderStats")
  .implement({
    fields: (t) => ({
      count: t.exposeInt("count"),
      topCuts: t.exposeInt("topCuts"),
      conversionRate: t.exposeFloat("conversionRate"),
      metaShare: t.exposeFloat("metaShare"),
    }),
  });

builder.objectField(Commander, "stats", (t) =>
  t.loadable({
    type: CommanderStats,
    byPath: true,
    args: { filters: t.arg({ type: CommanderStatsFilters }) },
    resolve: (parent) => parent.id,
    load: async (commanderIds: number[], _ctx, { filters }) => {
      const minSize = filters?.minSize ?? 0;
      const maxSize = filters?.maxSize ?? 1_000_000;
      const maxDate = filters?.maxDate ? new Date(filters.maxDate) : new Date();
      const minDate =
        filters?.minDate != null
          ? new Date(filters?.minDate ?? 0)
          : minDateFromTimePeriod(filters?.timePeriod);

      const [entriesQuery, statsQuery] = await Promise.all([
        db
          .selectFrom("Entry")
          .select((eb) => eb.fn.countAll<number>().as("totalEntries"))
          .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
          .where("Tournament.size", ">=", minSize)
          .where("Tournament.size", "<=", maxSize)
          .where("Tournament.tournamentDate", ">=", minDate.toISOString())
          .where("Tournament.tournamentDate", "<=", maxDate.toISOString())
          .executeTakeFirstOrThrow(),
        db
          .selectFrom("Commander")
          .leftJoin("Entry", "Entry.commanderId", "Commander.id")
          .leftJoin("Tournament", "Tournament.id", "Entry.tournamentId")
          .select([
            "Commander.id",
            "Commander.name",
            "Commander.colorId",
            (eb) => eb.fn.count<number>("Commander.id").as("count"),
            (eb) =>
              eb.fn
                .sum<number>(
                  eb
                    .case()
                    .when("Entry.standing", "<=", eb.ref("Tournament.topCut"))
                    .then(1)
                    .else(0)
                    .end(),
                )
                .as("topCuts"),
            (eb) =>
              eb(
                eb.cast<number>(
                  eb.fn.sum<number>(
                    eb
                      .case()
                      .when("Entry.standing", "<=", eb.ref("Tournament.topCut"))
                      .then(1)
                      .else(0)
                      .end(),
                  ),
                  "real",
                ),
                "/",
                eb.fn.count<number>("Entry.id"),
              ).as("conversionRate"),
          ])
          .where("Tournament.size", ">=", minSize)
          .where("Tournament.size", "<=", maxSize)
          .where("Tournament.tournamentDate", ">=", minDate.toISOString())
          .where("Tournament.tournamentDate", "<=", maxDate.toISOString())
          .where("Commander.id", "in", commanderIds)
          .groupBy("Commander.id")
          .execute(),
      ]);

      const totalEntries = entriesQuery.totalEntries ?? 1;
      const statsByCommanderId = new Map<number, CommanderCalculatedStats>();
      for (const { id, ...stats } of statsQuery) {
        statsByCommanderId.set(id, {
          ...stats,
          metaShare: stats.count / totalEntries,
        });
      }

      return commanderIds.map(
        (id) =>
          statsByCommanderId.get(id) ?? {
            topCuts: 0,
            conversionRate: 0,
            count: 0,
            metaShare: 0,
          },
      );
    },
  }),
);

// prettier-ignore
const APRIL_FOOLS_UWU_NAMES: Record<string, string> = {
  "Abaddon the Despoiler": "Abbiekins the Desp0iwyew~ ✨🔪",
  "Admiral Brass, Unsinkable": "Admewaw B-bwassy~🌊💖",
  "Aesi, Tyrant of Gyre Strait": "Aesi-chwann~ da big bad fishy~ 🐟💦",
  "Akiri, Line-Slinger / Malcolm, Keen-Eyed Navigator": "Akiri-bean & Mawwcwyum~ da saiwow bbies~ ⚓💕",
  "Alela, Cunning Conqueror": "Awela~ da sneaky sneaky fae~ 🧚✨",
  "Aminatou, Veil Piercer": "Ami-chan~ da spooky gwirl~ 👀💜",
  "Animar, Soul of Elements": "Annie-mawrr~ da cowourfuww beastie~ 🌈💖",
  "Anje Falkenrath": "Anjwie~ da spicy vamppy~ 🩸😈",
  "Aragorn, King of Gondor": "Awagworn~ da wegendawy husbando~ 👑💘",
  "Aragorn, the Uniter": "Awa-gowon~ da BFF matchmakew~ 💞✨",
  "Ardenn, Intrepid Archaeologist / Thrasios, Triton Hero": "Awdie & Thwas-chan~ da twavewy adventuwas~ 🏝️💎",
  "Ardenn, Intrepid Archaeologist / Vial Smasher the Fierce": "Awdie & Vial-boom boom~ 💥🔍",
  "Armix, Filigree Thrasher / Thrasios, Triton Hero": "Armewix & Thwas-chan~ da metaww fishy duo~ 🤖🐠",
  "Atla Palani, Nest Tender": "Atwa-chan~ da eggy mama~ 🥚🐣",
  "Atraxa, Grand Unifier": "Attwie-uwu~ da fwendwy monstah~ 😇💖",
  "Atraxa, Praetors' Voice": "Attwa-nyan~ da supew spooky angew~ 🖤😼",
  "Azami, Lady of Scrolls": "Azamuwu~ da big bwainy bookie gwirl~ 📚🧠",
  "Bello, Bard of the Brambles": "Bewwo-chan~ da songy thowny bb~ 🎶🌿",
  "Birgi, God of Storytelling // Harnfel, Horn of Bounty": "Biwwgi & Hawnfeww~ da spicy stowytime duo~ 🔥📖",
  "Bjorna, Nightfall Alchemist / Wernog, Rider's Chaplain": "B-bjownie & Wewwy-chwann~ da sp00ky potion fwiends~ 🔮🦇",
  "Brago, King Eternal": "Bwaggie-boo~ da ghosty pwincess~ 👻👑",
  "Brallin, Skyshark Rider / Shabraz, the Skyshark": "B-bwawwin & Shabby da uwu sky puppers~ ☁️🦈",
  "Breeches, Brazen Plunderer / Malcolm, Keen-Eyed Navigator": "Bweechie & Mawcwum~ da seawchan fo’ tweeasuww~ 🏴‍☠️💎",
  "Breya, Etherium Shaper": "Bwewya~ da shiny metaww bestie~ 🤖✨",
  "Bright-Palm, Soul Awakener": "B-bwightie-pawmsies~ da gwowing bebi~ 🌟👐",
  "Bristly Bill, Spine Sower": "Bwistwy Biwwy~ da owchie cactussy man~ 🌵💀",
  "Bruse Tarl, Boorish Herder / Kamahl, Heart of Krosa": "B-bwusie & Kammy~ da buff fwends~ 💪🐮",
  "Bruse Tarl, Boorish Herder / Kodama of the East Tree": "B-bwusie & Kodama-senpai~ da natuwe dads~ 🌳🫶",
  "Bruse Tarl, Boorish Herder / Malcolm, Keen-Eyed Navigator": "B-bwusie & Mawwc~ da sea cowboys~ 🌊🤠",
  "Bruse Tarl, Boorish Herder / Thrasios, Triton Hero": "B-bwusie & Thwas-kun~ da muscwy fishy bois~ 🐟💖",
  "Bruvac the Grandiloquent": "Brubie~ da chatty lil scholar 🗣️📚",
  "Burakos, Party Leader / Candlekeep Sage": "Bubby & Candle~ da party masterminds 🎉✨",
  "Captain America, First Avenger": "Cap-Cap~ da hero with da heart 💙🦸‍♂️",
  "Captain Howler, Sea Scourge": "Howlie~ da sea king 🏴‍☠️🌊",
  "Captain N'ghathrod": "N'Gathie~ da spooky captain 🦑💀",
  "Captain Sisay": "Sisay~ da legendary queen 👑💫",
  "Cazur, Ruthless Stalker / Ukkima, Stalking Shadow": "Cazzy & Ukkie~ shadowy hunters 🦇🌑",
  "Cecily, Haunted Mage / Othelm, Sigardian Outcast": "Cecie & Othy~ da spooky wizards 🔮👻",
  "Cecily, Haunted Mage / Sophina, Spearsage Deserter": "Cecie & Soph~ magical misfits 🧙‍♀️💫",
  "Chatterfang, Squirrel General": "Chatter~ da fluffy general 🐿️✨",
  "Chulane, Teller of Tales": "Chulie~ da tale spinner 📖💚",
  "Clavileño, First of the Blessed": "Clavie~ blessed by da stars 🌟💖",
  "Codie, Vociferous Codex": "Codie~ da noisy bookworm 📚🔊",
  "Commodore Guff": "Guffie~ da jolly captain 🚢💖",
  "Cormela, Glamour Thief": "Corme~ da glitzy thief 💋💎",
  "Danny Pink": "Danny~ da cutest pinkie 💗✨",
  "Daretti, Scrap Savant": "Darettie~ da scrap queen 💥🔧",
  "Dargo, the Shipwrecker / Tymna the Weaver": "Dargie & Tym~ shipwreckers & weave queens ⚓🧑‍🎤",
  "Demonlord Belzenlok": "Belzie~ da dark lord, uwu 😈🖤",
  "Derevi, Empyrial Tactician": "Derevi~ da tactical cutie 🎯✨",
  "Dihada, Binder of Wills": "Dihadie~ da will breaker 😏🔮",
  "Dogmeat, Ever Loyal": "Doggie~ da bestest fwiend 🐾💘",
  "Don Andres, the Renegade": "Dony~ da renegade chic 🦹‍♂️🔥",
  "Dr. Madison Li": "Madie~ da genius doc 🧪💡",
  "Edgar Markov": "Edgie~ da vampire king 🦇👑",
  "Edric, Spymaster of Trest": "Edie~ da sneaky spy 🕵️‍♂️✨",
  "Ellivere of the Wild Court": "Ellie~ da wild queen 🦋🌿",
  "Elmar, Ulvenwald Informant / Wernog, Rider's Chaplain": "Elmar & Wernie~ forest info duo 🌲📜",
  "Elsha of the Infinite": "Elshie~ da infinite energy 🌌⚡",
  "Eluge, the Shoreless Sea": "Elgie~ da endless sea babe 🌊💋",
  "Emry, Lurker of the Loch": "Emry~ da loch lurker 🦑💖",
  "Eriette of the Charmed Apple": "Eri~ da charmed apple queen 🍏✨",
  "Erinis, Gloom Stalker / Street Urchin": "Erinie & Urchie~ gloomy street duo 🌑🚶‍♀️",
  "Esika, God of the Tree // The Prismatic Bridge": "Esie~ da tree goddess 🌳✨",
  "Etali, Primal Conqueror // Etali, Primal Sickness": "Etalie~ da primal conqueress 🦖💥",
  "Evelyn, the Covetous": "Evie~ da covetous queen 👑💖",
  "Ezio Auditore da Firenze": "Ezio~ da sneaky assassin 🗡️🖤",
  "Faldorn, Dread Wolf Herald": "Faldie~ da wolfy herald 🐺🖤",
  "Fblthp, the Lost": "Fblthp~ da lil lost nugget 😅💖",
  "Feather, the Redeemed": "Feffie~ da redeemed angel ✨💓",
  "Firkraag, Cunning Instigator": "Firkie~ da fiery trickster 🔥💥",
  "Flubs, the Fool": "Fluffykins, da chaos gremlin 💅💥",
  "Francisco, Fowl Marauder / Ishai, Ojutai Dragonspeaker": "Fwancie & Ishy~ birdy boiis 🦅✨",
  "Francisco, Fowl Marauder / Kraum, Ludevic's Opus": "Franny & K-Kraummie~ mad scientist vibes 🧪💥",
  "Francisco, Fowl Marauder / Malcolm, Keen-Eyed Navigator": "Fwancie & Mal~ treasure snatchers 💎😏",
  "Francisco, Fowl Marauder / Thrasios, Triton Hero": "Fwancie & Thwassy~ ocean cuties 🌊🐟",
  "Francisco, Fowl Marauder / Tymna the Weaver": "Fwancie & Tym-Tym~ web queens 🕸️💖",
  "Freyalise, Llanowar's Fury": "Frey-Frey~ da forest goddess 🌳💫",
  "Frodo, Adventurous Hobbit / Sam, Loyal Attendant": "Frodo & Sammy~ hobbit bffs 💚🌄",
  "Fynn, the Fangbearer": "Fynnie~ fangy hunter 🐺💘",
  "Gaddock Teeg": "Gaddie~ froggy protector 🐸💛",
  "Gale, Waterdeep Prodigy / Scion of Halaster": "Gale & Scion~ magic duo 🔮✨",
  "General Ferrous Rokiric": "Ferwy~ da metal queen ⚔️💋",
  "General Tazri": "Tazzy~ mastermind baddie 💡💖",
  "Ghyrson Starn, Kelermorph": "Ghyrso~ disaster chic ⚡🌪️",
  "Gishath, Sun's Avatar": "Gishy~ dino queen 🦖☀️",
  "Glarb, Calamity's Augur": "Glarb~ chaos cutie 🌪️💋",
  "Godo, Bandit Warlord": "Godo~ treasure thief 💰🦹‍♀️",
  "Gonti, Night Minister": "Gonti~ shadowy mastermind 😈👀",
  "Grenzo, Dungeon Warden": "Grenzy~ dungeon daddy 💀🔐",
  "Grist, the Hunger Tide": "Gwisitie~ hungry swarm 🐍💖",
  "Grolnok, the Omnivore": "Grolny~ snack monster 🍴🦸‍♀️",
  "Gyruda, Doom of Depths": "Gyrudie~ deep sea diva 🐙💀",
  "Halana, Kessig Ranger / Tymna the Weaver": "Halana & Tym-Tym~ forest baddies 🌲✨",
  "Haldan, Avid Arcanist / Pako, Arcane Retriever": "Haldie & Pako~ magical pals 🔮🐶",
  "Hapatra, Vizier of Poisons": "Hapchi~ venom queen 🐍💋",
  "Hashaton, Scarab's Fist": "Hashie~ apocalypse punch 💥👑",
  "Helga, Skittish Seer": "Helgie~ spooky cutie 👻🔮",
  "Heliod, Sun-Crowned": "Helio~ sunshine king ☀️💛",
  "Heliod, the Radiant Dawn // Heliod, the Warped Eclipse": "Helio~ sun & shadow 🌅🌑",
  "Ian Malcolm, Chaotician": "Iannie~ da chaos expert 💥😜",
  "Imoti, Celebrant of Bounty": "Imo~ da harvest queen 🌾💖",
  "Inalla, Archmage Ritualist": "Innie~ da arcane ritual cutie 🔮✨",
  "Iron Man, Titan of Innovation": "Ironie~ tech god 🛠️💡",
  "Ishai, Ojutai Dragonspeaker / Jeska, Thrice Reborn": "Ishie & Jesie~ dragon bffs 🐉💘",
  "Ishai, Ojutai Dragonspeaker / Krark, the Thumbless": "Ishie & Krarkie~ chaos duo 🔮💥",
  "Ishai, Ojutai Dragonspeaker / Rograkh, Son of Rohgahh": "Ishie & Roggie~ dragon flames 🔥🐉",
  "Jacob Hauken, Inspector // Hauken's Insight": "Jake~ da inspector 🕵️‍♂️🔍",
  "Jeska, Thrice Reborn / Tymna the Weaver": "Jesie & Tym-Tym~ reborn weavers 🧵✨",
  "Jhoira, Ageless Innovator": "Jhojo~ da ageless innovator 💡✨",
  "Jhoira, Weatherlight Captain": "Jhojo~ da weather captain ⚓☀️",
  "Johann, Apprentice Sorcerer": "Johny~ da apprentice wizard 🧙‍♂️💫",
  "Jorn, God of Winter // Kaldring, the Rimestaff": "Jornie & Kaldrie~ frosty baddies ❄️🖤",
  "K'rrik, Son of Yawgmoth": "K'rrik~ da dark son 😈💔",
  "K-9, Mark I / The Fourteenth Doctor": "K-9 & 14~ time-travel duo ⏳🐾",
  "Kaalia of the Vast": "Kaalie~ da angelic queen 👼✨",
  "Kambal, Consul of Allocation": "Kambie~ da coin queen 💰👑",
  "Kambal, Profiteering Mayor": "Kambie~ da money maker 💵✨",
  "Kasla, the Broken Halo": "Kasie~ da fallen angel 👼💔",
  "Katilda, Dawnhart Prime": "Katty~ da dawn queen 🌅💖",
  "Kediss, Emberclaw Familiar / Malcolm, Keen-Eyed Navigator": "Keddie & Mal~ fiery explorers 🔥🌍",
  "Kenrith, the Returned King": "Ken~ da returned king 👑💫",
  "Kess, Dissident Mage": "Kessy~ da rebel mage 🧙‍♀️🔥",
  "Ketramose, the New Dawn": "Ketty~ da new beginning 🌄💖",
  "Kibo, Uktabi Prince": "Kibbie~ da jungle prince 🐒💚",
  "Kinnan, Bonder Prodigy": "Kinnnie~ da prodigy cutie 🧠💡",
  "Kodama of the East Tree / Tymna the Weaver": "Kodama & Tym~ nature weavers 🌳🧵",
  "Kona, Rescue Beastie": "Kona~ da rescue pupper 🐕💖",
  "Korvold, Fae-Cursed King": "Korvie~ da cursed king 👑💔",
  "Kotori, Pilot Prodigy": "Kotty~ da flying prodigy ✈️💫",
  "Kozilek, the Great Distortion": "Kozzy~ da great glitch 🌀💀",
  "Krark, the Thumbless / Sakashima of a Thousand Faces": "Krarkie & Saki~ chaotic twins 🌪️💥",
  "Krark, the Thumbless / Sidar Kondo of Jamuraa": "Krarkie & Sidie~ da thumbless bros ✨🔥",
  "Krark, the Thumbless / Silas Renn, Seeker Adept": "Krarkie & Silas~ seeker duo 🕵️‍♂️✨",
  "Krark, the Thumbless / Thrasios, Triton Hero": "Krarkie & Thrasie~ chaotic triton pals 🐟💥",
  "Krark, the Thumbless / Tymna the Weaver": "Krarkie & Tym-Tym~ chaotic weavers 🧵💣",
  "Kraum, Ludevic's Opus / Tevesh Szat, Doom of Fools": "Kraumie & Tev-Tev~ doom duo 💀🔥",
  "Kraum, Ludevic's Opus / Tymna the Weaver": "Kraumie & Tym~ opus & weaver 💥✨",
  "Krenko, Mob Boss": "Krenkie~ da mob boss 👑💣",
  "Kroxa, Titan of Death's Hunger": "Kroxy~ da titan of hunger 🦖🍖",
  "Kydele, Chosen of Kruphix / Tymna the Weaver": "Kydie & Tym-Tym~ chosen weavers 🌿✨",
  "Kykar, Wind's Fury": "Kykie~ da wind fury 🌪️💙",
  "Lavinia, Azorius Renegade": "Lavi~ da renegade queen 👑💙",
  "Livio, Oathsworn Sentinel / Thrasios, Triton Hero": "Livie & Thrasie~ oath & triton duo 🐟💎",
  "Lonis, Genetics Expert": "Lonnie~ da genetics queen 🧬💖",
  "Loot, the Pathfinder": "Lootie~ da adventurer 🍂🗺️",
  "Lumra, Bellow of the Woods": "Lumy~ da forest bellow 🌲✨",
  "Maelstrom Wanderer": "Maely~ da storm wanderer 🌪️💨",
  "Magda, Brazen Outlaw": "Magie~ da outlaw queen 💋🔥",
  "Malcolm, Keen-Eyed Navigator / Tana, the Bloodsower": "Mal & Tana~ da sailing blood duo ⛵💖",
  "Malcolm, Keen-Eyed Navigator / Tevesh Szat, Doom of Fools": "Mal & Tev-Tev~ doom & navigation ⚓💥",
  "Malcolm, Keen-Eyed Navigator / Tymna the Weaver": "Mal & Tym~ keen weavers 💫🧵",
  "Malcolm, Keen-Eyed Navigator / Vial Smasher the Fierce": "Mal & Vial~ smasher duo 💥⚔️",
  "Malik, Grim Manipulator": "Malie~ da grim manipulator 💀🎮",
  "Marath, Will of the Wild": "Marathie~ da wild will 🌿💚",
  "Marchesa, Dealer of Death": "Marchie~ da death dealer 💀✨",
  "Marina Vendrell": "Marinie~ da water queen 🌊💖",
  "Marneus Calgar": "Marney~ da big boss 💥👑",
  "Marwyn, the Nurturer": "Marwy~ da nurturing fairy 🌱💞",
  "Melira, Sylvok Outcast": "Melie~ da outcast cutie 🌿💔",
  "Meren of Clan Nel Toth": "Merenie~ da clan queen 🏰💚",
  "Meria, Scholar of Antiquity": "Merie~ da ancient scholar 📜✨",
  "Miara, Thorn of the Glade / Thrasios, Triton Hero": "Miara & Thrasie~ thorny triton duo 🌿🐟",
  "Minsc, Beloved Ranger": "Minsie~ da ranger love 💚🏹",
  "Mirko, Obsessive Theorist": "Mirky~ da theory nerd 🤓🔍",
  "Mizzix of the Izmagnus": "Mizziex~ da magic mastermind 🧙‍♂️💥",
  "Mogis, God of Slaughter": "Moggie~ da blood god 💔🔪",
  "Morska, Undersea Sleuth": "Morsie~ da deep sea detective 🕵️‍♀️🐙",
  "Najeela, the Blade-Blossom": "Najeelie~ da blade cutie 💐⚔️",
  "Nardole, Resourceful Cyborg / The Fourteenth Doctor": "Nardie & 14~ time-traveling bffs 🕰️🤖",
  "Narset, Enlightened Exile": "Narsie~ da enlightened queen 🌸💡",
  "Narset, Enlightened Master": "Narsie~ da master of wisdom 📚✨",
  "Nezahal, Primal Tide": "Nezzy~ da primal wave 🌊💙",
  "Niv-Mizzet, Parun": "Nivie~ da dragon parun 🐉🔥",
  "Niv-Mizzet, Visionary": "Nivie~ da vision dragon 👀💡",
  "Nymris, Oona's Trickster": "Nymmie~ da trickster fairy ✨🧚‍♀️",
  "Ob Nixilis, Captive Kingpin": "Obie~ da captive kingpin 👑🖤",
  "Ojer Axonil, Deepest Might // Temple of Power": "Ojer & Temple~ might & power duo 💪✨",
  "Ojer Kaslem, Deepest Growth // Temple of Cultivation": "Ojer & Temple~ growth & garden 🪴💚",
  "Old Stickfingers": "Oldie~ da creepy finger dude 👋💀",
  "Oloro, Ageless Ascetic": "Oloro~ da ageless monk 🧘‍♂️✨",
  "Omnath, Locus of Creation": "Omnie~ da creation queen 🌍✨",
  "Orvar, the All-Form": "Orvie~ da shapeshifter 💫💜",
  "Osgir, the Reconstructor": "Osgie~ da rework king 🔧👑",
  "Oskar, Rubbish Reclaimer": "Oskie~ da trash queen 🗑️💖",
  "Oswald Fiddlebender": "Osie~ da fiddle wizard 🎻✨",
  "Othelm, Sigardian Outcast / Wernog, Rider's Chaplain": "Othie & Wernie~ outcast adventurers 🏞️🛡️",
  "Phenax, God of Deception": "Phenie~ da deceiver god 🦹‍♂️💫",
  "Pir, Imaginative Rascal / Toothy, Imaginary Friend": "Pir & Toothie~ rascal & bestie 👯‍♀️💖",
  "Plagon, Lord of the Beach": "Plaggie~ da beach boss 🏖️👑",
  "Prosper, Tome-Bound": "Prospe~ da book queen 📖💫",
  "Queza, Augur of Agonies": "Quezie~ da agony augur 😣✨",
  "Raffine, Scheming Seer": "Raffie~ da schemy seer 🔮✨",
  "Raggadragga, Goreguts Boss": "Raggie~ da gore boss 💀🔥",
  "Rakdos, Lord of Riots": "Rakkie~ da riot lord 🔥💀",
  "Rakdos, the Muscle": "Rakkie~ da muscly boss 💪🔥",
  "Ral, Monsoon Mage // Ral, Leyline Prodigy": "Ral & Ral~ da storm & leyline duo 🌩️💥",
  "Ratadrabik of Urborg": "Rata~ da spooky lord 👀🖤",
  "Redshift, Rocketeer Chief": "Redie~ da rocket chief 🚀🔥",
  "Reyhan, Last of the Abzan / Tymna the Weaver": "Reyhan & Tym-Tym~ da abzan duo 🌿💖",
  "Rhys the Redeemed": "Rhysie~ da redeemed queen ✨💚",
  "Rocco, Cabaretti Caterer": "Roccie~ da cabaret cutie 🎉🍽️",
  "Rodolf Duskbringer": "Rodie~ da dusk prince 🌙🔥",
  "Rograkh, Son of Rohgahh / Silas Renn, Seeker Adept": "Rograkh & Silie~ da chaotic duo 🧩💥✨",
  "Rograkh, Son of Rohgahh / Thrasios, Triton Hero": "Rograkh & Thrasie~ da hero bros with a splash 💦💥",
  "Rograkh, Son of Rohgahh / Tymna the Weaver": "Rograkh & Tym~ tiny but mighty tag team 🐉🧵",
  "Rona, Herald of Invasion // Rona, Tolarian Obliterator": "Ronie~ da invasion queen 🌪️💀",
  "Rose Tyler / The Tenth Doctor": "Rosie & Ten~ time-travel bffs 🕰️💖",
  "Rosheen Meanderer": "Roshie~ da wandering queen 🌟💫",
  "Rowan, Scion of War": "Rowie~ da war princess ⚔️👑",
  "Roxanne, Starfall Savant": "Roxie~ da star queen ✨🌠",
  "Ruric Thar, the Unbowed": "Rurie~ da unbowed king 👑💥",
  "Saffi Eriksdotter": "Saffie~ da nature queen 🌿💖",
  "Saheeli, Radiant Creator": "Saheelie~ da radiant creator ✨🛠️",
  "Sarah Jane Smith / The Sixth Doctor": "Sarry & Sixie~ time duo 🕰️💙",
  "Saruman, the White Hand": "Sarie~ da white wizard ✨🧙‍♂️",
  "Satya, Aetherflux Genius": "Satie~ da genius queen 💡✨",
  "Sauron, Lord of the Rings": "Saurie~ da dark lord 🔥👑",
  "Sauron, the Dark Lord": "Sauron~ dark lord vibes~ 💖🖤",
  "Scion of the Ur-Dragon": "Scion~ draconic cutie 🐉✨",
  "Sefris of the Hidden Ways": "Sefris~ sneaky spooky ghost 👻💖",
  "Selenia, Dark Angel": "Selenia~ dark angel uwu 🖤🕊️",
  "Selvala, Explorer Returned": "Selvala~ wild wanderer 🌿💫",
  "Selvala, Heart of the Wilds": "Selvala~ heart of the wild 🦋🌲",
  "Sen Triplets": "Sen~ triplet chaos 💫🌀",
  "Shalai and Hallar": "Shalai & Hallar~ nature duo 🌿💥",
  "Shorikai, Genesis Engine": "Shorikai~ cosmic creator 💖🌌",
  "Sidar Kondo of Jamuraa / Tevesh Szat, Doom of Fools": "Sidar & Tevesh~ trickster duo 🎭💥",
  "Sisay, Weatherlight Captain": "Sisay~ adventurer captain 🌟⚓",
  "Slicer, Hired Muscle // Slicer, High-Speed Antagonist": "Slicer~ zoom zoom 💨💖",
  "Slimefoot and Squee": "Slimefoot & Squee~ squishy buddies 💚🧸",
  "Sliver Gravemother": "Sliver~ gravemommy 💀💖",
  "Sliver Overlord": "Sliver~ master of chaos 🌀👑",
  "Stella Lee, Wild Card": "Stella~ wildcard babe 💖🎲",
  "Storm, Force of Nature": "Storm~ nature's wrath 🌩️✨",
  "Sythis, Harvest's Hand": "Sythis~ harvest angel 💚🍃",
  "Talion, the Kindly Lord": "Talion~ sweet lord vibes 👑💖",
  "Tameshi, Reality Architect": "Tameshi~ reality bender 🛠️💫",
  "Tamiyo, Inquisitive Student // Tamiyo, Seasoned Scholar": "Tamiyo~ curious scholar 🧠💖",
  "Tana, the Bloodsower / Tymna the Weaver": "Tana & Tymna~ blood & magic ✨🩸",
  "Tasigur, the Golden Fang": "Tasigur~ golden cutie 🐾✨",
  "Tatyova, Benthic Druid": "Tatyova~ ocean's druid 🌊💖",
  "Tayam, Luminous Enigma": "Tayam~ shining mystery 🌟🧩",
  "Teferi, Temporal Archmage": "Teferi~ time lord 💖⌛",
  "Tegwyll, Duke of Splendor": "Tegwyll~ duke of elegance 👑✨",
  "Temmet, Naktamun's Will": "Temmet~ will of the sands 🌞💖",
  "Teshar, Ancestor's Apostle": "Teshar~ ancestor’s child 🌿💫",
  "Tevesh Szat, Doom of Fools / Thrasios, Triton Hero": "Tevesh & Thrasios~ doom duo 💥🧜‍♂️",
  "Thalia and The Gitrog Monster": "Thalia & Gitrog~ monster and muse 🌿🖤",
  "The First Sliver": "Sliver~ the first, the best~ 🐉✨",
  "The Gitrog Monster": "Gitrog~ slime monster vibes 💚🐸",
  "The Gitrog, Ravenous Ride": "Gitrog~ ravenous ride 🐸💨",
  "The Howling Abomination": "Howling~ spooky abomination 👹💖",
  "The Master of Keys": "Master~ keykeeper~ 🗝️✨",
  "The Master, Transcendent": "Master~ transcendent babe 💫💖",
  "The Mimeoplasm": "Mimeoplasm~ creepy goo~ 👾🖤",
  "The Necrobloom": "Necrobloom~ dark flower vibes 🌸💀",
  "The Reality Chip": "Reality~ chip~ hack the world 🌌💻",
  "The Swarmlord": "Swarmlord~ creepy bug king 🐜👑",
  "The Wise Mothman": "Mothman~ wise vibes~ 🦋✨",
  "Thrasios, Triton Hero / Tymna the Weaver": "Thrasios & Tymna~ sea & magic duo 🌊✨",
  "Thrasios, Triton Hero / Vial Smasher the Fierce": "Thrasios & Vial~ splash & smash 💥💖",
  "Thrasios, Triton Hero / Yoshimaru, Ever Faithful": "Thrasios & Yoshimaru~ faith & splash 🐾💖",
  "Tiamat": "Tiamat~ dragon queen vibes 🐉👑",
  "Tivit, Seller of Secrets": "Tivit~ secret seller 🗝️✨",
  "Toshiro Umezawa": "Toshiro~ skilled duelist 💖🗡️",
  "Toxrill, the Corrosive": "Toxrill~ slimy acid monster 🐍💚",
  "Trazyn the Infinite": "Trazyn~ eternal collector 💀🖤",
  "Tuvasa the Sunlit": "Tuvasa~ sunlit diva 🌞✨",
  "Unknown Commander": "Unknown~ mystery~ 🔍✨",
  "Urza, Chief Artificer": "Urza~ chief techie 🛠️💖",
  "Urza, Lord High Artificer": "Urza~ artificer lord 🔧👑",
  "Valgavoth, Harrower of Souls": "Valgavoth~ soul harvester 💀✨",
  "Veyran, Voice of Duality": "Veyran~ duality magic ✨🌀",
  "Volo, Guide to Monsters": "Volo~ monster guide~ 🐉💖",
  "Vorinclex // The Grand Evolution": "Vorinclex~ evo chaos 🦖💫",
  "Vren, the Relentless": "Vren~ relentless rush~ ⚡💖",
  "Winota, Joiner of Forces": "Winota~ force joiner~ 💥✨",
  "Winter, Cynical Opportunist": "Winter~ cynic with style ❄️🖤",
  "Xyris, the Writhing Storm": "Xyris~ stormy cutie 🌩️💖",
  "Yasharn, Implacable Earth": "Yasharn~ earth's protector 🌍💚",
  "Yawgmoth, Thran Physician": "Yawgmoth~ dark doctor~ 🖤💉",
  "Yeva, Nature's Herald": "Yeva~ nature's call~ 🌿✨",
  "Yidris, Maelstrom Wielder": "Yidris~ maelstrom baby 💨💖",
  "Yuriko, the Tiger's Shadow": "Yuriko~ stealthy ninja 🐅🌑",
  "Yusri, Fortune's Flame": "Yusri~ lucky fire babe 🔥🍀",
  "Zacama, Primal Calamity": "Zacama~ primal force~ 🌪️🐍",
  "Zedruu the Greathearted": "Zedruu~ heart of gold 💖✨",
  "Zhulodok, Void Gorger": "Zhulodok~ void monster 💀🌌",
  "Zimone, Mystery Unraveler": "Zimone~ mystery solver 💫🔍",
  "Zimone, Paradox Sculptor": "Zimone~ paradox creator 🌀✨",
  "Zinnia, Valley's Voice": "Zinnia~ valley's song~ 🌄🎶",
  "Zirda, the Dawnwaker": "Zirda~ dawnbringer 🌅💫",
  "Zur the Enchanter": "Zur~ enchanting charm ✨💖",
  "Zurgo and Ojutai": "Zurgo & Ojutai~ chaotic duo 🦋🔥",
  "Éowyn, Shieldmaiden": "Éowyn~ shieldmaid~ 💖⚔️"
}
