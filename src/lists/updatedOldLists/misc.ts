// SPECIAL ARRAYS

export type specialArray = {
    type?: any,
    prefix?: any,
    suffix?: any,
    adjective?: any,
    prepositional?: any,
    possessive?: any,
    unique?: any,
}

// PERSON

export const person_misc = [
    ['Fidget', [], 1],
    ['Maggot', [], 1],
    ['Dead Man', [], 1],
    ['Hermit', [], 1],
    ['Fool', [], 1],
    ['Special Guest', [], 1],
    ['Guest', [], 1],
];

export const person_ruler = [
    ['King', [], 1],
    ['Queen', [], 1],
    ['Lord', [], 1],
    ['Duke', [], 1],
];

export const person_entertainer = [
    ['Minstrel', [], 1],
    ['Jester', [], 1],
];

export const person_worker = [
    ['Cook', [], 1],
    ['Servant', [], 1],
    ['Maid', [], 1],
    ['Fletcher', [], 1],
];

export const person_warrior = [
    ['Archer', [], 1],
    ['Guardian', [], 1],
    ['Rogue', [], 1],
];

export const person_religious = [
    ['Druid', [], 1],
    ['Martyr', [], 1],
    ['Monk', [], 1],
    ['Templar', [], 1],
    ['Shamen', [], 1],
    ['Scribe', [], 1],
    ['Priest', [], 1],
    ['Adept', [], 1],
    ['Acolyte', [], 1],
    ['Scrivner', [], 1],
];

export const person_magical = [
    ['Wizard', [], 1],
    ['Sorceror', [], 1],
    ['Apprentice', [], 1],
    ['Alchemist', [], 1],
    ['Advisor', [], 1],
];




//currently not used
export const possessive_suffix = [
    ['Crossing', [], 1],
    ['Gaunlet', [], 1],
    ['Watch', [], 1],
    ['Sorrow', [], 1],
    ['Folly', [], 1],
    ['Run', [], 1],
];

export const relative = [
    ['Greater', [], 1],
    ['Lesser', [], 1],
    ['Inner', [], 1],
    ['Outer', [], 1],
    ['Upper', [], 1],
    ['Lower', [], 1],
    ['Eastern', [], 1],
    ['Western', [], 1],
    ['Northern', [], 1],
    ['Southern', [], 1],
    ['Old', [], 1],
    ['Elder', [], 1],
    ['Far', [], 1],
    ['Deep', [], 1],
    ['High', [], 1],
];

export const the = [
    ['The', [], 1],
];

export const prefix_mundane = [
    // need more mundane terms to add to the vivid fantasy elements in other lists.
    ['Stump', [], 1],
    ['Cricket', [], 1],
    ['Mouse', [], 1],
    ['Thistle', [], 1],
    ['Cobble', [], 1],
    ['Thatch', [], 1],
    ['Puddle', [], 1],
    ['Gnat', [], 1],
    ['Moth', [], 1],
    ['Owl', [], 1],
    ['Grog', [], 1],
    ['Farm', [], 1],
];

export const prefix_evil = [
    ['Ash', [], 1],
    ['Ashen', [], 1],
    ['Ashen', [], 1],
    ['Bane', [], 1],
    ['Bitter', [], 1],
    ['Blight', [], 1],
    ['Blight', [], 1],
    ['Blood', [], 1],
    ['Bone', [], 1],
    ['Carrion', [], 1],
    ['Dark', [], 1],
    ['Dead', [], 1],
    ['Demon', [], 1],
    ['Dire', [], 1],
    ['Dirt', [], 1],
    ['Doom', [], 1],
    ['Dread', [], 1],
    ['Fang', [], 1],
    ['Fell', [], 1],
    ['Fire', [], 1],
    ['Frost', [], 1],
    ['Gallow', [], 1],
    ['Ghoul', [], 1],
    ['Gloom', [], 1],
    ['Gore', [], 1],
    ['Grim', [], 1],
    ['Guant', [], 1],
    ['Hack', [], 1],
    ['Havoc', [], 1],
    ['Imp', [], 1],
    ['Marrow', [], 1],
    ['Mire', [], 1],
    ['Murk', [], 1],
    ['Plague', [], 1],
    ['Raven', [], 1],
    ['Riven', [], 1],
    ['Rot', [], 1],
    ['Sever', [], 1],
    ['Shadow', [], 1],
    ['Shiver', [], 1],
    ['Spawn', [], 1],
    ['Thorn', [], 1],
    ['Torn', [], 1],
    ['Winter', [], 1],
    ['Woe', [], 1],
    ['Wraith', [], 1],
    ['Wraith', [], 1],
    ['Wyrm', [], 1],
    ['Swarm', [], 1],
    ['Witch', [], 1],
];

