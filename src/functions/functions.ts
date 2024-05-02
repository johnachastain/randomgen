import * as baseLists from '../lists/base_lists'
import * as deityLists from '../lists/deity_lists'
import * as dungeonLists from '../lists/dungeon_rooms'
import * as miscLists from '../lists/misc_lists'
import * as adjLists from '../lists/adjective_lists'

const allLists = { ...baseLists, ...deityLists, ...dungeonLists, ...miscLists, ...adjLists }


export const getRandom = (n: number) => Math.floor(Math.random()* n)

export const getItem:any = (arr: any) => {
	const itm = arr.at(getRandom(arr.length));
  const result = typeof itm == 'object' ? getItem(itm) : itm
  return result
}

/*
function getString(arr) {
	var str ='';
		for ( var i = 0; i < arr.length; i++ ) {
			str += getItem( arr[i] );
			str += ' ';
		}
	return str;
}
function getList(n, arr) {
	var str ='';
		for ( var i = 0; i <= n; i++ ) {
			str += getString(arr);
			str += '<br/>';
		}
	return str;
}
*/

export const getSyntaxList = (n:number, typ:string, adj:string) => {
  let list: string[] = []
	for ( var i = 0; i < n; i++ ) {
    list  = [ ...list, getSyntax(typ, adj) ?? '']
  }
  return list
}

// const loopArray = (arr, base) => {
//     return arr.map((itm) => {
//       if (typeof itm == 'object' ) {
//         return loopArray(itm, base); 
//       } else if (typeof itm == 'string' ) {
//       return (<li>
//         <input name={`itm${i}`} type="checkbox" class="chkbx" />
//         {` ${itm} ${base}`}
//       </li>);
//       }
//     })
// }


// open issues exceptions to certain combinations


const getSyntax = (typ:string, adj:string) => {
	let r = getRandom(100);;
		switch(typ) {
			case "construction_town":
				return getTwoWordItem(typ, adj);
			
			case "construction_fortification":
			case "natural_mountain":
				r = getRandom(100);
					if (r <= 25) {
						return getSpecialPrefixItem(typ, adj);
					} else {
						return getWildernessItem(typ, adj);
					}
			
			case "construction_city":
				return getCityItem(typ, adj);
				
			case "political_nation":
				return getWildernessItem(typ, adj);
			
			case "tomb_room":
			case "temple_room":
			case "cavern_room":
			case "magical_room":
			case "dungeon_room":
			case "any_dungeon_room":
				return getDungeonItem(typ, adj);
				
			case "construction_tavern":
				return getTavernItem(typ, adj);
			
			case "natural_river":
				return getRiverItem(typ, adj);
			
			case "deity":
				return getDeity(typ, adj);
			
			default:
				return getWildernessItem(typ, adj);
		}	
}

const getCityItem = (typ:string, adj:string) => (
  `${getBase(typ, adj)} ${getPerpositionalPhrase(typ, adj)}`
)



const getTavernItem= (typ: string, adj: string) => {
	const r = getRandom(100);
		if (r <= 17) {
			return `${getBase(typ, adj)} ${getPerpositionalPhrase(typ, adj)}`			
		} else if (r > 17 && r <= 34) {
      return `The ${getItem(allLists.tavern_objects)} and the ${getItem(allLists.tavern_objects)} ${getBase(typ, adj)}`			
		} else if (r > 34 && r <= 51) {
      return `${getOptionalAdjective(typ, adj)} ${getBase(typ, adj)}`			
		} else if (r > 51 && r <= 68) {
      return `${getItem(allLists.base_adjective)} ${getItem(allLists.possessive)} ${getBase(typ, adj)}`			
		} else if (r > 68 && r <= 85) {
      return `The ${getItem(allLists.tavern_objects)} and ${getItem(allLists.tavern_objects)} ${getBase(typ, adj)}`			
		} else {
      return `The ${getItem(allLists.tavern_participle)} ${getBase(typ, adj)}`
		}		
}


const getRiverItem= (typ: string, adj: string) => {
	const r = getRandom(100);
		if (r <= 25) {
      return `${getItem(allLists.natural_river_adjective)} ${getBase(typ, adj)}`			
		} else if (r > 25 && r <= 75) {
      return `${getTwoWordItem(typ, adj)} ${getBase(typ, adj)}`		
		} else {
      return `${getItem(allLists.optional_adjective)} ${getItem(allLists.natural_river_adjective)} ${getBase(typ, adj)}`
		}
}


// DUNGEON ROOMS

