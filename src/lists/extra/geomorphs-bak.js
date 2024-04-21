function getRandom(n) {
	return Math.floor(Math.random()*n);
}

var cols = 2;
var rows = 2;
var gridH = 12;
var gridW = 12;
//var mapW = gridW * (cols +2);
//var mapH = gridH * (rows +2);

var mapW = (gridW +1) * (cols +2); //for img border debugging
var mapH = (gridH +1) * (rows +2); //for img border debugging

var maxNum = (cols + 2) * (rows + 2);
var mapArray =[];
var tempArray = [];
var tested = false;


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	geomorphs
	================================================================================ */

// dynamically built/sorted array placeholder vars
/*
	var top_open =[];
	var right_open =[];
	var bottom_open =[];
	var left_open =[];
	var top_left_open =[];
	var top_right_open =[];
	var bottom_left_open =[];
	var bottom_right_open =[];
	var right_top_open =[];
	var right_bottom_open =[];
	var left_top_open =[];
	var left_bottom_open =[];
	var top_connect =[];
	var right_connect =[];
	var bottom_connect =[];
	var left_connect =[];
	var top_closed =[];
	var right_closed =[];
	var bottom_closed =[];
	var left_closed =[];
*/

// the base array

var geomorphs = [
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


/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DOCUMENT READY
	================================================================================ */
	

$(document).ready(function() {
		/*   
		// build dynamic arrays, 
		// revision, this may not even be needed
		
		for (i=0; i< geomorphs.length; i++) {
			
			if (!window['top_' + geomorphs[i].top]) {
				window['top_' + geomorphs[i].top] =[];
			}
				window['top_' + geomorphs[i].top].push(geomorphs[i]);
			
			if (!window['bottom_' + geomorphs[i].bottom]) {
				window['bottom_' + geomorphs[i].bottom] =[];
			}
				window['bottom_' + geomorphs[i].bottom].push(geomorphs[i]);
			
			if (!window['left_' + geomorphs[i].left]) {
				window['left_' + geomorphs[i].left] =[];
			}
				window['left_' + geomorphs[i].left].push(geomorphs[i]);
			
			if (!window['right_' + geomorphs[i].right]) {
				window['right_' + geomorphs[i].right] =[];
			}
				window['right_' + geomorphs[i].right].push(geomorphs[i]);
		}
		*/
		
		// assign outer border solid grid items to array first
		for (i=0; i< maxNum; i++) {
			if ( i < (cols + 2) ) {
				mapArray[mapArray.length] = geomorphs[0];
			} else if (i >= ((cols + 2)  * (rows + 1)) ) {
				mapArray[mapArray.length] = geomorphs[0];
			} else {
				if (i % (cols+2) == 0 ) {
					mapArray[mapArray.length] = geomorphs[0];	
				} else if (i % (cols+2) == (cols +1) ) {
					mapArray[mapArray.length] = geomorphs[0];
				} else {
					mapArray[mapArray.length] = { type: "empty", src: "images/01.gif", top: "any", right: "any", bottom: "any", left: "any", top_left: "any", top_right: "any", bottom_left: "any", bottom_right: "any" };
				}
			}
		}
		
			
			function getParams(i) {

				var outerVals = { 	top: mapArray[i - (cols + 2)].bottom,
									bottom: mapArray[i + (cols + 2)].top,
									left: mapArray[i - 1].right,
									right: mapArray[i + 1].left,
										top_left: mapArray[i - 1].top_right,
										top_right: mapArray[i - (cols + 2)].bottom_right,
										bottom_left: mapArray[i - 1].bottom_right,
										bottom_right: mapArray[i + 1].bottom_left
								};
														
				
				return outerVals;
			}
		
		// assign random items to remaining grid
		
		
		for (i=0; i< mapArray.length; i++) {
			if (mapArray[i].type != 'solid') {
				
				tempArray = []; //clear array
				
				var isAvailableArray = []
				for (j=0; j< geomorphs.length; j++) {
					isAvailableArray[j] = true;
				}
				
				var itemParams = getParams(i);
				
				//loop thru geomorph array finding corresponding top value, add these to tempArray
						for (j=0; j< geomorphs.length; j++) {
							
							if (itemParams.top != geomorphs[j].top ) {
										isAvailableArray[j] = false;
							}
							
							if (itemParams.left != geomorphs[j].left ) {
										isAvailableArray[j] = false;
							}
							
								/*
								var isAvailable = false;
								if (itemParams.top == 'any') {
									isAvailable = true;	
								} else {
									if (itemParams.top == geomorphs[j].top ) {
										isAvailable = true;
									}	
								}
									if ( isAvailable ) {
										tempArray[tempArray.length] =  geomorphs[j];
									}
									*/
						}
				
				//loop thru tempArray removing any items that don't have corresponding left value
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								//if (itemParams.left == 'any') {
									//isAvailable = true;	
								//} else {		
									if (itemParams.left == tempArray[j].left ) {
										isAvailable = true;
									}	
								//}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}
						
						
					//top_left 
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								//if (itemParams.top_left == 'any') {
									//isAvailable = true;	
								//} else {		
									if (itemParams.top_left == tempArray[j].top_left ) {
										isAvailable = true;
									}	
								//}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}	
						
						//top_right 
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								//if (itemParams.top_right == 'any') {
									//isAvailable = true;	
								//} else {		
									if (itemParams.top_right == tempArray[j].top_right ) {
										isAvailable = true;
									}	
								//}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}
						
							
					//bottom_left 
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								//if (itemParams.bottom_left == 'any') {
									//isAvailable = true;	
								//} else {		
									if (itemParams.bottom_left == tempArray[j].bottom_left ) {
										isAvailable = true;
									}	
								//}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}	
						
						//bottom_right 
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								if (itemParams.bottom_right == 'any') {
									isAvailable = true;	
								} else {		
									if (itemParams.bottom_right == tempArray[j].bottom_right ) {
										isAvailable = true;
									}	
								}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}
						
				
				
				//bottom
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								if (itemParams.bottom == 'any') {
									isAvailable = true;	
								} else {		
									if (itemParams.bottom == tempArray[j].bottom ) {
										isAvailable = true;
									}
										
								}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}
				
				//right
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								if (itemParams.right == 'any') {
									isAvailable = true;	
								} else {		
									if (itemParams.right == tempArray[j].right ) {
										isAvailable = true;
									}
										
								}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}
				
				
				
				
				
				
				
				
				
				//randomly pick one of the remaining items in the tempArray
					if (!tested) {
						var str = "tempArray: \n";
							for (index in tempArray) {
								str += index+" => "+tempArray[index].src;
								str += '\n';
							}
							
						//alert(str);
						tested = true;
					}
					
					var selectedIndex = getRandom(tempArray.length -1);
					mapArray[i] = tempArray[selectedIndex];
				// catch errors if there are no items left in tempArray
				
				
			}
		}
	
		
		
		
		
		
		// display all imgs assigned to mapArray
		$('#canvas').css( 'height', mapH );
		$('#canvas').css( 'width', mapW );
		var currentImg;
		for (i=0; i< mapArray.length; i++) {
			currentImg = $('<img />').attr('src', mapArray[i].src).load(function(){ });
			//$(currentImg).attr('class', 'itm' + i);
			$('#canvas').append( currentImg);
		}
		
				   
	
/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	END DOCUMENT READY
	================================================================================ */
	
});

