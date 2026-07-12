import { TaggedItem } from '../types/types'
import {
  NAME, TITLE, DOMAIN, SYLLABLE_PRE, SYLLABLE_MID, SYLLABLE_SUF,
  ADJECTIVE, DEITY_MALE, DEITY_FEMALE,
  DEITY_GOOD, DEITY_EVIL, DEITY_NEUTRAL,
  DEITY_SILLY, DEITY_NASTY
} from './tags'

export const d_name_male: TaggedItem[] = [
  ["Abercrombie", [NAME, DEITY_MALE], 1], ["Aldus",       [NAME, DEITY_MALE], 1],
  ["Alfred",      [NAME, DEITY_MALE], 2], ["Algernon",    [NAME, DEITY_MALE], 1],
  ["Alistair",    [NAME, DEITY_MALE], 1], ["Alphonse",    [NAME, DEITY_MALE], 1],
  ["Ambrose",     [NAME, DEITY_MALE], 2], ["Archibald",   [NAME, DEITY_MALE], 1],
  ["Bartholomew", [NAME, DEITY_MALE], 1], ["Basil",       [NAME, DEITY_MALE], 2],
  ["Baxter",      [NAME, DEITY_MALE], 1], ["Benedict",    [NAME, DEITY_MALE], 2],
  ["Bigby",       [NAME, DEITY_MALE], 1], ["Boniface",    [NAME, DEITY_MALE], 1],
  ["Burne",       [NAME, DEITY_MALE], 1], ["Chester",     [NAME, DEITY_MALE], 2],
  ["Cornelius",   [NAME, DEITY_MALE], 1], ["Cyrus",       [NAME, DEITY_MALE], 2],
  ["Eldridge",    [NAME, DEITY_MALE], 1], ["Elijah",      [NAME, DEITY_MALE], 2],
  ["Elmer",       [NAME, DEITY_MALE], 1], ["Elmo",        [NAME, DEITY_MALE], 1],
  ["Ernest",      [NAME, DEITY_MALE], 2], ["Ethelbert",   [NAME, DEITY_MALE], 1],
  ["Ethelred",    [NAME, DEITY_MALE], 1], ["Esher",       [NAME, DEITY_MALE], 1],
  ["Felix",       [NAME, DEITY_MALE], 2], ["Ferdinand",   [NAME, DEITY_MALE], 1],
  ["Fergus",      [NAME, DEITY_MALE], 2], ["Festus",      [NAME, DEITY_MALE], 1],
  ["Finn",        [NAME, DEITY_MALE], 3], ["Florian",     [NAME, DEITY_MALE], 1],
  ["Floyd",       [NAME, DEITY_MALE], 1], ["Franklin",    [NAME, DEITY_MALE], 2],
  ["Fritz",       [NAME, DEITY_MALE], 1], ["Geoffrey",    [NAME, DEITY_MALE], 2],
  ["Gilbert",     [NAME, DEITY_MALE], 2], ["Godfrey",     [NAME, DEITY_MALE], 1],
  ["Graham",      [NAME, DEITY_MALE], 2], ["Grunwald",    [NAME, DEITY_MALE], 1],
  ["Gustav",      [NAME, DEITY_MALE], 1], ["Hector",      [NAME, DEITY_MALE], 2],
  ["Hieronymous", [NAME, DEITY_MALE], 1], ["Horace",      [NAME, DEITY_MALE], 2],
  ["Hubert",      [NAME, DEITY_MALE], 1], ["Humphrey",    [NAME, DEITY_MALE], 1],
  ["Ian",         [NAME, DEITY_MALE], 3], ["Ichabod",     [NAME, DEITY_MALE], 1],
  ["Ignatius",    [NAME, DEITY_MALE], 1], ["Igor",        [NAME, DEITY_MALE], 2],
  ["Isaac",       [NAME, DEITY_MALE], 2], ["Jarvis",      [NAME, DEITY_MALE], 1],
  ["Jeremiah",    [NAME, DEITY_MALE], 2], ["Jethro",      [NAME, DEITY_MALE], 1],
  ["Kermit",      [NAME, DEITY_MALE], 1], ["Lazlo",       [NAME, DEITY_MALE], 1],
  ["Leonard",     [NAME, DEITY_MALE], 2], ["Lester",      [NAME, DEITY_MALE], 1],
  ["Linus",       [NAME, DEITY_MALE], 1], ["Lorenzo",     [NAME, DEITY_MALE], 2],
  ["Ludwig",      [NAME, DEITY_MALE], 1], ["Luther",      [NAME, DEITY_MALE], 2],
  ["Maxwell",     [NAME, DEITY_MALE], 2], ["Melvin",      [NAME, DEITY_MALE], 1],
  ["Millard",     [NAME, DEITY_MALE], 1], ["Milo",        [NAME, DEITY_MALE], 2],
  ["Milton",      [NAME, DEITY_MALE], 1], ["Mortimer",    [NAME, DEITY_MALE], 1],
  ["Murphy",      [NAME, DEITY_MALE], 2], ["Murray",      [NAME, DEITY_MALE], 1],
  ["Ned",         [NAME, DEITY_MALE], 2], ["Obediah",     [NAME, DEITY_MALE], 1],
  ["Oliver",      [NAME, DEITY_MALE], 2], ["Orson",       [NAME, DEITY_MALE], 1],
  ["Oscar",       [NAME, DEITY_MALE], 2], ["Oswald",      [NAME, DEITY_MALE], 1],
  ["Otis",        [NAME, DEITY_MALE], 1], ["Otto",        [NAME, DEITY_MALE], 2],
  ["Owen",        [NAME, DEITY_MALE], 2], ["Pedro",       [NAME, DEITY_MALE], 2],
  ["Percival",    [NAME, DEITY_MALE], 1], ["Phineas",     [NAME, DEITY_MALE], 1],
  ["Roscoe",      [NAME, DEITY_MALE], 1], ["Rufus",       [NAME, DEITY_MALE], 1],
  ["Seth",        [NAME, DEITY_MALE], 2], ["Seymour",     [NAME, DEITY_MALE], 1],
  ["Silas",       [NAME, DEITY_MALE], 2], ["Stuart",      [NAME, DEITY_MALE], 2],
  ["Thadeus",     [NAME, DEITY_MALE], 1], ["Theobald",    [NAME, DEITY_MALE], 1],
  ["Tilman",      [NAME, DEITY_MALE], 1], ["Timothy",     [NAME, DEITY_MALE], 2],
  ["Uriah",       [NAME, DEITY_MALE], 1], ["Vern",        [NAME, DEITY_MALE], 1],
  ["Vlad",        [NAME, DEITY_MALE], 2], ["Waldo",       [NAME, DEITY_MALE], 1],
  ["Wilbur",      [NAME, DEITY_MALE], 1], ["Zachary",     [NAME, DEITY_MALE], 2],
  ["Horatio",     [NAME, DEITY_MALE], 1], ["Alger",       [NAME, DEITY_MALE], 1],
  ["Thurman",     [NAME, DEITY_MALE], 1], ["Ebenezer",    [NAME, DEITY_MALE], 1],
  ["Sigmund",     [NAME, DEITY_MALE], 1], ["Simon",       [NAME, DEITY_MALE], 2],
  ["Jasper",      [NAME, DEITY_MALE], 2], ["Falstaff",    [NAME, DEITY_MALE], 1],
  ["Griswald",    [NAME, DEITY_MALE], 1], ["Winston",     [NAME, DEITY_MALE], 2],
  ["Chauncy",     [NAME, DEITY_MALE], 1],
]