export const prefix_good = [
    ['Soul', [], 1],
    ['Star', [], 1],
    ['Spell', [], 1],
    ['Heart', [], 1],
    ['Stone', [], 1],
    ['Shard', [], 1],
    ['Feather', [], 1],
    ['Far', [], 1],
    ['Moon', [], 1],
    ['Elder', [], 1],
    ['Old', [], 1],
    ['Storm', [], 1],
    ['Rune', [], 1],
    ['Dagger', [], 1],
    ['Sigil', [], 1],
    ['Mist', [], 1],
    ['Wind', [], 1],
    ['Moss', [], 1],
    ['Well', [], 1],
    ['Ever', [], 1],
    ['Ember', [], 1],
];

export const suffix_evil = [
    ['Finger', [], 1],
    ['Fist', [], 1],
    ['Talon', [], 1],
    ['Spawn', [], 1],
    ['Dark', [], 1],
];

export const suffix_good = [
    ['Hand', [], 1],
    ['Shield', [], 1],
    ['Song', [], 1],
    ['Spire', [], 1],
    ['Edge', [], 1],
    ['Warden', [], 1],
    ['Stone', [], 1],
    ['Root', [], 1],
    ['Guard', [], 1],
    ['Water', [], 1],
    ['Ever', [], 1],
    ['Wind', [], 1],
    ['Forge', [], 1],
    ['Watch', [], 1],
    ['Hold', [], 1],
];


// ABSTRACTIONS

export const abstraction = [
    ['Blight', [], 1],
    ['Hate', [], 1],
    ['Malice', [], 1],
    ['Ire', [], 1],
    ['Carnage', [], 1],
    ['Envy', [], 1],
    ['Truth', [], 1],
    ['Knowledge', [], 1],
    ['Discord', [], 1],
    ['Dread', [], 1],
    ['Lies', [], 1],
    ['Weakness', [], 1],
    ['Woe', [], 1],
    ['Gore', [], 1],
    ['Greed', [], 1],
    ['Stench', [], 1],
    ['Healing', [], 1],
    ['Strength', [], 1],
    ['Wisdom', [], 1],
    ['Might', [], 1],
    ['Remedy', [], 1],
    ['Memory', [], 1],
    ['Mana', [], 1],
    ['Life', [], 1],
    ['Lore', [], 1],
    ['Regeneration', [], 1],
    ['Summoning', [], 1],
    ['Mercy', [], 1],
    ['Perception', [], 1],
    ['Vision', [], 1],
    ['Protection', [], 1],
    ['Balance', [], 1],
    ['Storms', [], 1],
    ['Tears', [], 1],
    ['Steam', [], 1],
    ['Gravity', [], 1],
    ['Silence', [], 1],
    ['Whisper', [], 1],
    ['Sleep', [], 1],
    ['Disruption', [], 1],
    ['Magnetism', [], 1],
    ['Eclipse', [], 1],
    ['Zenith', [], 1],
    ['Distortion', [], 1],
    ['Eternal Return', [], 1],
    ['Merriment', [], 1],
    ['Echo', [], 1],
    ['Fatique', [], 1],
];

// OBJECTS

export const objects = [
    ['Eye', [], 1],
    ['Hand', [], 1],
    ['Talon', [], 1],
    ['Fang', [], 1],
    ['Skull', [], 1],
    ['Mind', [], 1],
    ['Corpse', [], 1],
    ['Glacier', [], 1],
    ['Moon', [], 1],
    ['Sun', [], 1],
    ['Star', [], 1],
    ['Venom', [], 1],
    ['Rune', [], 1],
    ['Shroud', [], 1],
    ['Cloak', [], 1],
    ['Glyph', [], 1],
    ['Sword', [], 1],
    ['Thorn', [], 1],
    ['Flame', [], 1],
    ['Shadow', [], 1],
    ['Fire', [], 1],
    ['Lantern', [], 1],
    ['Slime', [], 1],
    ['Leaf', [], 1],
    ['Chord', [], 1],
    ['Chain', [], 1],
    ['Talisman', [], 1],
    ['Pentacle', [], 1],
    ['Orb', [], 1],
    ['Sphere', [], 1],
    ['Egg', [], 1],
    ['Candle', [], 1],
    ['Lens', [], 1],
    ['Shield', [], 1],
    ['Jar', [], 1],
    ['Urn', [], 1],
    ['Spike', [], 1],
    ['Gem', [], 1],
    ['Rose', [], 1],
    ['Junk', [], 1],
    ['Void', [], 1],
    ['Glaive', [], 1],
];

export const objects_body = [
    ['Eye', [], 1],
    ['Hand', [], 1],
    ['Talon', [], 1],
    ['Fang', [], 1],
    ['Skull', [], 1],
    ['Mind', [], 1],
    ['Corpse', [], 1],
];

export const objects_container = [
    ['Jar', [], 1],
    ['Urn', [], 1],
];

export const objects_magic = [
    ['Rune', [], 1],
    ['Glyph', [], 1],
    ['Talisman', [], 1],
    ['Pentacle', [], 1],
];

