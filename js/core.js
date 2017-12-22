function articleClick(current){
	var hiddenValue = current.find("#path").val();
	$("audio").attr("src","api.php?action=getAudio&path="+hiddenValue);
	$("audio").attr("controls","");
	$("audio")[0].play();
	$(".currentTrack").removeClass("currentTrack");
	current.addClass("currentTrack");
}

function getArticleElement(author,time,text,image,buttonContent,audioTrackUrl,draggable){
	var content = "<article class='element' onclick='articleClick($(this));'>";
		content+="<header>";
			content+="<img class='imageClass' src='"+image+"' alt='"+author+"'/>";
			if(buttonContent!=undefined && buttonContent.length>0){
				content+='<div class="buttonContentClass">'+buttonContent+'</div>\n';
			}
		content+="</header>\n";
		if(author!=undefined && author.length>0){
			content+="<div class='authorContentClass'>"+author+"</div>";
		}
		if(text!=undefined && text.length>0){
			content+='<p class="ellipsisClass">'+text+'</p>\n';
		}
		content+="<input type='hidden' id='path' value='"+btoa(audioTrackUrl)+"' />\n";
	content+="</article>";
	var jqueryContentElement = $(content);
	if(draggable){
		jqueryContentElement.on("mousemove",function(ev){
			if(ev.buttons==1 && $(".mouseDragged").length==0){
				dragElement($(this),ev);
			}
		});
	}
	jqueryContentElement.on("click",function(ev){
		var hiddenValue = $(this).find("#path").val();
		$("audio").attr("src","api.php?action=getAudio&path="+hiddenValue);
		$("audio").attr("controls","");
		$("audio")[0].play();
		$(".currentTrack").removeClass("currentTrack");
		jqueryContentElement.addClass("currentTrack");
	});
	return jqueryContentElement;
}

function load(){
	drawSections();
	//drawBests();
	drawPlayer();
	loadEvents();
	var margin = parseInt($(".spliter").css("height"))+135;
	var target = $("#player").offset().top-margin;
	moveSpliter(0,target);
	responsive();
}

function drawBests(){
	$.getJSON("api.php",{"action":"best"},function(response){
		if(response.tracks!=undefined){
			for(var i=0;i<response.tracks.length;i++){
				//var article = getArticleElement("a","b","c","d.png","e","f",true);
				//var article = getArticleElement("",response.description,track.title,response.image,response.author,response.path+track.fileurl,true);
				//$("#slider").append(article);
			}
		}
	});
}

function drawAlbum(album){
	$.getJSON("api.php",{"action":"getAlbum","album":album},function(response){
		if(response.tracks!=undefined){
			$("#content").html(""); //clean html
			$("#content").append("<div id='albumContent'></div>");
			$("#albumContent").append("<div class='albumImage'><img src='"+response.image+"' /></div>");
			$("#albumContent").append("<div id='albumMetadata'></div>");
			$("#albumMetadata").append("<div class='albumMetadata'>"+response.author+"</div>");
			$("#albumMetadata").append("<div class='albumMetadata'>"+response.timestamp+"</div>");
			$("#albumMetadata").append("<div class='albumMetadata'>"+response.description+"</div>");
			$("#albumContent").append("<div id='songsList'></div>");
			$("#songsList").append("<div class='totalSongs'>Total: "+response.tracks.track.length+"</div>");
			for(var i=0;i<response.tracks.track.length;i++){
				var track = response.tracks.track[i];
				if(track.title!=undefined && track.title.length>0){
					var div = $('<div class="song" >'+track.title+'</div>');
					$("#songsList").append(div);
					var description = response.description;
					var title = track.title;
					var image = response.image;
					var author = response.author;
					var path = response.path+track.fileurl;
					div.on("click",{"author":"","time":description,"text":title,"image":image,"buttonContent":author,"audioTrackUrl":path,"draggable":true},drawTrack);
				}
			}
		}
	});
}