export const d_name_female: TaggedItem[] = [
  ["Abigail",   [NAME, DEITY_FEMALE], 2], ["Agatha",    [NAME, DEITY_FEMALE], 2],
  ["Althea",    [NAME, DEITY_FEMALE], 1], ["Beatrice",  [NAME, DEITY_FEMALE], 2],
  ["Beatrix",   [NAME, DEITY_FEMALE], 1], ["Bertha",    [NAME, DEITY_FEMALE], 2],
  ["Daisy",     [NAME, DEITY_FEMALE], 3], ["Edna",      [NAME, DEITY_FEMALE], 2],
  ["Elvira",    [NAME, DEITY_FEMALE], 2], ["Ethel",     [NAME, DEITY_FEMALE], 2],
  ["Flora",     [NAME, DEITY_FEMALE], 2], ["Freda",     [NAME, DEITY_FEMALE], 1],
  ["Greta",     [NAME, DEITY_FEMALE], 2], ["Gretchen",  [NAME, DEITY_FEMALE], 1],
  ["Gertrude",  [NAME, DEITY_FEMALE], 2], ["Harriet",   [NAME, DEITY_FEMALE], 2],
  ["Hazel",     [NAME, DEITY_FEMALE], 2], ["Henrietta", [NAME, DEITY_FEMALE], 1],
  ["Hester",    [NAME, DEITY_FEMALE], 1], ["Hortense",  [NAME, DEITY_FEMALE], 1],
  ["Irma",      [NAME, DEITY_FEMALE], 1], ["Martha",    [NAME, DEITY_FEMALE], 2],
  ["Matilda",   [NAME, DEITY_FEMALE], 2], ["Mildred",   [NAME, DEITY_FEMALE], 2],
  ["Millicent", [NAME, DEITY_FEMALE], 1], ["Minerva",   [NAME, DEITY_FEMALE], 2],
  ["Miranda",   [NAME, DEITY_FEMALE], 2], ["Morgan",    [NAME, DEITY_FEMALE], 2],
  ["Myrna",     [NAME, DEITY_FEMALE], 1], ["Myrtle",    [NAME, DEITY_FEMALE], 1],
  ["Octavia",   [NAME, DEITY_FEMALE], 1], ["Olive",     [NAME, DEITY_FEMALE], 2],
  ["Penelope",  [NAME, DEITY_FEMALE], 2], ["Petunia",   [NAME, DEITY_FEMALE], 1],
  ["Prudence",  [NAME, DEITY_FEMALE], 2], ["Rosemary",  [NAME, DEITY_FEMALE], 2],
  ["Ruby",      [NAME, DEITY_FEMALE], 3], ["Stella",    [NAME, DEITY_FEMALE], 2],
  ["Teresa",    [NAME, DEITY_FEMALE], 2], ["Theodora",  [NAME, DEITY_FEMALE], 1],
  ["Violet",    [NAME, DEITY_FEMALE], 2], ["Vivian",    [NAME, DEITY_FEMALE], 2],
  ["Wednesday", [NAME, DEITY_FEMALE], 1], ["Winnifred", [NAME, DEITY_FEMALE], 1],
  ["Zelda",     [NAME, DEITY_FEMALE], 2], ["Zoe",       [NAME, DEITY_FEMALE], 2],
]

