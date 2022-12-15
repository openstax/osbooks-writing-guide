$(document).ready(function () {

	var setting;
	var rightFeedback, wrongFeedback;
	var arrAllDraggableitem = null;
	var staticImagePath = "images/";
	var prevBtn = null;
	var curDiv = null;
	var totalDropedItem = 0;
	let enterCounter = {};
	const isMobile = detectMob();
	var media = window.matchMedia("(max-width: 529px)");
	var REVIEW_TXT = "REVIEW YOUR <br>SORTED ANSWERS";
	var COLLAPSE_TXT = "COLLAPSE CATEGORIES"; 
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

	$(".bottom-btn").css({"opacity": 0.6, "pointer-events":"none"});
	console.log("check: ", REVIEW_TXT,  "---", COLLAPSE_TXT);
	/* if (media.matches) {
		$(".bottom-btn").html(REVIEW_TXT);
	}else{
		$(".bottom-btn").html(COLLAPSE_TXT);
	} */

	$(".bottom-btn").on("click", function () {
		console.log(REVIEW_TXT, "-=-=-=", COLLAPSE_TXT);
		if ($(".categoryDroppableCnt").hasClass("hidden2")) {
			$(".categoryDroppableCnt").removeClass("hidden2");
			$(this).html('COLLAPSE CATEGORIES &#62;');
			
		} else {
			$(".categoryDroppableCnt").addClass("hidden2");
			$(this).html("REVIEW YOUR <br>SORTED ANSWERS &#62;");
		}

		if (media.matches) {
			console.log(" 1111111111111111111 ", COLLAPSE_TXT);
			if ($(".categoryDroppableCnt").hasClass("hidden")) {
				$(".categoryDroppableCnt").removeClass("hidden");
				$(".categoryDroppableCnt").removeClass("hidden2");
				$(this).html("COLLAPSE <br>CATEGORIES");
			} else {
				$(".categoryDroppableCnt").addClass("hidden");
				$(".categoryDroppableCnt").removeClass("hidden2");
				$(this).html(REVIEW_TXT);
			}
		}else{
			console.log("no............");
		}
	})

	$(document).keyup(function (event) {
		//get the id of element on which enter key pressed
		const elemId = $(prevBtn).attr('id');

		event.preventDefault();
		var keycode = (event.keyCode ? event.keyCode : event.which);

		//escape key for deselect 
		if (keycode == 27) {
			curDiv = null;
			prevBtn = null;
			console.log(document.getElementsByClassName("selected").length);
			$(".selected button").blur();
			
			$(".selected").removeClass("selected");
		}
	});

	$("#tempDiv").load("data/data.xml", function (response, status, xhr) {
		if (status != "error") {

			$("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
				if (status != "error") {
					/*Hiding the loading image*/
					$("#loadingImg").hide();
					/*End*/
					displayStaticContent();
				}
			});
		}
	});

	/*Showing the loading image*/
	$("#loadingImg").show();

	function displayStaticContent() {
		function isMacintosh() {
			return navigator.platform.indexOf('Mac') > -1
		}
		var isMac = isMacintosh();
		if (isMac) {
			$('.content').addClass('contentMac');
		}

		var xmlDoc = $.parseXML($("#tempDiv").html());
		var xml = $(xmlDoc);
		//console.log(xml.find("content"));
		pageLength = xml.find("content").length;
		//objAccessibility=new Accessibility(pageLength); // call Accessibility funcion from accessibilityJs
		var settingDoc = $.parseXML($("#tempSetting").html());
		setting = $(settingDoc);

		// title style from from setting.xml
		var fontfamily = setting.find("title").attr('fontfamily');
		var color = setting.find("title").attr('color');
		var backgroundcolor = setting.find("title").attr('backgroundcolor');

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
		var instNormFontFamily = setting.find("instructionnorm").attr('fontfamily');
		var instNormColor = setting.find("instructionnorm").attr('color');
		var instNormBackgroundcolor = setting.find("instructionnorm").attr('backgroundcolor');
		rightFeedback = xml.find("feedback").find("rightans").html();
		wrongFeedback = xml.find("feedback").find("wrongans").html();

		var title = xml.find("title").text();
		var instructionNorm = xml.find("instruction").find("instructionnorm").html();
		//console.log("dgdfgdfgfd=", title, instructionNorm);

		var arrAllCategory = xml.find("category").find("categorytitle");
		var arrAllDraggableitem1 = xml.find("draggableitem").find("item");
		arrAllDraggableitem = shuffleArray(arrAllDraggableitem1);

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
			$(".categoryContainer").append('<div class="category category-' + arrAllCategory.length + '"><div class="categoryTitleCnt categoryTitleCnt_' + index + '"><button aria-label="Category: ' + $(el).html() + '" cat=' + $(el).attr("cat") + ' class="categoryTitle categoryTitle_' + index + '">' + $(el).html() + '</button></div><div class="hidden categoryDroppableCnt categoryDroppableCnt_' + index + '"></div></div><hr aria-hidden="true" class="catHr"/>');
		});

		$('.categoryTitle').css({
			"font-family": categorytitleFontfamily,
			"color": categorytitleColor,
			"backgroundColor": categorytitleBackgroundcolor
		}).off().on("click", selectCategory);

		/* generating draggable items view */
		arrAllDraggableitem.each(function (index, el) {
			var plain = $(el).html().replace("<i>", "").replace("</i>", "");
			$(".card-wrap").append('<div class="draggableitemCnt draggableitemCnt_' + index + '" id="draggableitemCnt_' + index + '"><button aria-label="Item to categorize: ' + plain + '"  cat=' + $(el).attr("cat") + ' id="draggableitem_' + index + '" class="draggableitem draggableitem_' + index + '">' + $(el).html() + '</button></div>');

			//enterCounter[`draggableitemCnt_${index}`] = 1;
		});
		
		$('.draggableitem').css({
			"font-family": draggableitemFontfamily,
			"color": draggableitemColor,
			"backgroundColor": draggableitemBackgroundcolor
		});

		$(".draggableitemCnt").click(function (e) {
			if($(prevBtn)[0] == $(this)[0] && $(prevBtn)[0]==e.currentTarget){
				totalDropedItem--;
				$(".card-wrap").append(prevBtn);
				prevBtn.find("button").removeClass("correct").removeClass("incorrect").removeClass("mouse-none");
				prevBtn.removeClass("selected");

				if (totalDropedItem != arrAllDraggableitem.length) {
					$('.submit_btn').prop("disabled", true);
					$(".nav-container").addClass("mob-hid");
				}

				if(totalDropedItem == 0){
					$(".bottom-btn").css({"opacity": 0.6, "pointer-events":"none"});
				}else{
					$(".bottom-btn").css({"opacity": 1, "pointer-events":"auto"});
				}

				curDiv = null;
				prevBtn = null;
				console.log("double click..........");
				return;
			}else{
				console.log("back....... 222222222222");
				if(!$(this).closest('.dragableItemContainer').length){
					prevBtn = $(this);
				}
			}

			curDiv = this;
			$(".draggableitemCnt").removeClass("selected");
			$(curDiv).addClass("selected");

			/* if($(curDiv).parent().hasClass("categoryDroppableCnt")){
				const elemId = $(curDiv).attr('id');
                enterCounter[elemId] += 1;
			} */
			checkLast();
		})

		$(".dragableItemContainer").on("click", function (e) {

			var same = true;
			try {
				same = prevBtn == $(this);
			} catch (err) {
				console.log(err);
				same = true;
			}
			console.log(same, prevBtn, " 44444444444444444444");
			if (!same) {
				if (prevBtn) {
					if ($(prevBtn).hasClass("dragableItemContainer")) {
						//console.log("SAME......");
					} else {
						totalDropedItem--;
						if($(this).hasClass("submit_btn")){
                            return;
                        }
						
						$(this).find(".card-wrap").append(prevBtn);
						prevBtn.find("button").focus();
						$(".draggableitemCnt").removeClass("selected");
						$(prevBtn).find("button").removeClass("correct").removeClass("incorrect").removeClass("mouse-none");

						if (totalDropedItem != arrAllDraggableitem.length) {
							$('.submit_btn').prop("disabled", true);
							$(".nav-container").addClass("mob-hid");
						}
						if(totalDropedItem == 0){
							$(".bottom-btn").css({"opacity": 0.6, "pointer-events":"none"});
						}else{
							$(".bottom-btn").css({"opacity": 1, "pointer-events":"auto"});
						}
						curDiv = null;
						prevBtn = null;					
						return;
					}
				}
			}
			console.log("Normal click....");
			prevBtn = $(this);
		})

		arrSettingStyleItem.each(function (ind, el) {
			if (ind == 0) {
				$(".settinToolsContainer .toolsCnt").append('<div class="toolContainer_' + ind + '"><button aria-label="Color Scheme" bg="' + $(el).attr("background") + '" fg="' + $(el).attr("foreground") + '" class="tool tool_' + ind + '">button</button><p l lang="en" class="toolTxt toolTxt_' + ind + '">' + $(el).attr("txt") + '</p></div>');
			} else {
				$(".settinToolsContainer .toolsCnt").append('<button aria-pressed= "false" aria-label="' + $(el).attr("txt") + '" role="settings tool" class="toolContainer toolContainer_' + ind + '" colors="' + $(el).attr("colors") + '"><img alt="' + $(el).attr("txt") + '" src="' + staticImagePath + $(el).attr("picname") + '" class="tool tool_' + ind + '"/><span l lang="en" class="toolTxt toolTxt_' + ind + '">' + $(el).attr("txt") + '</span></button>');
			}

			if (ind == 1) {
				var colors = $(el).attr("colors");
				color1 = colors.split(",")[0];
				color2 = colors.split(",")[1];
				color3 = colors.split(",")[2];
				$('.settinToolsContainer').css({ backgroundColor: color3 });
			}

		});


		$('.settinToolsContainer .toolContainer_0').find('.toolTxt').css({ "font-family": $(arrSettingStyleItem[0]).attr('fontfamily'), "color": $(arrSettingStyleItem[0]).attr('color') });

		$('.settinToolsContainer .toolContainer').each(function (index, el) {
			var arr = $(arrSettingStyleItem[index]).attr('fontfamily');
			$(el).find('.toolTxt').css({ "font-family": $(arrSettingStyleItem[index + 1]).attr('fontfamily'), "color": "#000000" });//$(arrSettingStyleItem[index + 1]).attr('tooltextcolor')
		});

		//displayDynContent(counter);
		$('.settinToolsContainer .toolContainer').eq(0).attr("aria-pressed", "true");
		$('.settinToolsContainer .toolContainer').off().on("click", changeBgFgOfTemplate);

		function shuffleArray(a) {
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
			}
			return a;
		}
		function changeBgFgOfTemplate() {
			//alert("ok");
			$('.settinToolsContainer .toolContainer').eq(0).attr("aria-pressed", "false");
			$(this).attr("aria-pressed", "true");
			var color1 = $(this).attr('colors').split(",")[0];
			var color2 = $(this).attr('colors').split(",")[1];
			var color3 = $(this).attr('colors').split(",")[2];

			$('#title').css({
				color: color2
			});
			
			$('.leftContentTitle').css({
				color: color2
			});
			$('.leftSubContainer').css({
				color: color2
			});

			$(".draggableitem").css("background", color1);
			$(".draggableitem").css("color", color2);

			$(".categoryTitle").css("background", color3);
			$(".categoryTitle").css("color", color1);

			$('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);
			$('.submit_btn,.tryagain_btn,.reset_btn').find("rect").attr('fill', color1);

			//$('.settinToolsContainer').css({ backgroundColor: color3 });
		}
	}

	function selectCategory() {
		if (curDiv) {
			var index = $(curDiv).attr("id").split("_")[1];
			var categoryDroppableCnt = $(this).parents(".category").find(".categoryDroppableCnt");

			/* if ($(categoryDroppableCnt).children().length == 6) {
				$(".draggableitemCnt").removeClass("selected");
				curDiv = null;
				prevBtn = null;
				return;
			} */

			$(curDiv).appendTo(categoryDroppableCnt);
			//enterCounter["draggableitemCnt_" + index] = 1;

			//isMobile && $(".container .draggableitem").last().removeAttr('disabled');
			$(".draggableitemCnt").removeClass("selected");
			curDiv = null;
			prevBtn = null;
			
			totalDropedItem = 0;
			$('.category').each(function (index, el) {
				var dropedItemLenth = $(el).find(".categoryDroppableCnt").children().length;

				totalDropedItem = totalDropedItem + dropedItemLenth

				var catTitle = $(el).find(".categoryTitle").attr("cat");
				$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
					$(ell).find(".draggableitem").removeClass("correct").removeClass("incorrect");
					if ($(ell).find(".draggableitem").attr("cat") == catTitle) {
						$(ell).find(".draggableitem").addClass("correct");
					} else {
						$(ell).find(".draggableitem").addClass("incorrect");
					}
				});

			})
			//console.log('totalDropedItem=', totalDropedItem);
			if (totalDropedItem == arrAllDraggableitem.length) {
				$('.submit_btn').prop("disabled", false);
				$(".nav-container").removeClass("mob-hid");
				$('.submit_btn').removeClass("submit-hide");
				$('.submit_btn').off().on("click", submitListener);
			}
			if(totalDropedItem == 0){
				$(".bottom-btn").css({"opacity": 0.6, "pointer-events":"none"});
			}else{
				$(".bottom-btn").css({"opacity": 1, "pointer-events":"auto"});
			}
			checkLast();
			
			//if($('.category:last-of-type .categoryDroppableCnt').children)
		}
	}

	function checkLast(){
		console.log($('.category:last-of-type .categoryDroppableCnt').children().length);
		if($('.category:last-of-type .categoryDroppableCnt').children().length){
			$('.category:last-of-type').removeClass("mar-bt");
		}else{
			$('.category:last-of-type').addClass("mar-bt");
		}
	}

	function submitListener() {
		var correctCounter = 0;
		$(".categoryTitle").addClass("inactive");
		$(".draggableitem").addClass("inactive");
		$(".card-wrap").addClass("hidden-feed");
		$('.submit_btn').addClass("submit-hide");
		$("header").addClass("t-border");
		var feedback = rightFeedback;
		$('.category').each(function (index, el) {
			var catTitle = $(el).find(".categoryTitle").attr("cat");
			var rightCat = "right-cat";
			

			$(el).find(".categoryDroppableCnt").children().each(function (ind, ell) {
				if ($(ell).find(".draggableitem").hasClass("correct")) {
					$(ell).find(".draggableitem").css("border", "2px solid #63A524");
					correctCounter++;
				} else {
					$(ell).find(".draggableitem").css("border", "2px solid #c22032");
					rightCat = "wrong-cat";
					feedback = wrongFeedback;
				}

			});
			if(!$(el).find(".categoryDroppableCnt").children().length){
				rightCat = "wrong-cat";				
			}

			console.log("FINAL CAT: ", rightCat);
			$(".categoryTitleCnt_" + index).addClass(rightCat);
		});

		//console.log('correctCounter=',correctCounter);
		$("header").addClass("pad-0");
		$(".feedback").html(feedback).show();
		$(this).addClass("invisible");
		$('.categoryContainer').addClass("submited");
		
		if (correctCounter == arrAllDraggableitem.length) {
			$('.reset_btn').removeClass("invisible").focus().off().on("click", resetCategory).prop("disabled", false);
		} else {
			$('.tryagain_btn').removeClass("invisible").focus().off().on("click", resetCategory).prop("disabled", false);
		}
	}

	function resetCategory() {
		$("header").removeClass("t-border");
		$(".categoryTitle").removeClass("inactive");
		$(".draggableitem").removeClass("inactive");
		$(".right-cat").removeClass("right-cat");
		$(".wrong-cat").removeClass("wrong-cat");
		$(".draggableitem").removeClass("inactive");
		$(".feedback").hide();
		$("header").removeClass("pad-0");
		$(".mouse-none").removeClass("mouse-none");
		$(".card-wrap").removeClass("hidden-feed");
		
		$(".card-wrap").append($('.draggableitemCnt'));
		$('.categoryContainer').removeClass("submited");
		$(".draggableitem").css("border", "2px solid transparent").removeClass("correct incorrect");
		if (isMobile) {
			$(".container .draggableitem").last().removeAttr('disabled');
		}
		$('.reset_btn').addClass("invisible").prop("disabled", true);
		$('.tryagain_btn').addClass("invisible").prop("disabled", true);
		$('.submit_btn').removeClass("invisible").prop("disabled", true);
	}

	$('.setting').off().on('click', settingListener);

	function settingListener() {
		$(".settinToolsContainer").css("zIndex", "3");
		$(".settingContainer").css("zIndex", "2");
		$(".help-popup").css("zIndex", "1");
		$('.settinToolsContainer').addClass('showhide');
		$('.settinToolsContainer .close').off().on('click', closeSetting).focus();
	}

	function closeSetting() {
		$('.settinToolsContainer').removeClass('showhide');
		$(".settinToolsContainer").css("zIndex", "unset");
		$('.setting').focus();
	}
});

$(document).ready(function () {
	
	if (window.innerWidth < 529) {
		REVIEW_TXT = "REVIEW YOUR <br>SORTED ANSWERS";
		COLLAPSE_TXT = "COLLAPSE CATEGORIES";
		$(".bottom-btn").html(REVIEW_TXT);
	}else{
		REVIEW_TXT = "REVIEW YOUR <br>SORTED ANSWERS &#62;";
		COLLAPSE_TXT = "COLLAPSE CATEGORIES &#62;";
		$(".bottom-btn").html(COLLAPSE_TXT);
	}
	console.log("ready: ", REVIEW_TXT, "--", COLLAPSE_TXT);
	$(".showText").click(function () {
		$(".help-popup").show();
		$(".settinToolsContainer").css("zIndex", "2");
		$(".settingContainer").css("zIndex", "3");
		$(".help-popup").css("zIndex", "4");
		$(".popup-close").focus();
	});
	$(".popup-close").click(function () {
		$(".help-popup").hide();
		$(".showText").focus();
		//$(".settingContainer").css("zIndex","unset");
	});
});

