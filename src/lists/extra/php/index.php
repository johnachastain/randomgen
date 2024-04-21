<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<?php include 'global/header.php'; ?>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Muddle's Wilderness Location Generator</title>
</head>
<body id="base">
<div id="container" class="clearfix">
<?php include 'global/topnav.php'; ?>
<h3>Muddle's Wilderness Location Generator</h3>
<form>
	<div  id="ui" style="background: #fff; padding-bottom: 24px;" class="clearfix">
	<div style="float:left; width: 50%; text-align: left; background: #fff;">
	<label for="num">Number of Items:</label>
	<input id="num" name="num" value="50" /><br />
	<input name="submit" type="button" value="Submit" id="submit" />
	</div>
	<div style="float:left; width: 50%; text-align: left; background: #fff;">
	<label for="typ">Select Type:</label>
	<select name='typ' id='typ'>
		<option value='base'>Any</option>
		
		<option value="deity">Deities/Demigods</option>
		
		<option value="natural">Any Landform</option>
			<option value='natural_mountain'>Mountain</option>
			<option value="natural_river">River</option>
			<option value="natural_hills">Hill</option>
			<option value="natural_desert">Desert</option>
				<option value="natural_freshwater">Lakes/RIvers</option>
				<option value="natural_highlands">Hills/Mountains</option>
				<option value="natural_misc">Natural Misc.</option>
				<option value="natural_woodlands">Forest</option>
				<option value="natural_marshes">Swamp/Marshes</option>
				<option value="natural_depression">Canyon/Valley/Gorge</option>
				<option value="natural_underground">Underground</option>
				<option value="natural_saltwater">Ocean</option>
				<option value="natural_stone">Stones/Rocks</option>
				
		<option value="construction">Any Construction</option>
			<option value="construction_fortification">Castles/Towers/Forts</option>
			<option value="construction_religious">Temples/Shrines</option>
			<option value="construction_funerary">Crypts/Tombs</option>
			<option value="construction_artifact">Artifacts</option>
			<option value="construction_underground">Mines/Tunnels</option>
			<option value="construction_shelter">construction_shelter</option>
			<option value="construction_mechanical">construction_mechanical</option>
			<option value="construction_security">construction_security</option>
			<option value="construction_misc">Construction Misc.</option>
			<option value="construction_freshwater">Wells</option>
			<option value="construction_town">Towns</option>
			<option value="construction_bridge">Bridge</option>
			<option value="construction_tower">Tower</option>
			<option value="construction_tavern">Inns/Taverns</option>
			
		<option value="construction_city">Cities</option>
		<option value="political_nation">Kingdoms/Nations</option>
		<option value="political_district">City Districts</option>
		<option value="dungeon_level">Entire Dungeon Levels</option>
		
		<option value="any_dungeon_room">Any Dungeon Room</option>
		<option value="dungeon_room">Common Dungeon Room</option>
		<option value="temple_room">Temple Room</option>
		<option value="tomb_room">Tomb Room</option>
		<option value="magical_room">Magical Room</option>
		<option value="cavern_room">Cavern Room</option>
		
			
			
			
	</select><br />
	
	<label for="adj">Adjective Type:</label>
	<select name='adj' id='adj'>
		<option value='base'>Any</option>
		<option value="good">Good</option>
		<option value="evil">Evil</option>
		<option value="magic">Magical</option>
		<option value="elf">Elven</option>
		<option value="dwarf">Dwarven</option>
		<option value="ice">Frozen</option>
		<option value="fire">Fiery</option>	
	</select>
	
</div>	
</div>
<div style="clear: both;">
<p class="hint1">Select the Number of items and the Type of items you would like, then click <strong>Submit</strong>.</p>
<p class="hint2">Now click the checkbox of any items would would like to keep in the list, <br/>and click <strong>Submit</strong> button to replace unwanted list items.</p>
</div>
<ul id="results"></ul>	
<div id="list_ui">
<input name="delete" type="button" value="Delete All Unchecked" id="delete" /> <input name="delete_checked" type="button" value="Delete All Checked" id="delete_checked" /> <input name="deselect" type="button" value="Deselect All" id="deselect" /> <input name="select" type="button" value="Select All" id="select" /></div>
</form>
<?php include 'global/footer.php'; ?>
</div>
</body>
</html>
