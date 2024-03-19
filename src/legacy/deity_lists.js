/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DEITIES & DEMIGODS
	================================================================================ */

	var d_name_male = [
	"Abercrombie",
	"Aldus",
	"Alfred",
	"Algernon",
	"Alistair",
	"Alphonse",
	"Ambrose",
	"Archibald",
	"Bartholomew",
	"Basil",
	"Baxter",
	"Benedict",
	"Bigby",
	"Boniface",
	"Burne",
	"Chester",
	"Cornelius",
	"Cyrus",
	"Eldridge",
	"Elijah",
	"Elmer",
	"Elmo",
	"Ernest",
	"Esher",
	"Felix",
	"Ferdinand",
	"Fergus",
	"Festus",
	"Finn",
	"Florian",
	"Floyd",
	"Franklin",
	"Fritz",
	"Geoffrey",
	"Gilbert",
	"Godfrey",
	"Graham",
	"Grunwald",
	"Gustav",
	"Hector",
	"Hieronymous",
	"Horace",
	"Hubert",
	"Humphrey",
	"Ian",
	"Ichabod",
	"Ignatius",
	"Igor",
	"Isaac",
	"Jarvis",
	"Jeremiah",
	"Jethro",
	"Kermit",
	"Lazlo",
	"Leonard",
	"Lester",
	"Linus",
	"Lorenzo",
	"Ludwig",
	"Luther",
	"Maxwell",
	"Melvin",
	"Millard",
	"Milo",
	"Milton",
	"Mortimer",
	"Murphy",
	"Murray",
	"Ned",
	"Obediah",
	"Oliver",
	"Orson",
	"Oscar",
	"Oswald",
	"Otis",
	"Otto",
	"Owen",
	"Pedro",
	"Percival",
	"Phineas",
	"Roscoe",
	"Rufus",
	"Seth",
	"Seymour",
	"Silas",
	"Stuart",
	"Thadeus",
	"Theobald",
	"Tilman",
	"Timothy",
	"Uriah",
	"Vern",
	"Vlad",
	"Waldo",
	"Wilbur",
	"Zachary",
	"Horatio",
	"Alger",
	"Thurman",
"Ebenezer",
"Sigmund",
"Simon",
"Seymour",
"Maxwell",
"Jasper",
"Jarvis",
"Falstaff",
"Griswald",
"Winston",
"Chauncy",
"Silas"
	];
	
	var d_name_female = [
	"Abigail",
	"Agatha",
	"Althea",
	"Beatrice",
	"Beatrix",
	"Bertha",
	"Daisy",
	"Edna",
	"Elvira",
	"Ethel",
	"Flora",
	"Freda",
	"Greta",
	"Gretchen",
	"Gretrude",
	"Harriet",
	"Hazel",
	"Henrietta",
	"Hester",
	"Hortence",
	"Irma",
	"Martha",
	"Matilda",
	"Mildred",
	"Millicent",
	"Minerva",
	"Miranda",
	"Morgan",
	"Myrna",
	"Myrtle",
	"Octavia",
	"Olive",
	"Penelope",
	"Petunia",
	"Prudence",
	"Rosemary",
	"Ruby",
	"Stella",
	"Teresa",
	"Theodora",
	"Violet",
	"Vivian",
	"Wednesday",
	"Winnifred",
	"Zelda",
	"Silas",
	"Zooey",
"Zooey",
"Zoe"
	];
	
	var d_surname_female = [
	"Awesome", 
	"Beautiful", 
	"Cool"
	];
	
	var d_surname_male = [
	"Awesome", 
	"Beautiful", 
	"Cool"
	];
	
	var d_surname_good = [
	"Awesome", 
	"Beautiful", 
	"Cool"
	];
	
	var d_surname_evil = [
	"Angry", 
	"Bad", 
	"Cranky"
	];
	var d_surname_neutral = [
	"Apathetic", 
	"Boring", 
	"Cold"
	];
	
	var d_surname_all = [
	d_surname_good, 
	d_surname_evil, 
	d_surname_neutral
	];
	
	var d_silly = [
		"Beard",
		"Biscuit",
		"Bobble",
		"Bong",
		"Bottom",
		"Brew",
		"Bucket",
		"Bucket",
		"Button",
		"Clump",
		"Crumble",
		"Doodle",
		"Fidget",
		"Finger",
		"Fluff",
		"Foot",
		"Fork",
		"Freckle",
		"Funnel",
		"Gizzard",
		"Glob",
		"Glum",
		"Gobble",
		"Google",
		"Grizzle",
		"Grumble",
		"Guzzle",
		"Hobble",
		"Ladle",
		"Loaf",
		"Lump",
		"Muffin",
		"Nose",
		"Nozzle",
		"Pants",
		"Piddle",
		"Plug",
		"Pocket",
		"Prickle",
		"Prong",
		"Puddle",
		"Puppet",
		"Sock",
		"Socks",
		"Spackle",
		"Speckle",
		"Spigot",
		"Spoon",
		"Stubble",
		"Stumble",
		"Tickle",
		"Toes",
		"Tooth",
		"Trouser",
		"Wart",
		"Water",
		"Weasel",
		"Weevil",
		"Whisker",
		"Widget",
		"Wood",
		"Worth"	,
		"Long",
		"Scurvy",
		"Scruffy",
		"Grumble",
		"Nose",
		"Knees",
		"Ears",
		"Trousers",
		"Beard",
		"Wart"
	];
	
	var d_nasty = [
	"Ash",
	"Axe",
	"Bag",
	"Bane",
	"Beast",
	"Beetle",
	"Belch",
	"Bend",
	"Bender",
	"Bile",
	"Bite",
	"Black",
	"Blade",
	"Blast",
	"Blight",
	"Blister",
	"Blood",
	"Blue",
	"Blunt",
	"Bog",
	"Bone",
	"Bowel",
	"Break",
	"Brow",
	"Brute",
	"Burble",
	"Burn",
	"Cackle",
	"Call",
	"Canker",
	"Chaos",
	"Chew",
	"Clap",
	"Claw",
	"Cloud",
	"Cold",
	"Crab",
	"Crawler",
	"Craze",
	"Crow",
	"Crush",
	"Cry",
	"Cut",
	"Death",
	"Devil",
	"Dire",
	"Dog",
	"Doom",
	"Dragon",
	"Dread",
	"Dreg",
	"Drink",
	"Drinker",
	"Drool",
	"Dung",
	"Eat",
	"Eater",
	"Eye",
	"Eye",
	"Face",
	"Fang",
	"Fat",
	"Feast",
	"Fester",
	"Fiddle",
	"Fiend",
	"Filth",
	"Fire",
	"Fist",
	"Flame",
	"Flesh",
	"Flush",
	"Flux",
	"Foam",
	"Foul",
	"Froth",
	"Fume",
	"Fury",
	"Gall",
	"Gibber",
	"Gloom",
	"Glop",
	"Glut",
	"Glutton",
	"Gnash",
	"Gnaw",
	"Gob",
	"Gobble",
	"Gore",
	"Grab",
	"Grasp",
	"Gray",
	"Green",
	"Grief",
	"Grim",
	"Grin",
	"Grin",
	"Grind",
	"Gristle",
	"Gross",
	"Growler",
	"Grue",
	"Grumble",
	"Grunt",
	"Gut",
	"Hack",
	"Hammer",
	"Hate",
	"Hawk",
	"Haze",
	"Head",
	"Heart",
	"Helm",
	"Horn",
	"Hot",
	"Howl",
	"Ice",
	"Ichor",
	"Jade",
	"Kill",
	"Killer",
	"Lash",
	"Leper",
	"Lick",
	"Lip",
	"Liver",
	"Loath",
	"Loose",
	"Lust",
	"Mad",
	"Maggot",
	"Maim",
	"Mange",
	"Mark",
	"Maul",
	"Maw",
	"Mildew",
	"Mind",
	"Mire",
	"Mold",
	"Moon",
	"Moulder",
	"Mucus",
	"Nibble",
	"Night",
	"Offal",
	"Ooze",
	"Pain",
	"Pest",
	"Pierce",
	"Pile",
	"Pinch",
	"Pit",
	"Plague",
	"Poison",
	"Pox",
	"Puke",
	"Pulse",
	"Pus",
	"Putrid",
	"Quake",
	"Quiver",
	"Rabid",
	"Raven",
	"Razor",
	"Reap",
	"Red",
	"Rend",
	"Rip",
	"Ripper",
	"Rot",
	"Rotten",
	"Rust",
	"Sate",
	"Scab",
	"Scrape",
	"Scratch",
	"Screech",
	"Scum",
	"Seethe",
	"Shadow",
	"Shank",
	"Shard",
	"Sharp",
	"Shield",
	"Shifter",
	"Shine",
	"Shout",
	"Sin",
	"Sinew",
	"Skin",
	"Skull",
	"Skull",
	"Slake",
	"Slash",
	"Slice",
	"Slime",
	"Slob",
	"Slobber",
	"Sludge",
	"Slug",
	"Snarl",
	"Snot",
	"Sore",
	"Soul",
	"Spasm",
	"Spawn",
	"Spell",
	"Spew",
	"Spider",
	"Spike",
	"Spine",
	"Spirit",
	"Spite",
	"Spittle",
	"Spore",
	"Spot",
	"Star",
	"Stare",
	"Steel",
	"Sting",
	"Stone",
	"Storm",
	"Suck",
	"Sweat",
	"Sword",
	"Taint",
	"Tear",
	"Thigh",
	"Thirst",
	"Thorn",
	"Thrash",
	"Thrust",
	"Toad",
	"Tongue",
	"Touch",
	"Tremble",
	"Twist",
	"Venom",
	"Vex",
	"Vile",
	"Viper",
	"Vomit",
	"Wail",
	"War",
	"Warp",
	"Wart",
	"Water",
	"Weaver",
	"Web",
	"Whine",
	"Whip",
	"Widow",
	"Wight",
	"Wind",
	"Wing",
	"Wither",
	"Wolf",
	"Worm",
	"Worship",
	"Wound",
	"Wrack",
	"Wrath",
	"Wraith"
	];

	
	var d_title_prefix_good = [
	"Sublime",
	"Exalted",
	"Celestial"
	];
	
	var d_title_prefix_evil = [
	"Dread",
	"Vile",
	"Grim"
	];
	var d_title_prefix_neutral = [
	"Mighty",
	"Unvanquishable",
	"Bellicose"
	];
	
	
	var d_title_good = [
	"Warden", 
	"Protector"
	];
	
	var d_title_evil = [
	"Fiend"
	];
	var d_title_neutral = [
	"Overseer"
	];
	
	var d_title_male = [
	"King", 
	"Lord", 
	"God"
	];
	var d_title_female = [
	"Queen", 
	"Lady", 
	"Godess"
	];
	
	
	
	var d_title_all = [
	d_title_good, 
	d_title_evil, 
	d_title_neutral,
	d_title_male, 
	d_title_female
	];
	
	
	
	
	
	var d_domain_good = [
	"Apples", 
	"Bannanas", 
	"Custard"
	];
	
	var d_domain_evil = [
	"Agression", 
	"Bad Breath", 
	"C"
	];
	var d_domain_neutral = [
	"Ants", 
	"Birds", 
	"Cats"
	];
	
	var d_domain_all = [
	d_domain_good,
	d_domain_evil,
	d_domain_neutral
	];
	
	var s_suf = [
	"ch",
	"ck",
	"ct",
	"ff",
	"ft",
	"ght",
	"ld",
	"lf",
	"ll",
	"lm",
	"ln",
	"lt",
	"mm",
	"mn",
	"mp",
	"nd",
	"ng",
	"nk",
	"nn",
	"nt",
	"ph",
	"pp",
	"pt",
	"rd",
	"rg",
	"rk",
	"rm",
	"rn",
	"rn",
	"rp",
	"rp",
	"sc",
	"sch",
	"sh",
	"sk",
	"sm",
	"sp",
	"ss",
	"st",
	"th",
	"tt",
	"wl",
	"wn"
	];
	
	var s_mid = [
		"a",
		"aa",
		"ae",
		"ai",
		"ao",
		"au",
		"ay",
		"e",
		"ea",
		"ee",
		"ei",
		"eo",
		"eu",
		"ey",
		"I",
		"ia",
		"ie",
		"ii",
		"io",
		"iu",
		"iy",
		"o",
		"oa",
		"oe",
		"oi",
		"oo",
		"ou",
		"oy",
		"u",
		"ua",
		"ue",
		"ui",
		"uo",
		"uu",
		"uy",
		"y",
		"ya",
		"ye",
		"yi",
		"yo"
	];
	
	
	var s_pre = [
		"Bl",
		"Br",
		"Ch",
		"Cl",
		"Dl",
		"Dr",
		"Dw",
		"Er",
		"Fh",
		"Fl",
		"Fr",
		"Fr",
		"Gh",
		"Gr",
		"Gw",
		"Kn",
		"Kr",
		"Kr",
		"Ph",
		"Pl",
		"Pr ",
		"Pr ",
		"Qu",
		"Rh",
		"Sch",
		"Scr",
		"Sh",
		"Sk",
		"Sl",
		"Sl",
		"Sm",
		"Sn",
		"Sp",
		"Spl",
		"Spr",
		"St",
		"Str",
		"Sw",
		"Th",
		"Tr",
		"Tw",
		"Wh" 
	];
	
	var l_suf = [
	"annum",
	"aril",
	"arn",
	"aster",
	"blin",
	"dir",
	"dith",
	"dor",
	"doth",
	"drel",
	"dril",
	"drim",
	"drin",
	"dun",
	"dur",
	"durn",
	"dyl",
	"grim",
	"gyl",
	"ial",
	"ian",
	"ith",
	"loch",
	"loth",
	"lum",
	"mael",
	"mir",
	"ord",
	"oth",
	"oun",
	"rael",
	"ril",
	"rim",
	"rin",
	"roun",
	"ryn",
	"thalin",
	"than",
	"thoth",
	"thril",
	"thryn",
	"thul",
	"trym",
	"tyr",
	"wald",
	"wich",
	"wick",
	"zar",
	"zin"
	];

	var l_mid = [
	"a",
	"el",
	"er",
	"um"
	];
	
	var l_pre = [
	"Ald",
	"Alizer",
	"Alm",
	"Alu",
	"Ambril",
	"Amon",
	"Arac",
	"Ard",
	"Arn",
	"Ashe",
	"Azer",
	"Azi",
	"Buro",
	"Duro",
	"Eld",
	"Eld",
	"End",
	"Fhast",
	"Fili",
	"Gallow",
	"Gaunt",
	"Gele",
	"Gelf",
	"Ghel",
	"Ghul",
	"Grel",
	"Greld",
	"Griel",
	"Grom",
	"Grue",
	"Grund",
	"Grym",
	"Guld",
	"Hoth",
	"Ill",
	"Imon",
	"Ith",
	"Lum",
	"Lyth",
	"Mal",
	"Mal",
	"Mirg",
	"Mul",
	"Myr",
	"Nar",
	"Narn",
	"Neth",
	"Nith",
	"Num",
	"Nyth",
	"Olo",
	"Orm",
	"Qual",
	"Rom",
	"Ryn",
	"Tael",
	"Taer",
	"Telk",
	"Teth",
	"Thal",
	"Thel",
	"Thool",
	"Thoth",
	"Thul",
	"Thyl",
	"Thys",
	"Tul",
	"Tyl",
	"Udo",
	"Ulm",
	"Urd",
	"Vod",
	"Vul",
	"Xan",
	"Xana",
	"Xanth",
	"Zyl"
	];