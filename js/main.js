function hideText(){$(".text").each(function(){var t=$(this),e={};if(!t.is("[data-expand-strings], [data-expand-words]"))return!1;if(e.type=t.is("[data-expand-strings]")?"strings":"words",e.number="strings"===e.type?t.attr("data-expand-strings"):t.attr("data-expand-words"),"strings"===e.type){var a=parseInt(t.css("line-height")),r=e.number*a;t.attr("data-height",t.height()),t.css("height",r+"px")}if("words"===e.type){var i=t.find(".expand-text"),n=new RegExp("([а-яА-Яa-zA-Z,]+\\s){"+(e.number-1)+"}[а-яА-Яa-zA-Z]+","mi"),s=t.text().trim().replace(n,"");t.attr("data-text",s),t.text(t.text().trim().match(n)+" ... "),t.append(i)}})}function expandText(){var t=$(this),e=t.parents(".text").length?t.parents(".text"):t.siblings(".text");e.attr("data-height")&&(e.css("height",e.attr("data-height")),t.remove()),e.attr("data-text")&&(t.remove(),e.text(e.text().trim().replace(/\.{3}$/im,"")+e.attr("data-text")))}
$(function(){({initialize:function(){this.listeners(),this.plugins(),hideText(),this.sidebarBehavior(),this.statusbars(),this.aboutInterval=setInterval(this.aboutViewportChanging,5e3)},startValues:{sideOffset:$("aside").length?$("aside").offset().top:0,sideParentHeight:$("aside").length?$("aside").parent().height():0,windowPrevPosition:$(window).scrollTop()},listeners:function(){$(".expand-text").click(expandText),$(".select-box_multiple").on("click",".cancel",this.clearMultiselect),$(document).click(this.popup),$("[id=commenting-input]").focus(this.npWrite),$("[id=commenting-input]").focusout(this.npClose),$("[id=commenting-input]").on("keydown keyup",this.npWriting),$('[data-modal*="modal"]').click(this.openModal),$(document).on("click",this.closeModal),$("[id=review-other]").click(this.showReviewTooltip),$(document).click(this.hideReviewTooltip),$("[id=add-review] textarea").focus(this.showAddReview),$("[id=add-review] textarea").focusout(this.hideAddReview),$("[id=activity-share]").click(this.showShare),$(document).click(this.hideShare),$("#catfilter-switcher").click(this.switchCats),$(window).scroll(this.sidebarBehavior.bind(this)),$(document).on("click",".viewport__nav",this.aboutViewportNavClick.bind(this))},plugins:function(){$(".select").selectric({onChange:this.selectricOnChange,onInit:this.selectricOnChange,multiple:{separator:", ",keepMenuOpen:!0,maxLabelEntries:!1}}),$(".rating").rateit({min:0,max:5,resetable:!1,starwidth:20,starheight:18}),$(".rating_12").rateit({min:0,max:5,resetable:!1,starwidth:14,starheight:12}),$(".rating_13").rateit({min:0,max:5,resetable:!1,starwidth:15,starheight:13}),$(".rating_14").rateit({min:0,max:5,resetable:!1,starwidth:16,starheight:14}),$(".photogallery__body").mCustomScrollbar({scrollInertia:0})},selectricOnChange:function(t){var e=$(t),i=e.find("option[data-disabled]").text(),a=e.parents(".selectric-select"),s=a.find(".selectric"),n=a.find(".selectric .label");n.removeClass("disabled"),n.text()===i&&n.addClass("disabled"),e.attr("multiple")&&e.val().length?(s.addClass("active"),s.find(".cancel").length||s.append('<div class="cancel"><span></span></div>')):(s.removeClass("active"),s.find(".cancel").remove())},clearMultiselect:function(t){t.preventDefault(),$(this).parents(".selectric-select").find(".selectric-items li.selected").each(function(){$(this).click()}),$(this).remove()},popup:function(t){var e=$(t.target),i=100;if(e.is("[data-popup=click]")||e.parents("[data-popup=click]").length){var a=e.attr("data-href")||e.parents("[data-popup=click]").attr("data-href");$("[data-popup=window].active:not("+a+")").css("opacity",0).removeClass("active");var s=$(a);return void(s.is(".active")?s.stop().animate({opacity:"0"},i,function(){s.removeClass("active")}):s.addClass("active").stop().animate({opacity:"1"},i))}if(!e.is("[data-popup=window]")&&!e.parents("[data-popup=window]").length){var n=$("[data-popup=window]"),i=100;n.stop().animate({opacity:"0"},i),setTimeout(function(){n.removeClass("active")},2*i)}},npWrite:function(){var t=$(this),e=t.parents("#commenting-parent").find("#commenting-foot");e.slideDown(100,function(){e.addClass("active")})},npClose:function(){var t=$(this),e=t.parents("#commenting-parent").find("#commenting-foot");e.slideUp(200,function(){e.removeClass("active")})},npWriting:function(){var t=$(this),e=t.val().length,i=t.parents("#commenting-parent").find("#commenting-count");i.text(i.text().trim().replace(/^\d+\s/i,e+" "))},openModal:function(t){t.preventDefault();var e=$(this).attr("data-modal");$("[data-id="+e+"]").addClass("active")},closeModal:function(t){($(t.target).is("#modal-close")||$(t.target).is("#modal-sub")||$(t.target).is("#modal")&&!$(t.target).find("#modal-sub").length)&&$("[id=modal]").removeClass("active")},showReviewTooltip:function(){$(this).find("#review-tooltip").toggleClass("active")},hideReviewTooltip:function(t){$(t.target).is("[id=review-tooltip]")||$(t.target).is("[id=review-other]")||$("[id=review-tooltip]").removeClass("active")},showAddReview:function(){var t=$(this);t.addClass("active"),t.prev().addClass("active"),t.next().addClass("active")},hideAddReview:function(){var t=$(this);t.val().length||(t.removeClass("active"),t.prev().removeClass("active"),t.next().removeClass("active"))},showShare:function(){$(this).siblings("#activity-socials").toggleClass("active")},hideShare:function(t){$(t.target).is("#activity-share")||$(t.target).is("#activity-socials")||$("[id=activity-socials]").removeClass("active")},switchCats:function(){var t=$(this),e=t.text();t.parents("#cat-filter").find("ul.active").removeClass("active").siblings("ul").addClass("active"),t.text(t.attr("data-alt")).attr("data-alt",e)},sidebarBehavior:function(t){var e=$("aside");if(e.length){var i=e.next(),a=$(".footer"),s=$(window).height(),n=this.startValues.windowPrevPosition,o=$(window).scrollTop(),l=o-n,r=this.startValues.sideOffset,c=e.height(),d=e.outerWidth()+parseInt(e.css("margin-right")),v=e.offset().top,h=(e.css("padding-top"),e.css("padding-bottom"),a.offset().top),p=a.outerHeight(),u=this.startValues.sideParentHeight;if(u<=c)return!1;c+80<s?(o>r-20&&o+(c+60)<h&&(i.length&&i.css("margin-left",d),e.addClass("fixed"),e.removeClass("absolute")),o<=r-20&&(e.removeClass("fixed"),e.removeClass("absolute"),i.attr("style","")),o>r-20&&o+(c+60)>=h&&(i.length&&i.css("margin-left",d),e.removeClass("fixed"),e.addClass("absolute"),e.css("bottom",p+40))):(l>0&&(o+s>=h?(e.removeClass("fixed fixed_tall"),e.addClass("absolute"),e.css("bottom",p+40)):o+s>=v+c+40?(i.length&&i.css("margin-left",d),e.addClass("fixed fixed_tall"),e.removeClass("absolute"),e.css("top",""),e.css("bottom",40)):o+s>v&&(i.length&&i.css("margin-left",d),e.removeClass("fixed"),e.addClass("absolute"),e.css("bottom",""),e.css("top",v))),l<0&&(o<=r-20?(e.removeClass("fixed fixed_tall"),e.removeClass("absolute"),i.attr("style",""),e.attr("style","")):o<=v-20?(i.length&&i.css("margin-left",d),e.addClass("fixed fixed_tall"),e.removeClass("absolute"),e.css("bottom",""),e.css("top",20)):o<v+c&&(i.length&&i.css("margin-left",d),e.removeClass("fixed fixed_tall"),e.addClass("absolute"),e.css("bottom",""),e.css("top",v)))),this.startValues.windowPrevPosition=o}},statusbars:function(){$("[data-statusbar]").each(function(){var t=$(this),e=t.attr("data-statusbar"),i=t.attr("data-complete");t.find("[class*=complete]").css("width",i/e*100+"%")})},aboutViewportChanging:function(){var t=$(".viewport"),e=t.find(".viewport__slide.active"),i=t.find(".viewport__nav.active");if(i.removeClass("active"),e.animate({opacity:"0"},600,function(){e.removeClass("active")}),0===e.next().length){var a=i.siblings(".viewport__nav:first-child"),s=e.siblings(".viewport__slide:first-child");a.addClass("active"),s.addClass("showing active").animate({opacity:"1"},600,function(){s.removeClass("showing")})}else{var s=e.next(),a=i.next();a.addClass("active"),s.addClass("showing active").animate({opacity:"1"},600,function(){s.removeClass("showing")})}},aboutViewportNavClick:function(t){var e=$(t.currentTarget),i=e.parents(".viewport");if(i.find(".showing").length||e.is(".active"))return!1;clearInterval(this.aboutInterval),this.aboutInterval=setInterval(this.aboutViewportChanging,5e3);var a=e.siblings(".active"),s=e.index()+1,n=i.find(".viewport__slide:nth-child("+s+")"),o=i.find(".viewport__slide.active");a.removeClass("active"),e.addClass("active"),o.animate({opacity:"0"},600,function(){o.removeClass("active")}),n.addClass("showing active").animate({opacity:"1"},600,function(){n.removeClass("showing")})}}).initialize()});
function mapInit(){myMap=new ymaps.Map("map",{center:[48.7,44.51],zoom:9})}!function(){if(window.ymaps){ymaps.ready(mapInit)}}();