"use strict"; //используем современный режим
//ВАЖНО: нужно использовать имеено touchend, т.к. touchstart вызывает ошибки если элементы разположенны близко друг к другу
//ПРИМЕЧАНИЕ: полезные команды:
//debugger приостановит выполнение скрипта в браузере на паузе можно будет происпектирвоать код


//bf.setCookie("top_baner_hide", true);
//bf.deleteCookie("top_baner_hide");


//ВЕРХНЕЕ МЕНЮ И БАНЕР
//скрываем банер при клике на крестик
header = $("header");
header_height = Number(header.css("height").replace("px", "")); //высота блока банера и верхнего меню



let header_menu = $(".header_menu_wrapper"),
    header_menu_height = Number(header_menu.css("height").replace("px", "")),
    top_baner = $(".top_banner_wrap"),
    close_baner_button = top_baner.find(".close_banner");

close_baner_button.on("click tochend", function() {
    let baner_id = top_baner.attr("id"),
        baner_height = top_baner.css("height");
    console.log(baner_height)
    jQuery("header").animate({
        top: "-" + baner_height // ширина элемента
    });
    //bf.setCookie("top_baner_hide_"+baner_id, true);//записываем в куки что верхний банер с таким id не показывать
});
//скрываем банер при клике на крестик

//ВЕРХНЕЕ МЕНЮ И БАНЕР
//
$(window).on("scroll", function() {
    let hide = window.pageYOffset >= (header_height+header_menu_height) ? true : false;

    if(hide){
        header.animate({ "top": "-"+header_height+"px"});
        return;
    }

    header.animate({ "top": "0"});
});


























let header_menu_wrapper = $(".header_menu_wrapper"),
    hidden_header_part = $(".hidden_header_part"),
    header_burger_button = $(".header_burger_button"),
    header_search_button = $(".header_search_button"),
    search_wrapper = $(".search_wrapper"),
    search_input = $(".search_input"),
    close_search = $(".close_search");


//открываем и закрывам меню по клику на бургер кнопку
header_burger_button.on("click tochend", function() {
    header_menu_wrapper.toggleClass("active");
    setTimeout(function() {
        header_menu_wrapper.toggleClass("test");
    }, 10);

});
//открываем и закрывам меню по клику на бургер кнопку

//клик по кнопке поиска в меню
header_search_button.on("click tochend", function() {
    if (!search_wrapper.hasClass("active")) {
        search_wrapper.addClass("active"); //открываем блок с полемм ввода для поиска
        hidden_header_part.addClass("show"); //открываем блок с полемм ввода для поиска
        search_input.find("input").focus(); //ставим курсор на наше поле ввода
    } else {
        hidden_header_part.removeClass("show"); //открываем блок с полемм ввода для поиска
        setTimeout(function() {
            search_wrapper.removeClass("active"); //открываем блок с полемм ввода для поиска
        }, 200);
    }

});
//клик по кнопке поиска в меню


//клик по крестику в окне поска
close_search.on("click tochend", function() {
    let input = search_wrapper.find("input");
    //если в поле введён текст
    if (search_wrapper.find("input")[0].value.length > 0) {
        input[0].value = null; //удаляем этот текст
        input.removeClass("nachat_vvod"); //убираем клас
    }
    //если в поле введён текст

    //если в поле нет текста
    else {
        search_wrapper.removeClass("active"); //скрываем окно с полем ввода для поиска
    }
    //если в поле нет текста
});
//клик по крестику в окне поска

//меняем цвет текста и границ после начала ввода
search_wrapper.find("input")[0].oninput = function() {
    let input = search_wrapper.find("input");
    this.value.length > 0 ? input.addClass("nachat_vvod") : input.removeClass("nachat_vvod");
}
//меняем цвет текста и границ после начала ввода



// создадим элемент с прокруткой
let div = document.createElement('div');

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';