export const d_surname_good: TaggedItem[] = [
  ["Awesome",   [ADJECTIVE, DEITY_GOOD], 2],
  ["Beautiful", [ADJECTIVE, DEITY_GOOD], 2],
  ["Cool",      [ADJECTIVE, DEITY_GOOD], 2],
]

export const d_surname_evil: TaggedItem[] = [
  ["Angry",  [ADJECTIVE, DEITY_EVIL], 2],
  ["Bad",    [ADJECTIVE, DEITY_EVIL], 3],
  ["Cranky", [ADJECTIVE, DEITY_EVIL], 2],
]

export const d_surname_neutral: TaggedItem[] = [
  ["Apathetic", [ADJECTIVE, DEITY_NEUTRAL], 1],
  ["Boring",    [ADJECTIVE, DEITY_NEUTRAL], 2],
  ["Cold",      [ADJECTIVE, DEITY_NEUTRAL], 2],
]

export const d_surname_male: TaggedItem[] = [
  ["Awesome",   [ADJECTIVE, DEITY_MALE, DEITY_GOOD], 2],
  ["Beautiful", [ADJECTIVE, DEITY_MALE, DEITY_GOOD], 2],
  ["Cool",      [ADJECTIVE, DEITY_MALE, DEITY_NEUTRAL], 2],
]

export const d_surname_female: TaggedItem[] = [
  ["Awesome",   [ADJECTIVE, DEITY_FEMALE, DEITY_GOOD], 2],
  ["Beautiful", [ADJECTIVE, DEITY_FEMALE, DEITY_GOOD], 2],
  ["Cool",      [ADJECTIVE, DEITY_FEMALE, DEITY_NEUTRAL], 2],
]

