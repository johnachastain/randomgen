const pluralize = (this, count) => {
  if (count && count <= 1) {
    return this
  }

  const plural = {
      '(quiz)$'               : "$1zes",
      '^(ox)$'                : "$1en",
      '([m|l])ouse$'          : "$1ice",
      '(matr|vert|ind)ix|ex$' : "$1ices",
      '(x|ch|ss|sh)$'         : "$1es",
      '([^aeiouy]|qu)y$'      : "$1ies",
      '(hive)$'               : "$1s",
      '(?:([^f])fe|([lr])f)$' : "$1$2ves",
      '(shea|lea|loa|thie)f$' : "$1ves",
      'sis$'                  : "ses",
      '([ti])um$'             : "$1a",
      '(tomat|potat|ech|her|vet)o$': "$1oes",
      '(bu)s$'                : "$1ses",
      '(alias)$'              : "$1es",
      '(octop)us$'            : "$1i",
      '(ax|test)is$'          : "$1es",
      '(us)$'                 : "$1es",
      '([^s]+)$'              : "$1s"
  };

  const irregular = {
      'move'   : 'moves',
      'foot'   : 'feet',
      'goose'  : 'geese',
      'sex'    : 'sexes',
      'child'  : 'children',
      'man'    : 'men',
      'tooth'  : 'teeth',
      'person' : 'people'
  };

  const uncountable = [
      'sheep', 
      'fish',
      'deer',
      'moose',
      'series',
      'species',
      'money',
      'rice',
      'information',
      'equipment'
  ];

  if(uncountable.indexOf(this.toLowerCase()) >= 0)
    return this;

  for (let word in irregular) {
    const pattern = new RegExp(word+'$', 'i');
    const replace = irregular[word];

    if (pattern.test(this)) {
      return this.replace(pattern, replace);
    }
  }

  let array = plural;

  // check for matches using regular expressions
  for (let reg in array){
    const pattern = new RegExp(reg, 'i');

    if (pattern.test(this)) {
      return this.replace(pattern, array[reg]);
    }
  }

  return this;
}