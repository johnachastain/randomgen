const  getRandom = (n: number) => {
	return Math.floor(Math.random()*n);
}

export const geomorphs = [
{	type: "solid",
	src: "images/00.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "open",
	src: "images/01.gif",
	top: "open",
	right: "open",
	bottom: "open",
	left: "open",
	top_left: "open",
	top_right: "open",
	bottom_left: "open",
	bottom_right: "open",
	nodes: [ 	{	x: 100, y: 100, prop: "normal" },
				{	x: 200, y: 150, prop: "trap"	}	]
},
{	type: "",
	src: "images/02.gif",
	top: "connect",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/03.gif",
	top: "closed",
	right: "connect",
	bottom: "connect",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/04.gif",
	top: "closed",
	right: "closed",
	bottom: "connect",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/05.gif",
	top: "closed",
	right: "closed",
	bottom: "connect",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/06.gif",
	top: "closed",
	right: "closed",
	bottom: "open",
	left: "open",
	top_left: "open",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/07.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/08.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "closed",
	top_left: "open",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/09.gif",
	top: "closed",
	right: "closed",
	bottom: "connect",
	left: "closed",
	top_left: "closed",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/10.gif",
	top: "closed",
	right: "closed",
	bottom: "connect",
	left: "closed",
	top_left: "open",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/11.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/12.gif",
	top: "connect",
	right: "closed",
	bottom: "connect",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/13.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/14.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/15.gif",
	top: "connect",
	right: "connect",
	bottom: "connect",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/16.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/17.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/18.gif",
	top: "closed",
	right: "closed",
	bottom: "open",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/19.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/20.gif",
	top: "connect",
	right: "closed",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/21.gif",
	top: "connect",
	right: "closed",
	bottom: "open",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/22.gif",
	top: "connect",
	right: "connect",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/23.gif",
	top: "closed",
	right: "connect",
	bottom: "connect",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/24.gif",
	top: "connect",
	right: "connect",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/25.gif",
	top: "connect",
	right: "connect",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/26.gif",
	top: "connect",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/27.gif",
	top: "connect",
	right: "closed",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/28.gif",
	top: "closed",
	right: "open",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/29.gif",
	top: "connect",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/30.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "open",
	top_left: "open",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/31.gif",
	top: "closed",
	right: "open",
	bottom: "closed",
	left: "connect",
	top_left: "closed",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/32.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/33.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "open",
	top_left: "open",
	top_right: "closed",
	bottom_left: "open",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/34.gif",
	top: "connect",
	right: "connect",
	bottom: "connect",
	left: "closed",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/35.gif",
	top: "connect",
	right: "closed",
	bottom: "connect",
	left: "connect",
	top_left: "closed",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/36.gif",
	top: "open",
	right: "closed",
	bottom: "closed",
	left: "open",
	top_left: "open",
	top_right: "open",
	bottom_left: "open",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/37.gif",
	top: "open",
	right: "open",
	bottom: "closed",
	left: "closed",
	top_left: "open",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/38.gif",
	top: "closed",
	right: "open",
	bottom: "open",
	left: "closed",
	top_left: "closed",
	top_right: "open",
	bottom_left: "open",
	bottom_right: "open",
	nodes: []
},
{	type: "",
	src: "images/39.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "closed",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/40.gif",
	top: "open",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "open",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/41.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "closed",
	top_left: "open",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/42.gif",
	top: "closed",
	right: "closed",
	bottom: "connect",
	left: "connect",
	top_left: "closed",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/43.gif",
	top: "open",
	right: "closed",
	bottom: "connect",
	left: "closed",
	top_left: "open",
	top_right: "open",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
},
{	type: "",
	src: "images/44.gif",
	top: "closed",
	right: "connect",
	bottom: "connect",
	left: "closed",
	top_left: "open",
	top_right: "closed",
	bottom_left: "closed",
	bottom_right: "closed",
	nodes: []
}

];

export const error = {	type: "",
	src: "images/error.gif",
	top: "any",
	right: "any",
	bottom: "any",
	left: "any",
	top_left: "any",
	top_right: "any",
	bottom_left: "any",
	bottom_right: "any",
	nodes: []
}
export type GridItem = {
	column: number,
	row: number,
	geomorph: any,
	type: string
}

