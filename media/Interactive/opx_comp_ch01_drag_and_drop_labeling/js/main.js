var matching = (function() {
    var data = {};
    //counter to store enter count for each id of clickable div
    let enterCounter = { };
    var curDiv = null;
    var curMatchbox = true;
    var prevBtn = null;
    var classnames = "";    
    const regex = /assets.*\.(png|jpg|jpeg|svg)/gm;
    var media = window.matchMedia("(max-width: 529px)");
    var isSafari = false;
    this.init = function(data) {
        fnBrowserDetect();
        this.loadXML();
        $(".notice-card").show();
        $(".notice-card").css("zIndex","3");
        $(".settings-container").css("zIndex","2");
        $(".close-bt").off().on("click", function(){
            $(".notice-card").hide();
            $(".note").focus();
        })

        $(".note").off().on("click",function() {
            $(".notice-card").show();
            $(".notice-card").css("zIndex","3");
            $(".settings-container").css("zIndex","2");
            $(".close-bt").focus();

            $(".close-bt").off().on("click", function(){
                $(".notice-card").hide();
                $(".note").focus();
            })
        })

        $(".setting-button").off().on("click",function() {
            $(".settings-container").show();
            $(".settings-container").css("zIndex","3");
            $(".notice-card").css("zIndex","2");
            $(".setting-button").blur();
            $(".close-btn").focus();

            $(".close-btn").off().on("click", function(){
                $(".settings-container").hide();
                $(".setting-button").focus();
            })
        })
        
        $(".tryagain_btn").off().on("click", function() {
            tryAgain();
        })

        $(".reset_btn").off().on("click", function(){
            tryAgain();
        })
        disbleFocus();
    }

    var tryAgain = function(){
        $(".clickable-items").removeClass("unsetonsubmit");
        $(".activity-header").removeClass("activity-header-submit");
        $(".activity-content").removeClass("activity-content-submit");
        $(".clickable-item.wrong-border-up").removeClass(".clickable-item.wrong-border-up-sub");
        $(".clickable-item").prop("disabled", false);
        $(".matching-item").prop("disabled", false);
        $(".clickableBlock").removeClass("no-grid");
        console.log("111", $(".clickableBlock"));
        $(".text-end").removeClass("mar-t-0");

        $(".matching-element").find(".clickable-item").removeClass("wrong-border-up");
        $(".matching-element").find(".matching-item").removeClass("wrong-border-bottom");
        $(".matching-element").find(".clickable-item").removeClass("right-border-up");
        $(".matching-element").find(".matching-item").removeClass("right-border-bottom");
       

        //$(".activity-header").removeClass("h-48p");
        //$(".activity-content").removeClass("p-48p");

        $(".clickedEvent").appendTo(".clickableBlock");
        $(".clickedEvent").removeAttr("data-placed");
        $(".clickedEvent").attr("class", classnames);

        $(".matchedEvent").removeClass("placed");
        $(".matchedEvent").removeAttr("data-placed");
        $(".matchedEvent").off().on("click", matchHandler);

        $(".tryagain_btn").hide();
        $(".reset_btn").hide();
        $(".submit_btn").show();
        $(".submit_btn").addClass("disabled");
        $(".submit_btn").addClass("mobile-submit");
        $(".submit_btn").prop("disabled", true);
        

        $(".matching-element").removeClass("submitted").removeClass("correct-ans");
        $(".matching-element").removeClass("submitted").removeClass("wrong-ans");

        $("#r-feedback").hide();
        $("#w-feedback").hide();

        $(".activity-header").removeClass("pad0");
    }

    this.loadXML = function(){
        $("#tempDiv").load("data/data.xml", function (response, status, xhr) {
            if (status != "error") {
                $("#tempSetting").load("data/setting.xml", function (response, status, xhr) {
                    if (status != "error") {
                        var settXml = $.parseXML($("#tempSetting").html());
                        var settingXML = $(settXml);

                        var xmlDoc = $.parseXML($("#tempDiv").html());
                        var xml = $(xmlDoc);
                        fetchData(xml);
                        createSettingBox(settingXML);
                    }
                });
            }
        });
       
    };

    function fnBrowserDetect(){
                 
        let userAgent = navigator.userAgent;
        let browserName;    
        if(userAgent.match(/chrome|chromium|crios/i)){
            browserName = "chrome";
          }else if(userAgent.match(/firefox|fxios/i)){
            browserName = "firefox";
          }  else if(userAgent.match(/safari/i)){
            browserName = "safari";
            isSafari = true;
          }else if(userAgent.match(/opr\//i)){
            browserName = "opera";
          } else if(userAgent.match(/edg/i)){
            browserName = "edge";
          }else{
            browserName="No browser detection";
          }
         
    }

    var fetchData = function(xml){
        $(".activity-title").html(xml.find("title").text());
        $(".notice-card p").html(xml.find("instruction").text());
        $("#reviewImg").attr("src", xml.find("reviewimage").text());

        var items = xml.find("items").find("item");
        var counter = 0;
        var imgMaxHeight=0;
        var iArr = [];
        var maxH = 0;
        //var matchItem = xml.find("items").find("matching").find("text");
        data["ques"] = [];
        items.each((index, el) => {
            var tempObj = {};
            tempObj["clickable"] = $(el).find("clickable text").html();
            tempObj["matching"] = $(el).find("matching text").html();
            
            $(el).find("matching alt").length && (tempObj["alt"] = $(el).find("matching alt").html());
            data.ques.push(tempObj);
            var txt = data.ques[index].clickable;
            $("#cloneItem_d").clone().appendTo(".clickableBlock");
            $("#cloneItem_d .clickable-item").attr("alt", "Item to match:  "+ txt);
            $("#cloneItem_d .clickable-item").attr("aria-label", "Iteam to match: "+txt);
            
            $("#cloneItem_d .clickable-item p").html(txt);
            $("#cloneItem_d").addClass("clickedEvent");
            $("#cloneItem_d").attr("id", "cloneItem_"+index);

            enterCounter[`cloneItem_${index}`] = 1;
            
            //$("#matchBox_d .matching-item").attr("alt", "Item to match: "+ txt);
           // $("#matchBox_d .matching-item").attr("aria-label", "Description to match: "+txt);
            $("#matchBox_d").clone().appendTo(".matchingBlock");

            var txt = data.ques[index].matching;
            m = txt.match(regex);
            
            if(m != null){
                $(".matching-item").addClass("img-wrap");
                var alt = data.ques[index].alt;
                //console.log("ALT: ", alt);
                $(".matching-item").addClass("img-wrap");
                $($(".matching-item")[index]).attr("aria-label", "Description to match: "+ alt)
                var img;                
                img = new Image();
                img.src = txt;
                img.className = "matchingImage";
                temp = img;
                $(img).attr({"alt": alt, "aria-hidden": true});                
                iArr.push(temp);
                img.onload = function (){
                    //console.log("loaded", this.height);
                    $("#matchBox_d .matching-item").append($(iArr[counter]));
                    imgMaxHeight = Math.max(imgMaxHeight, this.height);
                    counter++;
                    if(counter == items.length){
                        //console.log("all loaded....", imgMaxHeight, iArr);
                        $(".matching-item").each(function(index){
                            //$(this).append(iArr[index]);
                            $("#matchBox_"+index).find(".matching-item").append(iArr[index]);
                            //console.log(iArr[index].height);
                            //console.log(img.height, $(this).outerHeight());
                            maxH = Math.max(maxH,iArr[index].height);
                            //console.log(maxH,$(this).outerHeight());

                        });
                        $(".matching-item").css("height", maxH + 25);
                        var maxHofClickitem = $('.clickable-item').outerHeight();
                        let marg;
                        marg = isSafari?30:15;
                        console.log("SAFARI: ", isSafari, "  mar: ", marg);
                        $('.matchedEvent').css({"height": (maxH+maxHofClickitem+15)+"px"});
                        $('.matchedEvent').css({"height": (maxH+maxHofClickitem+50)+"px"});
                        //console.log(maxH, maxH+maxHofClickitem+15);
                    }
                    
                }
            }else{
                $("#matchBox_d .matching-item").html("<p aria-hidden=true></p>");
                $("#matchBox_d .matching-item p").html(txt);
                $("#matchBox_d .matching-item").attr("aria-label", "Description to match: " + txt)
                $(".matching-item").each(function(index){
                    //$(this).append(iArr[index]);
                    $("#matchBox_"+index).find(".matching-item").append(iArr[index]);
                    //console.log($(this).outerHeight());
                    maxH = Math.max(maxH,$(this).outerHeight());
                    //console.log(maxH,$(this).outerHeight());
                });
                $(".matching-item").css("height", maxH);
                var maxHofClickitem = $('.clickable-item').outerHeight();
                let marg;
                marg = isSafari?30:15;
                console.log("SAFARI: ", isSafari, "  mar: ", marg);
                $('.matchedEvent').css({"height": (maxH+maxHofClickitem+15)+"px"});
                console.log(maxH, maxH+maxHofClickitem+15);
                
            }
            var hh = document.getElementsByClassName("matchedEvent");
            
              
            $("#matchBox_d").addClass("matchedEvent");
            $("#matchBox_d").attr("id", "matchBox_"+index);


        });

        $("#cloneItem_d").remove();
        $("#matchBox_d").remove();

        $("#r-feedback p").html(xml.find("rightfeedback").text());
        $("#w-feedback p").html(xml.find("wrongfeedback").text());
        
        $(".shuffle").shuffleChildren();

        var r = document.querySelector(':root');
        r.style.setProperty('--cardCount', items.length);

        var heightArr = [];
        $('.matching-item').each(function(index, element) {
            var height = $(element).outerHeight();
            heightArr.push(height);
        });

        var maxHeight = Math.max(...heightArr);
        //$('.matching-item').css({"height":maxHeight+"px"});

        $(document).keyup(function(event) {
            //get the id of element on which enter key pressed
            const elemId = $(prevBtn).attr('id');
            console.log("ENTER prev: ", elemId);

            event.preventDefault();
            var keycode = (event.keyCode ? event.keyCode : event.which);

            //escape key for deselect 
            if(keycode == 27){
                //prevBtn.removeClass("selected");
                prevBtn = null;
                $(curDiv).find(".clickable-item").removeClass("selected");
                curDiv = null;
                $(".selected").removeClass("selected");
                $(".matching-item").blur();
                $(".clickable-item").blur();
            }

            //if key for enter event
            if (keycode == 13) {
                console.log("enter...");
                return;
                //get the count of enter pressed on element
                const enterCount = enterCounter[elemId];
                //if enter has pressed two times
                console.log(enterCount, " enter count ", enterCounter);
                if (enterCount > 2) {
                    //reset the value
                    enterCounter[elemId] = 1;

                    var same = true;
                    try{
                        same = prevBtn == $(this);
                    }catch(err){
                        //console.log(err);
                        same=true;
                    }
                    if(!same){
                        if(prevBtn){
                            if($(prevBtn).hasClass("clickable-items")){
                                //console.log("SAME......");
                                console.info('if', {prevBtn})
                            }else{
                                //console.log("BACK.....Else", prevBtn);
                                $(prevBtn).appendTo($(".clickable-items").find(".clickableBlock"));                    
                                var iid = $(prevBtn).attr("data-placed");
                                console.info('iid', iid);
                                $("#"+iid).removeClass("placed");
                                $("#"+iid).removeAttr("data-placed");
                                $(prevBtn).removeAttr("data-placed");
                                $(".submit_btn").addClass("disabled");
                                $(".submit_btn").prop("disabled", true);
                                $(".clickableBlock").removeClass("no-grid");
                                console.log("111", $(".clickableBlock"));
                                prevBtn=null;
                                $(".selected").removeClass("selected");
                                $(".matching-item").blur();
                                $(".clickable-item").blur();
                                return;
                            }
                        }
                    }

                    console.log("Normal click....");
                    prevBtn = $(this);
                }
                enterCounter[elemId] += 1;
            }
            console.log(keycode, " ************ ");
        });
    }

    function createSettingBox(data){
        //console.log("DATA: ", data.find("themes").find("theme").length);
        var themes = Array.from(data.find("themes").find("theme"));
        themes.forEach((element, index) => {
            // console.log("element", element.innerHTML);
            var btn = $("<button>",{
                "role": "settings tool",
                "data-color": $(element).find("color").html(),
                "data-background": $(element).find("background").html(),
                "data-boxbackground": $(element).find("boxbackground").html(),
                "class": "toolContainer toolContainer_" + (index+1),
                "aria-label": $(element).find("title").html(),
                "aria-pressed": "false",
                "title": $(element).find("title").html(),
            }).appendTo($(".toolCnt"));

            $("<img>",{
                "alt": $(element).find("name").html(),
                "class": "tool tool_" + (index+1),
                "src": "images/" + $(element).find("images").html()
            }).appendTo($(btn));
            $("<span>",{
                "class": "toolTxt toolTxt_"+(index+1),                
            }).html($(element).find("title").html()).appendTo(btn);

            //console.log($(".toolContainer")[0]);
            $(".toolContainer:first").attr("aria-pressed", "true");
            $(btn).on("click", function(e){
                console.log($(this).attr("data-color"));
                $(".toolContainer").attr("aria-pressed","false");
                $(this).attr("aria-pressed", "true");
                var r = document.querySelector(':root');
                r.style.setProperty('--color', $(this).attr("data-color"));
                r.style.setProperty('--background', $(this).attr("data-background"));
                r.style.setProperty('--boxbackground', $(this).attr("data-boxbackground"));
            })
        });
    }

    function matchHandler(e){        
        if(!$(e.target).hasClass("clickable-item")){
            prevBtn = null;
        }
        if(curDiv == null){
            return;
        }

        if(!$(this).attr("data-placed")){
            $(this).find(".matching-element").prepend(curDiv);

            const elemId = $(curDiv).attr('id');
            //reset the value
            enterCounter[elemId] = 1;

            classnames = $(this).find(".clickedEvent").attr('class');
            $(this).find(".clickedEvent").attr("class", 'clickedEvent');

            var prevMatched = $(curDiv).attr("data-placed");
            $("#"+prevMatched).removeAttr("data-placed");
            $("#"+prevMatched).removeClass("placed");
            console.log(" *-*-*-*-*-*-*-*-*-* ");
            $(".selected").removeClass("selected");
            $(".matching-item").blur();
            $(".clickable-item").blur();
        }else{
            if($(curDiv).attr("data-placed")){
                if(curMatchbox == $(this).attr("id")){
                    return;
                }
                console.log(" 000000000000000000 ");
                var parent = $("#"+$(curDiv).attr("data-placed"));                
                var apend = $("#"+$(this).attr("data-placed"));
                parent.find(".matching-element").prepend(apend);

                const elemId = $(curDiv).attr('id');
                //reset the value
                enterCounter[elemId] = 1;

                classnames = $(this).find(".clickedEvent").attr('class');
                $(this).find(".clickedEvent").attr("class", 'clickedEvent');

                apend.attr("data-placed", parent.attr("id"));
                parent.attr("data-placed", apend.attr("id"));
                parent.addClass("placed");
                
                $(this).find(".matching-element").prepend($(curDiv));

                classnames = $(this).find(".clickedEvent").attr('class');
                $(this).find(".clickedEvent").attr("class", 'clickedEvent');
            }else{
                if($("#"+$(this).attr("data-placed"))){
                    if (curDiv) {
                        var placedEle = $("#"+$(this).attr("data-placed"));
                        $(".clickableBlock").append(placedEle);

                        placedEle.removeAttr("data-placed")
                        
                        $(this).find(".matching-element").prepend(curDiv);

                        const elemId = $(curDiv).attr('id');
                        //reset the value
                        enterCounter[elemId] = 1;

                        classnames = $(this).find(".clickedEvent").attr('class');
                        $(this).find(".clickedEvent").attr("class", 'clickedEvent');
                        console.log(" 11111111111111111 ");
                    }
                }else{
                    console.log(" 2222222222222222222222 ");
                }
            }
           
        }

        $(curDiv).attr("data-placed", $(this).attr("id"));
        $(this).attr("data-placed", $(curDiv).attr("id"));
        $(this).addClass("placed");

        $(curDiv).find(".clickable-item").removeClass("selected");
        curDiv = null;

        if($(".placed").length == data.ques.length){
            $(".submit_btn").prop("disabled", false)
            $(".submit_btn").removeClass("disabled");
            $(".submit_btn").removeClass("mobile-submit");
            $(".activity-header").addClass("pad0");
            $(".clickableBlock").addClass("no-grid");
        }else{
            $(".clickableBlock").removeClass("no-grid");
            console.log("111", $(".clickableBlock"));
        }
    }

    $(".submit_btn").click(function(){        
        var wCount = 0;
        var rCount = 0;
        $(".clickable-items").addClass("unsetonsubmit");
        $(".activity-header").addClass("activity-header-submit");
        $(".activity-content").addClass("activity-content-submit");
        $(".clickable-item.wrong-border-up").addClass(".clickable-item.wrong-border-up-sub");
        $(".clickable-item").prop("disabled", true);
        $(".matching-item").prop("disabled", true);
        $(".text-end").addClass("mar-t-0");
        //$(".activity-content").addClass("p-48p");
        for(var i=0; i<data.ques.length; i++){
            var clicksId = $("#cloneItem_"+i).attr("id").replace("cloneItem_", "");
            var machedId = $("#cloneItem_"+i).attr("data-placed").replace("matchBox_", "");

            if(clicksId == machedId){
                $("#matchBox_"+machedId).find(".matching-element").addClass("submitted").addClass("correct-ans");
                $("#matchBox_"+machedId).find(".matching-element").find(".clickable-item").addClass("right-border-up");
                $("#matchBox_"+machedId).find(".matching-element").find(".matching-item").addClass("right-border-bottom");
                rCount++;
            }else{
                $("#matchBox_"+machedId).find(".matching-element").addClass("submitted").addClass("wrong-ans");
                $("#matchBox_"+machedId).find(".matching-element").find(".clickable-item").addClass("wrong-border-up");
                $("#matchBox_"+machedId).find(".matching-element").find(".matching-item").addClass("wrong-border-bottom");
                wCount++;
            }
        }

        if(wCount == 0){
            $(".reset_btn").show().focus();
            $(".tryagain_btn").hide();
            $(".submit_btn").hide();

            $("#r-feedback").show();
        }else{
            $(".tryagain_btn").show().focus();
            $(".reset_btn").hide();
            $(".submit_btn").hide();

            $("#w-feedback").show();
        }

        curDiv = null;
        prevBtn = null;
    })

    function bindEvents(){
        $(".clickedEvent").click(function clickableHandler(e){
            if($(prevBtn)[0] == $(this)[0] && $(prevBtn)[0]==e.currentTarget){
                console.log("double click..........");
                $(prevBtn).appendTo($(".clickable-items").find(".clickableBlock")); 
                console.log($(".clickable-items").find(".clickableBlock"));                   
                var iid = $(prevBtn).attr("data-placed");
                console.info('iid', iid);
                $("#"+iid).removeClass("placed");
                $("#"+iid).removeAttr("data-placed");
                $(prevBtn).removeAttr("data-placed");
                $(".submit_btn").addClass("disabled");
                $(".submit_btn").prop("disabled", true);
                $(".clickableBlock").removeClass("no-grid");
                console.log("111", $(".clickableBlock"));
                prevBtn=null;
                $(".selected").removeClass("selected");
                $(".matching-item").blur();
                $(".clickable-item").blur();
                e.stopImmediatePropagation();
                return;
            }
            console.log("-------------test-----------");
            if(prevBtn){
                console.log("back.......");
            }else{
                if(!$(this).closest('.clickable-items').length){
                    console.log("placed");
                    prevBtn = $(this);
                }
            }
            if(curDiv){
                $(curDiv).find(".clickable-item").removeClass("selected");
            }
            curDiv = this;
            $(curDiv).find(".clickable-item").addClass("selected");

            if($(curDiv).attr('data-placed') != ""){
                const elemId = $(curDiv).attr('id');
                enterCounter[elemId] += 1;
            }

            if($(this).attr("data-placed")){
                curMatchbox = $(this).attr("data-placed");
            }
            
            $(".matchedEvent").off().on("click", matchHandler);
        })

        $(".matchedEvent").off().on("click", matchHandler);

        $(".clickable-items").click(function(e) {
            var same = true;
            try{
                same = prevBtn == $(this);
            }catch(err){
                //console.log(err);
                same=true;
            }
            if(!same){
                if(prevBtn){
                    if($(prevBtn).hasClass("clickable-items")){
                        //console.log("SAME......");
                    }else{
                        if($(e.target).hasClass("submit_btn")){
                            return;
                        }
                        console.log("BACK.....", prevBtn);
                        $(prevBtn).appendTo($(".clickable-items").find(".clickableBlock"));                    
                        var iid = $(prevBtn).attr("data-placed");
                       // console.log("id ", iid);
                        $("#"+iid).removeClass("placed");
                        $("#"+iid).removeAttr("data-placed");
                        $(prevBtn).removeAttr("data-placed");
                        $(".submit_btn").addClass("disabled");
                        $(".submit_btn").prop("disabled", true);                        
                        $(".clickableBlock").removeClass("no-grid");
                        console.log("111", $(".clickableBlock"));
                        $(".selected").removeClass("selected");
                        $(".matching-item").blur();
                        $(".clickable-item").blur();
                        prevBtn=null;
                        return;
                    }
                }
            }

            console.log("Normal click....");
            prevBtn = $(this);
        })

        var isDown = true;
        $('#reviewBtn').click(function(){
            if(isDown){
                //$(".reviewContainer").css({"transform" : "translate(0px, -89vh)"});
                $("#reviewParent").removeClass("moveDown");
                $("#reviewParent").addClass("moveTOP");
                $(".reviewContainer").removeClass("moveDown");
                $(".reviewContainer").addClass("containerTOP");
                $("#reviewBtn i").removeClass("up").addClass("down");
                $("#reviewBtn p").html("Review Image");
                $("#reviewBtn").attr("aria-label", "Review Image");
                $("#reviewImg").attr("aria-hidden", true);
                isDown = false;
                enableFocus();
            }else{
                //$(".reviewContainer").css({"transform" : "translate(0px, 0px)"});
                $("#reviewParent").removeClass("moveTOP");
                $("#reviewParent").addClass("moveDown");

                $(".reviewContainer").removeClass("containerTOP");
                $(".reviewContainer").addClass("containerDown");
                $("#reviewBtn i").removeClass("down").addClass("up");
                $("#reviewBtn p").html("Begin Activity");
                $("#reviewBtn").attr("aria-label", "Begin Activity");
                $("#reviewParent").css({"background-color": "rgb(112 112 112 / 80%)"});
                $("#reviewImg").attr("aria-hidden", false);
                isDown = true;
                disbleFocus();
            }
            
        });

        $("#reviewParent").on( 'transitionend', function() {
            if(!isDown){
                $(this).css({"background-color": "rgb(112 112 112 / 0%)"});
            }
        });

    }

    function enableFocus(){
        $(".was-disabled").prop("disabled",false).removeClass("was-disabled");
        $(".clickable-items").attr("aria-hidden", false);
        $(".matching-items").attr("aria-hidden", false);
    }

    function disbleFocus(){
        $(".clickable-item").each(function(id, item){
            //console.log(item);
            if(!$(item).is(":disabled"))
            {
                //console.log("1111: ", $(item));
                $(item).addClass("was-disabled").prop("disabled", true);
            }
        });

        $(".matching-item").each(function(id,item){
            if(!$(item).is(":disabled"))
            {
                //console.log("2222: ", $(item));
                $(item).addClass("was-disabled").prop("disabled", true);
            }
        });
        $('.text-end').children(':visible').each(function(id,item){
            if(!$(item).is(":disabled"))
            {
                console.log("3333: ", $(item));
                $(item).addClass("was-disabled").prop("disabled", true);
            }
        })

        $(".clickable-items").attr("aria-hidden", true);
        $(".matching-items").attr("aria-hidden", true);
    }

    $.fn.shuffleChildren = function() {
        $.each(this.get(), function(index, el) {
            var $el = $(el);
            var $find = $el.children();
        
            $find.sort(function() {
            return 0.5 - Math.random();
            });
        
            $el.empty();
            $find.appendTo($el);
        });

        bindEvents();
    };

    return this;
});
 
 $(document).ready(function() {
    let matchingObj = new matching();
    matchingObj.init();
 });
 
 //  sticky header  //
//  window.addEventListener("scroll", function(){
//      var header = document.querySelector("header");
//      header.classList.toggle("sticky", window.scrollY > 0);
//  })
   //  sticky header  //