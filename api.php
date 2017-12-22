<?php
// Start the session
session_start();
require_once("utils/xmlutils.php");
require_once("utils/userutils.php");
require_once("utils/stringutils.php");
require_once("utils/logger.php");
require_once("utils/allmusic.php");

$action = '';
$username = '';
$password = '';
$album = '';
$path = '';
$list = array();
$name = '';

if(isset($_REQUEST["action"])){
	$action = $_REQUEST["action"];
}
if(isset($_REQUEST["username"])){
	$username = $_REQUEST["username"];
}
if(isset($_REQUEST["password"])){
	$password = $_REQUEST["password"];
}
if(isset($_REQUEST["album"])){
	$album = $_REQUEST["album"];
}
if(isset($_REQUEST["path"])){
	$path = $_REQUEST["path"];
}
if(isset($_REQUEST["list"])){
	$list = $_REQUEST["list"];
}
if(isset($_REQUEST["name"])){
	$name = $_REQUEST["name"];
}

require_once("utils/logger.php");
//log all request params
Logger::log(preg_replace('/[\s+]/','',(preg_replace("/[\n\r]/","",(var_export($_REQUEST,true))))),Logger::$SECURITY,Logger::$SECURITY,false);
Logger::log(preg_replace('/[\s+]/','',(preg_replace("/[\n\r]/","",(var_export($_SERVER,true))))),Logger::$SECURITY,Logger::$SECURITY,false);

switch ($action) {
	case "getMetadata":
		echo AllMusic::search($name);
		break;
	case "getSections":
		echo UserUtils::displayUserSections();
		break;
	case "logout":
		session_destroy();
		header("Location: /");
		break;
	case "saveList":
		echo UserUtils::storeList($list,$name);
		break;
	case "editLists":
	case "getLists":
		echo UserUtils::displayUserLists();
		break;
	case "deleteList":
		echo UserUtils::deleteList($name);
		break;
	case "getList":
		echo UserUtils::getList($name);
		break;
    case "last":
		echo UserUtils::readLast();
		break;
    case "best":
		echo UserUtils::readBest();
		break;
    case "getAlbums":
		echo UserUtils::readAlbums();
		break;
    case "getAlbum":
		echo UserUtils::readAlbum($album);
		break;
    case "generateAlbums":
		echo UserUtils::generateAlbums();
		break;
    case "getAudio":
		$path = base64_decode($path);
		Logger::debug("Reading audio: $path");
		if(strpos($path,"..") === false){
			if(StringUtils::endsWith($path,".mp3") || StringUtils::endsWith($path,".ogg")){
				header('Content-type: audio/mpeg');
				header('Content-length: ' . filesize($path));
				header('Content-Disposition: filename="'+substr($path,strrpos($path,"/"))+'"');
				header('X-Pad: avoid browser bug');
				header('Cache-Control: no-cache');
				try{
					echo file_get_contents($path);
				}catch(Exception $ex){
					Logger::error("ERROR Reading audio: $path. ".$ex->getCause());
				}
			}
		}
		break;
    case "login":
		$response = array();
		if(strpos($username,"..") === false){
			$response["username"] = $username;
			$result = "ko";
			$home = isset($_SERVER['USERS_HOME']) ? $_SERVER['USERS_HOME'] : '';
			if(file_exists($home.$username."/passwd") ){
				$passwd = preg_replace(array('/\s{2,}/', '/[\t\n]/'), '', file_get_contents($home.$username."/passwd")); 
				if(trim(str_replace("\n","",$passwd))==trim($password)){
					$result = "ok";
				}else{
					$result = $passwd;
				}
			}else{
				$result = $home.$username."/passwd";
			}
			$response["result"] = $result;
			if($result == 'ok'){
				$_SESSION["login"] = $username;
			}
		}
		echo json_encode($response);
	break;
}
?>