export const d_silly: TaggedItem[] = [
  ["Beard",   [DEITY_SILLY], 2], ["Biscuit",  [DEITY_SILLY], 2],
  ["Bobble",  [DEITY_SILLY], 1], ["Bottom",   [DEITY_SILLY], 2],
  ["Brew",    [DEITY_SILLY], 2], ["Bucket",   [DEITY_SILLY], 2],
  ["Button",  [DEITY_SILLY], 2], ["Clump",    [DEITY_SILLY], 1],
  ["Crumble", [DEITY_SILLY], 2], ["Doodle",   [DEITY_SILLY], 2],
  ["Fidget",  [DEITY_SILLY], 2], ["Finger",   [DEITY_SILLY], 2],
  ["Fluff",   [DEITY_SILLY], 2], ["Foot",     [DEITY_SILLY], 2],
  ["Fork",    [DEITY_SILLY], 1], ["Freckle",  [DEITY_SILLY], 1],
  ["Funnel",  [DEITY_SILLY], 1], ["Gizzard",  [DEITY_SILLY], 1],
  ["Glob",    [DEITY_SILLY], 1], ["Glum",     [DEITY_SILLY], 2],
  ["Gobble",  [DEITY_SILLY], 2], ["Google",   [DEITY_SILLY], 1],
  ["Grizzle", [DEITY_SILLY], 1], ["Grumble",  [DEITY_SILLY], 2],
  ["Guzzle",  [DEITY_SILLY], 1], ["Hobble",   [DEITY_SILLY], 1],
  ["Ladle",   [DEITY_SILLY], 1], ["Loaf",     [DEITY_SILLY], 2],
  ["Lump",    [DEITY_SILLY], 2], ["Muffin",   [DEITY_SILLY], 2],
  ["Nose",    [DEITY_SILLY], 3], ["Nozzle",   [DEITY_SILLY], 1],
  ["Pants",   [DEITY_SILLY], 2], ["Piddle",   [DEITY_SILLY], 1],
  ["Plug",    [DEITY_SILLY], 1], ["Pocket",   [DEITY_SILLY], 2],
  ["Prickle", [DEITY_SILLY], 1], ["Prong",    [DEITY_SILLY], 1],
  ["Puddle",  [DEITY_SILLY], 2], ["Puppet",   [DEITY_SILLY], 1],
  ["Sock",    [DEITY_SILLY], 2], ["Spackle",  [DEITY_SILLY], 1],
  ["Speckle", [DEITY_SILLY], 1], ["Spigot",   [DEITY_SILLY], 1],
  ["Spoon",   [DEITY_SILLY], 2], ["Stubble",  [DEITY_SILLY], 1],
  ["Stumble", [DEITY_SILLY], 2], ["Tickle",   [DEITY_SILLY], 2],
  ["Toes",    [DEITY_SILLY], 2], ["Tooth",    [DEITY_SILLY], 2],
  ["Trouser", [DEITY_SILLY], 1], ["Wart",     [DEITY_SILLY], 2],
  ["Water",   [DEITY_SILLY], 2], ["Weasel",   [DEITY_SILLY], 2],
  ["Weevil",  [DEITY_SILLY], 1], ["Whisker",  [DEITY_SILLY], 2],
  ["Widget",  [DEITY_SILLY], 1], ["Wood",     [DEITY_SILLY], 2],
  ["Worth",   [DEITY_SILLY], 1], ["Long",     [DEITY_SILLY], 2],
  ["Scurvy",  [DEITY_SILLY], 1], ["Scruffy",  [DEITY_SILLY], 2],
  ["Knees",   [DEITY_SILLY], 2], ["Ears",     [DEITY_SILLY], 2],
  ["Trousers",[DEITY_SILLY], 1],
]

export const d_nasty: TaggedItem[] = [
  ["Ash",    [DEITY_NASTY, DEITY_EVIL], 2], ["Axe",    [DEITY_NASTY, DEITY_EVIL], 2],
  ["Bane",   [DEITY_NASTY, DEITY_EVIL], 3], ["Beast",  [DEITY_NASTY, DEITY_EVIL], 2],
  ["Beetle", [DEITY_NASTY, DEITY_EVIL], 1], ["Bile",   [DEITY_NASTY, DEITY_EVIL], 2],
  ["Bite",   [DEITY_NASTY, DEITY_EVIL], 2], ["Black",  [DEITY_NASTY, DEITY_EVIL], 3],
  ["Blade",  [DEITY_NASTY, DEITY_EVIL], 2], ["Blight", [DEITY_NASTY, DEITY_EVIL], 2],
  ["Blood",  [DEITY_NASTY, DEITY_EVIL], 3], ["Bone",   [DEITY_NASTY, DEITY_EVIL], 3],
  ["Chaos",  [DEITY_NASTY, DEITY_EVIL], 2], ["Claw",   [DEITY_NASTY, DEITY_EVIL], 2],
  ["Death",  [DEITY_NASTY, DEITY_EVIL], 3], ["Doom",   [DEITY_NASTY, DEITY_EVIL], 3],
  ["Dread",  [DEITY_NASTY, DEITY_EVIL], 3], ["Fang",   [DEITY_NASTY, DEITY_EVIL], 2],
  ["Filth",  [DEITY_NASTY, DEITY_EVIL], 2], ["Fire",   [DEITY_NASTY, DEITY_EVIL], 2],
  ["Fury",   [DEITY_NASTY, DEITY_EVIL], 2], ["Gloom",  [DEITY_NASTY, DEITY_EVIL], 2],
  ["Gore",   [DEITY_NASTY, DEITY_EVIL], 2], ["Grim",   [DEITY_NASTY, DEITY_EVIL], 3],
  ["Gut",    [DEITY_NASTY, DEITY_EVIL], 2], ["Hate",   [DEITY_NASTY, DEITY_EVIL], 3],
  ["Lust",   [DEITY_NASTY, DEITY_EVIL], 2], ["Maim",   [DEITY_NASTY, DEITY_EVIL], 1],
  ["Maw",    [DEITY_NASTY, DEITY_EVIL], 2], ["Plague", [DEITY_NASTY, DEITY_EVIL], 2],
  ["Poison", [DEITY_NASTY, DEITY_EVIL], 2], ["Pox",    [DEITY_NASTY, DEITY_EVIL], 1],
  ["Rot",    [DEITY_NASTY, DEITY_EVIL], 2], ["Shadow", [DEITY_NASTY, DEITY_EVIL], 3],
  ["Skull",  [DEITY_NASTY, DEITY_EVIL], 2], ["Slash",  [DEITY_NASTY, DEITY_EVIL], 2],
  ["Slime",  [DEITY_NASTY, DEITY_EVIL], 2], ["Soul",   [DEITY_NASTY, DEITY_EVIL], 2],
  ["Spite",  [DEITY_NASTY, DEITY_EVIL], 2], ["Thorn",  [DEITY_NASTY, DEITY_EVIL], 2],
  ["Venom",  [DEITY_NASTY, DEITY_EVIL], 2], ["Vile",   [DEITY_NASTY, DEITY_EVIL], 2],
  ["Vomit",  [DEITY_NASTY, DEITY_EVIL], 1], ["Wrath",  [DEITY_NASTY, DEITY_EVIL], 3],
  ["Wound",  [DEITY_NASTY, DEITY_EVIL], 2], ["Wraith", [DEITY_NASTY, DEITY_EVIL], 2],
]

