function getRandom(n) {
	return Math.floor(Math.random()*n);
}

var cols = 3;
var rows = 3;
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
	bottom: "left_open",
	left: "bottom_open",
	nodes: []
},
{	type: "",
	src: "images/03.gif",
	top: "closed",
	right: "connect",
	bottom: "connect",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/04.gif",
	top: "closed",
	right: "closed",
	bottom: "connect",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/05.gif",
	top: "closed",
	right: "closed",
	bottom: "connect",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/06.gif",
	top: "closed",
	right: "closed",
	bottom: "open",
	left: "open",
	nodes: []
},
{	type: "",
	src: "images/07.gif",
	top: "right_open",
	right: "top_open",
	bottom: "closed",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/08.gif",
	top: "left_open",
	right: "connect",
	bottom: "closed",
	left: "top_open",
	nodes: []
},
{	type: "",
	src: "images/09.gif",
	top: "right_open",
	right: "top_open",
	bottom: "connect",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/10.gif",
	top: "left_open",
	right: "closed",
	bottom: "connect",
	left: "top_open",
	nodes: []
},
{	type: "",
	src: "images/11.gif",
	top: "closed",
	right: "bottom_open",
	bottom: "right_open",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/12.gif",
	top: "connect",
	right: "closed",
	bottom: "connect",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/13.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/14.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/15.gif",
	top: "connect",
	right: "connect",
	bottom: "connect",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/16.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/17.gif",
	top: "closed",
	right: "bottom_open",
	bottom: "right_open",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/18.gif",
	top: "closed",
	right: "closed",
	bottom: "open",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/19.gif",
	top: "closed",
	right: "closed",
	bottom: "left_open",
	left: "bottom_open",
	nodes: []
},
{	type: "",
	src: "images/20.gif",
	top: "connect",
	right: "bottom_open",
	bottom: "right_open",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/21.gif",
	top: "connect",
	right: "closed",
	bottom: "open",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/22.gif",
	top: "connect",
	right: "connect",
	bottom: "left_open",
	left: "bottom_open",
	nodes: []
},
{	type: "",
	src: "images/23.gif",
	top: "closed",
	right: "connect",
	bottom: "connect",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/24.gif",
	top: "connect",
	right: "connect",
	bottom: "closed",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/25.gif",
	top: "connect",
	right: "connect",
	bottom: "closed",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/26.gif",
	top: "connect",
	right: "closed",
	bottom: "closed",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/27.gif",
	top: "connect",
	right: "closed",
	bottom: "closed",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/28.gif",
	top: "closed",
	right: "open",
	bottom: "closed",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/29.gif",
	top: "connect",
	right: "bottom_open",
	bottom: "right_open",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/30.gif",
	top: "closed",
	right: "closed",
	bottom: "closed",
	left: "open",
	nodes: []
},
{	type: "",
	src: "images/31.gif",
	top: "closed",
	right: "open",
	bottom: "closed",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/32.gif",
	top: "closed",
	right: "connect",
	bottom: "left_open",
	left: "bottom_open",
	nodes: []
},
{	type: "",
	src: "images/33.gif",
	top: "closed",
	right: "connect",
	bottom: "closed",
	left: "open",
	nodes: []
},
{	type: "",
	src: "images/34.gif",
	top: "connect",
	right: "connect",
	bottom: "connect",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/35.gif",
	top: "connect",
	right: "closed",
	bottom: "connect",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/36.gif",
	top: "open",
	right: "closed",
	bottom: "closed",
	left: "open",
	nodes: []
},
{	type: "",
	src: "images/37.gif",
	top: "open",
	right: "open",
	bottom: "closed",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/38.gif",
	top: "closed",
	right: "open",
	bottom: "open",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/39.gif",
	top: "right_open",
	right: "top_open",
	bottom: "closed",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/40.gif",
	top: "open",
	right: "closed",
	bottom: "closed",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/41.gif",
	top: "left_open",
	right: "closed",
	bottom: "closed",
	left: "top_open",
	nodes: []
},
{	type: "",
	src: "images/42.gif",
	top: "right_open",
	right: "top_open",
	bottom: "connect",
	left: "connect",
	nodes: []
},
{	type: "",
	src: "images/43.gif",
	top: "open",
	right: "closed",
	bottom: "connect",
	left: "closed",
	nodes: []
},
{	type: "",
	src: "images/44.gif",
	top: "left_open",
	right: "connect",
	bottom: "connect",
	left: "top_open",
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
					mapArray[mapArray.length] = { type: "empty", src: "images/01.gif", top: "any", right: "any", bottom: "any", left: "any" };
				}
			}
		}
		
			
			function getParams(i) {

				var outerVals = { 	top: mapArray[i - (cols + 2)].bottom,
									bottom: mapArray[i + (cols + 2)].top,
									left: mapArray[i - 1].right,
									right: mapArray[i + 1].left,
									left_bottom: mapArray[i - 1].bottom,
									top_right: mapArray[i - (cols + 2)].right
								};
														
				var innerVals = {top: '', bottom: '', left: '', right: ''};

				
				//top
					var r = getRandom(100);
					
					if (outerVals.top == 'right_open') {
							if ( r <= 50 ) {
								innerVals.right = 'top_open';
								innerVals.top = 'right_open';
							} else {
								innerVals.right = 'open';
								innerVals.top = 'closed';
							}		
					} else if (outerVals.top == 'left_open') {
							if ( outerVals.left == ' top_open' ) {
								innerVals.top = 'left_open';
							} else {
								innerVals.top = 'closed';
							}				
					} else {
						innerVals.top = outerVals.top;
					}

				
				//left
					r = getRandom(100);
					
					if (outerVals.left == 'bottom_open') {
							if ( r <= 50 ) {
								innerVals.left = 'bottom_open';
								innerVals.bottom = 'closed';
								
							} else {
								innerVals.left = 'closed';	
								innerVals.bottom = 'open';
							}
					} else {
						innerVals.left = outerVals.left;
					}
				
				
				
				
				
				
				//bottom
				r = getRandom(100);
				
				if (outerVals.bottom == 'closed') {
					innerVals.bottom = 'closed';
				} else {
					
					if (innerVals.bottom == '') {
						
						if (r <= 25) {
						
						} else if (r > 25 && r <= 50) {
							
						} else if (r > 50 && r <= 75) {
							
						} else {
							
						}
						
					}
					
				}
				
				/* need to firgure out how to use outerVals.left_bottom in above statements */
				
				/*
				if (outerVals.bottom == 'right_open') {
					innerVals.right.push('open');
					innerVals.right.push('bottom_open');
					innerVals.bottom.push('closed');
				} else if (outerVals.bottom == 'left_open') {
					innerVals.left.push('open');
					innerVals.left.push('bottom_open');
					innerVals.bottom.push('closed');	
				} else {
					innerVals.bottom.push(outerVals.bottom);
				}
				*/
				
				
				
				
				//right
				
				
				
				
				
				
				/*
				if (outerVals.right == 'top_open') {
					innerVals.top.push('open');
					innerVals.top.push('right_open');
					innerVals.right.push('closed');
				} else if (outerVals.right == 'bottom_open') {
					innerVals.bottom.push('open');
					innerVals.bottom.push('right_open');
					innerVals.right.push('closed');	
				} else {
					innerVals.right.push(outerVals.right);
				}
				*/
				/*
				if (!tested) {
					var str = "outerVals: \n";
						for (param in outerVals) {
							str += param+" => "+outerVals[param];
							str += '\n';
						}
						str += "\n \n innerVals: \n";
						for (param in innerVals) {
							str += param+" => "+innerVals[param];
							str += '\n';
						}
						
					alert(str);
					tested = true;
				}
				*/
				return innerVals;
			}
		
		// assign random items to remaining grid
		
		
		for (i=0; i< mapArray.length; i++) {
			if (mapArray[i].type != 'solid') {
				tempArray = []; //clear array
				
				var itemParams = getParams(i);
				
				//loop thru geomorph array finding corresponding top value, add these to tempArray
						for (j=0; j< geomorphs.length; j++) {
							var isAvailable = false;
								if (itemParams.top[0] == 'any') {
									isAvailable = true;	
								} else {
										for (k=0; k< itemParams.top.length; k++) {
												if (itemParams.top[k] == geomorphs[j].top ) {
													isAvailable = true;
												}
										}
								}
									if ( isAvailable ) {
										tempArray[tempArray.length] =  geomorphs[j];
									}
						}
				
				//loop thru tempArray removing any items that don't have corresponding left value
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								if (itemParams.left[0] == 'any') {
									isAvailable = true;	
								} else {	
										for (k=0; k< itemParams.left.length; k++) {
											if (itemParams.left[k] == tempArray[j].left ) {
												isAvailable = true;
											}
										}
								}
									if ( !isAvailable ) {
										tempArray.splice(j,1)
									}
						}
				
				//loop thru tempArray removing any items that don't have corresponding right value
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								if (itemParams.right[0] == 'any') {
									isAvailable = true;	
								} else {
										for (k=0; k< itemParams.right.length; k++) {
											if (itemParams.right[k] == tempArray[j].right ) {
												isAvailable = true;
											}
										}
								}
							
							if ( !isAvailable ) {
								tempArray.splice(j,1)
							}	
						}
				
				//loop thru tempArray removing any items that don't have corresponding bottom value
						for (j=0; j< tempArray.length; j++) {
							var isAvailable = false;
								if (itemParams.bottom[0] == 'any') {
									isAvailable = true;	
								} else {
										for (k=0; k< itemParams.bottom.length; k++) {
											if (itemParams.bottom[k] == tempArray[j].bottom ) {
												isAvailable = true;
											}
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

