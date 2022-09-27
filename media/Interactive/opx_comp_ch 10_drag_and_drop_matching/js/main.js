var matching = (function() {
    var data = {};
    //counter to store enter count for each id of clickable div
    let enterCounter = { };
    var curDiv = null;
    var curMatchbox = true;
    var prevBtn = null;
    var classnames = "";

    this.init = function(data) {
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
    }

    var tryAgain = function(){
        $(".clickable-item").prop("disabled", false);
        $(".matching-item").prop("disabled", false);
        $(".clickableBlock").removeClass("no-grid");
        console.log("111", $(".clickableBlock"));

        $(".matching-element").find(".clickable-item").removeClass("wrong-border-up");
        $(".matching-element").find(".matching-item").removeClass("wrong-border-bottom");
        $(".matching-element").find(".clickable-item").removeClass("right-border-up");
        $(".matching-element").find(".matching-item").removeClass("right-border-bottom");
       

        $(".activity-header").removeClass("h-48p");
        $(".activity-content").removeClass("p-48p");

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

    var fetchData = function(xml){
        $(".activity-title").html(xml.find("title").text());
        $(".notice-card p").html(xml.find("instruction").text());

        var items = xml.find("items").find("item");
        //var matchItem = xml.find("items").find("matching").find("text");
        data["ques"] = [];
        items.each((index, el) => {
            var tempObj = {};
            tempObj["clickable"] = $(el).find("clickable text").html();
            tempObj["matching"] = $(el).find("matching text").html();

            data.ques.push(tempObj);
            var txt = data.ques[index].clickable;
            $("#cloneItem_d").clone().appendTo(".clickableBlock");
            $("#cloneItem_d .clickable-item").attr("alt", "Item to match:  "+ txt);
            $("#cloneItem_d .clickable-item").attr("aria-label", "Iteam to match: "+txt);

            $("#cloneItem_d .clickable-item p").html(txt);
            $("#cloneItem_d").addClass("clickedEvent");
            $("#cloneItem_d").attr("id", "cloneItem_"+index);

            enterCounter[`cloneItem_${index}`] = 1;
            
            var txt = data.ques[index].matching;
            $("#matchBox_d .matching-item").attr("alt", "Item to match: "+ txt);
            $("#matchBox_d .matching-item").attr("aria-label", "Description to match: "+txt);
            $("#matchBox_d").clone().appendTo(".matchingBlock");
            $("#matchBox_d .matching-item p").html(data.ques[index].matching);
            $("#matchBox_d").addClass("matchedEvent");
            $("#matchBox_d").attr("id", "matchBox_"+index);
        });

        $("#cloneItem_d").remove();
        $("#matchBox_d").remove();

        $("#r-feedback p").html(xml.find("rightfeedback").text());
        $("#w-feedback p").html(xml.find("wrongfeedback").text());
        
        $(".shuffle").shuffleChildren();

        var heightArr = [];
        $('.matching-item').each(function(index, element) {
            var height = $(element).outerHeight();
            heightArr.push(height);
        });

        var maxHeight = Math.max(...heightArr);
        var maxHofClickitem = $('.clickable-item').outerHeight();
        $('.matching-item').css({"height":maxHeight+"px"});

        $('.matchedEvent').css({"height": (maxHeight+maxHofClickitem+15)+"px"});

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
        $(".clickable-item").prop("disabled", true);
        $(".matching-item").prop("disabled", true);
        
        $(".activity-header").addClass("h-48p");
        $(".activity-content").addClass("p-48p");
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
            console.clear();
            console.log("prev: ", prevBtn);
            console.log("$prev: ", $(prevBtn));
            console.log("this: ", $(this));
            console.log("target: ", e.target);
            console.log("c target: ", e.currentTarget);
            console.log("prev[0]", $(prevBtn)[0]);
            console.log("c1: ", $(prevBtn)[0] == $(this)[0]);
            console.log("c2: ", $(prevBtn)[0]==e.currentTarget);

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
    //console.log($("#gear-icon"));
    //gear-icon.styel.fill = 'yellow';
    var icon = document.getElementById("gear-icon");
    console.log(icon);
    let matchingObj = new matching();
    matchingObj.init();
 });
 
 //  sticky header  //
//  window.addEventListener("scroll", function(){
//      var header = document.querySelector("header");
//      header.classList.toggle("sticky", window.scrollY > 0);
//  })
   //  sticky header  //