export const d_title_prefix_good: TaggedItem[] = [
  ["Sublime",   [TITLE, DEITY_GOOD], 2],
  ["Exalted",   [TITLE, DEITY_GOOD], 2],
  ["Celestial", [TITLE, DEITY_GOOD], 2],
]

export const d_title_prefix_evil: TaggedItem[] = [
  ["Dread", [TITLE, DEITY_EVIL], 3],
  ["Vile",  [TITLE, DEITY_EVIL], 2],
  ["Grim",  [TITLE, DEITY_EVIL], 2],
]

export const d_title_prefix_neutral: TaggedItem[] = [
  ["Mighty",         [TITLE, DEITY_NEUTRAL], 3],
  ["Unvanquishable", [TITLE, DEITY_NEUTRAL], 1],
  ["Bellicose",      [TITLE, DEITY_NEUTRAL], 1],
]

export const d_title_good: TaggedItem[] = [
  ["Warden",    [TITLE, DEITY_GOOD], 2],
  ["Protector", [TITLE, DEITY_GOOD], 2],
]

export const d_title_evil: TaggedItem[] = [
  ["Fiend", [TITLE, DEITY_EVIL], 3],
]

export const d_title_neutral: TaggedItem[] = [
  ["Overseer", [TITLE, DEITY_NEUTRAL], 2],
]

export const d_title_male: TaggedItem[] = [
  ["King", [TITLE, DEITY_MALE], 2],
  ["Lord", [TITLE, DEITY_MALE], 3],
  ["God",  [TITLE, DEITY_MALE], 1],
]

export const d_title_female: TaggedItem[] = [
  ["Queen",   [TITLE, DEITY_FEMALE], 2],
  ["Lady",    [TITLE, DEITY_FEMALE], 3],
  ["Goddess", [TITLE, DEITY_FEMALE], 1],
]

export const d_domain_good: TaggedItem[] = [
  ["Apples",  [DOMAIN, DEITY_GOOD], 2],
  ["Bananas", [DOMAIN, DEITY_GOOD], 2],
  ["Custard", [DOMAIN, DEITY_GOOD], 1],
]

export const d_domain_evil: TaggedItem[] = [
  ["Aggression", [DOMAIN, DEITY_EVIL], 3],
  ["Bad Breath", [DOMAIN, DEITY_EVIL], 1],
  ["Cucumbers",  [DOMAIN, DEITY_EVIL], 1],
]

export const d_domain_neutral: TaggedItem[] = [
  ["Ants",  [DOMAIN, DEITY_NEUTRAL], 2],
  ["Birds", [DOMAIN, DEITY_NEUTRAL], 2],
  ["Cats",  [DOMAIN, DEITY_NEUTRAL], 2],
]

