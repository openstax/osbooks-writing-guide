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
        items.each((index, el) => {
            var ftxt = $(el).find("front text").html();
            var btxt = $(el).find("back text").html();
            var frontAria = "Card " + (index+1) + ", Side 1: " + ftxt; 
            var backAria = "Card " + (index+1) + ", Side 2: " + btxt;
            frontAria = frontAria.replaceAll("<p>", "");
            frontAria = frontAria.replaceAll("</p>", " ");
            backAria = backAria.replaceAll("<p>", "");
            backAria = backAria.replaceAll("</p>", " ");
            var item = $("#cloneItem_d").clone()
            $(item).find(".flip-card").attr({"data-front": frontAria, "data-back": backAria, "aria-label": frontAria});
            $(item).appendTo(".cards-container").attr("id", "card_"+index);
            $(item).find(".flip-card-front").html(ftxt).attr("aria-hidden", true);
            $(item).find(".flip-card-back").html(btxt).attr("aria-hidden", true);

            //$("#cloneItem_d .flip-card-front").html(ftxt);
            //$("#cloneItem_d .flip-card-back").html(btxt);
            //console.log($("#card_"+index)[0]);
            //console.log(item);
        });

        $("#cloneItem_d").remove();
        $(".shuffle").shuffleChildren();
        
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
    };

    return this;
});
 
 $(document).ready(function() {
    let matchingObj = new matching();
    matchingObj.init();
 });
 
