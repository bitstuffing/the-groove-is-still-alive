<?php
class AllMusic{
	
	private static $url = "http://www.allmusic.com/search/all/";
	
	public static function search($content){
		Logger::debug("searching: $content");
		$content = urlencode($content);
		$response = file_get_contents(AllMusic::$url.$content);
	    $albums = substr($response,strpos($response,"<ul class=\"search-results\">"));
	    $albums = substr($albums,0,strpos($albums,"</ul>"));
	    $array = array();
	    foreach(explode("<li ",$albums) as $content){
	    	if(strpos($content," alt=\"")!=false){
	    		$album = array();
		    	$album["album"] = strpos($content,"lass=\"album")!==false;
		    	$title = substr($content,strpos($content," alt=\"")+strlen(" alt=\""));
		    	$title = substr($title,0,strpos($title,"\""));
		    	if(strlen($title)==0){
		    		$title = substr($content,strpos($content,"}\">")+strlen("}\">"));
		    		$title = substr($title,0,strpos($title,"<"));
		    	}
		    	$album["title"] = $title;
		    	if(strpos($content,"data-original=\"")!==false){
		    		$img = substr($content,strpos($content,"data-original=\"")+strlen("data-original=\""));
		    		$img = substr($img,0,strpos($img,"\""));
		    		if(strpos($img,"?")!==false){
		    			$img = substr($img,0,strpos($img,"?"));
		    		}
		    		$album["img"] = $img;
		    	}
		    	if(strpos($content,"<div class=\"artist\">")!==false){
		    		$artist = substr($content,strpos($content,"<div class=\"artist\">")+strlen("<div class=\"artist\">"));
		    		$artist = substr($artist,0,strpos($artist,"<"));
		    		if(strlen($title)>0){
		    			$album["artist"] = trim($title);
		    		}
		    	}
		    	if(strpos($content,"<div class=\"genres\">")!==false){
		    		$genres = substr($content,strpos($content,"<div class=\"genres\">")+strlen("<div class=\"genres\">"));
		    		$genres = substr($genres,0,strpos($genres,"<"));
		    		if(strlen($genres)>0){
		    			$album["genres"] = trim($genres);
		    		}
		    	}
		    	if(strpos($content,"<div class=\"year\">")!==false){
		    		$year = substr($content,strpos($content,"<div class=\"year\">")+strlen("<div class=\"year\">"));
		    		$year = substr($year,0,strpos($year,"<"));
		    		if(strlen($year)>0){
		    			$album["year"] = trim($year);
		    		}
		    	}
		    	$array[] = $album;
	    	}
	    }
	    return json_encode($array);
	}
}
?>