// Name syllable components
export const s_suf: TaggedItem[] = [
  ["ch", [SYLLABLE_SUF], 2], ["ck", [SYLLABLE_SUF], 2], ["ght",[SYLLABLE_SUF], 2],
  ["ld", [SYLLABLE_SUF], 2], ["ll", [SYLLABLE_SUF], 3], ["mp", [SYLLABLE_SUF], 2],
  ["nd", [SYLLABLE_SUF], 3], ["ng", [SYLLABLE_SUF], 3], ["nk", [SYLLABLE_SUF], 2],
  ["nt", [SYLLABLE_SUF], 2], ["rd", [SYLLABLE_SUF], 2], ["rk", [SYLLABLE_SUF], 2],
  ["rm", [SYLLABLE_SUF], 2], ["rn", [SYLLABLE_SUF], 2], ["sh", [SYLLABLE_SUF], 2],
  ["ss", [SYLLABLE_SUF], 2], ["st", [SYLLABLE_SUF], 3], ["th", [SYLLABLE_SUF], 2],
  ["wn", [SYLLABLE_SUF], 2], ["ff", [SYLLABLE_SUF], 1], ["ft", [SYLLABLE_SUF], 1],
  ["lf", [SYLLABLE_SUF], 1], ["lm", [SYLLABLE_SUF], 1], ["ln", [SYLLABLE_SUF], 1],
  ["lt", [SYLLABLE_SUF], 1], ["mm", [SYLLABLE_SUF], 1], ["mn", [SYLLABLE_SUF], 1],
  ["nn", [SYLLABLE_SUF], 1], ["ph", [SYLLABLE_SUF], 1], ["pp", [SYLLABLE_SUF], 1],
  ["pt", [SYLLABLE_SUF], 1], ["rg", [SYLLABLE_SUF], 1], ["rp", [SYLLABLE_SUF], 1],
  ["sc", [SYLLABLE_SUF], 1], ["sk", [SYLLABLE_SUF], 1], ["sm", [SYLLABLE_SUF], 1],
  ["sp", [SYLLABLE_SUF], 1], ["tt", [SYLLABLE_SUF], 1], ["wl", [SYLLABLE_SUF], 1],
]

export const s_mid: TaggedItem[] = [
  ["a", [SYLLABLE_MID], 3], ["e",  [SYLLABLE_MID], 3], ["i",  [SYLLABLE_MID], 3],
  ["o", [SYLLABLE_MID], 3], ["ai", [SYLLABLE_MID], 2], ["ay", [SYLLABLE_MID], 2],
  ["ea",[SYLLABLE_MID], 2], ["ee", [SYLLABLE_MID], 2], ["ia", [SYLLABLE_MID], 2],
  ["ie",[SYLLABLE_MID], 2], ["io", [SYLLABLE_MID], 2], ["oo", [SYLLABLE_MID], 2],
  ["ou",[SYLLABLE_MID], 2], ["u",  [SYLLABLE_MID], 2], ["y",  [SYLLABLE_MID], 2],
  ["aa",[SYLLABLE_MID], 1], ["ae", [SYLLABLE_MID], 1], ["ao", [SYLLABLE_MID], 1],
  ["au",[SYLLABLE_MID], 1], ["ei", [SYLLABLE_MID], 1], ["eo", [SYLLABLE_MID], 1],
  ["eu",[SYLLABLE_MID], 1], ["ey", [SYLLABLE_MID], 1], ["ii", [SYLLABLE_MID], 1],
  ["iu",[SYLLABLE_MID], 1], ["iy", [SYLLABLE_MID], 1], ["oa", [SYLLABLE_MID], 1],
  ["oe",[SYLLABLE_MID], 1], ["oi", [SYLLABLE_MID], 1], ["oy", [SYLLABLE_MID], 1],
  ["ua",[SYLLABLE_MID], 1], ["ue", [SYLLABLE_MID], 1], ["ui", [SYLLABLE_MID], 1],
  ["uo",[SYLLABLE_MID], 1], ["uu", [SYLLABLE_MID], 1], ["uy", [SYLLABLE_MID], 1],
  ["ya",[SYLLABLE_MID], 1], ["ye", [SYLLABLE_MID], 1], ["yi", [SYLLABLE_MID], 1],
  ["yo",[SYLLABLE_MID], 1],
]

