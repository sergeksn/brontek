"use strict"; //используем современный режим
//ВАЖНО: нужно использовать имеено touchend, т.к. touchstart вызывает ошибки если элементы разположенны близко друг к другу
//ПРИМЕЧАНИЕ: не играет особой роли как обращаться к элементу и его свойствам при большом количестве отераций, при ожидании изменение какого-то параметра элемента например, что через мою ksn библеотеку что через нативный js
//ПРИМЕЧАНИЕ: полезные команды:
//debugger приостановит выполнение скрипта в браузере на паузе можно будет происпектирвоать код
//чтоб избежать мгновенное назначение стилей или классов нужно использовать мою функцию bf.wait в async функции с парметром await
//window.getEventListeners(el) //получить список всех слушателей привязанных к элементу
//!!(выражение) преобразует ответ в true/false
//bf.setCookie("top_baner_hide", true);
//bf.deleteCookie("top_baner_hide");

//ПРИМЕЧАНИЕ: если мы хотим передать в функцию несколько аргументов function name_fu(arg_1, arg_2 = null, arg_3 = [], arg_4, arg_5 = 99) но мы не знаем в каком порядке будут переданы аргументы, или какие-то могут просто не использоваться, для этого можно использовать такую запись function name_fu({arg_1, arg_2 = null, arg_3 = [], arg_4, arg_5 = 99}), это нам даст возможность задавать параметры функции в виде объекта, к примеру мы не хотим задавать вручную аргуметы arg_3 и arg_5, для этого просто делаем так name_fu({arg_1:"data_1",arg_2:"data_2",arg_4:"data_4"}),  этом случае функция возьмёт аргументы соотвествующие ключам в объекте, а те аргумеенты которые не заданы будут взяты из значенйи функции по умолчанию или будут undefined

import "./moduls/media.js";
import "./moduls/overlay.js"; //подложка для поп ап окон и поска с меню
import "./moduls/header.js";
import "./moduls/scroll_to_top.js";
import "./moduls/search.js";
import "./moduls/top_baner.js"; //нужно доделать с учётом поиска и меню
import "./moduls/menu_mobile.js";

//мобильные до 640 px
//планшеты от 641 px до 1000 px
//компьютеры обычные экраны и ноутбуки от 1001 px до 1800 px
//большие экраны компьютеров и телевизоры от 1801 px

// let test = function() {
//     return $("#block_2").check_visible(function(el) {
//         //console.log("GOOD!");
//     }, $("#bg_green_block"), {
//         sensing_distance: {
//             top: 0,
//             right: 0,
//             bottom: 0,
//             left: 0
//         },
//         search_dir: {
//             top: true,
//             right: true,
//             bottom: true,
//             left: true
//         }
//     });
// };



$(document).on("DOMContentLoaded", function() {

    GDS.pageYOffset = window.pageYOffset; //отсуп от верха документа

    //значение для js анимаций по умочанию
    GDS.anim_time = 200;
    GDS.anim_tf = "linear";

    GDS.devise_touch = bf.touch_devise_screen(); //определяем сенсорный экран или нет

    //devise высота и ширина экрана устройства и win окна браузера , обновляем после каждого ресайза
    //ПРИМЕЧАНИЕ: ширина/высота окна браузера не учитывает полосы прокрутки
    GDS.devise_height = window.screen.height;
    GDS.devise_width = window.screen.width;
    GDS.win_height = $(window).height();
    GDS.win_width = $(window).width();

    $(window).on("resize", () => {
        GDS.devise_height = window.screen.height;
        GDS.devise_width = window.screen.width;
        GDS.win_height = $(window).height();
        GDS.win_width = $(window).width();
    });
    //devise высота и ширина экрана устройства и win окна браузера , обновляем после каждого ресайза

    const body = $("body"), //body
        overlay = $("#overlay"), //полупрозрачная бела подложка для всплывающих окон

        //хедер
        header = $("header"), //header
        header_overlay = $("#header_overlay"), //подложка для того чтоб header не перекрывал контент сверху
        //хедер

        //верхнее меню
        shadow_block = $("#shadow_block"), //полоска с теню
        header_menu = $(".header_menu_wrapper"), //верхнее меню
        hidden_header_part = $(".hidden_header_part"), //скрытая часть хедера
        //верхнее меню

        //мобильное меню
        header_burger_button = $(".header_burger_button"), //кнопка бургер меню
        //мобильное меню

        //поиск
        header_search_button = $(".header_search_button"),
        search_wrapper = $(".search_wrapper"),
        search_input = search_wrapper.find("input"),
        close_search_button = search_wrapper.find(".close_search"),
        search_loader = $(".search_loader"),
        results_wrapper = $(".results_wrapper"),
        search_results = $(".search_results");
    //поиск




    //КАРТИНКИ
    GDS.media.load_img_content();
    //КАРТИНКИ

    //HEADER
    GDS.header.init(); //иницализируется 1
    //HEADER

    //КНОПКА ПРОКРУТКИ ВВЕРХ
    GDS.scroll_to_top.init(); //запускает инициализацию модуля кнопки скрола вверх
    //КНОПКА ПРОКРУТКИ ВВЕРХ

    //ОКНО ПОИСКА
    GDS.search.init(); //запускает инициализацию модуля кнопки скрола вверх
    //ОКНО ПОИСКА

    //БАНЕР
    GDS.top_baner.init();
    //БАНЕР

    //МОБИЛЬНОЕ МЕНЮ
    GDS.menu_mobile.init();
    //МОБИЛЬНОЕ МЕНЮ


    //ВЕРХНЕЕ МЕНЮ И БАНЕР






    // //записываем/обновляем значение в данных высорты хедера и его подложки
    // $(window).on("resize", function() {
    //     GDS.header.height = get_header_h();
    //     GDS.header.overlay_height = header_overlay.height();
    // });
    // //записываем/обновляем значение в данных высорты хедера и его подложки














    $("#block_1, #block_2, #block_3").on("click", function() {
        //console.log($(this))
        //$(this).css("left", "100%")
        $(this).animate({
            //"margin-bottom": "-=20%",
            //"width": "+=20px",
            //"margin-top": "100px",
            //"opacity": "0.5"
            "left": "+=10%"
        }, 200, "linear", () => {
            console.log("TEST")
        });
    });


});


















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