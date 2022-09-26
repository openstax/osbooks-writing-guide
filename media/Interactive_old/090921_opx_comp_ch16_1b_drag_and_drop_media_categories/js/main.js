/*******************************************************/
$(document).ready(function () {

	var counter = 0;
	var pageLength = 0;
	var setting;
	var objAccessibility = null;
	var arrAllDraggableitem = null;
	var staticImagePath = "images/";
	var selectedItemColor;
	// var settingHoverBg;
	var color1,color2,color3;
	var white="#ffffff";
	var xml;

	/* detect mobile device start*/
	function detectMob() {
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
		];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
		/* detect mobile device ends */
	}

	$("#tempDiv").load("data/data.xml", function (response, status, xhr) {
		if (status != "error") {

			$("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
				if (status != "error") {
					/*Hiding the loading image*/
					$("#loadingImg").hide();
					/*End*/
					displayStaticContent();
					//$('.container').focus();
				
					specifyForMobile();

				}
			});
		}
	});

	/*Showing the loading image*/
	$("#loadingImg").show();



	function specifyForMobile() {
		if (detectMob()) {
			$(".dragableItemContainer").addClass("mobile-device");
			var top = 0;
			var left = 0;
			var drawCounter = 0;

			$(".container").find(".mobile-device").find(".draggableitemWraper").each(function (index, el) {
				drawCounter = drawCounter + .3;
				top = top + drawCounter;
				left = left + drawCounter;
				$(el).css({
					"position": "absolute",
					"top": top + "px",
					"left": left + "px"
				});
			})

			$(".container .draggableitem").prop('disabled', true);
			$(".container .draggableitem").last().removeAttr('disabled');

			if($(".categoryContainer").hasClass("submited"))
			{
			var h=$('.nav-container').height();
			$('.submited').css("padding-bottom",(h-25)+"px");
			}


		} else {
			$(".dragableItemContainer").removeClass("mobile-device");

			if($(".categoryContainer").hasClass("submited"))
			{
			$('.categoryContainer').removeAttr("style");
			}
			
		}
		// $(el).find(".draggableitem").prop('disabled',true);

	}



	$(window).on('resize', function(){
		var win = $(this); //this = window
		if (win.height() >= 820) { /* ... */ }
		if (win.width() <= 1050) { 
			
			$(".dragableItemContainer").addClass("mobile-device");
			var top = 0;
			var left = 0;
			var drawCounter = 0;

			$(".container").find(".mobile-device").find(".draggableitemWraper").each(function (index, el) {
				drawCounter = drawCounter + .3;
				top = top + drawCounter;
				left = left + drawCounter;
				$(el).css({
					"position": "absolute",
					"top": top + "px",
					"left": left + "px"
				});
			})

			if($(".categoryContainer").hasClass("submited"))
			{
			var h=$('.nav-container').height();
			$('.submited').css("padding-bottom",(h-25)+"px");
			}

			$(".container .draggableitem").prop('disabled', true);
			$(".container .draggableitem").last().removeAttr('disabled');

		 }else{
			$(".dragableItemContainer").removeClass("mobile-device");
			if($(".categoryContainer").hasClass("submited"))
			{
				$('.categoryContainer').removeAttr("style");
			}
			

			var top = 45;
		var left = 0;
		var totalItemLen = arrAllDraggableitem.length;

		$(".container").find(".draggableitemWraper").each(function(index,el){
			$(el).css({"position":"absolute","top":top+"px","left":left+"%"});
			$(el).find('.draggableitem').prop('disabled',true);
			var width= $(el).width();
			// left=left+width+10;
			left=left+25;
			if((index+1)%4==0)
			{
				left=0;
				top=top-10;
			}
			if(index>=totalItemLen-4){
				$(el).find('.draggableitem').removeAttr('disabled');
			}
			});
		 }
	});


	function displayStaticContent() {
		function isMacintosh() {
			return navigator.platform.indexOf('Mac') > -1
		}
		var isMac = isMacintosh();
		if (isMac) {
			$('.content').addClass('contentMac');
		}

		var xmlDoc = $.parseXML($("#tempDiv").html());
		xml = $(xmlDoc);
		//console.log(xml.find("content"));
		pageLength = xml.find("content").length;
		var settingDoc = $.parseXML($("#tempSetting").html());
		setting = $(settingDoc);

		//focus setting
		var focusColor = setting.find("focuscolor").attr('color').split(',')[0];
		selectedItemColor = setting.find("focuscolor").attr('selecteditemcolor').split(',')[0];
		$('body').append('<style>input[type=button]:focus{ outline-color: ' + focusColor + ';} button:focus{outline-color: ' + focusColor + ';}</style>');


		//$('body').append('<style>input[type=button]:focus{outline: '+focusBorder+'px solid ' + focusColor + '; border: 0px solid transparent;} button:focus{outline: '+focusBorder+'px solid ' + focusColor + '; border: 0px solid transparent;}</style>');

		// title style from from setting.xml
		var fontfamily = setting.find("titlestyle").attr('fontfamily');
		var color = setting.find("titlestyle").attr('color');
		var backgroundcolor = setting.find("titlestyle").attr('backgroundcolor');

		// category title
		var categorytitleFontfamily = setting.find("categorytitle").attr('fontfamily');
		var categorytitleColor = setting.find("categorytitle").attr('color');
		var categorytitleBackgroundcolor = setting.find("categorytitle").attr('backgroundcolor');

		var arrSettingStyleItem = setting.find("styleitem")
		// category title
		var draggableitemFontfamily = setting.find("draggableitem").attr('fontfamily');
		var draggableitemColor = setting.find("draggableitem").attr('color');
		var draggableitemBackgroundcolor = setting.find("draggableitem").attr('backgroundcolor');


		// title style from from setting.xml
		var feedbackFontFamily = setting.find("feedback").attr('fontfamily');
		var feedbackColor = setting.find("feedback").attr('color');
		$('.feedback').css({
			"font-family": feedbackFontFamily,
			"color": feedbackColor
		});

		// title style from from setting.xml
		var instNormFontFamily = setting.find("instructionnorm").attr('fontfamily');
		var instNormColor = setting.find("instructionnorm").attr('color');
		var instNormBackgroundcolor = setting.find("instructionnorm").attr('backgroundcolor');

		console.log('fontfamily=', fontfamily);

		var title = xml.find("titletext").text();
		var instructionNorm = xml.find("instruction").find("instructionnorm").html();
		//console.log("dgdfgdfgfd=", title, instructionNorm);

		var arrAllCategory = xml.find("category").find("categorytitle");
		arrAllDraggableitem = xml.find("draggableitem").find("item");


		$("#title").text(title).css({
			"font-family": fontfamily,
			"color": color,
			"backgroundColor": backgroundcolor
		});
		$("#instructionnorm").html(instructionNorm).css({
			"font-family": instNormFontFamily,
			"color": instNormColor,
			"backgroundColor": instNormBackgroundcolor
		});

		/* generating category view */
		arrAllCategory.each(function (index, el) {
			console.log('index=', index);
			$(".categoryContainer").append('<div class="category category-' +index+ ' category-' + arrAllCategory.length + '"><div class="categoryTitleCnt categoryTitleCnt_' + index + '"><button cat=' + $(el).attr("cat") + ' class="categoryTitle categoryTitle_' + index + '">' + $(el).html() + '</button></div><div class="categoryDroppableCnt categoryDroppableCnt_' + index + '"></div></div>');
		});

		$('.categoryTitle').css({
			"font-family": categorytitleFontfamily,
			"color": categorytitleColor,
			"backgroundColor": categorytitleBackgroundcolor
		}).off().on("click", selectCategory);

		/* generating draggable items view */
		arrAllDraggableitem.each(function (index, el) {
			// console.log('index=', index);
			$(".dragableItemContainer").append('<div class="draggableitemWraper draggableitemWraper_' + index + '"><div class="draggableitemCnt draggableitemCnt_' + index + '"><button cat=' + $(el).attr("cat") + ' id="draggableitem_' + index + '" class="draggableitem draggableitem_' + index + '">' + $(el).html() + '</button></div></div>');
		});

		$('.draggableitem').css({
			"font-family": draggableitemFontfamily,
			"color": draggableitemColor,
			// "backgroundColor": draggableitemBackgroundcolor
		}).off().on("click", selectDraggable);

		var top = 45;
		var left = 0;
		var totalItemLen = arrAllDraggableitem.length;

		$(".container").find(".draggableitemWraper").each(function(index,el){
			$(el).css({"position":"absolute","top":top+"px","left":left+"%"});
			$(el).find('.draggableitem').prop('disabled',true);
			var width= $(el).width();
			// left=left+width+10;
			left=left+25;
			if((index+1)%4==0)
			{
				left=0;
				top=top-10;
			}
			if(index>=totalItemLen-4){
				$(el).find('.draggableitem').removeAttr('disabled');
			}
			});

		// var feedbackcor = xml.find("feedbackcor").html();
		// $('.feedback').html(feedbackcor).css({
		// 	"font-family": feedbackFontFamily,
		// 	"color": feedbackColor
		// });

		$(".settinToolsContainer").append('<div class="toolsCnt"></div>');
		$(".settinToolsContainer").append('<button title="close" class="close"></button>');
		// var defauldhoverBg;
		arrSettingStyleItem.each(function (ind, el) {


			// color1


			// $('.settinToolsContainer').css({backgroundColor:color3});

			if (ind == 0) {
				$(".settinToolsContainer .toolsCnt").append('<div class="toolContainer_' + ind + '"><button bg="' + $(el).attr("background") + '" fg="' + $(el).attr("foreground") + '" class="tool tool_' + ind + '">button</button><p l lang="en" class="toolTxt toolTxt_' + ind + '">' + $(el).attr("txt") + '</p></div>');
			} else {
				var allcolors = $(el).attr("colors");
				color1 = allcolors.split(",")[0];
				color2 = allcolors.split(",")[1];
				color3 = allcolors.split(",")[2];
				// $(".settinToolsContainer .toolsCnt").append('<button role="settings tool" class="toolContainer toolContainer_'+ind+'" colors="'+$(el).attr("colors")+'"><img src="'+staticImagePath+$(el).attr("picname")+'" class="tool tool_'+ind+'"/><span l lang="en" class="toolTxt toolTxt_'+ind+'">'+$(el).attr("txt")+'</span></button>');

				$(".settinToolsContainer .toolsCnt").append('<button role="settings tool"  class="toolContainer toolContainer_' + ind + '" colors="' + $(el).attr("colors") + '"><svg xmlns="http://www.w3.org/2000/svg" class="tool tool_' + ind + '" width="39" height="39" viewBox="0 0 39 39"><g id="Group_717" data-name="Group 717" transform="translate(-1514 -62)"> <circle id="Ellipse_203" data-name="Ellipse 203" cx="19.5" cy="19.5" r="19.5" transform="translate(1514 62)" fill="' + color1 + '"/><rect id="Rectangle_769" data-name="Rectangle 769" width="39" height="8" rx="1" transform="translate(1514 78)" fill="' + color3 + '"/></g></svg>' + $(el).attr("txt") + '</span></button>');
			}

		});

		var firstColor=$(arrSettingStyleItem[1]).attr("colors");
		color1=firstColor.split(",")[0];
		color2=firstColor.split(",")[1];
		color3=firstColor.split(",")[2];
		console.log("color1",color1);

		$('.settinToolsContainer').css({
			backgroundColor: white
		});
		$('.setting').find("path").attr('fill', color1);

		
		// alert(defauldhoverBg);
		
		$('body').append('<style class="default">.submit_btn,.tryagain_btn,.reset_btn{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn:hover,.tryagain_btn:hover,.reset_btn:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';}  .submit_btn:active,.tryagain_btn:active,.reset_btn:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');


		$('.settinToolsContainer .toolContainer_0').find('.toolTxt').css({
			"font-family": $(arrSettingStyleItem[0]).attr('fontfamily'),
			"color": $(arrSettingStyleItem[0]).attr('color')
		});

		$('.settinToolsContainer .toolContainer').each(function (index, el) {
			var arr = $(arrSettingStyleItem[index]).attr('fontfamily');
			console.log("raj=", arr);
			$(el).find('.toolTxt').css({
				"font-family": $(arrSettingStyleItem[index + 1]).attr('fontfamily'),
				"color": $(arrSettingStyleItem[index + 1]).attr('tooltextcolor')
			});
		});



		//displayDynContent(counter);

		$(document).keydown(function(e){

			if(document.activeElement.classList.contains("draggableitem")){
				var code = e.keyCode || e.which;
				if(code == 13) 
				{ //Enter keycode
				//Do something
				$(".container .draggableitem").css("borderColor","transparent");
				$(document.activeElement).css("borderColor",selectedItemColor);
				}
			}
			if(document.activeElement.classList.contains("categoryTitle")){
				var code = e.keyCode || e.which;
				if(code == 13) 
				{ //Enter keycode
				//Do something
				$(".container .draggableitem").css("borderColor","transparent");
				}
			}
		});

		$('.settinToolsContainer .toolContainer').off().on("click", changeBgFgOfTemplate);

		function changeBgFgOfTemplate() {
			//alert("ok");
			color1 = $(this).attr('colors').split(",")[0];
			color2 = $(this).attr('colors').split(",")[1];
			color3 = $(this).attr('colors').split(",")[2];
			//settingHoverBg=$(this).attr('colors').split(",")[2];
			// $('.content').css({
			// 	backgroundColor: color2
			// });
			//alert("ok");
		//	alert($(this).index());
			//focus setting

			$('body').find("style").remove();
			var ind=$(this).index()-1;
		var focusColor = setting.find("focuscolor").attr('color').split(',')[ind];
		selectedItemColor = setting.find("focuscolor").attr('selecteditemcolor').split(',')[ind];

		$('body').append('<style>input[type=button]:focus{ outline-color: ' + focusColor + ';} button:focus{outline-color: ' + focusColor + ';}</style>');

			$(".settinToolsContainer .toolContainer").css({
				color: color1
			});

			$(".settinToolsContainer .toolTxt").css({
				color: color1
			});

			$('#title').css({
				color: color1
			});
			$('#instructionnorm').css({
				color: color2
			});

			$('.leftContentTitle').css({
				color: color2
			});
			$('.leftSubContainer').css({
				color: color2
			});

			// $('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);
			// $('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);

			// $('.submit_btn,.tryagain_btn,.reset_btn').css({
			// 	backgroundColor: color1
			// });

			$('body').append('<style class="default">.submit_btn,.tryagain_btn,.reset_btn{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn:hover,.tryagain_btn:hover,.reset_btn:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';}  .submit_btn:active,.tryagain_btn:active,.reset_btn:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');

			// $('body').append('<style>.submit_btn,.tryagain_btn,.reset_btn:focus{ outline-color: ' + focusColor + ';} button:focus{outline-color: ' + focusColor + ';}</style>');
			// $('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);
			$('.categoryTitle').css({
				backgroundColor: color1
			});

			$('.settinToolsContainer').css({
				backgroundColor: white
			});
			
			$('.setting').find("path").attr('fill', color1);

		}

	}

	function selectDraggable() {
		
		var curId;

		if($(this).parents(".dragableItemContainer"))
		{
		curId = $(this).attr("id");
		$(this).parents(".dragableItemContainer").attr("curitem", curId);	
		}

		if($(this).parents(".dragableItemContainer"))
		{
		 curId = $(this).attr("id");
		$(this).parents(".categoryDroppableCnt").attr("curitem", curId);
		}
		
		
	}

	function selectCategory() {
		var id;
		var dragCurId;
		var catCurId;
		dragCurId = $(".dragableItemContainer").attr("curitem");
		//catCurId=$(".categoryDroppableCnt").attr("curitem");
		$(".categoryDroppableCnt").each(function (index, el) {
			var curItem= $(el).attr("curitem");
			if(curItem)
			{
				catCurId=curItem;	
			}
		});

		// console.log("catCurId=",catCurId);
		if(dragCurId)
		{
			id=dragCurId;
		}else if(catCurId){
			id=catCurId;
		}

		// console.log("id=",id);

		if (id) {
			var index = id.split("_")[1];
			var categoryDroppableCnt = $(this).parents(".category").find(".categoryDroppableCnt");
			if(index>=4){
				$(".draggableitemCnt_"+(index-4)).find(".draggableitem").removeAttr('disabled');
			}
			
			if (detectMob()) {
				$(".draggableitemCnt_" + index).find(".draggableitem").removeAttr('disabled');
			}

			if(dragCurId)
			{
			$(".draggableitemCnt_" + index).appendTo(categoryDroppableCnt);
			$(".dragableItemContainer").removeAttr("curitem");
			}

			if(catCurId)
			{
			$(".categoryDroppableCnt").find(".draggableitemCnt_" + index).appendTo(categoryDroppableCnt);
			//$(".categoryDroppableCnt").removeAttr("curitem");
		}

			if (detectMob()) {
				$("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
				$(".container .draggableitem").last().removeAttr('disabled');
			}


			

			//alert("ok");
			var totalDropedItem = 0;
			$('.category').each(function (index, el) {
				var dropedItemLenth = $(el).find(".categoryDroppableCnt").children().length;
				totalDropedItem = totalDropedItem + dropedItemLenth
				// console.log('dropedItemLenth=', dropedItemLenth);

				var catTitle = $(el).find(".categoryTitle").attr("cat");
				$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
					if ($(ell).find(".draggableitem").attr("cat") == catTitle) {
						$(ell).find(".draggableitem").removeClass("incorrect");
						$(ell).find(".draggableitem").addClass("correct");
					} else {
						$(ell).find(".draggableitem").removeClass("correct");
						$(ell).find(".draggableitem").addClass("incorrect");
					}
				});

			})
			console.log('totalDropedItem=', totalDropedItem);
			if (totalDropedItem == arrAllDraggableitem.length) {
				$('.nav-container').show();
				$('.submit_btn').show().focus().off().on("click", submitListener);

				if (detectMob()){
					$('.dragableItemContainer').css("display","block");
					}else{
						// alert("ok");
					$('.dragableItemContainer').css("display","none");
					}
			}
		}
		//$(this).parent().parent().append(curItem);
		$(".categoryDroppableCnt").removeAttr("curitem");
	}

	function submitListener() {
		var correctCounter = 0;
		$('.category').each(function (index, el) {
			var catTitle = $(el).find(".categoryTitle").attr("cat");
			// totalDropedItem=totalDropedItem+dropedItemLenth
			//console.log('catTitle=',catTitle);
			$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
				if ($(ell).find(".draggableitem").hasClass("correct")) {
					// $(ell).find(".draggableitem").addClass("correctBorder");
					$(ell).find(".draggableitem").css("borderColor","green");
					correctCounter++;
				} else {
					// $(ell).find(".draggableitem").addClass("incorrectBorder");
					$(ell).find(".draggableitem").css("borderColor","red");
					
				}
			});
		});
		//console.log('correctCounter=',correctCounter);
		$(this).hide();
		$('.categoryContainer').addClass("submited");
		$('.nav-container').show();
		if (correctCounter == arrAllDraggableitem.length) {

			$('.reset_btn').show().focus().off().on("click", resetListener);
			$('.feedback').show();
			var feedbackcor = xml.find("feedbackcor").html();
			$('.feedback').html(feedbackcor);

		if (detectMob()){
			$('.dragableItemContainer').css("display","block");
			}else{
				// alert("ok");
			$('.dragableItemContainer').css("display","none");
			}

		} else {
			$('.tryagain_btn').show().focus().off().on("click", tryagainListener);
			$('.feedback').show();
			var feedbackincor = xml.find("feedbackincor").html();
			console.log("feedbackincor=",feedbackincor);
			$('.feedback').html(feedbackincor);
		}

		$('.reset_btn,.tryagain_btn').addClass("position-try-reset-btn");
		$('.nav-container').addClass("adjust-nav-cnt");

		if (detectMob()){
		var h=$('.nav-container').height();
		$('.submited').css("padding-bottom",h+"px");
		}else{
			$('.submited').removeAttr("style");
		}


		$('.category .draggableitem').off("click").prop('disabled', true);
		
	}

	function resetListener() {
		$('.feedback').hide();
		
		resetCategory(this);

	}


	function tryagainListener() {
		$('.feedback').hide();
		resetCategory(this);

	}

	function resetCategory(objThis) {
		$('.categoryContainer').removeAttr("style");
		arrAllDraggableitem.each(function (index, el) {
			$(".categoryContainer").find(".draggableitemCnt_" + index).appendTo(".draggableitemWraper_" + index);
		});
		$('.categoryContainer').removeClass("submited");
		// $(".draggableitem").removeClass("correct incorrect correctBorder incorrectBorder");
		$(".draggableitem").removeClass("correct incorrect").css("borderColor","transparent");
		$(objThis).hide();
		$(objThis).parent(".nav-container").hide();

		

		if (detectMob()) {
			$(".container .draggableitem").prop('disabled', true);
			$(".container .draggableitem").last().removeAttr('disabled');
		}else{
			var totalItemLen = arrAllDraggableitem.length;
		$(".container .draggableitem").prop('disabled', true);
		$(".container").find(".draggableitemWraper").each(function(index,el){
			if(index>=totalItemLen-4){
				$(el).find('.draggableitem').removeAttr('disabled');
			}
			});
		}

		$(".container .draggableitem").off().on("click", selectDraggable);

		$('.reset_btn,.tryagain_btn').removeClass("position-try-reset-btn");
		// $('.nav-container').removeClass("adjust-nav-cnt");

		// if (detectMob()){
			$('.dragableItemContainer').css("display","block");
			
		

	}


	$('.setting').off('click').on('click', settingListener);
	$('.setting').off('mouseover').on('mouseover', settinghoverListener);
	$('.setting').off('mouseleave').on('mouseleave', settinghoutListener);

	function settingListener() {
		$(this).hide();
		$('.settinToolsContainer').addClass('showhide');
		$('.settinToolsContainer .close').off().on('click', closeSetting);
	}


	function settinghoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$('.setting').find("path").attr('fill', color3);
	}

	function settinghoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$('.setting').find("path").attr('fill', color1);
	}
	

	function closeSetting() {
		$(".setting").show();
		$('.settinToolsContainer').removeClass('showhide');
	}

});