export const s_pre: TaggedItem[] = [
  ["Bl", [SYLLABLE_PRE], 2], ["Br", [SYLLABLE_PRE], 2], ["Ch", [SYLLABLE_PRE], 2],
  ["Cl", [SYLLABLE_PRE], 2], ["Dr", [SYLLABLE_PRE], 2], ["Fl", [SYLLABLE_PRE], 2],
  ["Fr", [SYLLABLE_PRE], 2], ["Gr", [SYLLABLE_PRE], 2], ["Kn", [SYLLABLE_PRE], 2],
  ["Pl", [SYLLABLE_PRE], 2], ["Pr", [SYLLABLE_PRE], 2], ["Sh", [SYLLABLE_PRE], 2],
  ["Sl", [SYLLABLE_PRE], 2], ["Sp", [SYLLABLE_PRE], 2], ["St", [SYLLABLE_PRE], 2],
  ["Th", [SYLLABLE_PRE], 2], ["Tr", [SYLLABLE_PRE], 2], ["Dl", [SYLLABLE_PRE], 1],
  ["Dw", [SYLLABLE_PRE], 1], ["Er", [SYLLABLE_PRE], 1], ["Fh", [SYLLABLE_PRE], 1],
  ["Gh", [SYLLABLE_PRE], 1], ["Gw", [SYLLABLE_PRE], 1], ["Kr", [SYLLABLE_PRE], 1],
  ["Ph", [SYLLABLE_PRE], 1], ["Qu", [SYLLABLE_PRE], 1], ["Rh", [SYLLABLE_PRE], 1],
  ["Sch",[SYLLABLE_PRE], 1], ["Scr",[SYLLABLE_PRE], 1], ["Sk", [SYLLABLE_PRE], 1],
  ["Sm", [SYLLABLE_PRE], 1], ["Sn", [SYLLABLE_PRE], 1], ["Spl",[SYLLABLE_PRE], 1],
  ["Spr",[SYLLABLE_PRE], 1], ["Str",[SYLLABLE_PRE], 1], ["Sw", [SYLLABLE_PRE], 1],
  ["Tw", [SYLLABLE_PRE], 1], ["Wh", [SYLLABLE_PRE], 1],
]

export const l_suf: TaggedItem[] = [
  ["arn",  [SYLLABLE_SUF], 2], ["dir",  [SYLLABLE_SUF], 2], ["dor",  [SYLLABLE_SUF], 2],
  ["dun",  [SYLLABLE_SUF], 2], ["dur",  [SYLLABLE_SUF], 2], ["grim", [SYLLABLE_SUF], 2],
  ["ian",  [SYLLABLE_SUF], 2], ["ith",  [SYLLABLE_SUF], 2], ["loch", [SYLLABLE_SUF], 2],
  ["lum",  [SYLLABLE_SUF], 2], ["mir",  [SYLLABLE_SUF], 2], ["ord",  [SYLLABLE_SUF], 2],
  ["oth",  [SYLLABLE_SUF], 2], ["rim",  [SYLLABLE_SUF], 2], ["rin",  [SYLLABLE_SUF], 2],
  ["than", [SYLLABLE_SUF], 2], ["tyr",  [SYLLABLE_SUF], 2], ["wald", [SYLLABLE_SUF], 2],
  ["wich", [SYLLABLE_SUF], 2], ["wick", [SYLLABLE_SUF], 2], ["annum",[SYLLABLE_SUF], 1],
  ["aril", [SYLLABLE_SUF], 1], ["aster",[SYLLABLE_SUF], 1], ["blin", [SYLLABLE_SUF], 1],
  ["dith", [SYLLABLE_SUF], 1], ["doth", [SYLLABLE_SUF], 1], ["drel", [SYLLABLE_SUF], 1],
  ["dril", [SYLLABLE_SUF], 1], ["drim", [SYLLABLE_SUF], 1], ["drin", [SYLLABLE_SUF], 1],
  ["durn", [SYLLABLE_SUF], 1], ["dyl",  [SYLLABLE_SUF], 1], ["gyl",  [SYLLABLE_SUF], 1],
  ["ial",  [SYLLABLE_SUF], 1], ["loth", [SYLLABLE_SUF], 1], ["mael", [SYLLABLE_SUF], 1],
  ["oun",  [SYLLABLE_SUF], 1], ["rael", [SYLLABLE_SUF], 1], ["ril",  [SYLLABLE_SUF], 1],
  ["roun", [SYLLABLE_SUF], 1], ["ryn",  [SYLLABLE_SUF], 1], ["thalin",[SYLLABLE_SUF],1],
  ["thoth",[SYLLABLE_SUF], 1], ["thril",[SYLLABLE_SUF], 1], ["thryn",[SYLLABLE_SUF], 1],
  ["thul", [SYLLABLE_SUF], 1], ["trym", [SYLLABLE_SUF], 1], ["zar",  [SYLLABLE_SUF], 1],
  ["zin",  [SYLLABLE_SUF], 1],
]

export const l_mid: TaggedItem[] = [
  ["a",  [SYLLABLE_MID], 3],
  ["el", [SYLLABLE_MID], 2],
  ["er", [SYLLABLE_MID], 2],
  ["um", [SYLLABLE_MID], 2],
]