function drawTrack(event){
	var author = event.data.author;
	var time = event.data.time;
	var text = event.data.text;
	var image = event.data.image;
	var buttonContent = event.data.buttonContent;
	var audioTrackUrl = event.data.audioTrackUrl;
	var draggable = event.data.draggable;
	//var content = audioTrackUrl.toString().replace("'","&#39;");
	var article = getArticleElement(author,time,text,image,buttonContent,audioTrackUrl,draggable);
	$("#slider").append(article);
	//update slider size
	var articleWidth = parseInt($("article:last").css("width"));
	var targetArticles = $("#slider").find("article");
	var counter = targetArticles.length;
	var width = (counter+1)*articleWidth;
	width+=$("#spliter").css("width");
	$("#slider").css("width",width);
	//moveSpliter($("#spliter").offset().left,$("#spliter").offset().top);
}

function drawAlbumOld(album){
	$.getJSON("api.php",{"action":"getAlbum","album":album},function(response){
		if(response.tracks!=undefined){
			for(var i=0;i<response.tracks.track.length;i++){
				var track = response.tracks.track[i];
				if(track.title!=undefined && track.title.length>0){
					var article = getArticleElement("",response.description,track.title,response.image,response.author,response.path+track.fileurl,true);
					$("#slider").append(article);
				}
			}
		}
	});
}

function slide(direction){
	//if(typeof animating=="undefined" || !animating){
		animating = true;
		var target = $("#slider").find("article").first();
		var width = parseInt(target.css("width"));
		var left = Math.abs(parseInt($("#slider").css("margin-left")));
		var marginArticle = parseInt(4);
		if(direction=="left"){
			var newMargin = parseInt(width+left+marginArticle);
			var margin = "-"+newMargin+"px";
			var counter = $("#slider").find("article").length;
			
			//if there are so much articles, slider needs more space
			var newWidth = (parseInt($("#spliter").css("width"))+parseInt((width+marginArticle)*counter))+"px";
			
			$("#slider").css("width",newWidth);
			if(((width+marginArticle)*counter)>newMargin){
				$("#slider").animate({"margin-left":margin}, "fast");
				$("#slider").promise().done(function(){
					animating = false;
				});
			}else{
				animating = false;
			}
		}else{ // direction == 'right'
			console.log("right!");
			var margin = "-"+((left-width)-marginArticle)+"px";
			$("#slider").animate({"margin-left":margin}, "fast");
			$("#slider").promise().done(function(){
				animating = false;
			});
		}
	//}
}

function drawPlayer(){
	$(".sliderControlClassPrev").click(function(){
		$("#slider").promise().done(function(){
			slide("right");
		});
	});
	$(".sliderControlClassNext").click(function(){
		$("#slider").promise().done(function(){
			slide("left");
		});
	});
	$("audio").on("ended",function(){
		var target = $(".currentTrack").next();
		if(target.html()!=undefined){
			target.trigger("click");
		}else{
			$(".currentTrack").removeClass("currentTrack");
			$("audio").attr("src","");
		}
	});
}

