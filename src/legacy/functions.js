function getRandom(n) {
	return Math.floor(Math.random()*n);
}

function getItem(arr) {
	var itm = arr[ getRandom(arr.length) ];
	
	if (typeof itm == 'object' ) {
		return getItem(itm);
		
	} else if (typeof itm == 'string' ) {
		return itm;
	}
	
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

function getSyntaxList(n, typ, adj) {
	var str ='';
		for ( var i = 0; i < n; i++ ) {
			str += '<li>';
			str += '<span class="itmnum"></span>';
			str += '<input name="itm' + i + '" type="checkbox" class="chkbx" />';
			str += ' ';
			str += '<span class="itmtxt">';
				str += getSyntax(typ, adj);
			str += '</span>';
			str += '<input  size="20" type="text" class="edittxtfld" />';
			str += '<span class="btns">';
				str += '<input type="button" value="Edit" class="editbtn" />';
				str += '<input type="button" value="Save" class="savebtn" />';
			str += '</span>';
			str += '</li>';
		}
	return str;
}

function loopArray(arr, base) {
	var str ='';
	
		for ( var i = 0; i < arr.length; i++ ) {
			var itm = arr[i];
				if (typeof itm == 'object' ) {
					str += loopArray(itm, base);
					
				} else if (typeof itm == 'string' ) {
					str += '<li>';
					str += '<input name="itm' + i + '" type="checkbox" class="chkbx" />';
					str += ' ';
					str += itm + ' ' + base;
					str += '</li>';
				}
		}
	return str;	
}


// open issues exceptions to certain combinations


function getSyntax(typ, adj) {
	var str ='';
	var r = getRandom(100);;
	
		switch(typ) {
			case "construction_town":
				str = getTwoWordItem(typ, adj);
				break;
			
			case "construction_fortification":
			case "natural_mountain":
				r = getRandom(100);
					if (r <= 25) {
						str = getSpecialPrefixItem(typ, adj);
					} else {
						str = getWildernessItem(typ, adj);
					}
				break;
			
			case "construction_city":
				str = getCityItem(typ, adj);
				break;
				
			case "political_nation":
				str = getWildernessItem(typ, adj);
				break;
			
			case "tomb_room":
			case "temple_room":
			case "cavern_room":
			case "magical_room":
			case "dungeon_room":
			case "any_dungeon_room":
				str = getDungeonItem(typ, adj);
				break;
				
			case "construction_tavern":
				str = getTavernItem(typ, adj);
			break;
			
			case "natural_river":
				str = getRiverItem(typ, adj);
			break;
			
			case "deity":
				str = getDeity(typ, adj);
			break;
			
			
			default:
				str = getWildernessItem(typ, adj);
				break;
		}

	return str;		
}

function getCityItem(typ, adj) {
	var str ='';
		str += getBase(typ, adj);
		str += ' ';
		str += getPerpositionalPhrase(typ, adj);
	return str;	
}

function getTavernItem(typ, adj) {
	var str ='';
	var r = getRandom(100);
		if (r <= 17) {
			str += getBase(typ, adj);
			str += ' ';
			str += getPerpositionalPhrase(typ, adj);
			
		} else if (r > 17 && r <= 34) {
			str += "The ";
			str += getItem(tavern_objects);
			str += " and the ";
			str += getItem(tavern_objects);
			str += ' ';
			str += getBase(typ, adj);
			
		} else if (r > 34 && r <= 51) {
			str += getOptionalAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			
		} else if (r > 51 && r <= 68) {
			str += getItem(base_adjective);
			str += ' ';
			str += getItem(possessive);
			str += ' ';
			str += getBase(typ, adj);
			
		} else if (r > 68 && r <= 85) {
			str += "The ";
			str += getItem(tavern_objects);
			str += " and ";
			str += getItem(tavern_objects);
			str += ' ';
			str += getBase(typ, adj);
			
		} else {
			str += "The ";
			str += getItem(tavern_participle);
			str += ' ';
			str += getBase(typ, adj);
		}	
	return str;	
}


function getRiverItem(typ, adj) {
	var str ='';
	var r = getRandom(100);
		if (r <= 25) {
			str += getItem(natural_river_adjective);
			str += ' ' ;
			str += getBase(typ, adj);
			
		} else if (r > 25 && r <= 75) {
			str += getTwoWordItem(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
		
		} else {
			str += getItem(optional_adjective);
			str += ' ' ;
			str += getItem(natural_river_adjective);
			str += ' ' ;
			str += getBase(typ, adj);
		}
	return str;	
}


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DUNGEON ROOMS
	================================================================================ */

function getDungeonItem(typ, adj) {
	var str ='';
	
	var r = getRandom(100);
	
	if (typ == "any_dungeon_room") {
		typ = getItem(any_dungeon_type);
	}
	
		if (r <= 25) {
			
			var theArray;
				for (var i=0; i<special_arrays.length; i++) {
					 if (special_arrays[i].type == typ) {
						 if (special_arrays[i].unique) 	{
							theArray = special_arrays[i].unique;
						 }
					 }
				}
				
				if (!theArray) {
					str += getDungeonAdjective(typ, adj);
					str += ' ';
					str += getBase(typ, adj);
				} else {
					str += getItem(theArray);
				}
			
		} else if (r > 25 && r <= 50) {
			
			str += getDungeonOptionalAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
				
		} else if (r > 50 && r <= 75) {
			
			str += getDungeonAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			
		
		} else if (r > 75 && r <= 94) {
			
			str += getBase(typ, adj);
			str += ' ';
			str += getDungeonPerpositionalPhrase(typ, adj);
			
		} else if (r > 94 && r <= 96) {
			
			str += getDungeonOptionalAdjective(typ, adj);
			str += ' ';
			str += getDungeonAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			
		} else if (r > 96 && r <= 98) {
			
			str += getDungeonAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			str += ' ';
			str += getDungeonPerpositionalPhrase(typ, adj);
			
		} else if (r > 98 && r <= 100) {
			
			str += getDungeonOptionalAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			str += ' ';
			str += getDungeonPerpositionalPhrase(typ, adj);
			
		}
	return str;		
}


function getDungeonOptionalAdjective(typ, adj) {
	var str ='';
		var r = getRandom(100);
		
			if (r <= 33) {
				//str += getPossessive( getItem(possessive) );
				
				var theArray = possessive;
					for (var i=0; i<special_arrays.length; i++) {
						 if (special_arrays[i].type == typ) {
							 if (special_arrays[i].possessive) 	{
							 	theArray = special_arrays[i].possessive;
							 }
						 }
					}
				str += getItem(theArray) + "'s";
				
				
			} else {
				str += getItem(optional_adjective);
			}
	return str;
}

function getDungeonAdjective(typ, adj) {
	var str ='';
		//var r = getRandom(100);
		
			//if (r <= 50) {
				//str += getPrefix(typ);
				//str += "-";
				//str += getSuffix(typ);
			//} else {
				var theArray = base_adjective;
					for (var i=0; i<special_arrays.length; i++) {
						 if (special_arrays[i].type == typ) {
							 if (special_arrays[i].adjective) 	{
							 	theArray = special_arrays[i].adjective;
							 }
						 }
					}
				str += getItem(theArray);
			//}
	return str;
}

function getDungeonPerpositionalPhrase(typ, adj) {
	//determine which will be used " "of" + plural, or "of the" + singular
	// determine which array to use
	
	var str ='';
	var adjArray = base_adjective;
	var prepArray = prepositional_plural;
		for (var i=0; i<special_arrays.length; i++) {
			 if (special_arrays[i].type == typ) {
				 //if (special_arrays[i].adjective) 	{
					//adjArray = special_arrays[i].adjective;
				 //}
				  if (special_arrays[i].perpositional) 	{
					adjArray = special_arrays[i].adjective;
					prepArray = special_arrays[i].perpositional;
				 }
			 }
		}
	
		var r = getRandom(100);
		
			if (r <= 17) {
				str += "of ";
				str += getPlural( getItem(prepArray) );
						
			} else if (r > 17 && r <= 34) {
				str += "of the ";
				str += getItem(prepArray);
				
			} else if (r > 34 && r <= 51) {
				str += "of ";
				str += getItem(prepArray);
				
				
			} else if (r > 51 && r <= 68) {
				str += "of ";
				str += getItem(adjArray);
				str += ' ';
				str += getPlural( getItem(prepArray) );
				
			} else if (r > 68 && r <= 85) {
				str += "of the ";
				str += getItem(adjArray);
				str += ' ';
				str += getItem(prepArray);
				
			} else if (r > 85 && r <= 100) {
				str += "of the ";
				str += getItem(adjArray);
				str += ' ';
				str += getItem(prepArray);
			}
		
	return str;
}


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	WILDERNESS ITEMS
	================================================================================ */

function getSpecialPrefix(typ, adj) {
	var str ='';
	
		for (var i=0; i<special_arrays.length; i++) {
			 if (special_arrays[i].type == typ) {
				 if (special_arrays[i].prefix) {
				 	str += getItem( special_arrays[i].prefix );
				 }
			 }
		}

	return str;	
}

function getSpecialPrefixItem(typ, adj) {
	var str ='';
		str += getSpecialPrefix(typ, adj);
		str += ' ';
		str += getTwoWordItem(typ, adj);		
	return str;			
}

function getTwoWordItem(typ, adj) {
	var str ='';
		str += getPrefix(typ, adj);
		str += getSuffix(typ, adj);		
	return str;		
}

function getWildernessItem(typ, adj) {
	var str ='';
	
	var r = getRandom(100);
	
	if (typ == "base") {
		typ = getItem(base_type);
	} else if (typ == "natural") {
		typ = getItem(natural_type);
	} else if (typ == "construction") {
		typ = getItem(construction_type);
	}
	
		if (r <= 1) {
			
			str += getOptionalAdjective(typ, adj);
			str += ' ';
			str += getAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			str += ' ';
			str += getPerpositionalPhrase(typ, adj);
			
		} else if (r > 1 && r <= 25) {
			
			str += getOptionalAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			
		} else if (r > 25 && r <= 75) {
			
			str += getAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			
			
		} else if (r > 75 && r <= 94) {
			
			str += getBase(typ, adj);
			str += ' ';
			str += getPerpositionalPhrase(typ, adj);
			
		} else if (r > 94 && r <= 96) {
			
			str += getOptionalAdjective(typ, adj);
			str += ' ';
			str += getAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			
		} else if (r > 96 && r <= 98) {
			
			str += getAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			str += ' ';
			str += getPerpositionalPhrase(typ, adj);
			
		} else if (r > 98 && r <= 100) {
			
			str += getOptionalAdjective(typ, adj);
			str += ' ';
			str += getBase(typ, adj);
			str += ' ';
			str += getPerpositionalPhrase(typ, adj);
			
		}
	return str;		
}


function getPrefix(typ, adj) {
	var str ='';
		str += getItem(prefixes);
	return str;
}


function getSuffix(typ) {
	var str ='';
	var theArray = suffixes;
		for (var i=0; i<special_arrays.length; i++) {
			 if (special_arrays[i].type == typ) {
				 if (special_arrays[i].suffix) {
					var  r = getRandom(100);
						if (r <= 90) {
							theArray = special_arrays[i].suffix;
						}
				 }
			 }
		}
		str += getItem(theArray).toLowerCase();
	return str;
}


function getAdjective(typ, adj) {
	var str ='';
		var r = getRandom(100);
		
			if (r <= 50) {
				str += getPrefix(typ, adj);
				//str += "-";
				str += getSuffix(typ, adj);
			} else {
				var theArray = base_adjective;
					for (var i=0; i<special_arrays.length; i++) {
						 if (special_arrays[i].type == typ) {
							 if (special_arrays[i].adjective) 	{
							 	theArray = special_arrays[i].adjective;
							 }
						 }
					}
				str += getItem(theArray);
			}
	return str;
}

function getBase(typ, adj) {
	var str ='';
		str += getItem( window[typ] );
	return str;
}

function getPerpositionalPhrase(typ, adj) {
	
	var str ='';
		var r = getRandom(100);
		
			if (r <= 17) {
				str += "of ";
				str += getPlural( getItem(prepositional_plural) );
						
			} else if (r > 17 && r <= 34) {
				str += "of the ";
				str += getItem(prepositional_plural);
				
			} else if (r > 34 && r <= 51) {
				str += "of ";
				str += getItem(prepositional_singular);
				
				
			} else if (r > 51 && r <= 68) {
				str += "of ";
				str += getItem(base_adjective);
				str += ' ';
				str += getPlural( getItem(prepositional_plural) );
				
			} else if (r > 68 && r <= 85) {
				str += "of the ";
				str += getItem(base_adjective);
				str += ' ';
				str += getItem(prepositional_plural);
				
			} else if (r > 85 && r <= 100) {
				str += "of the ";
				str += getItem(base_adjective);
				str += ' ';
				str += getItem(prepositional_singular);
			}
		
	return str;
}

function getPlural(str) {
	//Plurals formed by simply adding a final "-es", 
	//usually with words ending in an "-s", "-ss", "-ch", "-sh", "-x", or "-o".
	var lastChar = str.charAt(str.length-1);
		switch(lastChar) {
			case "s":
			case "x":
			case "o":
				str = str + "es";
				break;
				
			case "h":
				var nextLastChar = str.charAt(str.length-2);
				switch(nextLastChar) {
					case "s":
					case "c":
						str = str + "es";
						break;
				}	
				break;
				
			default:
				str = str + "s";
				break;
			
		}
	return str;
}

function getPossessive(str) {
	return str += "'s";
}


function getOptionalAdjective(typ, adj) {
	var str ='';
		var r = getRandom(100);
		
			if (r <= 33) {
				str += getPossessive( getItem(possessive) );
			} else {
				str += getItem(optional_adjective);
			}
	return str;
}


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DEITIES & DEMIGODS
	================================================================================ */	
	
	function getGender() {
		var str ='';
			var r = getRandom(100);
			
				if (r <= 50) {
					str = 'Male';
				} else {
					str = 'Female';
				}
		return str;
	}
	
	function getAlignment() {
		var str ='';
			var r = getRandom(100);
			
				if (r <= 34) {
					str = 'Good';
				} else if (r > 34 && r <= 67) {
					str = 'Evil';
				} else {
					str = 'Neutral';
				}
		return str;
	}
	
	
	function getTitle(algn, gndr) {
		var str =', ';
		var r = getRandom(100);
		
		
			if (r <= 25 || r >= 75 ) {
				if (algn == "Good") {
					//add title prefix
					str += getItem(d_title_prefix_good) + " ";
				} else if (algn == "Evil") {
					//add title prefix
					str += getItem(d_title_prefix_evil) + " ";
				} else {
					//add title prefix
					str += getItem(d_title_prefix_neutral) + " ";
				}
			}
		
			if (r <= 50) {
				
				if (algn == "Good") {
					str += getItem(d_title_good);
				} else if (algn == "Evil") {
					str += getItem(d_title_evil);
				} else {
					str += getItem(d_title_neutral);
				}
				
			
				
			} else if (r > 50) {
				
				if (gndr == "Male") {
					str += getItem(d_title_male);
				} else if (gndr == "Female") {
					str += getItem(d_title_female);
				}
				
			}
			str += ' of ';
		
	return str;
		
	}
	
	function getSilly() {
		var str ='';
		var r = getRandom(100);
		var a = getItem(d_silly);
		var b = a;
		
			while ( a == b ) {
				var b = getItem(d_silly);
			}
		
			str += a + b.toLowerCase();
			
			if (r <= 25) {
				str = getPlural(str);
			}
		return str;		
	}
	
	function getNasty() {
		var str = '';
		var r = getRandom(100);
		var a = getItem(d_nasty);
		var b = a;
		
			while ( a == b ) {
				var b = getItem(d_nasty);
			}
		
			str += a + b.toLowerCase();
			
			if (r <= 25) {
				str = getPlural(str);
			}
			
		return str;		
	}
	
	
	
	function getSurname(algn) {
		var str =' the ';
		var r = getRandom(100);
		
			if (r <= 25) {
				
				if (algn =="Good") {
					str += getItem(d_surname_good);
				} else if (algn =="Evil") {
					str += getItem(d_surname_evil);
				} else {
					str += getItem(d_surname_neutral);
				}
				
			} else if (r > 26 && r <= 35) {
				
				str = " " + getTwoWordItem("Deity");
				
			} else if (r > 36 && r <= 55) {
				
				if (algn =="Male") {
					str += getItem(d_surname_male);
				} else {
					str += getItem(d_surname_female);
				}
				
			} else if (r > 56 && r <= 88) {
				
				if (algn =="Good") {
					str = " " + getSilly();
				} else if (algn =="Evil") {
					str = " " + getNasty();
				} else {
					str = " " + getSilly();
				}
				
			} else {
				
				str='';
				
			}
		
	return str;
		
	}
	
	
	function getDName(algn, gndr) {
		var str ='';
		var r = getRandom(100);
		//str = getShortName();
		str = getLongName();
			/*if (r <= 50) {
			
			} else if (r > 50) {
					
			}*/
		
		
		return str;
	}
	
	
	
	function getShortName() {
		return getItem(s_pre) + getItem(s_mid) + getItem(s_suf);
	}
	
	function getLongName() {
		return getItem(l_pre) + getItem(l_mid) + getItem(l_suf);
	}
	
	
	
	function getDeity(typ, adj) {
		var str ='';
		
		var gender = getGender();
		var align = getAlignment();
		var name;
		var surname;
		var domain;
		
		str = getDName(align, gender);
		
		/*
		if ( gender == 'Male' ) {
			str = getItem(d_name_male); 
		} else {
			str = getItem(d_name_female); 
		}
		*/
		if ( align == 'Good' ) {
			surname = getItem(d_surname_good);
			domain = getItem(d_domain_good);
		} else if ( align == 'Evil' ) {
			surname = getItem(d_surname_evil);
			domain = getItem(d_domain_evil);
		} else {
			surname = getItem(d_surname_neutral);
			domain = getItem(d_domain_neutral);
		}
		
		var title = getTitle(align, gender);
		
		str += getSurname(align, gender) + getTitle(align, gender) + domain;
		
		return str;
	}
	




/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DOCUMENT READY
	================================================================================ */
	

$(document).ready(function() {
				   
	
	$('#ui #submit').click(function(event) {							
		$(".hint1").hide();
		$(".hint2").show();
			$("#results li").each(function() {		  
					var isChecked = $(this).children(".chkbx").attr("checked");
						if(!isChecked) {
							$(this).remove();
						}
			});						
		$("#results").append( getSyntaxList( $("#num").val(), $("#typ").val(), $("#adj").val() )  );
		//$("#results li").each(function(i) {	
			//$(this).children('.itmnum').html( i+1 + " " );
		//});
		setupBtns();
	});
						   			   

	$('#list_ui #delete').click(function(event) {							
		$("#results li").each(function() {		  
				var isChecked = $(this).children(".chkbx").attr("checked");
					if(!isChecked) {
						$(this).remove();
					}
		});
		
		$("#results li").each(function(i) {					   
			$(this).children('.itmnum').html( i+1 + " " );	
		});
	});
	
	
	$('#list_ui #delete_checked').click(function(event) {							
		$("#results li").each(function() {		  
				var isChecked = $(this).children(".chkbx").attr("checked");
					if(isChecked) {
						$(this).remove();
					}
		});
		
		$("#results li").each(function(i) {					   
			$(this).children('.itmnum').html( i+1 + " " );	
		});
	});
	
	
	$('#list_ui #deselect').click(function(event) {							
		$("#results li").each(function() {		  
				var isChecked = $(this).children(".chkbx").attr("checked", false);
		});
	});
	
		$('#list_ui #select').click(function(event) {							
			$("#results li").each(function() {		  
					var isChecked = $(this).children(".chkbx").attr("checked", true);
			});
		});
		
	
	
	//for (i =0; i < 100; i++) {
		//$("#results").append(getRandom(3) + "<br/>");
	//}
		
	//$("#results").append( loopArray(effect, "Tower") );	
	
	function setupBtns() {
		$("#results li").each(function(i) {					   
			$(this).hover(
				function() {
					$(this).children('.btns').show();
				},
				function() {
					$(this).children('.btns').hide();
				}
			);
			$(this).children('.itmnum').html( i+1 + " " );	
		});
	
		$('#results li .editbtn').click(function(event) {	
			$(this).parent().siblings('.edittxtfld').val( $(this).parent().siblings('.itmtxt').text() );
			$(this).hide();
			$(this).parent().siblings('.itmtxt').hide();
			$(this).parent().siblings('.edittxtfld').show();
			$(this).siblings('.savebtn').show();
		});
		
		
		$('#results li .savebtn').click(function(event) {
			$(this).parent().siblings('.itmtxt').html( $(this).parent().siblings('.edittxtfld').val() );
			$(this).hide();
			$(this).parent().siblings('.edittxtfld').hide();
			$(this).parent().siblings('.itmtxt').show();
			$(this).siblings('.editbtn').show();									 
		});	
	}
	
	
	
	

	
	$("#results").append( getSyntaxList( $("#num").val(), $("#typ").val(), $("#adj").val() ) );
	
	setupBtns();
	
/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	END DOCUMENT READY
	================================================================================ */
	
});
