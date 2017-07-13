<?php
require_once("allmusic.php");
require_once("stringutils.php");
require_once("logger.php");

class XMLUtils{

	public static function readUrl($url){
		try{
			$fileContents= file_get_contents($url);
			$simpleXml = simplexml_load_string($fileContents);
	    	$json = json_encode($simpleXml);
	    	return $json;
		}catch(Excepcion $ex){
			Logger::error("Something goes wrong!!! ".$ex->getCause());
		}
	}
	
	public static function browseLevel($albumDir,$folder,$domtree,$tracks){
		if ($handle2 = opendir($albumDir."/".$folder)) {
			try { 
				while (false !== ($entry2 = readdir($handle2))){
					if($entry2 != "." && $entry2 != ".."){
						if(is_dir($albumDir."/".$entry2)){
							$albumDir2 = $entry2;
							if(strlen($folder)>0){
								$albumDir2 = $folder."/".$entry2;
							}
							//echo "browsing deep: $albumDir2\n";
							XMLUtils::browseLevel($albumDir,$albumDir2,$domtree,$tracks);
						}else if(strpos($entry2,".jpg")===false && strpos($entry2,".gif")===false && strpos($entry2,".png")===false ){
							//echo "using: ".$entry2."\n";
							$target = $entry2;
							if(strlen($folder)>0){
								$target = $folder."/".$entry2;
							}
							XMLUtils::writeTrack($target,$domtree,$tracks);
						}
					}
				}
			}catch(Excepcion $ex){
				Logger::error("Something goes wrong!!! ".$entry);
			}
		}
	}
	
	public static function writeTrack($entry2,$domtree,$tracks){
		$track = $domtree->createElement("track");
		try { 
			$track->appendChild($domtree->createElement('fileurl',htmlspecialchars($entry2)));
			$title = htmlspecialchars($entry2);
			$title = substr($title,0,strrpos($title,"."));
			if(strpos($title,".")!==false && strpos($title,".")<10){
				$title = substr($title,strpos($title,".")+1);
			}
			$track->appendChild($domtree->createElement('title',$title));
			$tracks->appendChild($track);
		}catch(Excepcion $e){
			Logger::error("Something goes wrong with entry: ".$entry2);
		}
	}
	
	public static function readFolder($folder,$extension){
		$files = array();
		if ($handle = opendir($folder)) {
			while (false !== ($entry = readdir($handle))) {
				if ($entry != "." && $entry != ".." && StringUtils::endsWith($entry,".$extension")) {
					$files[] = $entry;
				}
			}
		}
		return json_encode($files);
	}
	
	public static function xmlToArray($xmlFile){
		$xmlstring = file_get_contents($xmlFile);
		$xml = simplexml_load_string($xmlstring);
		$json = json_encode($xml);
		return $json;
	}
	
	public static function arrayToXml($array,$xml){
		foreach ($array as $key => $value) {
			if(is_int($key)){
                $key = "n$key";
            }
	        if(is_array($value)){
	            $label = $xml->addChild($key);
	            $this->arrayToXml($value, $label);
	        }
	        else {
	            $xml->addChild($key, $value);
	        }
	    }
	    return $xml;
	}
}
?>
