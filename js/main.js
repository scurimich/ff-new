function hideText(){$(".text").each(function(){var t=$(this),e={};if(!t.is("[data-expand-strings], [data-expand-words]"))return!1;if(e.type=t.is("[data-expand-strings]")?"strings":"words",e.number="strings"===e.type?t.attr("data-expand-strings"):t.attr("data-expand-words"),"strings"===e.type){var a=parseInt(t.css("line-height")),r=e.number*a;t.attr("data-height",t.height()),t.css("height",r+"px")}if("words"===e.type){var i=t.find(".expand-text"),n=new RegExp("([а-яА-Яa-zA-Z,]+\\s){"+(e.number-1)+"}[а-яА-Яa-zA-Z]+","mi"),s=t.text().trim().replace(n,"");t.attr("data-text",s),t.text(t.text().trim().match(n)+" ... "),t.append(i)}})}function expandText(){var t=$(this),e=t.parents(".text").length?t.parents(".text"):t.siblings(".text");e.attr("data-height")&&(e.css("height",e.attr("data-height")),t.remove()),e.attr("data-text")&&(t.remove(),e.text(e.text().trim().replace(/\.{3}$/im,"")+e.attr("data-text")))}
$(function(){({initialize:function(){this.plugins(),this.listeners(),hideText(),this.sidebarBehavior(),this.statusbars(),this.aboutInterval=setInterval(this.aboutViewportChanging.bind(this),5e3)},startValues:{sideOffset:$("aside").length?$("aside").offset().top:0,sideParentHeight:$("aside").length?$("aside").parent().height():0,windowPrevPosition:$(window).scrollTop()},listeners:function(){$(".expand-text").click(expandText),$(".select-box_multiple").on("click",".cancel",this.clearMultiselect),$(document).click(this.popup),$("[id=commenting-input]").focus(this.npWrite),$("[id=commenting-input]").focusout(this.npClose),$("[id=commenting-input]").on("keydown keyup",this.npWriting),$('[data-modal*="modal"]').click(this.openModal),$(document).on("click",this.closeModal),$("[id=review-other]").click(this.showReviewTooltip),$(document).click(this.hideReviewTooltip),$("[id=add-review] textarea").focus(this.showAddReview),$("[id=add-review] textarea").focusout(this.hideAddReview),$("[id=activity-share]").click(this.showShare),$(document).click(this.hideShare),$("#catfilter-switcher").click(this.switchCats),$(window).scroll(this.sidebarBehavior.bind(this)),$(document).on("click",".viewport__nav",this.aboutViewportNavClick.bind(this)),$(document).on("mouseover mouseout",".viewport__slides",this.aboutViewportStop.bind(this)),$(document).on("mouseout",".viewport__slides",this.aboutViewportStart.bind(this)),$(document).on("click",'[href="#time-remove"]',this.scheduleRemover),$(document).on("focusout","[data-valid=time]",this.timeValidation.bind(this)),$(document).on("focus","[data-valid=time]",this.timeValidationHide.bind(this)),$(document).on("mousedown keydown change focus focusout","input[data-mask]",this.inputMask)},plugins:function(){$(".select").selectric({onChange:this.selectricOnChange,onInit:this.selectricOnInit,multiple:{separator:", ",keepMenuOpen:!0,maxLabelEntries:!1}}),$(".rating").rateit({min:0,max:5,resetable:!1,starwidth:20,starheight:18}),$(".rating_12").rateit({min:0,max:5,resetable:!1,starwidth:14,starheight:12}),$(".rating_13").rateit({min:0,max:5,resetable:!1,starwidth:15,starheight:13}),$(".rating_14").rateit({min:0,max:5,resetable:!1,starwidth:16,starheight:14})},selectricOnInit:function(t){var e=$(t),i=e.find("option[data-disabled]").text(),a=e.parents(".selectric-select"),s=a.find(".selectric"),n=a.find(".selectric .label");n.removeClass("disabled"),n.text()===i&&n.addClass("disabled"),e.attr("multiple")&&e.val().length?(s.addClass("active"),s.find(".cancel").length||s.append('<div class="cancel"><span></span></div>')):(s.removeClass("active"),s.find(".cancel").remove())},selectricOnChange:function(t){var e=$(t),i=e.find("option[data-disabled]").text(),a=e.parents(".selectric-select");if(e.parents(".owner-main__select")){var s=e.find("option"),n=a.find(".selectric-items .selected");n.length>=3?(s.prop("disabled",!0),a.find(".selectric-items li.selected").each(function(){var t=$(this),i=t.index();e.find("option:nth-child("+(i+1)+")").prop("disabled",!1)}),e.selectric("refresh").click(),a.click()):2==n.length&&e.find("option:disabled").length&&(a.find(".selectric-items li"),s.attr("disabled",!1),e.selectric("refresh").click())}var o=a.find(".selectric"),l=a.find(".selectric .label");l.removeClass("disabled"),l.text()===i&&l.addClass("disabled"),e.attr("multiple")&&e.val().length?(o.addClass("active"),o.find(".cancel").length||o.append('<div class="cancel"><span></span></div>')):(o.removeClass("active"),o.find(".cancel").remove())},clearMultiselect:function(t){t.preventDefault(),$(this).parents(".selectric-select").find(".selectric-items li.selected").each(function(){$(this).click()}),$(this).remove()},popup:function(t){var e=$(t.target),i=100;if(e.is("[data-popup=click]")||e.parents("[data-popup=click]").length){var a=e.attr("data-href")||e.parents("[data-popup=click]").attr("data-href");$("[data-popup=window].active:not("+a+")").css("opacity",0).removeClass("active");var s=$(a);return void(s.is(".active")?s.stop().animate({opacity:"0"},i,function(){s.removeClass("active")}):s.addClass("active").stop().animate({opacity:"1"},i))}if(!e.is("[data-popup=window]")&&!e.parents("[data-popup=window]").length){var n=$("[data-popup=window]"),i=100;n.stop().animate({opacity:"0"},i),setTimeout(function(){n.removeClass("active")},2*i)}},npWrite:function(){var t=$(this),e=t.parents("#commenting-parent").find("#commenting-foot");e.slideDown(100,function(){e.addClass("active")})},npClose:function(){var t=$(this),e=t.parents("#commenting-parent").find("#commenting-foot");e.slideUp(200,function(){e.removeClass("active")})},npWriting:function(){var t=$(this),e=t.val().length,i=t.parents("#commenting-parent").find("#commenting-count");i.text(i.text().trim().replace(/^\d+\s/i,e+" "))},openModal:function(t){t.preventDefault();var e=$(this).attr("data-modal");$("[data-id="+e+"]").addClass("active")},closeModal:function(t){($(t.target).is("#modal-close")||$(t.target).is("#modal-sub")||$(t.target).is("#modal")&&!$(t.target).find("#modal-sub").length)&&$("[id=modal]").removeClass("active")},showReviewTooltip:function(){$(this).find("#review-tooltip").toggleClass("active")},hideReviewTooltip:function(t){$(t.target).is("[id=review-tooltip]")||$(t.target).is("[id=review-other]")||$("[id=review-tooltip]").removeClass("active")},showAddReview:function(){var t=$(this);t.addClass("active"),t.prev().addClass("active"),t.next().addClass("active")},hideAddReview:function(){var t=$(this);t.val().length||(t.removeClass("active"),t.prev().removeClass("active"),t.next().removeClass("active"))},showShare:function(){$(this).siblings("#activity-socials").toggleClass("active")},hideShare:function(t){$(t.target).is("#activity-share")||$(t.target).is("#activity-socials")||$("[id=activity-socials]").removeClass("active")},switchCats:function(){var t=$(this),e=t.text();t.parents("#cat-filter").find("ul.active").removeClass("active").siblings("ul").addClass("active"),t.text(t.attr("data-alt")).attr("data-alt",e)},sidebarBehavior:function(t){var e=$("aside");if(e.length){var i=e.next(),a=$(".footer"),s=$(window).height(),n=this.startValues.windowPrevPosition,o=$(window).scrollTop(),l=o-n,d=this.startValues.sideOffset,r=e.height(),c=e.outerWidth()+parseInt(e.css("margin-right")),h=e.offset().top,v=(e.css("padding-top"),e.css("padding-bottom"),a.offset().top),u=a.outerHeight(),p=this.startValues.sideParentHeight;if(p<=r)return!1;r+80<s?(o>d-20&&o+(r+60)<v&&(i.length&&i.css("margin-left",c),e.addClass("fixed"),e.removeClass("absolute")),o<=d-20&&(e.removeClass("fixed"),e.removeClass("absolute"),i.attr("style","")),o>d-20&&o+(r+60)>=v&&(i.length&&i.css("margin-left",c),e.removeClass("fixed"),e.addClass("absolute"),e.css("bottom",u+40))):(l>0&&(o+s>=v?(e.removeClass("fixed fixed_tall"),e.addClass("absolute"),e.css("bottom",u+40)):o+s>=h+r+40?(i.length&&i.css("margin-left",c),e.addClass("fixed fixed_tall"),e.removeClass("absolute"),e.css("top",""),e.css("bottom",40)):o+s>h&&(i.length&&i.css("margin-left",c),e.removeClass("fixed"),e.addClass("absolute"),e.css("bottom",""),e.css("top",h))),l<0&&(o<=d-20?(e.removeClass("fixed fixed_tall"),e.removeClass("absolute"),i.attr("style",""),e.attr("style","")):o<=h-20?(i.length&&i.css("margin-left",c),e.addClass("fixed fixed_tall"),e.removeClass("absolute"),e.css("bottom",""),e.css("top",20)):o<h+r&&(i.length&&i.css("margin-left",c),e.removeClass("fixed fixed_tall"),e.addClass("absolute"),e.css("bottom",""),e.css("top",h)))),this.startValues.windowPrevPosition=o}},statusbars:function(){$("[data-statusbar]").each(function(){var t=$(this),e=t.attr("data-statusbar"),i=t.attr("data-complete");t.find("[class*=complete]").css("width",i/e*100+"%")})},aboutViewportChanging:function(){var t,e,i=$(".viewport"),a=i.find(".viewport__slide.active"),s=i.find(".viewport__nav.active");0===a.next().length?(t=s.siblings(".viewport__nav:first-child"),e=a.siblings(".viewport__slide:first-child")):(e=a.next(),t=s.next()),this.aboutSlidesSwitching(a,s,e,t)},aboutViewportNavClick:function(t){var e=$(t.currentTarget),i=e.parents(".viewport");if(i.find(".showing").length||e.is(".active"))return!1;clearInterval(this.aboutInterval),this.aboutInterval=setInterval(this.aboutViewportChanging.bind(this),5e3);var a=e.siblings(".active"),s=e.index()+1,n=i.find(".viewport__slide:nth-child("+s+")"),o=i.find(".viewport__slide.active");this.aboutSlidesSwitching(o,a,n,e)},aboutSlidesSwitching:function(t,e,i,a){var s=t.find("img"),n=t.find("h3, p"),o=i.find("img"),l=i.find("h3, p");e.removeClass("active"),a.addClass("active"),t.addClass("hidding"),i.addClass("showing active"),o.css("opacity","1"),n.removeClass("active"),l.addClass("active"),s.animate({opacity:"0"},1e3,function(){i.removeClass("showing"),t.removeClass("hidding active")})},aboutViewportStop:function(t){clearInterval(this.aboutInterval)},aboutViewportStart:function(t){this.aboutInterval=setInterval(this.aboutViewportChanging.bind(this),5e3)},scheduleRemover:function(t){t.preventDefault();var e=$(this),i=e.parents(".owner-schedule__times");e.parents(".schedule-time").remove(),i.find(".schedule-time").length||i.parent().remove()},timeValidation:function(t){var e=$(t.target),i=e.val();if(i){var a=i.search(/['.:;]{1}/),s=parseInt(i.substring(0,a+1?a:i.length).trim()),n=a+1?parseInt(i.substring(a+1,i.length)):void 0,o=Boolean(s>=0&&s<24),l=Boolean(n>=0&&n<60);return s&&n&&o&&l?e.val(s+":"+n):s&&!n&&o?e.val(s+":00"):void e.next().show()}},timeValidationHide:function(t){$(t.target).next().hide()},inputMask:function(t){var e=$(this),i=e.val(),a=i.length,s=e.attr("data-mask"),n=s.length;return a<=n||0!==i.indexOf(s)?("keydown"===t.type&&8===t.keyCode&&t.preventDefault(),e.val(s)):"focusout"===t.type&&a<=n?e.val(""):void 0},addNull:function(t){return 0===t.length?"00":t.length>1?"0"+t:t}}).initialize()});
function mapInit(){myMap=new ymaps.Map("map",{center:[48.7,44.51],zoom:9})}function googleMapInit(){var n,a=$("#owner-coords"),e=a.val()||"1 1",o={lat:Number(e.substring(0,e.indexOf(","))),lng:Number(e.substring(e.indexOf(" ")))};if($("#address-map").length){var t=new google.maps.Map($("#address-map"),{center:o,zoom:o.lat?8:2});o.lat&&o.lng&&(n=new google.maps.Marker({position:o,map:t})),t.addListener("click",function(e){var o={lat:Number(e.latLng.lat().toFixed(6)),lng:Number(e.latLng.lng().toFixed(6))},t=o.lat+", "+o.lng;a.val(t),n.setPosition(o)})}}$(function(){if(window.ymaps){ymaps.ready(mapInit)}window.google&&googleMapInit()});