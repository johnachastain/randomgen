export enum WordPosition {
    Prefix = 'prefix',
    Suffix = 'suffix',
    Root = 'root'
}

export enum WordType {
    Agentive = 'agentive', // ending in 'er' or 'or'
    Collective = 'collective',
    Gerund = 'gerund', // ending in 'ing'
    PastParticiple = 'past-participle', // ending in 'ed'
    Noun = 'noun',
    Verb = 'verb',
    Adjective = 'adjective',
    Adverb = 'adverb',
    Conjunction = 'conjunction',
    Preposition = 'preposition',
    Pronoun = 'pronoun',
    Determiner = 'determiner'
}

export enum NounGroup {
    Animal = 'animal',
    Plant = 'plant',
    Material = 'material',
    Anatomical = 'anatomical',
    Weapon = 'weapon',
    Armor = 'armor',
    Fluid = 'fluid',
    Color = 'color',
    Weather = 'weather',
    Abstraction = 'abstraction'
}

export enum MaterialGroup {
    Metal = 'metal',
    Wood = 'wood',
    Stone = 'stone',
    Gem = 'gem',
    Fabric = 'fabric',
    Mineral = 'mineral',
    Liquid = 'liquid',
    Gas = 'gas'
}

export enum VerbTense {
    Past = 'past',
    Present = 'present',
    Future = 'future',
    Continuous = 'continuous',
    Perfect = 'perfect',
    Simple = 'simple'
}

export enum VerbGroup { }

export enum AdjectiveGroups {
    Effect = 'effect',
    Condition = 'condition',
    Quality = 'quality',
}

export enum NameTags {
    Color = 'color',
    Silly = 'silly',
    Grim = 'grim',
    Gross = 'grim',
    Gore = 'gore'
}