export const getGrid = (columns: number, rows: number): GridItem[] => {
	const maxNum = columns * rows
	let row = 0
	let column = 0
	let grid: GridItem[] = []
	for (let i=1; i< maxNum; i++) {
		const modulo = i % columns
		if (modulo === 1) {
			row++
			column = 1
		} else {
			column++
		}
		const edges = {
			top: row === 1 ? "closed" : "any",
			right: column === columns ? "closed" : "any",
			bottom: row === rows ? "closed" : "any",
			left: column === 1 ? "closed" :"any"
		}

		let item: GridItem = { 
			column, 
			row, 
			geomorph: { edges }, 
			type: ''
		}

		grid = [ ...grid, item]
	}
	return grid
}

export const getGeomorphMap = () => {
  // number of cols excluding first/left and last/right
  const cols = 10;
  // number of cols excluding first/top and last/bottom
  const rows = 10;
  // pixel dimensions of geomorphs
  const gridH = 120;
  const gridW = 120;

  const mapW = gridW * (cols +2);
  const mapH = gridH * (rows +2);
  // total number of geomorphs
  const maxNum = (cols + 2) * (rows + 2);
  let mapArray =[];
  let tempArray = [];


      
  // assign outer border solid grid items to array first
  for (let i=0; i< maxNum; i++) {
    // first twelve are top row
    if ( i < (cols + 2) ) {
      mapArray[mapArray.length] = geomorphs[0];
      
      // last last row on bottom
    } else if (i >= ((cols + 2)  * (rows + 1)) ) {
      mapArray[mapArray.length] = geomorphs[0];

    } else {
      // far right column
      if (i % (cols+2) == 0 ) {
        mapArray[mapArray.length] = geomorphs[0];	

        // far left column
      } else if (i % (cols+2) == (cols +1) ) {
        mapArray[mapArray.length] = geomorphs[0];

        // everything else
      } else {
        mapArray[mapArray.length] = { type: "empty", src: "images/01.gif", top: "any", right: "any", bottom: "any", left: "any", top_left: "any", top_right: "any", bottom_left: "any", bottom_right: "any" };
      }
    }
  }
    
  const getParams = (i: any) => {        
    const outerVals = { 	
		top: mapArray[i - (cols + 2)].bottom,
      	bottom: mapArray[i + (cols + 2)].top,
      	left: mapArray[i - 1].right,
      	right: mapArray[i + 1].left,
	}
    return outerVals;
  }
      
  // assign random items to remaining grid

  for (let i=0; i< mapArray.length; i++) {
    if (mapArray[i].type != 'solid') {

      tempArray = []; //clear array
      const isAvailableArray = [];
        for (let j=0; j< geomorphs.length; j++) {
          isAvailableArray[j] = true;
        }
      const itemParams = getParams(i);

      for (let j=0; j< geomorphs.length; j++) {

        if (itemParams.top != geomorphs[j].top ) {
              isAvailableArray[j] = false;
        }

        if (itemParams.left != geomorphs[j].left ) {
              isAvailableArray[j] = false;
        }


        if (itemParams.right != "any") {
          if (itemParams.right != geomorphs[j].right ) {
                isAvailableArray[j] = false;
          }
        }
        
        if (itemParams.bottom != "any") {
          if (itemParams.bottom != geomorphs[j].bottom ) {
                isAvailableArray[j] = false;
          }
        }
        
      }

      for (let j=0; j< geomorphs.length; j++) {
        if (isAvailableArray[j] == true) {
          tempArray[tempArray.length] = geomorphs[j];
        } 
      }
    
      if (tempArray.length != 0) {
      //randomly pick one of the remaining items in the tempArray
        const selectedIndex = getRandom(tempArray.length);
        mapArray[i] = tempArray[selectedIndex];

      } else {
      // catch errors if there are no items left in tempArray
        mapArray[i] = error;
      }
    }
  }
  
  for (let i=0; i< mapArray.length; i++) {
    // currentImg = $('<img />').attr('src', mapArray[i].src).load(function(){ });
    let alt = " " + i;
      alt += " | top: " + mapArray[i].top;
      alt += " | left: " + mapArray[i].left;
      alt += " | right: " + mapArray[i].right;
      alt += " | bottom: " + mapArray[i].bottom;
      alt += " | top_left: " + mapArray[i].top_left;
      alt += " | top_right: " + mapArray[i].top_right;
      alt += " | bottom_left: " + mapArray[i].bottom_left;
      alt += " | bottom_right: " + mapArray[i].bottom_right;
      
  }

}

	