const getDungeonItem= (typ: string, adj: string) => {
	const r = getRandom(100);
	if (typ == "any_dungeon_room") {
		typ = getItem(allLists.any_dungeon_type);
	}
	
		if (r <= 25) {	
			let theArray;
				for (var i=0; i<allLists.special_arrays.length; i++) {
					 if (allLists.special_arrays[i].type == typ) {
						 if (allLists.special_arrays[i].unique) 	{
							theArray = allLists.special_arrays[i].unique;
						 }
					 }
				}				
				if (!theArray) {
          return `${getDungeonAdjective(typ, adj)} ${getBase(typ, adj)}`
				} else {
					return getItem(theArray);
				}
			
		} else if (r > 25 && r <= 50) {
      return `${getDungeonOptionalAdjective(typ, adj)} ${getBase(typ, adj)}`				
		} else if (r > 50 && r <= 75) {
      return `${getDungeonAdjective(typ, adj)} ${getBase(typ, adj)}`			
		} else if (r > 75 && r <= 94) {
      return `${getBase(typ, adj)} ${getDungeonPerpositionalPhrase(typ, adj)}`			
		} else if (r > 94 && r <= 96) {
      return `${getDungeonOptionalAdjective(typ, adj)} ${getDungeonAdjective(typ, adj)} ${getBase(typ, adj)}`			
		} else if (r > 96 && r <= 98) {
      return `${getDungeonAdjective(typ, adj)} ${getBase(typ, adj)} ${getDungeonPerpositionalPhrase(typ, adj)}`			
		} else if (r > 98 && r <= 100) {
      return `${getDungeonOptionalAdjective(typ, adj)} ${getBase(typ, adj)} ${getDungeonPerpositionalPhrase(typ, adj)}`			
		}
}


const getDungeonOptionalAdjective= (typ: string, adj: string) => {
		const r = getRandom(100);
		
			if (r <= 33) {
				let theArray = allLists.possessive;
        for (var i=0; i<allLists.special_arrays.length; i++) {
            if (allLists.special_arrays[i].type == typ) {
              if (allLists.special_arrays[i].possessive) 	{
              theArray = allLists.special_arrays[i].possessive;
              }
            }
        }
				return getItem(theArray) + "'s";
			} else {
				return getItem(allLists.optional_adjective);
			}
}

const getDungeonAdjective= (typ: string, adj: string) => {
				let theArray = allLists.base_adjective;
        
					for (var i=0; i<allLists.special_arrays.length; i++) {
						 if (allLists.special_arrays[i].type == typ) {
							 if (allLists.special_arrays[i].adjective) 	{
							 	theArray = allLists.special_arrays[i].adjective;
							 }
						 }
					}
				return getItem(theArray);
}

const getDungeonPerpositionalPhrase= (typ: string, adj: string) => {
	//determine which will be used " "of" + plural, or "of the" + singular
	// determine which array to use
	
	let adjArray = allLists.base_adjective;
	let prepArray = allLists.prepositional_plural;

		for (var i=0; i<allLists.special_arrays.length; i++) {
			 if (allLists.special_arrays[i].type == typ) {
				//  if (allLists.special_arrays[i].adjective) 	{
				// 	adjArray = allLists.special_arrays[i].adjective;
				//  }
				  if (allLists.special_arrays[i].perpositional) 	{
					adjArray = allLists.special_arrays[i].adjective;
					prepArray = allLists.special_arrays[i].perpositional;
				 }
			 }
		}
	
		const r = getRandom(100);
		
			if (r <= 17) {
        return `of ${getPlural( getItem(prepArray) )}`						
			} else if (r > 17 && r <= 34) {
        return `of the ${getItem(prepArray)}`				
			} else if (r > 34 && r <= 51) {
        return `of ${getItem(prepArray)}`				
			} else if (r > 51 && r <= 68) {
        return `of ${getItem(adjArray)} ${getPlural( getItem(prepArray) )}`				
			} else if (r > 68 && r <= 85) {
        return `of ${getItem(adjArray)} ${getItem(prepArray)}`				
			} else if (r > 85 && r <= 100) {
        return `of the ${getItem(adjArray)} ${getItem(prepArray)}`
			}
}


// WILDERNESS ITEMS

const getSpecialPrefix= (typ: string, adj: string) => {
		for (let i=0; i<allLists.special_arrays.length; i++) {
			 if (allLists.special_arrays[i].type == typ) {
				 if (allLists.special_arrays[i].prefix) {
				 	return getItem( allLists.special_arrays[i].prefix );
				 }
			 }
		}

	return '';	
}

const getSpecialPrefixItem= (typ: string, adj: string) => {
  return `${getSpecialPrefix(typ, adj)}${getTwoWordItem(typ, adj)}`				
}

const getTwoWordItem= (typ: string, adj: string) => {
  return `${getPrefix(typ, adj)}${getSuffix(typ)}`
}

