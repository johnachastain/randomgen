export type ListOption = {
  value: string
  label: string
}
  
export const natural: ListOption[] = [
  {value: 'natural', label: 'Any Landform'},
  {value: 'natural_mountain', label: 'Mountain'},
  {value: 'natural_river', label: 'River'},
  {value: 'natural_hills', label: 'Hill'},
  {value: 'natural_desert', label: 'Desert'},
  {value: 'natural_freshwater', label: 'Lakes/Rivers'},
  {value: 'natural_highlands', label: 'Hills/Mountains'},
  {value: 'natural_misc', label: 'Natural Misc.'},
  {value: 'natural_woodlands', label: 'Forest'},
  {value: 'natural_marshes', label: 'Swamp/Marshes'},
  {value: 'natural_depression', label: 'Canyon/Valley/Gorge'},
  {value: 'natural_underground', label: 'Underground'},
  {value: 'natural_saltwater', label: 'Ocean'},
  {value: 'natural_stone', label: 'Stones/Rocks'},
]
            
export const construction: ListOption[] = [
  {value: 'construction', label: 'Any Construction'},
  {value: 'construction_fortification', label: 'Castles/Towers/Forts'},
  {value: 'construction_religious', label: 'Temples/Shrines'},
  {value: 'construction_funerary', label: 'Crypts/Tombs'},
  {value: 'construction_artifact', label: 'Artifacts'},
  {value: 'construction_underground', label: 'Mines/Tunnels'},
  {value: 'construction_shelter', label: 'construction_shelter'},
  {value: 'construction_mechanical', label: 'construction_mechanical'},
  {value: 'construction_security', label: 'construction_security'},
  {value: 'construction_misc', label: 'Construction Misc.'},
  {value: 'construction_freshwater', label: 'Wells'},
  {value: 'construction_town', label: 'Towns'},
  {value: 'construction_bridge', label: 'Bridge'},
  {value: 'construction_tower', label: 'Tower'},
  {value: 'construction_tavern', label: 'Inns/Taverns'},
  {value: 'construction_city', label: 'Cities'},
]

const dungeon: ListOption[] = [
  {value: 'dungeon_level', label: 'Entire Dungeon Levels'},         
  {value: 'any_dungeon_room', label: 'Any Dungeon Room'},
  {value: 'dungeon_room', label: 'Common Dungeon Room'},
  {value: 'temple_room', label: 'Temple Room'},
  {value: 'tomb_room', label: 'Tomb Room'},
  {value: 'magical_room', label: 'Magical Room'},
  {value: 'cavern_room', label: 'Cavern Room'},  
]

export const adjective: ListOption[] = [
  {value: 'base', label: 'Any'},
  {value: 'good', label: 'Good'},
  {value: 'evil', label: 'Evil'},
  {value: 'magic', label: 'Magical'},
  {value: 'elf', label: 'Elven'},
  {value: 'dwarf', label: 'Dwarven'},
  {value: 'ice', label: 'Frozen'},
  {value: 'fire', label: 'Fiery'},	
]

export const deities: ListOption[] = [
  {value: 'deity', label: 'Deities/Demigods'},
  {value: 'base', label: 'Any'},
]


export const all: ListOption[] = [ ...natural, ...construction, ...dungeon ]