function loadEvents(){
	$(window).on("resize", responsive());
	$("#loginButton").on("click",function(){
		var username = $("input[name=login]").val();
		var password = $("input[name=password]").val();
		var data = {"action":"login","username":username,"password":password};
		$.post("api.php",data,function(resp){
			var response = JSON.parse(resp);
			if(response.result == 'ok'){
				$(".loginBox").html("Welcome: "+response.username);
				setTimeout(location.reload(),"3000");
			}else{
				alert("Login fails");
			}
		});
	});
	$("#logoutSpan").on("click",function(){
		var data = {"action":"logout"};
		$.post("api.php",data,function(resp){
			setTimeout(location.reload(),"1000");
		});
	});
	$(".spliter").on("mousedown",function(event){
		$("#mousedown").each(function(){
			$(this).remove();
		});
		$(this).append("<input type='hidden' id='mousedown' />");
		moveSpliter(event.pageX,event.pageY);
	});
	
	$(document).on("mouseup",function(event){
		event.stopPropagation();
		if($("#mousedown").length>0){
			//clearContextMenu();
			moveSlider(event.pageX,event.pageY);
			$("#mousedown").each(function(){
				$(this).remove();
			});
			//updateSpliter();
			moveSpliter(event.pageX,event.pageY);
		}
		if($("#mouseTempDrag").length>0){
			dropElement(event.pageX,event.pageY);
			$("#mouseTempDrag").each(function(){
				$(this).remove();
			});
		}
	});
	
	$(document).on("mousemove",function(event){
		if($("#mousedown").length>0){
			moveSlider(event.pageX,event.pageY);
		}else if($("#mouseTempDrag").length>0){ //drag moving
			var temp = $("#mouseTempDrag");
			temp.css({"position":"fixed","top":event.pageY-50,"left":event.pageX-50,"z-index":"102"});
		}
	});
	
	$("#menuButton").on("click",function(){
		if($(this).hasClass("displayed")){
			$(this).removeClass("displayed");
			$(".loginBox").fadeOut("slow");
		}else{
			$(this).addClass("displayed");
			$(".loginBox").fadeIn("slow");
		}
		updateContent();
	});
	//avoid browser default drag on a html img element
	$(document).on('dragstart', function(event) { event.preventDefault(); });
	$(document).contextmenu(function(ev) { 
		contextMenu(ev);
		return false; 
	});
	
	$(document).ajaxStart(function () {
		$("#loadingDiv").show();
	}).ajaxStop(function () {
		$("#loadingDiv").hide();
	});
}

function toast(message){
	$("#toastDiv").hide();
	$("#toastDiv").html("<p class='toast-item'>"+message+"</p>");
	$("#toastDiv").fadeIn("fast");
	setTimeout('$("#toastDiv").fadeOut("fast");',"3000");
}

function launchAction(action){
	if(!$("#loadingDiv").is(':visible')){
		var dataPost = {"action":action};
		if($("#listName").length>0){
			dataPost["name"] = $("#listName").val();
		}
		$.ajax({
		    url: "api.php",
		    type: "POST",
		    data: dataPost,
		    dataType: "json",
		    timeout: 10000,
		    success: function(response){
				$("#content").html(""); //clean html
				var nextAction = "";
				switch(action){
					case "getAlbums":
						var i=0
						for(;i<response.length;i++){
							var content = response[i];
							$("#content").append("<span class='rounded-list' onclick=\"drawAlbum('"+content.trim()+"');\">"+content+"</span>");
						}
						toast(i+" albums has been obtained");
						break;
					case "editLists":
					case "getLists":
						if(response!=undefined && response.length>0){
							var functionName = (action=='editLists'?'editList':'seeList');
							var i=0
							for(;i<response.length;i++){
								$("#content").append("<span class='rounded-list' onclick=\""+functionName+"('"+response[i]+"')\">"+response[i]+"</span>");
							}
							toast(i+" lists has been obtained");
						}
						if(action=='editLists'){
							$("#content").append("<span class='rounded-list' onclick=\"newList()\">New list</span>");
						}
						break;
					case "generateAlbums":
						console.log("generate albums done!");
						toast("All user albums have been generated successfull");
						break;
				}
			},
		    error: function(xmlhttprequest, textstatus, message) {
	            toast(textstatus+", "+message);
		    }
		});
	}else{
		toast("Please wait until a launched action finish!");
	}
}

function editList(name){
	$.getJSON("api.php",{"action":"getList","name":name},function(response){
		toast("Edited "+name+" list");
		console.log(response);
		var songs = [];
		for(var key in response){
			songs.push(response[key]);
		}
		if(name.indexOf(".")>0){
			name = name.substring(0,name.lastIndexOf("."));
		}
		editListSongs(name,songs);
	});
}