const getWildernessItem = (type: string, adj: string) => {
	
	const r = getRandom(100);
  let typ = getItem(allLists.base_type);
	
	if (type == "base") {
		typ = getItem(allLists.base_type);
	} else if (type == "natural") {
		typ = getItem(allLists.natural_type);
	} else if (type == "construction") {
		typ = getItem(allLists.construction_type);
	}
  // return `${getOptionalAdjective(typ, adj)} ${getAdjective(typ, adj)} ${getBase(typ, adj)} ${getPerpositionalPhrase(typ, adj)}`	
		if (r <= 1) {
      return `${getOptionalAdjective(typ, adj)} ${getAdjective(typ, adj)} ${getBase(typ, adj)} ${getPerpositionalPhrase(typ, adj)}`			
		} else if (r > 1 && r <= 25) {
      return `${getOptionalAdjective(typ, adj)} ${getBase(typ, adj)}`			
		} else if (r > 25 && r <= 75) {
      return `${getAdjective(typ, adj)} ${getBase(typ, adj)}`			
		} else if (r > 75 && r <= 94) {
      return `${getBase(typ, adj)} ${getPerpositionalPhrase(typ, adj)}`			
		} else if (r > 94 && r <= 96) {
      return `${getOptionalAdjective(typ, adj)} ${getAdjective(typ, adj)} ${getBase(typ, adj)}`			
		} else if (r > 96 && r <= 98) {
      return `${getAdjective(typ, adj)} ${getBase(typ, adj)} ${getPerpositionalPhrase(typ, adj)}`			
		} else if (r > 98 && r <= 100) {
      return `${getOptionalAdjective(typ, adj)} ${getBase(typ, adj)} ${getPerpositionalPhrase(typ, adj)}`			
		}
}


const  getPrefix= (typ: string, adj: string) => {
		return getItem(allLists.prefixes);
}

const getSuffix = (typ: string) => {
	let theArray = allLists.suffixes;
		for (let i=0; i<allLists.special_arrays.length; i++) {
			 if (allLists.special_arrays[i].type == typ) {
				 if (allLists.special_arrays[i].suffix) {
					const r = getRandom(100);
						if (r <= 90) {
							theArray = allLists.special_arrays[i].suffix;
						}
				 }
			 }
		}
		return getItem(theArray).toLowerCase();
}


const getAdjective= (typ: string, adj: string) => {
  // const theArray= allLists.base_adjective

		const r = getRandom(100);
			if (r <= 50) {
				return `${getPrefix(typ, adj)}${getSuffix(typ)}`;
			} else {
				let theArray = allLists.base_adjective;
					for (let i=0; i<allLists.special_arrays.length; i++) {
						 if (allLists.special_arrays[i].type == typ) {
							 if (allLists.special_arrays[i].adjective) 	{
							 	theArray = allLists.special_arrays[i].adjective;
							 }
						 }
					}
				return getItem(theArray);
			}
}

const getBase= (typ: string, adj: string) => {
  const itm = allLists[typ as keyof typeof allLists]
	return getItem(itm);
}

const getPerpositionalPhrase= (typ: string, adj: string) => {
		const r = getRandom(100);
			if (r <= 17) {
        return `of ${getPlural( getItem(allLists.prepositional_plural) )}`			
			} else if (r > 17 && r <= 34) {
        return `of the ${getItem(allLists.prepositional_plural)}`			
			} else if (r > 34 && r <= 51) {
        return `of ${getItem(allLists.prepositional_singular)}`				
			} else if (r > 51 && r <= 68) {
        return `of ${getItem(allLists.base_adjective)} ${getPlural( getItem(allLists.prepositional_plural) )}`			
			} else if (r > 68 && r <= 85) {
        return `of the ${getItem(allLists.base_adjective)} ${getItem(allLists.prepositional_plural)}`				
			} else if (r > 85 && r <= 100) {
        return `of the ${getItem(allLists.base_adjective)} ${getItem(allLists.prepositional_singular)}`
			}
}

const getPlural = (str: string) => {
	//Plurals formed by simply adding a final "-es", 
	//usually with words ending in an "-s", "-ss", "-ch", "-sh", "-x", or "-o".
	const lastChar = str.charAt(str.length-1);
		switch(lastChar) {
			case "s":
			case "x":
			case "o":
				return `${str}es`;
				
			case "h":
				const nextLastChar = str.charAt(str.length-2);
				switch(nextLastChar) {
					case "s":
					case "c":
            return `${str}es`;
				}	
				
			default:
				return `${str}s`;
			
		}
}

const getPossessive = (str: string) => {
	return `${str}'s`;
}


