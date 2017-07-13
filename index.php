<?php
// Start the session
session_start();

require_once("utils/logger.php");
//log all request params
Logger::log(preg_replace('/[\s+]/','',(preg_replace("/[\n\r]/","",(var_export($_REQUEST,true))))),Logger::$SECURITY,Logger::$SECURITY,false);
Logger::log(preg_replace('/[\s+]/','',(preg_replace("/[\n\r]/","",(var_export($_SERVER,true))))),Logger::$SECURITY,Logger::$SECURITY,false);
?>
<html>
	<head>
		<meta charset="utf-8">
		<?php 
		$cssList = array("css/styles.css","css/login.css","css/lists.css","css/player.css","css/jquery-ui.css","css/loading.css");
		for($i=0;$i<sizeof($cssList);$i++){ ?>
			<link rel="stylesheet" href="<?php echo $cssList[$i]; ?>" />
		<?php } 
		$scriptList = array("js/jquery-1.12.4.js","js/jquery-ui.js","js/core.js");
		for($i=0;$i<sizeof($scriptList);$i++){ ?>
			<script type="text/javascript" src="<?php echo $scriptList[$i]; ?>" ></script>
		<?php }	?>

	</head>
		<body onresize="responsive();">
		<div id="header">
			<div id="headerContent">
				<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="Primary Navigation">
					<button id="menuButton" class="menu-toggle" aria-controls="site-navigation" aria-expanded="false"><span>Menu</span></button>
				</nav>
			</div>

			<div class="login">
				<div class="loginBox">
				<?php if(!isset($_SESSION["login"])){ ?>
					<label for="login">Username:</label>
					<input type="text" name="login" />
					<label for="password">Password:</label>
					<input type="password" name="password" />
					<input type="button" id="loginButton" value="Login" />
				<?php }else{
					echo "Welcome: ".$_SESSION["login"]." <span id='logoutSpan'>logout</span>"; 
				}?>
				</div>
			</div>
			
		</div>
		
		<div id="sections">
			
		</div>
		
		<div id="container">
			<div id="content" >
				
			</div>
		</div>
		
		<div id="controls">
			<div id="spliter" class="spliter"> </div>
			<div id="listControls">
				<div id="prev-slider" class="sliderControlClassPrev"><div id="arrow-left"></div></div>
				<div id="slider"></div>
				<div id="next-slider" class="sliderControlClassNext"><div id="arrow-right"></div></div>
			</div>
			<div id="player">
				 <audio> </audio> 
			</div>
		</div>
		<div id="toastDiv" class="toast-container toast-position-bottom-right"></div>
		<script type="text/javascript">
			$(document).ready(function(){
				load();
			});
		</script>
	</body>
</html>
