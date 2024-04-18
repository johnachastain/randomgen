import { GridItem, Edge, Edges, Geomorph } from "../model/Geomorph";
import { geomorphs } from './geomorphConfig'

const  getRandom = (n: number) => {
	return Math.floor(Math.random()*n);
}

// const geomorphs: any = []

export const getEdges = (
  array: GridItem[], column: number, row: number, columns: number, rows: number
) => {  
  const above: GridItem | undefined = array.find(
    (i: any) =>  i.row === row - 1 && i.column === column)
  const prev: GridItem | undefined = array.find(
    (i: any) =>  i.column === column - 1 && i.row === row)

  // const below = array.find(
  //   (i: any) =>  i.row === row + 1 && i.column === column)
  // const next = array.find(
  //   (i: any) =>  i.column === column + 1 && i.row === row)

  const top = row === 1 ? "closed" : above?.geomorph.edges?.bottom
  const right = column === columns ? "closed" : undefined
  const bottom = row === rows ? "closed" : undefined
  const left = column === 1 ? "closed" : prev?.geomorph.edges?.right

  return { top, right, bottom, left }
}

export const getGrid = (columns: number, rows: number): GridItem[] => {
	const maxNum = columns * rows
	let row = 0
	let column = 0
	let grid: GridItem[] = []
	for (let i=1; i<= maxNum; i++) {
		const modulo = i % columns
		if (modulo === 1) {
			row++
			column = 1
		} else {
			column++
		}
		const edges = getEdges(grid, column, row, columns, rows )

    const available = geomorphs.filter((g: any) => {
      const t = edges.top ? g.edges.top === edges.top : true
      const r = edges.right ? g.edges.right === edges.right : true
      const b = edges.bottom ? g.edges.bottom === edges.bottom : true
      const l = edges.left ? g.edges.left === edges.left : true
      return t && r && b && l
    })
    const geomorph = available[ getRandom(available.length) ]

		let item: GridItem = { 
			column, 
			row, 
			edges,
      geomorph
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
  let mapArray: any[] = [];
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

        if (itemParams.top != geomorphs[j].edges.top ) {
              isAvailableArray[j] = false;
        }

        if (itemParams.left != geomorphs[j].edges.left ) {
              isAvailableArray[j] = false;
        }


        if (itemParams.right != "any") {
          if (itemParams.right != geomorphs[j].edges.right ) {
                isAvailableArray[j] = false;
          }
        }
        
        if (itemParams.bottom != "any") {
          if (itemParams.bottom != geomorphs[j].edges.bottom ) {
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
        // mapArray[i] = error;
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

	

