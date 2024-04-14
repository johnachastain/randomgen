<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<?php include 'global/header.php'; ?>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Muddle's City/Town Location Generator</title>
<style>

#results li {
	/*width: 100%;
	height: 40px;*/
	
}
#container {
	width: 980px;
}

</style>
</head>
<bod id="deity">
<div id="container" class="clearfix">
<?php include 'global/topnav.php'; ?>
<h3>Muddle's Dieties /Demigods Name Generator</h3>
<form>
	<div  id="ui">
	<label for="num">Number of Items:</label>
	<input id="num" name="num" value="50" />

	<label for="typ">Select Type:</label>
	<select name='typ' id='typ'>
		<option value="deity">Deities/Demigods</option>
		<option value='base'>Any</option>
	
	</select>
	<label for="adj">Adjective Type:</label>
	<select name='adj' id='adj'>
		<option value='base'>Any</option>
		<option value="good">Good</option>
		<option value="evil">Evil</option>
		<option value="magic">Magical</option>
		<option value="elf">Elven</option>
		<option value="dwarf">Dwarven</option>		
	</select>
	<input name="submit" type="button" value="Submit" id="submit" />
</div>
<p class="hint1">Select the Number of items and the Type of items you would like, then click <strong>Submit</strong>.</p>
<p class="hint2">Now click the checkbox of any items would would like to keep in the list, <br/>and click <strong>Submit</strong> button to replace unwanted list items.</p>

<ul id="results"></ul>	
<div id="list_ui">
<input name="delete" type="button" value="Delete All Unchecked" id="delete" /> <input name="delete_checked" type="button" value="Delete All Checked" id="delete_checked" /> <input name="deselect" type="button" value="Deselect All" id="deselect" /> <input name="select" type="button" value="Select All" id="select" /></div>
</form>
<?php include 'global/footer.php'; ?>
</div>
</body>
</html>
