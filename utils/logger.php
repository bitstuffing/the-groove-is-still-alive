<?php
class Logger{
	
	public static $DEBUG = "DEBUG";
	public static $INFO = "INFO";
	public static $WARNING = "WARNING";
	public static $ERROR = "ERROR";
	
	public static $SECURITY = "SECURITY";
	
	public static function log($message,$level,$logFile='traces_',$logTraces=false){
		$logFile .= date("Ymd").".log";
		$currentDate = date("Y-m-d H:i:s");
		$trace = '';
		
		foreach (debug_backtrace() as $k => $v) {
			array_walk($v['args'], function (&$item, $key) { $item = var_export($item, true); });
			if(!$logTraces){ //clean to obtain just last one
				$trace = ''; 
			}else{ //append deep 
				$trace .= '#'.($k).' ';
			}
			$trace .= $v['file'].'('.$v['line'].'): ';
			if($logTraces){
				$trace .= (isset($v['class'])?$v['class'].'->':'').$v['function'].'('.implode(', ',$v['args']).')'."\n";
			}
		}
		
		$traces = "$currentDate [$level] $trace $message\n";
		$f = fopen($_SERVER["LOGS_APP"].$logFile,'a+');
		fwrite($f, $traces);
		fclose($f);
	}
	
	public static function info($message){
		Logger::log($message,Logger::$INFO);
	}
	
	public static function debug($message){
		Logger::log($message,Logger::$DEBUG);
	}
	
	public static function warning($message){
		Logger::log($message,Logger::$WARNING);
	}
	
	public static function error($message){
		Logger::log($message,Logger::$ERROR,"error_",true);
	}
}

?>