// мы должны вставить элемент в документ, иначе размеры будут равны 0
document.body.append(div);
let scrollWidth = div.offsetWidth - div.clientWidth;

div.remove();

//console.log(scrollWidth)


function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
};

//console.log(getScrollBarWidth())









/*
let header_menu_wrapper = $(".header_menu_wrapper"),
    hidden_header_part = $(".hidden_header_part"),
    header_burger_button = $(".header_burger_button"),
    header_search_button = $(".header_search_button"),
    search_wrapper = $(".search_wrapper"),
    search_input = $(".search_input"),
    close_search = $(".close_search");

//открываем и закрывам меню по клику на бургер кнопку
header_burger_button.on("click tochend", function(e) {
    e.preventDefault();
    header_menu_wrapper.toggleClass("active");
    setTimeout(function(){
        header_menu_wrapper.toggleClass("test");
    },10);
    
});
//открываем и закрывам меню по клику на бургер кнопку

//клик по кнопке поиска в меню
header_search_button.on("click tochend", function(e) {
    e.preventDefault();

    if(!search_wrapper.hasClass("active")){
        search_wrapper.addClass("active"); //открываем блок с полемм ввода для поиска
        hidden_header_part.addClass("show"); //открываем блок с полемм ввода для поиска
        search_input.find("input").focus(); //ставим курсор на наше поле ввода
    } else {
        hidden_header_part.removeClass("show"); //открываем блок с полемм ввода для поиска
        setTimeout(function(){
            search_wrapper.removeClass("active"); //открываем блок с полемм ввода для поиска
        },200);
    }
    
});
//клик по кнопке поиска в меню

//клик по крестику в окне поска
close_search.on("click tochend", function(e) {
    e.preventDefault();
    let input = search_wrapper.find("input");
    //если в поле введён текст
    if (search_wrapper.find("input")[0].value.length > 0) {
        input[0].value = null; //удаляем этот текст
        input.removeClass("nachat_vvod"); //убираем клас
    }
    //если в поле введён текст

    //если в поле нет текста
    else {
        search_wrapper.removeClass("active"); //скрываем окно с полем ввода для поиска
    }
    //если в поле нет текста
});
//клик по крестику в окне поска

//меняем цвет текста и границ после начала ввода
search_wrapper.find("input")[0].oninput = function() {
    let input = search_wrapper.find("input");
    this.value.length > 0 ? input.addClass("nachat_vvod") : input.removeClass("nachat_vvod");
}
//меняем цвет текста и границ после начала ввода


//подгоняем ширину окна ввода для поиска под размер блока с меню
function search_width() {
    let win_w = $(window).width(),
        menu_w = $(".top_menu>ul").width(),
        search_block = $(".search_input");
    if (1250 > win_w && win_w > 630) {
        search_block.width(menu_w - 40);
    } else {
        search_block.removeAttr("style");
    }
}

search_width();

$(window).resize(function() {
    search_width();
    header_menu_wrapper.removeClass("active");
});
//подгоняем ширину окна ввода для поиска под размер блока с меню

//для мобильных подстраиваем синию декорацию в футоре по высоте
function footer_decoration_modification_on_mobile() {
    let win_width = $(window).width(),
        foter_decoration = $("footer .foter_decoration");
    if (win_width >= 576) {
        foter_decoration.height("");
        return;
    }
    let first_footer_item = $("footer .footer_item").first(),
        h_first_footer_item = first_footer_item.height();
    foter_decoration.height(h_first_footer_item + 55 + 25);
}

footer_decoration_modification_on_mobile();
$(window).resize(function() {
    footer_decoration_modification_on_mobile();
});
//для мобильных подстраиваем синию декорацию в футоре по высоте


//слайдер марок авто на главной странице сверху
let block_marok = $(".select_marka"),
    button_arrow_swipe = $(".arrow_select_marka");

    button_arrow_swipe.on("click tochend", function(e){
        e.preventDefault();
    })
//слайдер марок авто на главной странице сверху
*/