function seeList(name){
	$.getJSON("api.php",{"action":"getList","name":name},function(response){
		toast("Shown "+name+" list");
		$("#content").html("<div id='songsList'></div>");
		$.each(response, function(i, element){
			var content = "<input type='hidden' id='"+i+"' value='"+element+"' />";
			var title = element.substring(element.lastIndexOf("/")+1);
			var startsWithNumber = /^\d/.test(title[0]);
			if(startsWithNumber){ //remove track numbers
				title = title.substring(title.indexOf(" ")+1);
			}
			if(title.indexOf(".")>0){
				title = title.substring(0,title.lastIndexOf("."));
			}
			content += title;
			var songElement = $("<div class='song'>"+content+"</div>");
			//toast("appending to list "+title);
			//var title = $(this).text();
			//var path = $(this).find("input").val();
			var description = "";
			var image = "https://cdn0.iconfinder.com/data/icons/simple-icons-4/512/music.png";
			var author = "";
			var path = element;
			songElement.on("click",{"author":"","time":description,"text":title,"image":image,"buttonContent":author,"audioTrackUrl":path,"draggable":true},drawTrack);
			$("#songsList").append(songElement);
		});
	});
}

function deleteList(){
	$("body").append('<div id="dialog" title="Confirmation">Are you sure about this?</div>');
	$("#dialog").dialog({
    	modal: true,
        bgiframe: true,
        /*width: 500,
        height: 200,*/
        autoOpen: true,
    });
    
    $("#dialog").dialog('option', 'buttons', {
        "Confirm" : function() {
            launchAction('deleteList');
            $(this).dialog("close");
            launchAction('editLists');
        },
        "Cancel" : function() {
            $(this).dialog("close");
        }
    });
}

function saveList(){
	var values = $.map($("select#listContent option") ,function(option) { return option.value; });
	console.log("serialized: "+values);
	var listName = $("#listName").val();
	$.getJSON("api.php",{"action":"saveList","name":listName,"list":values},function(response){
		toast("The list '"+name+"' was stored succesfully!");
		$("#loadingDiv").hide();
		launchAction('editLists');
	});
}

function editListSongs(name,songs){
	$("#content").html("<div id='formList'></div>");
	$("#formList").html("<div id='newList'></div>");
	$("#newList").append("<label for='listName' >List name:</label>");
	if(name!=undefined && name.length>0){
		$("#newList").append("<input type='text' id='listName' disabled value='"+name+"'/>");
	}else{
		$("#newList").append("<input type='text' id='listName' />");
	}
	$("#newList").append("<input type='button' id='saveListButton' onclick='saveList();' value='Save' ></input>");
	if(name!=undefined && name.length>0){
		$("#newList").append("<input type='button' id='deleteListButton' onclick='deleteList();' value='Delete' ></input>");
	}
	$("#formList").append("<div id='newList2'></div>");
	$("#content").append("<div id='listContentDiv'></div>");
	$("#listContentDiv").append("<select multiple='multiple' id='listContent'></select>");
	$.getJSON("api.php",{"action":"getAlbums"},function(response){
		$("#newList2").append("<label for='albums' >From Album:</label>");
		$("#newList2").append("<select onchange='drawAlbumContentToNewList();' id='albums'><option>No album selected</option></select>");
		for(var i=0;i<response.length;i++){
			$("#albums").append("<option value='"+response[i]+"'>"+response[i]+"</option>");
		}
	});
	if(name!=undefined && name.length>0){
		for(var i=0;i<songs.length;i++){
			var element = songs[i];
			var title = element.substring(element.lastIndexOf("/")+1);
			var startsWithNumber = /^\d/.test(title[0]);
			if(startsWithNumber){ //remove track numbers
				title = title.substring(title.indexOf(" ")+1);
			}
			if(title.indexOf(".")>0){
				title = title.substring(0,title.lastIndexOf("."));
			}
			$("#listContent").append("<option value='"+element+"'>"+title+"</option>");
		}
	}
}

