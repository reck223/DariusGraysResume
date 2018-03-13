/********************* GLOBAL VARIABLES & CALLING INITIAL FUNCTIONS *********************/
var $ = window.jQuery;
var $boxes = $('.flipBox'); //get all the flipboxes
var WAIT_AFTER_FLIP = 500;                                      //amount of time to wait before and after flipping card
var WAIT_BEFORE_FLIP = 150;
var isIE = /*@cc_on!@*/false || !!document.documentMode;      //check for IE (I found this code online)

/******************************** FUNCTIONS ********************************/

/*** Flip & unflip the cards ***/
// param(sender) = the object requesting the flip
// ASSUMES: if it's never been flipped, it doens't have 'flip' or 'unflip' class
var Flip = function Flip(){
  var $box = $(this);
  var hasFlipClass = HasFlip.call($box);                                   //if it has flip, we need to unflip it (and vice versa)
  FlipHelper.call($box, !hasFlipClass); //if it has flip or unflip, it's been flipped before
}

/*** Flip helper - actually do the flipping  ***/
// param(sender) = the object requesting the flip
// param(isFlip) = true if it's a flip, false if it's an unflip
// param(hasFlipped) = true if the object has flipped before, else false
// ASSUMES: if the object is being unflipped, it's been flipped before
var FlipHelper = function FlipHelper(isFlip){
  var $box = $(this);
  if(isFlip){
    $box.addClass('flip');                               //flip it
    $box.removeClass('unflip');                        //remove 'unflipped' so it flips again later

    setTimeout(function(){ FlipContent.call($box, isFlip); }       //animate flipping DOWN the content
               , WAIT_AFTER_FLIP);
  }else{                                                        //otherwise, unflip it
    FlipContent.call($box, isFlip);                                //flip the content up first
    setTimeout(function(){    $box.addClass('unflip');   //then flip the header
                              $box.removeClass('flip');     }
               , WAIT_BEFORE_FLIP);
  }
  if(isIE){ FixIE.call($box, isFlip); } //fix issue with IE not flipping correctly
}

/*** Check if class list has the class 'flip', which means it needs to be UNflipped **/
// returns: true if it contains flip, else false
function HasFlip(){
  return $(this).hasClass('flip');
}

/*** Check if class list has the class 'unflip', which means it needs to be flipped **/
// returns: true if it contains flip, else false
var HasUnflip = function HasUnflip(){
  return $(this).hasClass('unflip');
}

/*** Flip the back of the card forwards or backwards ***/
// param(sender) = the object you're checking for 'flip'
// param(isFlip) = true if it's a flip, false if it's an unflip
// ASSUMES: there is a single 'subPt' class in your box
var FlipContent = function FlipContent(isFlip){
  var $content = $(this).find('.subPt');        //get the lower half of the back of the box
  if(isFlip){
    $content.addClass('show');
    setTimeout(function(){ $content.removeClass('hide'); }
               , 500);

  }   //show the content
  else{
    $content.addClass('hide');
    $content.removeClass('show');
  }            //hide the content
}

/*** Fix an issue with IE where it shows both the back & front of the card at the same time
      To fix, this manually sets the z-index of the front and back. ***/
// param(sender) = the object you're checking for 'flip'
// param(isFlip) = true if it's a flip, false if it's an unflip
var FixIE = function FixIE(isFlip){
  var $box = $(this);
  if(isFlip){                                                         //if showing the back, set z-index of front to be less than z-index of the back
    $box.find('.front')[0].style.zIndex = ('9');
    $box.find('.back')[0].style.zIndex = ('10');
  }else{                                                              //and vice versa
    $box.find('.front')[0].style.zIndex =('10');
    $box.find('.back')[0].style.zIndex =('9');
  }
}

/*** Expand or collapse all boxes ***/
var ExpandCollapseAll = function ExpandCollapseAll(){
  var $btn = $('#expandCollapse');
  var isFlip;                                               //allows us to flip or unflip all boxes the same way
  if($btn.text() === 'Expand All'){                    //update the button text/icon to be the opposite of what it was
    $btn.text('Collapse All');
    $btn.removeClass('expandMe');                    //remove 'expand' and add 'collapse' so the flip occurs
    $btn.addClass('collapseMe');
    isFlip = false;
  }else{                                                    //and vice versa
    $btn.text('Expand All');
    $btn.removeClass('collapseMe');
    $btn.addClass('expandMe');
    isFlip = true;
  }
  var waitTime = isFlip ? WAIT_AFTER_FLIP : WAIT_BEFORE_FLIP; //wait the appropriate amount of time depending on if it's a flip or unflip
  $.each($boxes, function(){
    FlipHelper.call(this, !isFlip);       //isFlip will be the same for every box
  });
}

/*** Remove all :hover stylesheets for touch devices (I found this code online) ***/
// ASSUMES: this is a touch device
var RemoveHover = function RemoveHover(){
    try { // prevent exception on browsers not supporting DOM styleSheets properly
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    }catch(Exception){ } //do nothing
}

//fix bugs with touchscreen
var FixBugs = function FixBugs(){
  var touch = 'ontouchstart' in document.documentElement        // used to disable hovering for touchscreen (I found this code online)
              || navigator.maxTouchPoints > 0
              || navigator.msMaxTouchPoints > 0;
  if (touch) RemoveHover();
}
//add onclick events
var AddEventHandlers = function AddEventHandlers(){
  $('#expandCollapse').on('click', ExpandCollapseAll);
  $boxes.on('click', Flip);  //flip open the flip boxes
}

$(document).ready(function() {
  AddEventHandlers();
  FixBugs();
});
