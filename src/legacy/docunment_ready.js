/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	DOCUMENT READY
	================================================================================ */
	

// $(document).ready(function() {
				   
	
// 	$('#ui #submit').click(function(event) {							
// 		$(".hint1").hide();
// 		$(".hint2").show();
// 			$("#results li").each(function() {		  
// 					var isChecked = $(this).children(".chkbx").attr("checked");
// 						if(!isChecked) {
// 							$(this).remove();
// 						}
// 			});						
// 		$("#results").append( getSyntaxList( $("#num").val(), $("#typ").val(), $("#adj").val() )  );
// 		//$("#results li").each(function(i) {	
// 			//$(this).children('.itmnum').html( i+1 + " " );
// 		//});
// 		setupBtns();
// 	});
						   			   

// 	$('#list_ui #delete').click(function(event) {							
// 		$("#results li").each(function() {		  
// 				var isChecked = $(this).children(".chkbx").attr("checked");
// 					if(!isChecked) {
// 						$(this).remove();
// 					}
// 		});
		
// 		$("#results li").each(function(i) {					   
// 			$(this).children('.itmnum').html( i+1 + " " );	
// 		});
// 	});
	
	
// 	$('#list_ui #delete_checked').click(function(event) {							
// 		$("#results li").each(function() {		  
// 				var isChecked = $(this).children(".chkbx").attr("checked");
// 					if(isChecked) {
// 						$(this).remove();
// 					}
// 		});
		
// 		$("#results li").each(function(i) {					   
// 			$(this).children('.itmnum').html( i+1 + " " );	
// 		});
// 	});
	
	
// 	$('#list_ui #deselect').click(function(event) {							
// 		$("#results li").each(function() {		  
// 				var isChecked = $(this).children(".chkbx").attr("checked", false);
// 		});
// 	});
	
// 		$('#list_ui #select').click(function(event) {							
// 			$("#results li").each(function() {		  
// 					var isChecked = $(this).children(".chkbx").attr("checked", true);
// 			});
// 		});
		
	
	
// 	//for (i =0; i < 100; i++) {
// 		//$("#results").append(getRandom(3) + "<br/>");
// 	//}
		
// 	//$("#results").append( loopArray(effect, "Tower") );	
	
// 	function setupBtns() {
// 		$("#results li").each(function(i) {					   
// 			$(this).hover(
// 				function() {
// 					$(this).children('.btns').show();
// 				},
// 				function() {
// 					$(this).children('.btns').hide();
// 				}
// 			);
// 			$(this).children('.itmnum').html( i+1 + " " );	
// 		});
	
// 		$('#results li .editbtn').click(function(event) {	
// 			$(this).parent().siblings('.edittxtfld').val( $(this).parent().siblings('.itmtxt').text() );
// 			$(this).hide();
// 			$(this).parent().siblings('.itmtxt').hide();
// 			$(this).parent().siblings('.edittxtfld').show();
// 			$(this).siblings('.savebtn').show();
// 		});
		
		
// 		$('#results li .savebtn').click(function(event) {
// 			$(this).parent().siblings('.itmtxt').html( $(this).parent().siblings('.edittxtfld').val() );
// 			$(this).hide();
// 			$(this).parent().siblings('.edittxtfld').hide();
// 			$(this).parent().siblings('.itmtxt').show();
// 			$(this).siblings('.editbtn').show();									 
// 		});	
// 	}
	
	
	
	

	
// 	$("#results").append( getSyntaxList( $("#num").val(), $("#typ").val(), $("#adj").val() ) );
	
// 	setupBtns();
	
/*	////////////////////////////////////////////////////////////////////////////////

    --------------------------------------------------------------------------------
	
	END DOCUMENT READY
	================================================================================ */
	
// });