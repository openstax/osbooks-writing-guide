/*******************************************************/
$(document).ready(function () {

	var counter = 0;
	var pageLength = 0;
	var staticImagePath = "images/";
	var setting;
	var objAccessibility = null;
	var content = $('.content');
	var activityType = '';
	var xml = null;
	var leftSubContainer;

	var color1;
	var color2;
	var color3;
	var disableBg = "#d3d2d2";
	var white = "#ffffff";
	var focusColor;

	var anscounter=0;
	
	
    // var scrm = pipwerks.SCORM; // shortcut
    // scrm.version = "1.2";
	// scrm.init();

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
					$("#loadingImg").hide();
					displayStaticContent();
					$('.container').focus();
					//alert('ok');
				}
			});
		}
	});

	/*Showing the loading image*/
	$("#loadingImg").show();

	function displayStaticContent() {


		var xmlDoc = $.parseXML($("#tempDiv").html());
		xml = $(xmlDoc);




		//console.log(xml.find("content"));
		pageLength = xml.find("content").length;
		objAccessibility = new Accessibility(pageLength); // call Accessibility funcion from accessibilityJs
		var settingDoc = $.parseXML($("#tempSetting").html());
		setting = $(settingDoc);

		focusColor = setting.find("focuscolor").attr('color').split(",")[0];
		$('body').append('<style>input[type=button]:focus{outline-color:' + focusColor + ';}</style>');

		// title style from from setting.xml
		var fontfamily = setting.find("titlestyle").attr('fontfamily');
		var color = setting.find("titlestyle").attr('color');
		var backgroundcolor = setting.find("titlestyle").attr('backgroundcolor');

		// title style from from setting.xml
		var instNormFontFamily = setting.find("instructionnorm").attr('fontfamily');
		var instNormColor = setting.find("instructionnorm").attr('color');
		var instNormBackgroundcolor = setting.find("instructionnorm").attr('backgroundcolor');

		var arrSettingStyleItem = setting.find("styleitem");

		var title = xml.find("templatetitle").html();
		// var instructionBold = xml.find("instruction").find("instructionbold").text();
		var instructionNorm = xml.find("instruction").find("instructionnorm").html();
		// console.log("dgdfgdfgfd=",title, instructionBold, instructionNorm);

		$("#title").html(title).css({
			"font-family": fontfamily,
			"color": color,
			"backgroundColor": backgroundcolor
		});

		//  $("#instructionbold").text(instructionBold).css({"font-family":instBoldFontFamily,"color":instBoldColor,"backgroundColor":instBoldBackgroundcolor});

		$("#instructionnorm").html(instructionNorm).css({
			"font-family": instNormFontFamily,
			"color": instNormColor,
			"backgroundColor": instNormBackgroundcolor
		});

		$(".settinToolsContainer").append('<div class="toolsCnt"></div>');
		$(".settinToolsContainer").append('<button title="close" class="close"></button>');
		arrSettingStyleItem.each(function (ind, el) {
			colors = String($(el).attr("colors")).split(',');
			if (ind == 0) {
				$(".settinToolsContainer .toolsCnt").append('<div class="toolContainer_' + ind + '"><button bg="' + $(el).attr("background") + '" fg="' + $(el).attr("foreground") + '" class="tool tool_' + ind + '">button</button><p l lang="en" class="toolTxt toolTxt_' + ind + '">' + $(el).attr("txt") + '</p></div>');
			} else {
				$(".settinToolsContainer .toolsCnt").append('<button role="settings tool" class="toolContainer toolContainer_' + ind + '" colors="' + $(el).attr("colors") + '"><svg class="tool tool_' + ind + '" id="colorscheme1" xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39"><g id="Group_717" data-name="Group 717" transform="translate(-1687 -62)"><circle id="Ellipse_200" data-name="Ellipse 200" cx="19.5" cy="19.5" r="19.5" transform="translate(1687 62)" fill="' + colors[0] + '" /><rect id="Rectangle_771" data-name="Rectangle 771" width="39" height="8" rx="1" transform="translate(1687 78)" fill="' + colors[2] + '" /></g></svg><span l lang="en" class="toolTxt toolTxt_' + ind + '">' + $(el).attr("txt") + '</span></button>');
			}

			if (ind == 1) {
				// var colors = $(el).attr("colors");
				// color1 = colors.split(",")[0];
				// color2 = colors.split(",")[1];
				// color3 = colors.split(",")[2];
				// $('.settinToolsContainer').css({
				// 	backgroundColor: color3
				// });
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
		$(".default").remove();
		$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.submit_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .continue_btn_mcq{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_textarea:hover,.submit_btn_mcq:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_textarea:active,.submit_btn_mcq:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');




		$('.setting').find("path").attr('fill', color1);
		$('.next_btn,.prev_btn,.reset_btn').find("circle").attr('fill', color1);
		$('.next_btn,.prev_btn,.reset_btn').find("path").attr('fill', white);


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


		displayDynContent(counter);

		$('.settinToolsContainer .toolContainer').off().on("click", changeBgFgOfTemplate);

		function changeBgFgOfTemplate() {
			//alert("ok");
			color1 = $(this).attr('colors').split(",")[0];
			color2 = $(this).attr('colors').split(",")[1];
			color3 = $(this).attr('colors').split(",")[2];

			// $('.content').css({backgroundColor:color1});
			$('#title').css({
				color: color1
			});
			$('#instructionnorm').css({
				color: color2
			});
			$(".settinToolsContainer .toolContainer").css({
				color: color1
			});

			$(".settinToolsContainer .toolTxt").css({
				color: color1
			});
			$('.settinToolsContainer').css({
				backgroundColor: white
			});

			if (!$('.next_btn').hasClass("disable_next")) {
				$('.next_btn').find("circle").attr('fill', color1);
				$('.next_btn').find("path").attr('fill','#d3d3d3');
			}

			if ($('.submit_btn_textarea').hasClass("enable_submit_textarea")) {
				// $('.submit_btn_textarea').find("rect").attr('fill', color1);
				// $('.submit_btn_textarea').find("path").attr('fill',bg);
			}

			if ($('.submit_btn_mcq').hasClass(".enable_submit_mcq")) {
				// $('.submit_btn_mcq').find("rect").attr('fill', color1);
				// $('.submit_btn_mcq').find("path").attr('fill',bg);
			}



			$('.prev_btn,.reset_btn,.testyourskill_btn').find("circle").attr('fill', color1);
			// $('.prev_btn,.reset_btn,.testyourskill_btn').find("path").attr('fill',bg);

			$('.testyourskill_btn').find(".st0").attr('fill', color1);
			// $('.testyourskill_btn').find("path").attr('fill',bg);

			$('.continue_btn_textarea').find("rect").attr('fill', color1);

			$('.continue_btn_mcq').find("rect").attr('fill', color1);

			$('.leftContainer ').find("g").find("#selectedColor").attr('fill', color1);

			// $('..continue_btn_textarea').find("path").attr('fill',bg);

			$(".textAriaTitle").css({
				'backgroundColor': color3
			});

			$('body').find("style").remove();
			var ind=$(this).index()-1;
		var focusColor = setting.find("focuscolor").attr('color').split(',')[ind];
		// selectedItemColor = setting.find("focuscolor").attr('selecteditemcolor').split(',')[ind];

		// $('body').append('<style>input[type=button]:focus{ outline-color: ' + focusColor + ';} button:focus{outline-color: ' + focusColor + ';}</style>');

		var texTareaValue=$('textarea').val();
		// console.log("texTareaValue=",texTareaValue.length);


		var optionSelected=$('.optionCnt').attr("ans");
		console.log("optionSelected=",optionSelected);

		$(".default").remove();
		$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.continue_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .submit_btn_mcq{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');
		if(texTareaValue!=undefined)
			{
		if((texTareaValue.length > 0))
		{
			console.log("filled textarea");
		$(".default").remove();
		$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.continue_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: '+color1+'; color:'+color1+'; background-color:transparent;} .submit_btn_mcq{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_textarea:hover,.submit_btn_mcq:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_textarea:active,.submit_btn_mcq:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');
		}
	}

		if(optionSelected!=undefined)
		{
			console.log("filled mcq");
		$(".default").remove();
		$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.continue_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .submit_btn_mcq{ border-color: '+color1+'; color:'+color1+'; background-color:transparent;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_textarea:hover,.submit_btn_mcq:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_textarea:active,.submit_btn_mcq:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');
		}


		}
	}


	function displayDynContent(counter) {

		var content = $('.content');
		var leftContainer = $('.leftContainer');
		var rightContainer = $('.rightContainer');
		changeLeBackftAndRightContainerPos();
		// title style from from setting.xml
		var contentTitleFontFamily = setting.find("contenttitle").attr('fontfamily');
		var contentTitleColor = setting.find("contenttitle").attr('color');
		var contentTitleBackgroundcolor = setting.find("contenttitle").attr('backgroundcolor');

		// title style from from setting.xml
		var contentDataFontFamily = setting.find("contentdata").attr('fontfamily');
		var contentDataColor = setting.find("contentdata").attr('color');
		var contentDataBackgroundcolor = setting.find("contentdata").attr('backgroundcolor');

		var picturedescriptionFontFamily = setting.find("picturedescription").attr('fontfamily');
		var picturedescriptionColor = setting.find("picturedescription").attr('color');

		// var xmlDoc = $.parseXML($("#tempDiv").html());
		// var xml = $(xmlDoc);

		$('.counter').text(counter + 1);
		$('.total').text(pageLength);
		//console.log(pageLength);
		var xmlLeftContentTitle = xml.find("content").eq(counter).find("contenttitle").text();
		console.log('xmlLeftContentTitle=', xmlLeftContentTitle);

		activityType = xml.find("content").eq(counter).find("contentdata").attr('type');
		console.log('activityType=', activityType);


		var imgName = xml.find("content").eq(counter).find("picture").eq(0).attr("picname");
		var imgAlt = xml.find("content").eq(counter).find("picture").eq(0).attr("alt");
		var picturedescriptionText = xml.find("content").eq(counter).find("picturedescription").eq(0).html();
		// console.log('picturedescriptionText=',picturedescriptionText);
		//console.log('rightContentLength=',rightContentLength);

		if (activityType == 'introduction') {
			$('.pic').attr("src", staticImagePath + imgName);

			$('.pic').attr("alt", imgAlt);

			$('.pic_desc').html(picturedescriptionText).css({
				"font-family": picturedescriptionFontFamily,
				"color": picturedescriptionColor
			});
			
			$(".testyourskill_btn").hide();
			content.removeClass('setContent');
			var arrXmlLeftContent = xml.find("content").eq(counter).find("contentdata").find("para");
			leftContainer.empty();
			leftContainer.append("<div class='leftContentTitle'></div><div class='leftSubContainer'></div>");
			var leftContentTitle = $('.leftContentTitle');
			leftSubContainer = $('.leftSubContainer');

			leftContentTitle.html(xmlLeftContentTitle).css({
				"font-family": contentTitleFontFamily,
				"color": contentTitleColor,
				"backgroundColor": contentTitleBackgroundcolor
			});
			leftSubContainer.css({
				"font-family": contentDataFontFamily,
				"color": contentDataColor,
				"backgroundColor": contentDataBackgroundcolor
			});
			//leftSubContainer.addClass('tableCell').parent(".leftContainer").addClass('fullHeight');
			//leftContainer.addClass('fullContent fullTextArea');

			console.log('arrXmlLeftContent=', arrXmlLeftContent.length);
			leftSubContainer.empty();
			arrXmlLeftContent.each(function (ind, el) {
				leftSubContainer.append("<p>" + $(el).html() + "</>");
			});
			//rightContainer.hide();	
			// leftContainer.children('h3').hide();
		} else if (activityType == 'continued') {
			$(".next_btn").find("path").attr('fill', white);

			content.removeClass('pageOne setContent');
			leftContainer.empty();
			leftContainer.append("<div class='leftContentTitle'></div><div class='leftSubContainer'></div>");
			var leftContentTitle = $('.leftContentTitle');
			leftSubContainer = $('.leftSubContainer');

			$(".testyourskill_btn").hide();

			var arrXmlLeftContent = xml.find("content").eq(counter).find("contentdata").find("para");
			leftContentTitle.html(xmlLeftContentTitle).css({
				"font-family": contentTitleFontFamily,
				"color": contentTitleColor,
				"backgroundColor": contentTitleBackgroundcolor
			});
			leftSubContainer.css({
				"font-family": contentDataFontFamily,
				"color": contentDataColor,
				"backgroundColor": contentDataBackgroundcolor
			});
			leftSubContainer.removeClass('tableCell').parent(".leftContainer").removeClass('fullHeight');
			leftContainer.removeClass('fullContent fullTextArea');
			leftContainer.children('h3').show();
			console.log('arrXmlLeftContent=', arrXmlLeftContent.length);
			leftSubContainer.empty();
			arrXmlLeftContent.each(function (ind, el) {
				leftSubContainer.append("<p class = para_" + ind + ">" + $(el).text() + "</>");
			});

			rightContainer.show();
			$('.pic').attr("src", staticImagePath + imgName);
			$('.pic').attr("alt", imgAlt);
			$('.pic_desc').html(picturedescriptionText).css({
				"font-family": picturedescriptionFontFamily,
				"color": picturedescriptionColor
			});


		} else if (activityType == 'testyourskills') {
			content.removeClass('pageOne setContent');
			leftContainer.empty();
			leftContainer.append("<div class='leftContentTitle'></div><div class='leftSubContainer'></div>");
			var leftContentTitle = $('.leftContentTitle');
			leftSubContainer = $('.leftSubContainer');


			$(".testyourskill_btn").show();
			var arrXmlLeftContent = xml.find("content").eq(counter).find("contentdata").find("para");
			leftContentTitle.html(xmlLeftContentTitle).css({
				"font-family": contentTitleFontFamily,
				"color": contentTitleColor,
				"backgroundColor": contentTitleBackgroundcolor
			});
			leftSubContainer.css({
				"font-family": contentDataFontFamily,
				"color": contentDataColor,
				"backgroundColor": contentDataBackgroundcolor
			});
			leftSubContainer.removeClass('tableCell').parent(".leftContainer").removeClass('fullHeight');
			leftContainer.removeClass('fullContent fullTextArea');
			leftContainer.children('h3').show();
			console.log('arrXmlLeftContent=', arrXmlLeftContent.length);
			leftSubContainer.empty();
			arrXmlLeftContent.each(function (ind, el) {
				leftSubContainer.append("<p class = para_" + ind + ">" + $(el).text() + "</>");
			});

			rightContainer.show();
			$('.pic').attr("src", staticImagePath + imgName);
			$('.pic').attr("alt", imgAlt);
			$('.pic_desc').html(picturedescriptionText).css({
				"font-family": picturedescriptionFontFamily,
				"color": picturedescriptionColor
			});

		} else if (activityType == 'textentry') {
			console.log('text entry');
			content.addClass('setContent');
			leftContainer.empty().addClass('fullTextArea');
			leftContainer.append("<div class='textAriaTitle'></div><textarea type=text class=text-area placeholder=Type your answer:  id=textEntry></textarea>");

			var leftContentTitle = leftContainer.find('.textAriaTitle');
			var textAriaTitle = xml.find("content").eq(counter).find("contentdata").find("textariatitle").html();
			var feedbackTitle = xml.find("content").eq(counter).find("contentdata").find("feedbacktitle").text();
			var arrFeedbackContentPara = xml.find("content").eq(counter).find("contentdata").find("feedbackcontent").find('para');
			leftContentTitle.html(textAriaTitle);

			var textareashortansFF = setting.find("textareashortans").attr('fontfamily');
			var textareashortansFC = setting.find("textareashortans").attr('color');

			var textareashortanscontentFF = setting.find("textareashortanscontent").attr('fontfamily');
			var textareashortanscontentFC = setting.find("textareashortanscontent").attr('color');

			var textareashortanstextFF = setting.find("textareashortanstext").attr('fontfamily');
			var textareashortanstextFC = setting.find("textareashortanstext").attr('color');


			//var textareashortansBC = setting.find("textareashortans").attr('backgroundcolor');

			leftContentTitle.find('.shortanswer').css({
				"font-family": textareashortansFF,
				"color": textareashortansFC
			});

			leftContentTitle.find('.shortanswer1').css({
				"font-family": textareashortanscontentFF,
				"color": textareashortanscontentFC
			});

			leftContainer.find('.text-area').css({
				"font-family": textareashortanstextFF,
				"color": textareashortanstextFC
			});

			rightContainer.hide();

			var textareafeedbackFF = setting.find("textareafeedback").attr('fontfamily');
			var textareafeedbackFC = setting.find("textareafeedback").attr('color');

			var textareafeedbacktextFF = setting.find("textareafeedbacktext").attr('fontfamily');
			var textareafeedbacktextFC = setting.find("textareafeedbacktext").attr('color');

			$('.textareaFeedbackTitle').html(feedbackTitle).css({
				"font-family": textareafeedbackFF,
				"color": textareafeedbackFC
			});
			$('.textareaFeedbackContect').empty().css({
				"font-family": textareafeedbacktextFF,
				"color": textareafeedbacktextFC
			});

			$(".testyourskill_btn").hide();

			arrFeedbackContentPara.each(function (ind, el) {
				$('.textareaFeedbackContect').append("<p class = para_" + ind + ">" + $(el).text() + "</>");
			});

			$(".textAriaTitle").css({
				'backgroundColor': color3
			});



		} else if (activityType == 'mcq') {

			var imgPosition = xml.find("content").eq(counter).find("picture").find("position").text();

			var mcqmultiplechoiceFF = setting.find("mcqmultiplechoice").attr('fontfamily');
			var mcqmultiplechoiceFC = setting.find("mcqmultiplechoice").attr('color');

			var mcqquestiontextFF = setting.find("mcqquestiontext").attr('fontfamily');
			var mcqquestiontextFC = setting.find("mcqquestiontext").attr('color');

			var mcqoptiontextFF = setting.find("mcqoptiontext").attr('fontfamily');
			var mcqoptiontextFC = setting.find("mcqoptiontext").attr('color');


			var newString = imgPosition.replace(/[^A-Z0-9]/ig, "").toUpperCase();
			console.log('imgPosition=', newString);
			if (newString == "LEFTSIDE") {
				console.log('coming here');
				changeLeftAndRightContainerPos();
			}


			content.removeClass('pageOne setContent');
			leftContainer.empty().removeClass('fullContent fullTextArea');
			rightContainer.show();
			rightContainer.find('.pic').attr("src", staticImagePath + imgName);
			$('.pic').attr("alt", imgAlt);

			$('.pic_desc').html(picturedescriptionText).css({
				"font-family": picturedescriptionFontFamily,
				"color": picturedescriptionColor
			});


			leftContainer.append("<div class='leftSubContainer'></div>");
			leftSubContainer = leftContainer.find(".leftSubContainer");
			leftSubContainer.append("<div class='questionCnt'><div class='question'></div><div class='optionCnt'></div></div>");
			var question = xml.find("content").eq(counter).find("contentdata").find("question").html();
			var arrOption = xml.find("content").eq(counter).find("contentdata").find("option");

			leftSubContainer.find('.question').html(question).css({
				"font-family": mcqquestiontextFF,
				"color": mcqquestiontextFC
			});

			leftSubContainer.find('.question').find('.mcqMultipleChoice').css({
				"font-family": mcqmultiplechoiceFF,
				"color": mcqmultiplechoiceFC
			});

			arrOption.each(function (ind, el) {
				//leftSubContainer.find('.optionCnt').append('<div class = "optCnt optCnt_' + ind + '"><input type="button" ans="' + $(el).attr('ans') + '" value="' + $(el).text() + '" class="radio" id="radio_' + ind + '"/><div class="optTxt">' + $(el).text() + '</div></div>');

				leftSubContainer.find('.optionCnt').append('<div class = "optCnt optCnt_' + ind + '"><button ans="' + $(el).attr('ans') + '" title="' + $(el).text() + '" class="radio" id="radio_' + ind + '"><svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45"><g transform="translate(.5 .5)"><circle cx="22" cy="22" r="22" fill="#fff" stroke="#001a36" stroke-miterlimit="10"/></g></svg></button><div class="optTxt">' + $(el).text() + '</div></div>');
			});

			leftSubContainer.find('.optionCnt').css({
				"font-family": mcqoptiontextFF,
				"color": mcqoptiontextFC
			});

			$(".testyourskill_btn").hide();

			$('.leftContainer ').find("g").find("#selectedColor").attr('fill', color1);


		} else if (activityType == 'summary') {
			content.removeClass('pageOne setContent');
			leftContainer.empty();
			leftContainer.append("<div class='leftContentTitle'></div><div class='leftSubContainer'></div>");
			var leftContentTitle = $('.leftContentTitle');
			leftSubContainer = $('.leftSubContainer');


			var arrXmlLeftContent = xml.find("content").eq(counter).find("contentdata").find("para");
			leftContentTitle.html(xmlLeftContentTitle).css({
				"font-family": contentTitleFontFamily,
				"color": contentTitleColor,
				"backgroundColor": contentTitleBackgroundcolor
			});
			leftSubContainer.css({
				"font-family": contentDataFontFamily,
				"color": contentDataColor,
				"backgroundColor": contentDataBackgroundcolor
			});
			leftSubContainer.removeClass('tableCell').parent(".leftContainer").removeClass('fullHeight');
			leftContainer.removeClass('fullContent fullTextArea');
			leftContainer.children('h3').show();
			
			leftSubContainer.empty();
			// console.log(arrXmlLeftContent.html());
			arrXmlLeftContent.each(function (ind, el) {

				// console.log($(el).html());

				leftSubContainer.append("<div class = para_" + ind + ">" + $(el).html() + "</>");
			});

			rightContainer.show();
			
			$('.pic').attr("src", staticImagePath + imgName);
			$('.pic').attr("alt", imgAlt);
			$('.pic_desc').html(picturedescriptionText).css({
				"font-family": picturedescriptionFontFamily,
				"color": picturedescriptionColor
			});
			$(".testyourskill_btn").hide();

		}



		function changeLeftAndRightContainerPos() {
			console.log('coming here');
			rightContainer.addClass('positionLeft');
			leftContainer.addClass('positionRight');
		}

		function changeLeBackftAndRightContainerPos() {
			console.log('coming here');
			rightContainer.removeClass('positionLeft');
			leftContainer.removeClass('positionRight');
		}

	}


	$(document).keyup(function (e) {
		var text = $('textarea').val();
		if (text != "") {
			$(".default").remove();
			console.log('coming here');
			$(".submit_btn_textarea").addClass('enable_submit_textarea').removeAttr('disabled');
			// $(".submit_btn_textarea").find("rect").attr("fill", color1);
			$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.submit_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: '+color1+'; color:'+color1+'; background-color:transparent;} .continue_btn_mcq{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_textarea:hover,.submit_btn_mcq:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_textarea:active,.submit_btn_mcq:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');

		} else {
			$(".submit_btn_textarea").removeClass('enable_submit_textarea').prop('disabled', true);
			// $(".submit_btn_textarea").find("rect").attr("fill", "#d3d2d2");
			$(".default").remove();
			$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.submit_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .continue_btn_mcq{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_mcq:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_mcq:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');

		}
	});



	$('.prev_btn').off().on('click', prevListener);
	$('.prev_btn').off('mouseover').on('mouseover', prevhoverListener);
	$('.prev_btn').off('mouseleave').on('mouseleave', prevoutListener);

	$('.nav-container .submit_btn_textarea').off().on('click', submitTextarea);


	function submitTextarea() {
		$('textarea').val('');
		if ($(this).hasClass('enable_submit_textarea')) {
			$('.prev_btn, .setting').prop('disabled', true);
			$('.text-area').prop('disabled', true);
			$('.nav-container .submit_btn_textarea').prop('disabled', true);

			$('.popupLayer').show();
			$('.popupTextAreaContainer').show();
			$('.continue_btn_textarea').focus().off().on('click', nextListener);
			// $('.next_btn').off('mouseover').on('mouseover', nexthoverListener);
			// $('.next_btn').off('mouseleave').on('mouseleave', nexthoutListener);
			if(detectMob())
			{
				console.log("coming=",detectMob);
				var curPos=$(".popupTextAreaContainer").offset().top-100;
				console.log("curPos=",curPos);
				$("html, body").animate({ scrollTop: curPos });
			}
		}
	}

	function prevhoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', color1);
		$(this).find("circle").attr('fill', color3);
	}

	function prevoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', white);
		$(this).find("circle").attr('fill', color1);
	}

	function prevListener() {

		if (counter == pageLength - 1) {
			$('.reset_btn').hide();
			$('.next_btn').show();
		}

		if (counter > 0) {
			counter--
			objAccessibility.updateCounter(counter);
			displayDynContent(counter);
			if (counter == 0) {
				$('.prev_btn').hide();
				$(".next_btn").focus();

			}
		} else {
			counter = pageLength - 1;
			objAccessibility.updateCounter(counter);
			displayDynContent(counter);
			$(".next_btn").hide();
			$('.reset_btn').show();
			$('.prev_btn').show();
			content.removeClass('pageOne');
			$('.navSpace').addClass('updateNavSpace');
			
		}

		updateNavOnNextAndPrev();

		$('.setting').removeAttr('disabled');
		$('.counter').text(counter + 1);
		$('.total').text(pageLength);
	}

	function updateNavOnNextAndPrev() {
		console.log('activityType=', activityType);

		if (activityType == 'introduction') {
			
			$('.testyourskill_btn').hide();
			$('.submit_btn_mcq').hide();
			$('.next_btn').removeAttr('disabled').removeClass('disable_next').off().on('click', nextListener).show();
			$('.next_btn').off('mouseover').on('mouseover', nexthoverListener);
			$('.next_btn').off('mouseleave').on('mouseleave', nexthoutListener);

			$('.next_btn').find("path").attr("fill", white);
			$('.next_btn').find("path").attr("stroke", white);

			$('.next_btn').find("circle").attr("fill", color1);
			//content.addClass('pageOne');
			//$('.navSpace').addClass('updateNavSpace');
			$('.leftContainer').removeClass('adjustPadding');
		} else if (activityType == 'continued') {
			$('.testyourskill_btn').hide();
			$('.submit_btn_mcq').hide();
			$('.next_btn').removeAttr('disabled').removeClass('disable_next').off().on('click', nextListener).show();
			$('.next_btn').off('mouseover').on('mouseover', nexthoverListener);
			$('.next_btn').off('mouseleave').on('mouseleave', nexthoutListener);
			$('.next_btn').find("circle").attr("fill", color1);
			$('.submit_btn_textarea').hide();
			console.log('rrrrrrrrrr commmmmmmmmmmmmmmmmmmmmmmmm');
			$('.navSpace').removeClass('updateNavSpace');
			$('.leftContainer').removeClass('adjustPadding');
		} else if (activityType == 'testyourskills') {
			console.log('commmmmmmmmmmmmmmmmmmmmmmmm');
			
			$(this).off("click");
			$('.next_btn').off();
			$(".next_btn").addClass('disable_next').prop('disabled', true).hide();
			$('.testyourskill_btn').show();
			$('.submit_btn_mcq').hide();
			$('.testyourskill_btn').focus().off().on('click', nextListener);
			$('.submit_btn_textarea').hide();

			$('.navSpace').removeClass('updateNavSpace');
			$('.leftContainer').removeClass('adjustPadding');
		} else if (activityType == 'textentry') {
			// $('body').find(".default").remove();
			$(".next_btn").show();
			// $(".next_btn").find('path').attr('fill','#e9e9e9');
			// $(".next_btn").find('g').attr('stroke','#e9e9e9');
			$(".next_btn").addClass('disable_next').prop('disabled', true).show();
			$('.next_btn').find("circle").attr("fill", disableBg);
			$('.next_btn').find("circle").attr("stroke", disableBg);
			$('.next_btn').find("path").attr("fill", white);
			$('.next_btn').find("path").attr("stroke", white);
			
			$('.submit_btn_mcq').hide();
			$('.testyourskill_btn').hide();
			$('.submit_btn_textarea').show().removeClass('enable_submit_textarea');
			// $(".submit_btn_textarea").find("rect").attr("fill", "#d3d2d2");
			$(".default").remove();
			$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.continue_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .submit_btn_mcq{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_mcq:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_mcq:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');

			$('.navSpace').removeClass('updateNavSpace');
			$('.leftContainer').addClass('adjustPadding');
			$('.text-area').focus();
			$(".textAriaTitle").css({
				'backgroundColor': color3
			});
			$('.prev_btn').removeAttr('disabled');
		} else if (activityType == 'mcq') {
			//  alert("cominfg");
			$(".next_btn").addClass('disable_next').prop('disabled', true).show();
			$('.next_btn').find("circle").attr("fill", disableBg);
			$('.next_btn').find("circle").attr("stroke", disableBg);
			$('.next_btn').find("path").attr("fill", white);
			$('.next_btn').find("path").attr("stroke", white);
			$('.testyourskill_btn').hide();
			$('.submit_btn_textarea').hide();
			$('.leftContainer ').find('.radio').off().on('click', selectOptionListener);
			$(".default").remove();
			$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.continue_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .submit_btn_mcq{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_textarea:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_textarea:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');


			$('.submit_btn_mcq').show().removeClass('enable_submit_mcq').prop('disabled', true);
			$('.submit_btn_mcq').find("rect").attr("fill", "#d3d2d2");
			$('.navSpace').removeClass('updateNavSpace');
			$('.leftContainer').removeClass('adjustPadding');
			$('.prev_btn,.submit_btn_textarea,.setting').removeAttr('disabled');
			$('.leftContainer').find('.radio').removeAttr('disabled');



		} else if (activityType == 'summary') {
			$('.testyourskill_btn').hide();
			$('.submit_btn_mcq').hide();
			$('.submit_btn_textarea').hide();
			$('.navSpace').removeClass('updateNavSpace');
			$('.leftContainer').removeClass('adjustPadding');
			$('.prev_btn,.submit_btn_mcq,.setting').removeAttr('disabled');
		}
	}

	// $('.next_btn').off().on('click', nextListener);
	
	$('.next_btn').off("click").on('click', nextListener);
	$('.next_btn').off('mouseover').on('mouseover', nexthoverListener);
	$('.next_btn').off('mouseleave').on('mouseleave', nexthoutListener);

	function nexthoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', color1);
		$(this).find("circle").attr('fill', color3);
		$(this).find('g').attr('stroke',color1);
	}

	function nexthoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', white);
		$(this).find("circle").attr('fill', color1);
		$(this).find('g').attr('stroke',white);
	}





	$('.testyourskill_btn').off().on('click', nextListener);
	

	function nextListener(e) {
		//alert("ok");
		$('.prev_btn').show();
		// $('.testyourskill_btn').show();

		$('.setting').removeAttr('disabled');

		if ($(e.currentTarget).hasClass('next_btn') || $(e.currentTarget).hasClass('testyourskill_btn') || $(e.currentTarget).hasClass('continue_btn_textarea') || $(e.currentTarget).hasClass('continue_btn_mcq')) {
			if (counter < pageLength - 1) {

				counter++
				objAccessibility.updateCounter(counter);
				console.log("counter===" + counter)
				displayDynContent(counter);



				$('#title').focus();
				if (counter == pageLength - 1) {
					$(".next_btn").hide();
					$('.reset_btn').show().focus();
					if(anscounter>=2)
					{
						// scrm.set('cmi.core.lesson_status',"completed");
						// scrm.save();
					}

					// scrm.set('cmi.core.lesson_status',"incompleted");
					// 	scrm.save();
				}
				//console.log('objAccessibility=',objAccessibility);
				//objAccessibility.updateCounter(counter);
				$('.navSpace').removeClass('updateNavSpace');
			}

		}
		if ($(e.currentTarget).hasClass('testyourskill_btn')) {
			$(this).hide();
			$(".submit_btn_textarea").show().prop('disabled', true);

		}

		if ($(e.currentTarget).hasClass('continue_btn_textarea')) {
			$('.popupLayer').hide();
			$('.popupTextAreaContainer').hide();
			$('.submit_btn_textarea').hide();
			$('.testyourskill_btn').hide();
			$('.submit_btn_mcq').show();
			$('.leftContainer ').find('.radio').off().on('click', selectOptionListener);
		}

		if ($(e.currentTarget).hasClass('continue_btn_mcq')) {
			$('.popupLayer').hide();
			$('.popupMCQContainer').hide();
			$('.submit_btn_mcq').hide();
			$('.testyourskill_btn').hide();
		}

		updateNavOnNextAndPrev();

		// $('.counter').text(counter+1);
		// $('.total').text(pageLength);
	}



	function selectOptionListener() {
		//alert('ok');
		$('.leftContainer ').find('.radio').removeClass('radioSelected');

		$('.leftContainer ').find("g").find("#selectedColor").remove();

		$(this).addClass('radioSelected');

		

		function parseSVG(s) {
			var div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
			div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
			var frag = document.createDocumentFragment();
			while (div.firstChild.firstChild)
				frag.appendChild(div.firstChild.firstChild);
			return frag;
		}

		// document.getElementById('s').appendChild(parseSVG(
		// 	'<circle cx="16" cy="16" r="16" fill="#001a36" transform="translate(6 6)"/>'
		// ));

		// $(this).find("g").append('<circle cx="16" cy="16" r="16" fill="#001a36" transform="translate(6 6)"/>');

		$(this).find("g").append(parseSVG(
			'<circle id="selectedColor" cx="16" cy="16" r="16" fill="#001a36" transform="translate(6 6)"/>'
		));


		$(this).parents('.optionCnt').attr('ans', $(this).attr('ans'));
		$('.submit_btn_mcq').addClass('enable_submit_mcq').removeAttr('disabled').off().on('click', submitMCQListener);
		
		$(".default").remove();

		$('body').append('<style class="default">.testyourskill_btn,.continue_btn_textarea,.continue_btn_mcq{ border-color: ' + color1 + '; color:'+color1+'; background-color:transparent;} button:focus{outline-color: ' + focusColor + ';} .submit_btn_textarea{ border-color: #d3d2d2; color:'+color1+'; background-color:#d3d2d2;} .submit_btn_mcq{ border-color: '+color1+'; color:'+color1+'; background-color:transparent;} .testyourskill_btn:hover,.continue_btn_textarea:hover,.submit_btn_textarea:hover,.submit_btn_mcq:hover,.continue_btn_mcq:hover{ border-color: ' + color1 + '; color:'+color1+'; background-color:'+color3+';} .testyourskill_btn .arrow-right{border-left-color: ' + color1 + ';} .testyourskill_btn:hover .arrow-right{border-left-color:'+color1+'} .testyourskill_btn:active .arrow-right{border-left-color:'+white+'}  .testyourskill_btn:active,.continue_btn_textarea:active,.submit_btn_textarea:active,.submit_btn_mcq:active,.continue_btn_mcq:active{ border-color: ' + color1 + '; color:'+color3+'; background-color:'+color1+';} button:focus{outline-color: ' + focusColor + ';}</style>');


		// $('.submit_btn_mcq').find("rect").attr("fill", color1);
		$('.leftContainer ').find("g").find("#selectedColor").attr('fill', color1);
	}

	function submitMCQListener() {



		var iconImgRight = xml.find("content").eq(counter).find("rightfeedback").find("icon").attr('picname');
		var iconTextRight = xml.find("content").eq(counter).find("rightfeedback").find("icontext").text();
		var rightFeebackContent = xml.find("content").eq(counter).find("rightfeedback").find("rightfeebackcontent").html();

		var iconImgWrong = xml.find("content").eq(counter).find("wrongfeedback").find("icon").attr('picname');
		var iconTextWrong = xml.find("content").eq(counter).find("wrongfeedback").find("icontext").text();
		var wrongFeebackContent = xml.find("content").eq(counter).find("wrongfeedback").find("wrongfeebackcontent").html();


		var mcqfeedbackwrongFF = setting.find("mcqfeedbackwrong").attr('fontfamily');
		var mcqfeedbackwrongFC = setting.find("mcqfeedbackwrong").attr('color');

		var mcqfeedbackrightFF = setting.find("mcqfeedbackright").attr('fontfamily');
		var mcqfeedbackrightFC = setting.find("mcqfeedbackright").attr('color');

		var mcqfeedbacktextFF = setting.find("mcqfeedbacktext").attr('fontfamily');
		var mcqfeedbacktextFC = setting.find("mcqfeedbacktext").attr('color');


		if (leftSubContainer.find('.optionCnt').attr('ans') == 'correct') {
			$('.mcqFeedbackTitle .icon').attr('src', staticImagePath + iconImgRight);
			$('.mcqFeedbackTitle .text').html(iconTextRight).css({
				"font-family": mcqfeedbackrightFF,
				"color": mcqfeedbackrightFC
			});
			$('.mcqFeedbackContect').html(rightFeebackContent).css({
				"font-family": mcqfeedbacktextFF,
				"color": mcqfeedbacktextFC
			});
			anscounter++;
		} else {
			$('.mcqFeedbackTitle .icon').attr('src', staticImagePath + iconImgWrong);
			$('.mcqFeedbackTitle .text').html(iconTextWrong).css({
				"font-family": mcqfeedbackwrongFF,
				"color": mcqfeedbackwrongFC
			});
			$('.mcqFeedbackContect').html(wrongFeebackContent).css({
				"font-family": mcqfeedbacktextFF,
				"color": mcqfeedbacktextFC
			});
			anscounter--;
		}

		$('.popupLayer').show();
		$('.popupMCQContainer').show();
		$('.continue_btn_mcq').focus().off().on('click', nextListener);
		$('.next_btn').off('mouseover').on('mouseover', nexthoverListener);
		$('.next_btn').off('mouseleave').on('mouseleave', nexthoutListener);

		$('.prev_btn,.submit_btn_mcq,.setting').prop('disabled', true);
		$('.leftContainer').find('.radio').prop('disabled', true);
		
		if(detectMob())
		{
			var curPos=$(".popupMCQContainer").offset().top-100;
			console.log("curPos=",curPos);
			$("html, body").animate({ scrollTop: curPos });
		}
		
	}

	// $('.setting').off().on('click', settingListener);

	// function settingListener() {
	// 	$('.popup').toggleClass('showhide');
	// }





	$('.reset_btn').off().on('click', resetListener);

	$('.reset_btn').off('mouseover').on('mouseover', resethoverListener);
	$('.reset_btn').off('mouseleave').on('mouseleave', resethoutListener);
	function resethoverListener() {
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', color1);
		$(this).find("circle").attr('fill', color3);
	}

	function resethoutListener() {
		console.log("color1",color1);
		//$('.settinToolsContainer').addClass('showhide');
		$(this).find("path").attr('fill', white);
		$(this).find("circle").attr('fill', color1);
	}

	function resetListener() {
		counter = 0;
		objAccessibility.updateCounter(counter);
		displayDynContent(counter);
		$('.reset_btn').hide();
		$('.next_btn').show().focus();
		$('.prev_btn').hide();
		$('.counter').text(counter + 1);
		$('.total').text(pageLength);
		//content.addClass('pageOne');
		$(".next_btn").removeAttr('disabled').focus().removeClass('disable_next').off().on('click', nextListener);
		$('.next_btn').off('mouseover').on('mouseover', nexthoverListener);
		$('.next_btn').off('mouseleave').on('mouseleave', nexthoutListener);

		$('.next_btn').find("circle").attr("fill", color1);
		$('.testyourskill_btn').off().on('click', nextListener);
		$('.navSpace').addClass('updateNavSpace');

		$('.submit_btn_textarea').removeClass('enable_submit_textarea');
		$('.submit_btn_textarea').find("rect").attr("fill", "#d3d2d2");
		$('.submit_btn_mcq').removeClass('enable_submit_mcq');
		$('.submit_btn_mcq').find("rect").attr("fill", "#d3d2d2");
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