export const objects_weapon = [
    ['Sword', [], 1],
    ['Helm', [], 1],
    ['Shield', [], 1],
    ['Spike', [], 1],
    ['Glaive', [], 1],
];

export const objects_clothing = [
    ['Shroud', [], 1],
    ['Cloak', [], 1],
];


export const objects_celestial = [,
    ['Moon', [], 1],
    ['Sun', [], 1],
    ['Star', [], 1],
];


// SPECIAL SUFFIX

export const suffix_river = [
    ['flow', [], 1],
    ['water', [], 1],
    ['tears', [], 1],
    ['blood', [], 1],
    ['wine', [], 1],
    ['mere', [], 1],
    ['ford', [], 1],
    ['falls', [], 1],
    ['meade', [], 1],
    ['grog', [], 1],
    ['spring', [], 1],
    ['tide', [], 1],
    ['wash', [], 1],
];

export const suffix_forest = [
    ['wood', [], 1],
    ['leaf', [], 1],
    ['root', [], 1],
    ['tree', [], 1],
    ['thorn', [], 1],
    ['willow', [], 1],
    ['oak', [], 1],
    ['wort', [], 1],
    ['weed', [], 1],
    ['cedar', [], 1],
    ['bark', [], 1],
];


export const suffix_mountain = [
    ['wall', [], 1],
    ['stone', [], 1],
    ['horn', [], 1],
    ['spur', [], 1],
    ['rock', [], 1],
    ['tooth', [], 1],
    ['spine', [], 1],
    ['teeth', [], 1],
    ['talon', [], 1],
    ['cap', [], 1],
    ['top', [], 1],
];

export const prefix_mountain = [
    ['Mount', [], 1],
];

export const prefix_fortification = [
    ['Fort', [], 1],
    ['Castle', [], 1],
];

export const special_suffix_town = [
    ['well', [], 1],
    ['wall', [], 1],
    ['wich', [], 1],
    ['wold', [], 1],
    ['wald', [], 1],
    ['ton', [], 1],
    ['town', [], 1],
    ['glen', [], 1],
    ['heim', [], 1],
    ['wort', [], 1],
    ['ward', [], 1],
    ['ham', [], 1],
    ['berg', [], 1],
    ['gard', [], 1],
    ['watch', [], 1],
    ['port', [], 1],
    ['gate', [], 1],
    ['brair', [], 1],
    ['home', [], 1],
    ['holm', [], 1],
    ['haven', [], 1],
    ['shire', [], 1],
    ['keep', [], 1],
    ['stone', [], 1],
    ['heart', [], 1],
    ['hall', [], 1],
    ['bury', [], 1],
    ['falls', [], 1],
    ['ford', [], 1],
    ['helm', [], 1],
    ['mere', [], 1],
    ['mill', [], 1],
    ['hollow', [], 1],
    ['burrow', [], 1],
    ['barrow', [], 1],
    ['cliff', [], 1],
    ['guard', [], 1],
    ['water', [], 1],
    ['bluff', [], 1],
    ['dorf', [], 1],
    ['field', [], 1],
    ['fens', [], 1],
    ['bog', [], 1],
    ['moor', [], 1],
    ['delve', [], 1],
    ['watch', [], 1],
    ['wick', [], 1],
    ['wart', [], 1],
    ['moot', [], 1],
    ['dell', [], 1],
    ['fell', [], 1],
    ['minster', [], 1],
    ['stein', [], 1],
    ['ville', [], 1],
    ['borough', [], 1],
    ['vale', [], 1],
    ['dale', [], 1],
    ['end', [], 1],
];

export const natural_type = [
    ['natural_mountain', [], 1],
    ['natural_hills', [], 1],
    ['natural_river', [], 1],
    ['natural_freshwater', [], 1],
    ['natural_woodlands', [], 1],
    ['natural_highlands', [], 1],
    ['natural_saltwater', [], 1],
    ['natural_underground', [], 1],
    ['natural_depression', [], 1],
    ['natural_marshes', [], 1],
    ['natural_desert', [], 1],
    ['natural_misc', [], 1],
    ['natural_stone', [], 1],
];

export const any_dungeon_type = [
    ['tomb_room', [], 1],
    ['temple_room', [], 1],
    ['cavern_room', [], 1],
    ['magical_room', [], 1],
    ['dungeon_room', [], 1],
];

export const construction_type = [
    ['construction_underground', [], 1],
    ['construction_religious', [], 1],
    ['construction_fortification', [], 1],
    ['construction_funerary', [], 1],
    ['construction_artifact', [], 1],
    ['construction_shelter', [], 1],
    ['construction_mechanical', [], 1],
    ['construction_security', [], 1],
    ['construction_misc', [], 1],
    ['construction_freshwater', [], 1],
    ['construction_tower', [], 1],
    ['construction_bridge', [], 1],
    ['construction_tavern', [], 1],
];