const getOptionalAdjective= (typ: string, adj: string) => {
		const r = getRandom(100);
			if (r <= 33) {
				return getPossessive( getItem(allLists.possessive) );
			} else {
				return getItem(allLists.optional_adjective);
			}
}


// DEITIES & DEMIGODS

	
	const getGender = () => {
			const r = getRandom(100);
				if (r <= 50) {
					return 'Male';
				} else {
					return 'Female';
				}
	}
	
	const getAlignment = () => {
			const r = getRandom(100);
				if (r <= 34) {
					return 'Good';
				} else if (r > 34 && r <= 67) {
					return 'Evil';
				} else {
					return 'Neutral';
				}
	}
	
	
	const getTitle = (algn:string, gndr: string) => {
		let str =', ';
		const r = getRandom(100);
		
			if (r <= 25 || r >= 75 ) {
        //add title prefix
				if (algn == "Good") {
					str += getItem(allLists.d_title_prefix_good) + " ";
				} else if (algn == "Evil") {
					str += getItem(allLists.d_title_prefix_evil) + " ";
				} else {
					str += getItem(allLists.d_title_prefix_neutral) + " ";
				}
			}
		
			if (r <= 50) {
				if (algn == "Good") {
					str += getItem(allLists.d_title_good);
				} else if (algn == "Evil") {
					str += getItem(allLists.d_title_evil);
				} else {
					str += getItem(allLists.d_title_neutral);
				}	
			} else if (r > 50) {	
				if (gndr == "Male") {
					str += getItem(allLists.d_title_male);
				} else if (gndr == "Female") {
					str += getItem(allLists.d_title_female);
				}	
			}

			str += ' of ';
		
	return str;
		
	}
	
	const getSilly = () => {
		const r = getRandom(100);
		const a = getItem(allLists.d_silly);
		let b = a;
    while ( a == b ) {
      b = getItem(allLists.d_silly);
    }
    const str = a + b.toLowerCase(); 
    if (r <= 25) {
      return getPlural(str);
    }
    return str;	
	}

  const getNasty = () => {
		const r = getRandom(100);
		const a = getItem(allLists.d_nasty);
		let b = a;
    while ( a == b ) {
      b = getItem(allLists.d_nasty);
    }
    const str = a + b.toLowerCase(); 
    if (r <= 25) {
      return getPlural(str);
    }
    return str;	
	}
	
	
const getSurname = (algn: string) => {
		const r = getRandom(100);
			if (r <= 25) {
				if (algn =="Good") {
          return ` the ${getItem(allLists.d_surname_good)}`
				} else if (algn =="Evil") {
          return ` the ${getItem(allLists.d_surname_evil)}`
				} else {
          return ` the ${getItem(allLists.d_surname_neutral)}`
				}
				
			} else if (r > 26 && r <= 35) {
        return ` the ${getTwoWordItem("Deity", '')}`
				
			} else if (r > 36 && r <= 55) {	
				if (algn =="Male") {
          return ` the ${getItem(allLists.d_surname_male)}`
				} else {
          return ` the ${getItem(allLists.d_surname_female)}`
				}
				
			} else if (r > 56 && r <= 88) {
				if (algn =="Good") {
          return ` the ${getSilly()}`
				} else if (algn =="Evil") {
          return ` the ${getNasty()}`
				} else {
          return ` the ${getSilly()}`
				}	
			}
		
	return '';		
	}
	
	
	const getDName = (algn: string, gndr: string) => {
		// const r = getRandom(100);
		return getLongName();
	}
	
	const getShortName = () => {
		return `${getItem(allLists.s_pre)} ${getItem(allLists.s_mid)} ${getItem(allLists.s_suf)}`;
	}
	
	export const getLongName = () => {
		return` ${getItem(allLists.l_pre)} ${getItem(allLists.l_mid)} ${getItem(allLists.l_suf)}`;
	}
	
	
	
	const getDeity= (typ: string, adj: string) => {
		var str ='';
		
		const gender = getGender();
		const align = getAlignment();
		let name;
		// let surname;
		let domain;
		
		str = getDName(align, gender);
		

		if ( gender == 'Male' ) {
			name = getItem(allLists.d_name_male); 
		} else {
			name = getItem(allLists.d_name_female); 
		}

		if ( align == 'Good' ) {
			// surname = getItem(allLists.d_surname_good);
			domain = getItem(allLists.d_domain_good);
		} else if ( align == 'Evil' ) {
			// surname = getItem(allLists.d_surname_evil);
			domain = getItem(allLists.d_domain_evil);
		} else {
			// surname = getItem(allLists.d_surname_neutral);
			domain = getItem(allLists.d_domain_neutral);
		}
		
		// const title = getTitle(align, gender);
		
		return `${getSurname(align)} ${getTitle(align, gender)} ${domain}`;
	}
	
