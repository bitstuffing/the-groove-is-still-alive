<?php

require_once("xmlutils.php");
require_once("logger.php");

class UserUtils{
	
	public static $SONG_IMG = "https://cdn0.iconfinder.com/data/icons/simple-icons-4/512/music.png";
	
	public static function readAlbums(){
		$library = isset($_SERVER['LIBRARY_PATH']) ? $_SERVER['LIBRARY_PATH'] : '';
		Logger::debug("Reading user albums from library: $library");
		return XMLUtils::readFolder($library,"xml");
	}
	
	public static function readAlbum($album){
		$library = isset($_SERVER['LIBRARY_PATH']) ? $_SERVER['LIBRARY_PATH'] : '';
		$url = $library.$album;
		Logger::debug("Reading user album: $album");
		return XMLUtils::readUrl($url);
	}
	
	public static function generateAlbums(){
		$library = isset($_SERVER['LIBRARY_PATH']) ? $_SERVER['LIBRARY_PATH'] : '';
		if ($handle = opendir($library)) {
			while (false !== ($entry = readdir($handle))) {
				if ($entry != "." && $entry != ".." && is_dir($library.$entry)) {
					Logger::debug("generating xml album using entry: ".$entry);
					//generate xml file
					$domtree = new DOMDocument('1.0', 'UTF-8');
					$xmlRoot = $domtree->createElement("album");
					$xmlRoot = $domtree->appendChild($xmlRoot);
					$author = $domtree->createElement("author",$entry);      //( track (title fileurl) )
					$xmlRoot->appendChild($author);
					$description = $domtree->createElement("description",$entry);
					$xmlRoot->appendChild($description);
					$img = UserUtils::$SONG_IMG;
					$date = '1969';
					$results = json_decode(AllMusic::search($entry), true);
					for($i=0;$i<sizeof($results);$i++){
						$result = $results[$i];
						if(isset($result["img"])){
							$img = str_replace("\\", "", $result["img"]);
							$i = sizeof($results);
						}
						if(isset($result["year"])){ //shoud be always but...
							$date = $result["year"];
						}
					}
					$timestamp = $domtree->createElement("timestamp",$date);
					$xmlRoot->appendChild($timestamp);
					$image = $domtree->createElement("image",$img);
					$xmlRoot->appendChild($image);
					$buttonContent = $domtree->createElement("buttoncontent","Play");
					$xmlRoot->appendChild($buttonContent);
					$albumDir = $library.$entry;
					$path = $domtree->createElement("path",$library.$entry."/");
					$xmlRoot->appendChild($path);
					$tracks = $domtree->createElement("tracks");
					$tracks = $xmlRoot->appendChild($tracks);
					XMLUtils::browseLevel($albumDir,"",$domtree,$tracks);
					//store file
					$finalFile = $library.$entry.".xml";
					file_put_contents($finalFile,$domtree->saveXML());
					Logger::debug("stored album using file: $finalFile");
				}
			}
		}
		return json_encode(array());
	}
	
	public static function displayUserSections(){
		$sections = array();
		if(isset($_SESSION["login"])){
			Logger::debug("Displaying user actions for user: ".$_SESSION["login"]);
			$section = array();
			$section["action"] = "getAlbums";
			$section["label"] = "Get albums";
			$sections[]=$section;
			$section = array();
			$section["action"] = "getLists";
			$section["label"] = "Get lists";
			$sections[]=$section;
			$section = array();
			$section["action"] = "editLists";
			$section["label"] = "Edit lists";
			$sections[]=$section;
			$section = array();
			$section["action"] = "generateAlbums";
			$section["label"] = "Generate albums from library folder";
			$sections[]=$section;
		}
		return json_encode($sections);
	}
	
	public static function storeList($list,$name){
		if(isset($_SESSION["login"]) && strlen($name)>0 && strpos($name,"..")==false){
			Logger::debug("Storing user list $name for user: ".$_SESSION["login"]);
			$response = array();
			$response["status"] = "fail";
			$response["list"] = $name;
			$username = $_SESSION["login"];
			$home = isset($_SERVER['USERS_HOME']) ? $_SERVER['USERS_HOME'] : '';
			if(file_exists($home.$username."/lists/") ){
				if ($handle = opendir($home.$username."/lists/")) {
					$found = false;
					while (false !== ($entry = readdir($handle))) {
						if ($entry != "." && $entry != ".." && StringUtils::endsWith($entry,".xml")) {
							$found = true;
							Logger::debug("$entry used / found");
						}
					}
					if($found){
						Logger::warning("$entry not used / not found");
					}
					$name = $name.".xml";
					$xml = new SimpleXMLElement('<list/>');
					$xml = XMLUtils::arrayToXml($list, $xml);
					$finalPath = $home.$username."/lists/".$name;
					file_put_contents($finalPath,$xml->saveXML());
					Logger::info("List $name finally stored.");
					$response = array();
					$response["status"] = "ok";
					$response["list"] = $finalPath;
				}
			}
			return json_encode($response);
		}
	}
	
	public static function displayUserLists(){
		$lists = array();
		if(isset($_SESSION["login"])){
			Logger::debug("Displaying user lists for user ".$_SESSION["login"]);
			$username = $_SESSION["login"];
			$home = isset($_SERVER['USERS_HOME']) ? $_SERVER['USERS_HOME'] : '';
			if(file_exists($home.$username."/lists/") ){
				if ($handle = opendir($home.$username."/lists/")) {
					while (false !== ($entry = readdir($handle))) {
						if ($entry != "." && $entry != ".." && StringUtils::endsWith($entry,".xml")) {
							$lists[] = $entry;
						}
					}
				}
			}
		}
		return json_encode($lists);
	}
	
	public static function getList($name){
		$username = $_SESSION["login"];
		$home = isset($_SERVER['USERS_HOME']) ? $_SERVER['USERS_HOME'] : '';
		if(isset($_SESSION["login"]) && strlen($name)>0 && strpos($name,"..")==false && file_exists($home.$username."/lists/".$name) ){
			$xmlFile = $home.$username."/lists/".$name;
			return XMLUtils::xmlToArray($xmlFile);
		}
	}
	
	public static function readLast(){ //TODO
		$array = array();
		//element.author,element.timestamp,element.description,element.image,element.buttoncontent,element.fileurl
		$element = array();
		$element["author"] = "[Guardians of the Galaxy: Vol 2] Official Soundtrack";
		$element["timestamp"] = "2007-08-29T13:58Z";
		$element["description"] = "Mr. Blue Sky - ELO";
		$element["image"] = "https://images-na.ssl-images-amazon.com/images/I/61mtx%2B420hL._US100_.jpg";
		$element["buttoncontent"] = "Play";
		$element["fileurl"] = "http://178.162.210.70/dl/s23/6G9I2Akz3zcH1_xW1CPkTg,1494107803/yt:rjnd7880pYs-1/1%20Mr.%20Blue%20Sky%20-%20Electric%20Light%20Orchestra%20%28Guardians%20Of%20The%20Galaxy%20Vol%202%20Soundtrack%29.mp3";
		return json_encode ($array);
	}
	
	public static function readBest(){ //TODO
		return false; 
	}
}
?>