function newList(){
	editListSongs("",[]);
	/*$("#content").html("<div id='formList'></div>");
	$("#formList").html("<div id='newList'></div>");
	$("#newList").append("<label for='listName' >List name:</label>");
	$("#newList").append("<input type='text' id='listName' />");
	$("#newList").append("<input type='button' id='saveListButton' onclick='saveList();' value='Save' ></input>");
	$("#formList").append("<div id='newList2'></div>");
	$("#content").append("<div id='listContentDiv'></div>");
	$("#listContentDiv").append("<select multiple='multiple' id='listContent'></select>");
	$.getJSON("api.php",{"action":"getAlbums"},function(response){
		$("#newList2").append("<label for='albums' >From Album:</label>");
		$("#newList2").append("<select onchange='drawAlbumContentToNewList();' id='albums'><option>No album selected</option></select>");
		for(var i=0;i<response.length;i++){
			$("#albums").append("<option value='"+response[i]+"'>"+response[i]+"</option>");
		}
	});*/
}

function drawAlbumContentToNewList(){
	var album = $("#albums").val();
	$.getJSON("api.php",{"action":"getAlbum","album":album},function(response){
		$("#newList3").remove();
		$("#formList").append("<div id='newList3'></div>");
		$("#newList3").append("<label for='songs' >Select a Song:</label>");
		$("#newList3").append("<select onchange='drawSongContentToNewList();' id='songs'><option>No song selected</option></select>");
		for(var i=0;i<response.tracks.track.length;i++){
			$("#songs").append("<option value='"+response.path+response.tracks.track[i].fileurl+"'>"+album+" --> "+response.tracks.track[i].title+"</option>");
		}
	});
}

function drawSongContentToNewList(){
	$("#listContent").append("<option value='"+$("#songs").val()+"'>"+$("#songs option:selected").text()+"</option>");
}

function responsive(){	
	//if($("#animating").length==0){ //avoid conflicts
		updateSpliter();
		var top = parseInt($(".spliter").offset().top);
		var margin = parseInt($(".spliter").css("height"))+135;
		var bottomMargin = parseInt($("#player").css("height"));
		var sliderPos = parseInt(top+margin);
		if(sliderPos>parseInt($("#player").offset().top)-margin){
			sliderPos = parseInt($("#player").offset().top-margin);
		}
		updateContent();
		moveSlider(0,sliderPos);
	//}
}

function updateContent(){
	var contentTop = $("#content").offset().top;
	var spliterTop = $("#spliter").offset().top;
	var total = parseInt(spliterTop-contentTop);
	$("#content").css("height",total);
	//$("#content").css("min-height",total);
	$("#container").css("height","100%");
	$("#content").css("overflow","scroll");
}

function updateSpliter(){
	if($("article:last").length>0){
		var top = parseInt($("article:last").offset().top);
		$(".spliter").css("top",(top-15));
	}
}

function moveSpliter(x,y){
	//put boundaries
	var margin = parseInt($(".spliter").css("height"))+135;
	var target = $("#player").offset().top-margin;
	if(y>target){
		y = target;
	}else if (y<margin-135){
		y=margin-135;
	}
	$(".spliter").css("top",y);
}

function moveSlider(x,y){
	if(parseInt(y)>0 && parseInt($("#player").offset().top)>parseInt(y)){
		//put boundaries
		var margin = parseInt($(".spliter").css("height"))+135;
		var target = $("#player").offset().top-margin;
		if(y>target){
			y=target;
		}
		moveSpliter(x,y);
		$("#listControls").css("top",y);
		var realTop = parseInt(y)+parseInt($("#spliter").css("height"));
		$("#prev-slider").css("top",realTop);
		$("#slider").css("top",realTop);
		$("#next-slider").css("top",realTop);
		var articleWidth = parseInt($("article:last").css("width"));
		var targetArticles = $("#slider").find("article");
		var counter = targetArticles.length;
		var width = (counter+1)*articleWidth;
		$("#slider").css("width",width);
		var value = parseInt($("#player").css("top"))-realTop;
		targetArticles.each(function(){
			$(this).css("height",value);
			//$(this).css("background-color","#EEE");
		});
		var arrowTop = parseInt(realTop+((parseInt($("#player").css("top"))-realTop)/2)); //arrows margin-top
		$("#arrow-left").css("top",arrowTop);
		$("#arrow-left").css("position","fixed");
		$("#arrow-left").css("z-index","101");
		$("#arrow-right").css("top",arrowTop);
		$("#arrow-right").css("position","fixed");
		$("#arrow-right").css("z-index","101");
		updateContent();
	}
}

