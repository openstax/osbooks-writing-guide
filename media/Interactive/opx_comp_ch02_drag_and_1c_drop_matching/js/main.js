function ClickableItemModel(index,data){
   this.index = index;
   this.text = data.text;
   this.isMoved = ko.observable(false);
}

function MatchingItemModel(index,data){
    this.index = index;
    this.text = data.text;
    this.clickableItem = ko.observable();

    this.isShowingUnmatch = ko.observable(false);

    this.isFilled = ko.computed(function(){
        return this.clickableItem();
    },this);

    this.isCorrect = ko.observable();
 }

function MatchingTemplate() 
{
	// this.container = null;	

    this.title = ko.observable();
    this.instruction = ko.observable();
    this.feedback = ko.observable();
	this.clickableItems = ko.observableArray([]);
    this.matchingItems = ko.observableArray([]);

    this.totalItems = ko.observable();
   
    this.selectedClickableItem = ko.observable();

    this.isSubmitted = ko.observable(false);
    this.isAllCorrect = ko.observable(false);

    // this.scorm = pipwerks.SCORM; // shortcut

    // this.scorm.version = "1.2";

    var ref = this;

    this.init = function(){
        this.loadXML("./data/data.xml",this.xmlLoaded.bind(this));

        // this.scorm.init();

    }

    this.xmlLoaded = function(xml){
        console.log("xml loaded");
        var data = this.xml2json(xml).dataset;
        this.title(data.title);
        this.instruction(data.instruction);

        var arr1 = [];
        var arr2 = [];
        for(var i = 0; i < data.items.item.length; i++){
            arr1.push(new ClickableItemModel(i+1,data.items.item[i].clickable));
            arr2.push(new MatchingItemModel(i+1,data.items.item[i].matching));
        }

        this.clickableItems(this.shuffleArray(arr1));
        this.matchingItems(this.shuffleArray(arr2));
       
        this.totalItems(data.items.item.length);
        this.feedback(data.feedback);
    }

    this.isAllFilled = ko.computed(function(){
        var bool = true;
        for(var i = 0; i < this.matchingItems().length; i++){
            if(!this.matchingItems()[i].clickableItem()){
                bool = false;
                break;
            }
        }
        return bool;
    },this);

    this.filledCount = ko.computed(function(){
        var cnt = 0;
        for(var i = 0; i < this.matchingItems().length; i++){
            if(this.matchingItems()[i].clickableItem()){
               cnt++; 
            }
        }
        return cnt;
    },this);

    this.selectClickableItemHandler = function($data){
        
        ref.selectedClickableItem($data);
    }
    /*this.selectMatchingItemHandler = function($data){
        if(ref.selectedClickableItem() && !$data.clickableItem()){          
            ref.selectedClickableItem().isMoved(true);              
            $data.clickableItem(ref.selectedClickableItem());
            ref.selectedClickableItem(undefined);
        }
    }
    this.removeMatchingItemHandler = function($data){          
        if($data.clickableItem()){
            $data.clickableItem().isMoved(false);
            $data.clickableItem(undefined);
            ref.selectedClickableItem(undefined);
        }
    }*/

    this.selectMatchingItemHandler = function($data){
        
        if(ref.selectedClickableItem()){          

            if($data.clickableItem()){
                $data.clickableItem().isMoved(false);
                $data.clickableItem(undefined);               
            }

            $data.isShowingUnmatch(false);

            ref.selectedClickableItem().isMoved(true);              
            $data.clickableItem(ref.selectedClickableItem());
            ref.selectedClickableItem(undefined);
        }else{
           ref.toggleMatchingItemHandler($data);
        }
    }

    this.hideMatchingButtonFromAll = function(){
        for(var i = 0; i < this.matchingItems().length; i++){
            this.matchingItems()[i].isShowingUnmatch(false);
        }
    }

    this.removeMatchingItemHandler = function($data){          
        if($data.clickableItem()){
            $data.isShowingUnmatch(false);
            $data.clickableItem().isMoved(false);
            $data.clickableItem(undefined);
            ref.selectedClickableItem(undefined);
        }
    }

    this.toggleMatchingItemHandler = function($data){
        if(ref.isSubmitted()){
            return;
        }
        const bool = $data.isShowingUnmatch();
        ref.hideMatchingButtonFromAll();
        $data.isShowingUnmatch(!bool);
    }



    this.submitHandler = function(){
        var bool = true;

        ref.hideMatchingButtonFromAll();
        for(var i = 0; i < ref.matchingItems().length; i++){
            ref.matchingItems()[i].isCorrect(ref.matchingItems()[i].clickableItem().index ==  ref.matchingItems()[i].index);
            if(!ref.matchingItems()[i].isCorrect()){
                bool = false;                
            }
        }
        ref.isAllCorrect(bool);
        // if(bool){
        //     ref.scorm.set('cmi.core.lesson_status',"completed");
        //     ref.scorm.save();
        // }
        ref.isSubmitted(true);
    }

    this.tryagainHandler = function(){
        ref.resetHandler();
    }
    this.resetHandler = function(){
        for(var i = 0; i < ref.matchingItems().length; i++){
            if( ref.matchingItems()[i].clickableItem){
                ref.matchingItems()[i].clickableItem().isMoved(false);
                ref.matchingItems()[i].clickableItem(undefined);
                ref.matchingItems()[i].isCorrect(undefined);
            }
        }
        ref.isSubmitted(false);
        ref.selectedClickableItem(undefined);
    }

    this.isClickableSelected = function($data){
        return this.selectedClickableItem() === $data
    }
    
    this.getClickableItem = function(ind){
        return this.items()[ind-1].clickable;
    }
    this.getMatchingItem = function(ind){
        return this.items()[ind-1].matching;
    }

    this.init();
}

MatchingTemplate.prototype = new Util();
MatchingTemplate.prototype.constructor = MatchingTemplate;


$(document).ready(function() {
	var obj = new MatchingTemplate();
	ko.applyBindings(obj,$("#matching_template")[0])

});