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

$(document).on("DOMContentLoaded", function() {

    //КАРТИНКИ
    let img_content = $("img[data-type='img_content']");

    img_content.each(function() {
        let img = $(this),
            data_src = img.attr("data-src");
        img.attr("src", data_src);
    });

    img_content.on("load", function() {
        $(this).addClass("loaded");
    });
    //КАРТИНКИ

    //ВЕРХНЕЕ МЕНЮ И БАНЕР
    let header = $("header"), //header
        header_overlay = $("#header_overlay"), //подложка для того чтоб header не перекрывал контент сверху
        header_height = Number(header.css("height").replace("px", "")), //высота блока банера и верхнего меню
        header_menu = $(".header_menu_wrapper"), //верхнее меню
        top_baner = $(".top_banner_wrap"); //верхний банер если нашли


    let click_baner_fu = async function() {

        data_site.toggle_header_lock = true; //блокируем сворачивание/разворачивание хедера

        let baner_id = top_baner.attr("id"),
            baner_height = Number(top_baner.css("height").replace("px", "")), //высота блока банера
            header_overlay_height = header_height - baner_height; //высота для подложки хедера

        header.animate({ "top": "-" + baner_height + "px" }, 200); //поднимаем хедер чтоб скрыть банер за пределами видимой части экрана
        header_overlay.animate({ "height": header_overlay_height + "px" }, 200, "linear", function() {
            top_baner.css("display", "none"); //скрываем банер из документа
            header.css("top", "0") //попутно быстро меняем верхнюю позицию для хедера сразу после удаленяи банера
            data_site.toggle_header_lock = false; //разрешаем сворачивание/разворачивание хедера
        }); //плавно поднимаем подложку хедера и после того как анимация закончится вызываем колбек


        //await bf.wait(() => header_overlay.css("height"), header_overlay_height + "px"); //дожидаемся пока у элемента header_overlay высота закончит анимацию до значения header_overlay_height

        //await bf.wait(() => header.css("top"), "0px"); //ждём пока у хедера значение top стонет равным 0px

        //bf.setCookie("top_baner_hide_" + baner_id, true); //записываем в куки что верхний банер с таким id не показывать

    };

    //если есть банер
    if (top_baner.length > 0) {
        let close_baner_button = top_baner.find(".close_banner_wrap"); //кнопка-крестик закрытия банера

        //скрываем банер при клике на крестик
        close_baner_button.on("click touchend", click_baner_fu);
        //скрываем банер при клике на крестик
    }
    //если есть банер
    //bf.deleteCookie("top_baner_hide_id_NKkGUF0X9DGuvct")

    //скрываем/показываем header при скроле или ресайзе
    function toggle_header_show() {

        if (data_site.toggle_header_lock) return; //проверяем разрешено ли сворачимать/разворачивать хедер

        //если скролим вверх
        if (data_site.pageYOffset > window.pageYOffset) {
            //header.css("top", "0");
            header.animate({ "top": "0px" }, 200);
            return;
        }
        //если скролим вверх

        let hide = window.pageYOffset >= (Number(header.css("height").replace("px", "")) + Number(header_menu.css("height").replace("px", ""))) ? true : false; //при скроле ВНИЗ проверяем на сколько мы проскролили от верху страницы
        hide ? header.animate({ "top": "-" + header.css("height") }, 200) : header.animate({ "top": "0px" }, 200);
    }
    //скрываем/показываем header при скроле или ресайзе






    $(window).on("load", function() {
        //задержка чтоб в момент загрузки страницы не срабатывало событие scroll
        setTimeout(() => {
            $(window).on("scroll resize", function() {
                toggle_header_show(); //скрываем/показываем header при скроле или ресайзе
                data_site.pageYOffset = window.pageYOffset; //обновляем данные о текущем отступе от верха страницы до верха окна браузера
            }); //скрываем/показываем header при скроле или ресайзе

            $(window).on("resize", function() { header_overlay.css("height", header.css("height")) }); //при изменении размера экрана пересчитываем новую высоту подкладки хедера
        }, 100)
        //задержка чтоб в момент загрузки страницы не срабатывало событие scroll
    })







    let header_burger_button = $(".header_burger_button");
    //открываем и закрывам меню по клику на бургер кнопку
    header_burger_button.on("click tochend", function() {
        header_menu_wrapper.toggleClass("active");

    });
    //открываем и закрывам меню по клику на бургер кнопку
    //ВЕРХНЕЕ МЕНЮ И БАНЕР

    /*swipe(top_baner, {}, {
        success: function() {
            console.log("GOOD");
            //click_baner_fu()
        },
        fail: function() {
            top_baner.find("a")[0].click();
        }
    });*/

    /*    let swipe_baner = function() {
            console.log(123)
            //top_baner.animate({ "left": "100%" });
            //click_baner_fu()
        }

        top_baner.on("swipe", swipe_baner, {}, {
            left: 0,
            min_percent_dist_x: 20,
            //делаем переход по сслке если это не свайп
            callback_move: function() {
                let el = $(this.el),
                    sdvig_x = this.x - this.start_x,
                    sdvig_y = this.y - this.start_y;

                if (this.start_direction) {
                    switch (this.start_direction) {
                        case "left":
                            el.css(this.start_direction, sdvig_x + "px");
                            break;
                        case "right":
                            el.css(this.start_direction, "-" + sdvig_x + "px");
                            break;
                        case "bottom":
                            el.css(this.start_direction, "-" + sdvig_y + "px");
                            break;
                        case "top":
                            el.css(this.start_direction, sdvig_y + "px");
                            break;
                    }
                }
                //console.log(Math.abs(this.x - this.start_x))
                //console.log(Math.abs(this.y - this.start_y))

                //el.css("left", (this.left + sdvig) + "px")
            },
            callback_fail: function() {
                let el = $(this.el),
                    dir = this.start_direction;

                console.log(dir)
                el.css(dir, "0");
                //el.animate({ dir: "0" });
                setTimeout(() => {
                    el.css("transition", "")
                }, 300)

            },
            callback_finally: function() {
                if ($(this.finall_target_el)[0] === top_baner.find(".close_banner_wrap")[0] || $(this.finall_target_el).parents(".close_banner_wrap").length > 0) return; //если свайп завершился на крестике банера или на его оболочке или на любом из его элементов

                //только при малом смещении или при отсутствии смещения вовсе
                if (Math.abs(this.x - this.start_x) <= 10 || this.x === 0) {
                    let el = $(this.el),
                        a = el.find("a"),
                        href = a.attr("href");
                    document.location.href = href
                }
            }
        });*/









    $("#block_1, #block_2, #block_3").on("click", function() {
        //console.log($(this))
        //$(this).css("left", "100%")
        $(this).animate({
            "margin-bottom": "-=20%",
            "width": "+=20px",
            "margin-top": "100px",
            "opacity": "0.5"
        }, 700, "bow-shot", () => {
            console.log("TEST")
        });
    });














    /*    let swipe_block = function() {
            $(this).css("background-color", "white")
        };

        $("#block_1, #block_2, #block_3").on("swipe", swipe_block, {}, {
            left: 0,
            min_percent_dist_x: 20,
            permission_directions: {
                right: true,
                left: true
            },
            //делаем переход по сслке если это не свайп
            callback_move: function() {
                //console.log(this)
                let el = $(this.el),
                    sdvig_x = this.x - this.start_x,
                    sdvig_y = this.y - this.start_y;

                //el.css("left", sdvig_x + "px")


            },
            callback_finally: function() {
                let el = $(this.el);
    console.log(this)
                el.css("transition", "left 2s linear")
                el.css("left", "0px")

                setTimeout(() => {
                    el.css("transition", "")
                }, 2200)
            }
        });*/

    /*setTimeout(() => {
        console.log("OFF")
         top_baner.off("swipe", swipe_baner);
    }, 5000)*/


    //ВАЖНО: сделать отдельно событие свайпа и функцию савайпа
    //событие свайпа будет просто определять был свайп или нет
    //а функция свайпа будет перемещать блок ,на котором вызвана, за курсором мышки или пальцем, в ту сторону в которую сначало потянем



    /*    top_baner.on("mousedown touchstart", function(e) {
            e.preventDefault();
            $(e.target).on("click", rem_def, { passive: false });
        }, { passive: false });

        top_baner.on("mouseup touchend", function(e) {
            setTimeout(()=>{
                $(e.target).off("click", rem_def);
            },100)
            
        });*/
    //top_baner.on("mousedown touchstart", test_def, { passive: true });
});












//ВАЖНО: при клике на иконку поиска на мобильных не нужно делать фокус на инпуте !!!






let header_menu_wrapper = $(".header_menu_wrapper"),
    hidden_header_part = $(".hidden_header_part"),
    header_burger_button = $(".header_burger_button"),
    header_search_button = $(".header_search_button"),
    search_wrapper = $(".search_wrapper"),
    search_input = $(".search_input"),
    close_search = $(".close_search");




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