function dropElement(x,y){
	var top = parseInt($(".spliter").offset().top);
	if(parseInt(y)+50>top){
		var lastGoodOne = $("article:not(.mouseDragged):last");
		var articles = $("#slider").find("article").length;
		var index = -1;
		var exit = false;
		for(var i=0;!exit && i<articles;i++){
			var target = $("#slider").find("article").eq(i);
			var center = parseInt(target.offset().left);
			center += parseInt(parseInt(target.css("width"))/2);
			if(center>parseInt(x)){
				index = i-1;
				exit = true;
			}
		}
		if(index>-1){ //use to insert instead last one to append at the end of the list
			lastGoodOne = $("#slider").find("article").eq(index);
		}
		//clone element to be in the dropped position
		var tempElement = $("#mouseTempDrag");
		var author = $("#mouseTempDrag").find('.authorContentClass').text();
		var time = "";
		var text = $("#mouseTempDrag").find('.ellipsisClass').text();
		var image = $("#mouseTempDrag").find('.imageClass').attr("src");
		var buttonContent = $("#mouseTempDrag").find('.buttonContentClass').text();
		var audioTrackUrl = atob($("#mouseTempDrag").find('#path').val());
		var draggable = true;
		var newArticle = getArticleElement(author,time,text,image,buttonContent,audioTrackUrl,draggable);
		
		if($("#mouseTempDrag").hasClass("currentTrack")){
			newArticle.addClass("currentTrack");
		}
		
		//newArticle.removeClass("mouseDragged");
		newArticle.css("height",lastGoodOne.css("height"));

		if(exit && index==-1){
			lastGoodOne = $("#slider").find("article").eq(0);
			lastGoodOne.before(newArticle);
		}else{
			lastGoodOne.after(newArticle);
		}
		tempElement.remove();
		$(".mouseDragged").remove();
	}
}

function dragElement(element,ev){
	var temp = element;
	temp.addClass("mouseDragged");
	temp.attr("id","mouseTempDrag");
	temp.css({"position":"fixed","top":ev.pageY+50,"left":ev.pageX-50});
	$("body").append(temp);
}


function drawSections(){
	$.getJSON("api.php",{"action":"getSections"},function(response){
		$("#sections").append("<ul id='ulSections' />");
		for(var i=0;i<response.length;i++){
			var section = '<li class="cursorClass"><div class="fitContent" onclick="launchAction(\''+response[i]["action"]+'\');">'+response[i]["label"]+'</div></li>';
			$("#ulSections").append(section);
		}
		$("#sections").append('<div id="loadingDiv" class="ld ld-ring ld-spin-fast huge"></div>');
		$("#loadingDiv").hide();
	});
}


function contextMenu(e){
	clearContextMenu();
	$("body").append("<div id='contextBox' class='contextMenu' onmouseout='clearContextMenu();'></div>");
	$("#contextBox").hide();
	if($("article.element").length>0){
		$("#contextBox").append("<div id='clearPlaylist' class='contextOption' onclick='clearPlaylist();' >Clear playlist</div>");
	}
	if(e.data!=null && e.data.length>0){
		//TODO
	}
	if($(".contextOption").length>0){
		$("#contextBox").css({left:e.pageX-15, top:e.pageY-15}); //,"position":"fixed","z-index":"1000000"
		$("#contextBox").fadeIn("fast");
		//toast("Context was launched!");
	}else{
		$("#contextBox").remove();
	}
}

function clearPlaylist(){
	//article class='element'
	$("article.element").each(function(){
		$(this).remove();
	});
	clearContextMenu();
}

function clearContextMenu(){
	$("#contextBox").fadeOut("fast");
	$("#contextBox").remove();
}