export const l_pre: TaggedItem[] = [
  ["Ald",   [SYLLABLE_PRE], 2], ["Amon",  [SYLLABLE_PRE], 2], ["Ard",   [SYLLABLE_PRE], 2],
  ["Arn",   [SYLLABLE_PRE], 2], ["Ashe",  [SYLLABLE_PRE], 2], ["Eld",   [SYLLABLE_PRE], 2],
  ["Grom",  [SYLLABLE_PRE], 2], ["Ith",   [SYLLABLE_PRE], 2], ["Mal",   [SYLLABLE_PRE], 2],
  ["Nar",   [SYLLABLE_PRE], 2], ["Rom",   [SYLLABLE_PRE], 2], ["Thal",  [SYLLABLE_PRE], 2],
  ["Alizer",[SYLLABLE_PRE], 1], ["Alm",   [SYLLABLE_PRE], 1], ["Alu",   [SYLLABLE_PRE], 1],
  ["Ambril",[SYLLABLE_PRE], 1], ["Arac",  [SYLLABLE_PRE], 1], ["Ashe",  [SYLLABLE_PRE], 1],
  ["Azer",  [SYLLABLE_PRE], 1], ["Azi",   [SYLLABLE_PRE], 1], ["Buro",  [SYLLABLE_PRE], 1],
  ["Duro",  [SYLLABLE_PRE], 1], ["End",   [SYLLABLE_PRE], 1], ["Fhast", [SYLLABLE_PRE], 1],
  ["Fili",  [SYLLABLE_PRE], 1], ["Gallow",[SYLLABLE_PRE], 1], ["Gaunt", [SYLLABLE_PRE], 1],
  ["Gele",  [SYLLABLE_PRE], 1], ["Gelf",  [SYLLABLE_PRE], 1], ["Ghel",  [SYLLABLE_PRE], 1],
  ["Ghul",  [SYLLABLE_PRE], 1], ["Grel",  [SYLLABLE_PRE], 1], ["Greld", [SYLLABLE_PRE], 1],
  ["Griel", [SYLLABLE_PRE], 1], ["Grue",  [SYLLABLE_PRE], 1], ["Grund", [SYLLABLE_PRE], 1],
  ["Grym",  [SYLLABLE_PRE], 1], ["Guld",  [SYLLABLE_PRE], 1], ["Hoth",  [SYLLABLE_PRE], 1],
  ["Ill",   [SYLLABLE_PRE], 1], ["Imon",  [SYLLABLE_PRE], 1], ["Lum",   [SYLLABLE_PRE], 1],
  ["Lyth",  [SYLLABLE_PRE], 1], ["Mirg",  [SYLLABLE_PRE], 1], ["Mul",   [SYLLABLE_PRE], 1],
  ["Myr",   [SYLLABLE_PRE], 1], ["Narn",  [SYLLABLE_PRE], 1], ["Neth",  [SYLLABLE_PRE], 1],
  ["Nith",  [SYLLABLE_PRE], 1], ["Num",   [SYLLABLE_PRE], 1], ["Nyth",  [SYLLABLE_PRE], 1],
  ["Olo",   [SYLLABLE_PRE], 1], ["Orm",   [SYLLABLE_PRE], 1], ["Qual",  [SYLLABLE_PRE], 1],
  ["Ryn",   [SYLLABLE_PRE], 1], ["Tael",  [SYLLABLE_PRE], 1], ["Taer",  [SYLLABLE_PRE], 1],
  ["Telk",  [SYLLABLE_PRE], 1], ["Teth",  [SYLLABLE_PRE], 1], ["Thel",  [SYLLABLE_PRE], 1],
  ["Thool", [SYLLABLE_PRE], 1], ["Thoth", [SYLLABLE_PRE], 1], ["Thul",  [SYLLABLE_PRE], 1],
  ["Thyl",  [SYLLABLE_PRE], 1], ["Thys",  [SYLLABLE_PRE], 1], ["Tul",   [SYLLABLE_PRE], 1],
  ["Tyl",   [SYLLABLE_PRE], 1], ["Udo",   [SYLLABLE_PRE], 1], ["Ulm",   [SYLLABLE_PRE], 1],
  ["Urd",   [SYLLABLE_PRE], 1], ["Vod",   [SYLLABLE_PRE], 1], ["Vul",   [SYLLABLE_PRE], 1],
  ["Xan",   [SYLLABLE_PRE], 1], ["Xana",  [SYLLABLE_PRE], 1], ["Xanth", [SYLLABLE_PRE], 1],
  ["Zyl",   [SYLLABLE_PRE], 1],
]
