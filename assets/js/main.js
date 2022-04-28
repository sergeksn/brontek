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

let test = function() {
    return $("#block_2").check_visible(function(el) {
        //console.log("GOOD!");
    }, $("#bg_green_block"), {
        sensing_distance: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        search_dir: {
            top: true,
            right: true,
            bottom: true,
            left: true
        }
    });
};

$(window).on("scroll", () => {
    //test() ? console.log("YES") : console.log("NO");
});

$(document).on("DOMContentLoaded", function() {

    let body = $("body"); //body

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

    //КАРТИНКИ

    let load_img_content = function() {
        let img_content = $("img[data-type='img_content']");

        img_content.each(function() {
            let img = $(this),
                data_src = img.attr("data-src");
            img.attr("src", data_src);
        });

        img_content.on("load", function() {
            $(this).addClass("loaded");
        });
    };

    load_img_content();




    //загружаем и отображаем картики з блока в котором выводится картинка товара со всеми наложенными svg деталями
    let load_img_prevu_product = function() {
        $(".product_prevu_img_block.start_load").each(function() {
            let wrapper = $(this), //текущая оболочка картинок
                all_promise = []; //сюда записываем все промисы содержащие загрузку каждой картинки

            //перебираем все картинки в этом блоке
            wrapper.find("img").each(function() {
                let img = $(this);
                img.attr("src", img.attr("data-src"));
                let load_prom = new Promise((resolve) => img.on("load error", () => resolve())); //создаём просмис который выполнится после загрузки картинки
                all_promise.push(load_prom); //записываем в масиив с промисами для данного блока
            });
            //перебираем все картинки в этом блоке

            Promise.all(all_promise).then(() => wrapper.removeClass("start_load").addClass("loaded")); //когда все промисы выполнятся, т.е. все картинки в блоке загрузятся то мы показываем блок
        });
    };
    //загружаем и отображаем картики з блока в котором выводится картинка товара со всеми наложенными svg деталями
    //КАРТИНКИ

    //ВЕРХНЕЕ МЕНЮ И БАНЕР

    let header = $("header"), //header
        header_overlay = $("#header_overlay"), //подложка для того чтоб header не перекрывал контент сверху
        overlay = $("#overlay"), //полупрозрачная бела подложка для всплывающих окон
        shadow_block = $("#shadow_block"), //полоска с теню
        header_menu = $(".header_menu_wrapper"), //верхнее меню
        hidden_header_part = $(".hidden_header_part"); //скрытая часть хедера

    GDS.header = {}; //создаём данные для хранение записей хедера
    GDS.header.toggle = true; //разрешаем сворачивание/разворачивание хедера

    //функция получае нужные высоты в хедере
    let get_header_h = function() {
        let top_banner_wrap = $(".top_banner_wrap"),
            header_menu_wrapper_h = $(".header_menu_wrapper").height(),
            top_banner_wrap_h = top_banner_wrap.length > 0 ? top_banner_wrap.height() : 0;

        return header_menu_wrapper_h + top_banner_wrap_h;

    }
    //функция получае нужные высоты в хедере

    //скрываем/показываем подложку для сплывающих окон
    let toggle_overlay = function() {
        return new Promise((resolve) => {
            //если подложка скрыта показываем её
            if (!overlay.hasClass("show")) {
                overlay.addClass("show");
                overlay.animate({ "opacity": "0.8" }, GDS.anim_time, GDS.anim_tf, function() {
                    resolve();
                });
            }

            //если подложка показана скрываем её
            else {
                overlay.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf, () => {
                    overlay.removeClass("show");
                    resolve();
                });
            }
        });
    }
    //скрываем/показываем подложку для сплывающих окон

    //записываем/обновляем значение в данных высорты хедера и его подложки
    GDS.header.height = get_header_h();
    GDS.header.overlay_height = header_overlay.height();

    $(window).on("resize", function() {
        GDS.header.height = get_header_h();
        GDS.header.overlay_height = header_overlay.height();
    });
    //записываем/обновляем значение в данных высорты хедера и его подложки

    //
    //
    //ВЕРХНЕЕ МЕНЮ
    //
    //
    //после загрузки страницы подключем слушатели для хедера чтоб из бежать ложного срабатывания в момент дёрграния высоты страницы при загрузке
    $(window).on("load", function() {
        //скрываем/показываем header при скроле или ресайзе
        $(window).on("scroll resize", function() {
            if (!GDS.header.toggle) return; //проверяем разрешено ли сворачивать/разворачивать хедер

            //если скролим вверх
            if (GDS.pageYOffset > window.pageYOffset) {
                header.animate({ "top": "0px" }, GDS.anim_time);
            }
            //если скролим вверх

            //если скролим вниз
            else {
                let hide = window.pageYOffset >= GDS.header.height ? true : false; //при скроле ВНИЗ проверяем на сколько мы проскролили от верху страницы

                if (hide) { header.animate({ "top": "-" + GDS.header.height + "px" }, GDS.anim_time) } //скрываем/показываем header при скроле или ресайзе
            }
            //если скролим вниз

            GDS.pageYOffset = window.pageYOffset; //обновляем данные о текущем отступе от верха страницы до верха окна браузера
        });
        //скрываем/показываем header при скроле или ресайзе

        $(window).on("resize", function() { header_overlay.css("height", header.css("height")) }); //при изменении размера экрана пересчитываем новую высоту подкладки хедера
    })
    //после загрузки страницы подключем слушатели для хедера чтоб из бежать ложного срабатывания в момент дёрграния высоты страницы при загрузке


    //
    //МОБИЛЬНОЕ МЕНЮ
    //
    let header_burger_button = $(".header_burger_button"); //кнопка бургер меню
    GDS.header.hidden_header_block = hidden_header_part.height(); //записываем высоту скррытого блока меню
    $(window).on("resize", function() { GDS.header.hidden_header_block = hidden_header_part.height() }); //пересчитываем новые высоты при каждом ресайзе


    //открываем меню
    let open_menu_mobile = function() {

            if (header_menu.hasClass("open_menu")) return false; //если меню уже открыто завершаем функцию

            header_menu.addClass("open_menu"); //помечаем меню как открытое

            body.toggleClass("scroll_lock"); //блокируем прокурутку документа

            //если высота скрытого блока меню вместе с высотой хедера меньше чем высота экрана устройства
            if (GDS.devise_height - (GDS.header.height + GDS.header.hidden_header_block) <= 0) {
                header.animate({ "height": GDS.devise_height + "px" }, GDS.anim_time, GDS.anim_tf, function() {
                    header.css({ "overflow-y": "scroll" });
                }); //разворачиваем меню на высоту блока
            }
            //если высота скрытого блока меню вместе с высотой хедера меньше чем высота экрана устройства

            //если высота скрытого блока меню вместе с высотой хедера больше (или равна) чем высота экрана устройства
            hidden_header_part.animate({ "bottom": "-" + GDS.header.hidden_header_block + "px" }, GDS.anim_time, GDS.anim_tf); //разворачиваем меню на высоту блока

            toggle_overlay(); //показываем подложку
            return true;
        },
        //открываем меню

        //закрываем меню
        close_menu_mobile = function() {
            if (!header_menu.hasClass("open_menu")) return false; //если меню уже закрыто завершаем функцию

            header.animate({ "height": GDS.header.height + "px" }, GDS.anim_time, GDS.anim_tf, function() {
                header.css({ "overflow-y": "revert", "height": "revert" }); //убираем блокировку прокрутки документа
            });

            //сворачиваем меню
            hidden_header_part.animate({ "bottom": "0px" }, GDS.anim_time, GDS.anim_tf, function() {
                header_menu.removeClass("open_menu"); //убираем пометку открытого меню
            });
            //сворачиваем меню

            body.toggleClass("scroll_lock"); //убираем блокировку прокрутки документа

            toggle_overlay(); //скрываем подложку
            return true;
        }
    //закрываем меню

    //открываем и закрывам меню по клику на бургер кнопку
    header_burger_button.on("click tochend", function() {
        if (!open_menu_mobile()) { //выполнится если меню закрыто
            close_menu_mobile(); //выполнится если меню открыто
        }
    });
    //открываем и закрывам меню по клику на бургер кнопку

    //при ресайзах скрываем мобильное меню и чистим все стити его открытия
    $(window).on("resize", function() {
        close_menu_mobile(); //закрываем меню
    });
    //при ресайзах скрываем мобильное меню и чистим все стити его открытия
    //
    //МОБИЛЬНОЕ МЕНЮ
    //
    //
















    //
    //
    //ОКНО ПОИСКА
    //
    //

    //ВАЖНО: при клике на иконку поиска на мобильных не нужно делать фокус на инпуте !!!

    let header_search_button = $(".header_search_button"),
        search_wrapper = $(".search_wrapper"),
        search_input = $(".search_input"),
        close_search_button = $(".close_search"),
        search_loader = $(".search_loader"),
        results_wrapper = $(".results_wrapper"),
        search_results = $(".search_results");



    //хранит в себе все функции необходимые для функционирования поиска
    let search = GDS.search = {
        open_button_enable: true, //разрешаем открытие окна поиска , нужно чтоб избежать ложных многократных нажатий пока все функции открытия или закрытия окна поиска не выполнятся

        cached_result: null, //сохранеям в данный объект результаты последнего поиска чтоб можно было их быстро использовать для повторного открытия окна поиска если не было очищщено поле ввода

        //открываем окно поиска с полем ввода
        open: function() {
            return new Promise(async (resolve, reject) => {
                if (header_menu.hasClass("open_search") || GDS.search.open_button_enable === false) return reject("вызвано открытие окна поиска когда оно уже открыто"); //если окно поиска уже открыто или запрещено его открыти/закрытие то завершаем промис неудачей

                GDS.search.open_button_enable = false; //блокируем открыти/закрытие окна поиска
                GDS.header.toggle = false; //блокируем сворачивание/разворачивание хедера

                header_menu.addClass("open_search"); //помечаем что блок с поиском открыт

                hidden_header_part.css("height", hidden_header_part.height() + "px"); //явно задаём высоту скрытому блоку

                hidden_header_part.animate({ "top": header_menu.height() + "px" }, GDS.anim_time, GDS.anim_tf); //опускаем весь скрытый блок

                await toggle_overlay(); //скрываем подложку и ждём завершения её сворачивания

                if (!GDS.devise_touch) { search_input.find("input").focus(); }; //ставим курсор на наше поле ввода НЕ на сенсорных экранах

                GDS.search.open_button_enable = true; //разблокируем открыти/закрытие окна поиска

                resolve(); //промис успешно выполнен окно поиска открыто
            });
        },
        //открываем окно поиска с полем ввода

        //закрываем окно поиска с полем ввода
        close: function() {
            return new Promise(async (resolve, reject) => {
                if (!header_menu.hasClass("open_search") || GDS.search.open_button_enable === false) return reject("вызвано закрытие окна поиска когда оно уже закрыто"); //если окно поиска закрыто или запрещено его открыти/закрытие то завершаем промис неудачей

                await this.close_results_block().catch(() => {}); //на всякий случай запускаем команду закрытия окна с результатами поиска

                GDS.search.open_button_enable = false; //блокируем открыти/закрытие окна поиска

                //уменьшаем высоту скрытого блока и плавно скрываем окно поиска дожидаемся окончания анимации
                await hidden_header_part.animate({
                    "height": "0px",
                    "top": "-" + (search_wrapper.outerHeight() - header_menu.height()) + "px"
                }, GDS.anim_time, GDS.anim_tf);
                //уменьшаем высоту скрытого блока и плавно скрываем окно поиска

                hidden_header_part.css("height", ""); //убираем у него явно заданную высоту анимации

                header_menu.removeClass("open_search"); //помечаем что блок с поиском закрыт

                await toggle_overlay(); //скрываем подложку и ждём завершения её сворачивания

                GDS.header.toggle = true; //блокируем сворачивание/разворачивание хедера

                GDS.search.open_button_enable = true; //разблокируем открыти/закрытие окна поиска

                this.clean_search_events(); //удаляем все слушатели которые были нужны при открытом окне поиска

                resolve(); //промис успешно выполнен окно поиска закрыто
            });
        },
        //закрываем окно поиска с полем ввода

        //открываем окно для отображения результатов поиска
        open_results_block: function() {
            return new Promise(async (resolve, reject) => {
                if (search_results.hasClass("open")) return reject("вызвано открытие окна вывода результатов поиска когда оно уже открыто"); //если окно с результатами поиска уже открыто то завершаем промис неудачей

                let search_results_block_height = GDS.devise_height - search_results[0].getBoundingClientRect().top; //получаем растояние от верха экрана до верха блока для отображение результатов поиска и получаем высоту которую дожен будет занять блок чтоб покрыть всю высоту экрана

                await $().animate([{
                    "elements": search_results,
                    "height": search_results_block_height + "px" //опускаем блок с результатами поиска до низа окна бразуера
                }, {
                    "elements": hidden_header_part,
                    "height": "+=" + search_results_block_height + "px" //опускаем скрытый блок до низа окна бразуера
                }], GDS.anim_time, GDS.anim_tf);

                search_loader.animate({ "opacity": "1" }, GDS.anim_time, GDS.anim_tf); //показываем лоадер после откытия блока с результатами поиска

                body.toggleClass("scroll_lock"); //блокируем прокурутку документа

                shadow_block.toggleClass("hide"); //скрываем полосу чтоб она не перекрывала контент

                //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа
                header.css({
                    "overflow-y": "scroll",
                    "overflow-x": "hidden", //нужно для скрола банера без горизонтальной полосы прокрутки
                    "height": GDS.devise_height + "px"
                });
                //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа

                search_results.addClass("open"); //помечаем что блок с результатами поиска открыт

                resolve(); //промис успешно выполнен окно с результатами поиска открыто
            });
        },
        //открываем окно для отображения результатов поиска

        //закрываем окно для отображения результатов поиска
        close_results_block: function() {
            return new Promise(async (resolve, reject) => {
                if (!search_results.hasClass("open")) return reject("вызвано закрытие окна вывода результатов поиска когда оно уже закрыто"); //если окно с результатами поиска закрыто то завершаем промис неудачей

                //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа
                header.css({
                    "overflow-y": "",
                    "overflow-x": "", //нужно для скрола банера без горизонтальной полосы прокрутки
                    "height": ""
                });
                //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа

                body.toggleClass("scroll_lock"); //включаем прокурутку документа

                shadow_block.toggleClass("hide"); //делаем полосу с теню видимой

                let input = search_wrapper.find("input"); //поле ввода поиска

                input.removeClass("nachat_vvod"); //убираем клас уведомляющий о том что поле заполнено текстом поиска

                input[0].value = ""; //удаляем содержимое инпута для поиска

                //если результаты поиска пусты и ещё не заполнены ни чем
                if (results_wrapper[0].innerHTML === "") {
                    await search_loader.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //плавно скрываем лоадер
                }
                //если результаты поиска пусты и ещё не заполнены ни чем

                //если есть какие-то отображённые результаты поиска
                else {
                    search_loader.css("opacity", "0"); //скрываем лоадер

                    await results_wrapper.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //дожидаемся пока станет прозрачным блок с результатами поиска

                    results_wrapper[0].innerHTML = ""; //очищаем содержимое блока с результатами поиска
                }
                //если есть какие-то отображённые результаты поиска

                await $().animate([{
                    "elements": search_results,
                    "height": "0px" //уменьшаем высоту блок с результатами поиска для его скрытия
                }, {
                    "elements": hidden_header_part,
                    "height": search_wrapper.outerHeight() + "px" //уменьшаем высоту скрытого блока
                }], GDS.anim_time, GDS.anim_tf);

                search_results.removeClass("open"); //убираем пометку об открытом блоке с результатами поиска

                resolve(); //промис успешно выполнен окно с результатами поиска закрыто
            });
        },
        //закрываем окно для отображения результатов поиска

        //начинает асинхранную задачу по поиску и возвращает результат
        load_results: function(search_text) {
            return bf.request_to_server({
                "action": "search",
                "text": search_text
            }, "/ajax.php");
        },
        //начинает асинхранную задачу по поиску и возвращает результат

        //раскрываем окно с результатами поиска и отображает результаты поиска в блоке для результатов
        render_results: async function(search_text) {

            bf.setCookie("search_data", search_text, { expires: "Tue, 19 Jan 2099 03:14:07 GMT" });

            await this.open_results_block().catch(() => {}); //откроет блок для вывода результатов поиска если он ещё не был открыт

            //если мы уже ищем не первый раз то блок с результатами поиска нужно очистить перед выводом новых результатов
            if (results_wrapper[0].innerHTML !== "") {
                await results_wrapper.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //дожидаемся пока результаты поиска станут прозрачными

                results_wrapper[0].innerHTML = ""; //удаляем всё содержимое блока с результатами поиска

                search_loader.animate({ "opacity": "1" }, GDS.anim_time, GDS.anim_tf); //показываем лоадер
            }
            //если мы уже ищем не первый раз то блок с результатами поиска нужно очистить перед выводом новых результатов

            //ищем search_text - текст ввежёный в поле поиска в базе, после того как получили ответ выводим его на экран
            this.load_results(search_text).then(async (data) => {

                await search_loader.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //дожидаемся скрытия лоадера

                results_wrapper[0].innerHTML += data.response; //записываем результаты в блок с результатами поиска

                this.cached_result = data.response; //сохранеям результаты поиска

                await results_wrapper.animate({ "opacity": "1" }, GDS.anim_time, GDS.anim_tf); //плавно показываем блок с результатами

                this.start_load_img_in_search_result(); //загружаем картинки из результатов поиска
            }).catch((error) => console.log(error));
            //ищем search_text - текст ввежёный в поле поиска в базе, после того как получили ответ выводим его на экран
        },
        //раскрываем окно с результатами поиска и отображает результаты поиска в блоке для результатов

        //запускаем процесс загрузки картинок
        start_load_img_in_search_result: function() {
            //если результаты поиска дали хотяб один ответ
            if ($(".results_wrapper .product_prevu_img_block").length > 0) {
                this.load_img(); //загружаем уже частично видимые картинки
                header.on("scroll", this.load_img); //добавляем слушатель чтоб при скроле хедера загружались картинки из результатов поиска
            }
            //если результаты поиска дали хотяб один ответ
        },
        //запускаем процесс загрузки картинок

        //загружает только те картинки из результатов поиска до которых пользователь доскролил или которые стали видны в момент загрузки резаультатов
        load_img: function() {
            let images_search = $(".results_wrapper .product_prevu_img_block:not(.start_load):not(.loaded)"); //все блоки картинок из результатов поиска которе ещё не загружены и не начали загрузку

            //находим все блоки с картинками которые не загружены и ещё не начали загрузку и проверяем находятся ли они в границах окна браущера по вертикали, если находятяс выполянем для каждой найденой калбек
            images_search.check_visible((img_block) => {
                $(img_block).addClass("start_load"); //помечаем что блок с картинками начал загрузку
                load_img_prevu_product(); //начинаем загружать картинки из всех блоков product_prevu_img_block с пометкой начавшейся загрузки start_load
            }, $(window), {
                search_dir: {
                    top: true,
                    bottom: true
                }
            });
            //находим все блоки с картинками которые не загружены и ещё не начали загрузку и проверяем находятся ли они в границах окна браущера по вертикали, если находятяс выполянем для каждой найденой калбек

            if (images_search.length === 0) header.off("scroll", search.load_img); //как только все блоки картинок загрузились можно удалить слушатель загрузки картинок при скроле
        },
        //загружает только те картинки из результатов поиска до которых пользователь доскролил или которые стали видны в момент загрузки резаультатов

        //удаляет слушатели события которые нужны только при открытом окне поиска
        clean_search_events: function() {
            header.off("scroll", this.load_img); //отключаем слушатель с хедера который загружал картинки в результатах поиска
        }
        //удаляет слушатели события которые нужны только при открытом окне поиска
    };
    //хранит в себе все функции необходимые для функционирования поиска

    $(window).on("resize", () => search.close().catch(() => {})); //при ресайзе полностью закрываем поиск

    //клик по кнопке поиска в меню
    header_search_button.on("click tochend", function() {
        //если окно поиска закрыто откроет его, если оно уже открыто перейдёт к выполению блока catch
        search.open().catch(() => {
            //удаляем результаты поиска и закрываем его окно с результатами поиска если оно открыто, если оно закрыто закрываем окно поиска
            search.close_results_block().catch(() => {
                search.close().catch(() => {}); //закрываем окно поиска
            });
        });
        //если окно поиска закрыто откроет его, если оно уже открыто перейдёт к выполению блока catch
    });
    //клик по кнопке поиска в меню

    //скрываем окно поиска по клику на полупрозрачную подложку
    overlay.on("click tochend", () => search.close().catch(() => {})); //выполнится если окно поиска открыто
    //скрываем окно поиска по клику на полупрозрачную подложку

    //клик по крестику в окне поиска
    close_search_button.on("click tochend", function() {
        //если в поле введён текст сначало закрываем окно с результатами поиска, если текста нет следовательно закрыт блок с результатами поиска закрываем само окно поиска
        search.close_results_block().catch(() => {
            search.close().catch(() => {}); //закрываем окно поиска
        });
    });
    //клик по крестику в окне поиска

    //начинаем поиск после ввода символов
    search_wrapper.find("input")[0].oninput = function() {
        let input = search_wrapper.find("input"); //поле ввода для поиска

        input[0].value.length > 0 ? input.addClass("nachat_vvod") : input.removeClass("nachat_vvod"); //если введён хотяб один символ в поле поиска

        clearTimeout(GDS.search.input_timerid); //удаляем таймер

        //создаём таймер задержки ввода
        GDS.search.input_timerid = setTimeout(function() {

            //если ввели 2 и блоее символов начинаем поиск
            if (input[0].value.length > 1) {
                search.render_results(input[0].value); //начинаем поиск
            }
            //если ввели 2 и блоее символов начинаем поиск

            //если количество символов удалили до нуля то сворачиваем блок с результатами поиска
            if (input[0].value.length === 0) {
                search.close_results_block().catch(() => {}); //удаляем результаты поиска и закрываем его окно
            }
            //если количество символов удалили до нуля то сворачиваем блок с результатами поиска
        }, 500);
        //создаём таймер задержки ввода
    }
    //начинаем поиск после ввода символов
    //
    //
    //ОКНО ПОИСКА
    //
    //



    //
    //
    //ВЕРХНЕЕ МЕНЮ
    //
    //

    //
    //
    //БАНЕР
    //
    //
    let top_baner = $(".top_banner_wrap"), //верхний банер если нашли
        close_baner_button = top_baner.find(".close_banner_wrap"), //кнопка-крестик закрытия банера

        //скрываем банер
        //cookie - указывает скрывать банер без каписи в куки или с записью
        hide_baner = async function(cookie = false) {
            GDS.header.toggle = false; //блокируем сворачивание/разворачивание хедера

            let baner_id = top_baner.attr("id"),
                baner_height = top_baner.height(), //высота блока банера
                header_overlay_height = GDS.header.height - baner_height; //высота для подложки хедера


            //если меню открыто то нужно перед скрытием банера увеличить высоту хедера чтоб не было прыжка
            //если открыт поиск с результатами то при скрытии банера нужно будет увеличить высоту блока поиска
            if (header_menu.hasClass("open_menu") || search_results.hasClass("open")) {
                header.css("height", header.height() + baner_height + "px");
            }

            await Promise.all([
                header.animate({ "top": "-" + baner_height + "px" }, GDS.anim_time, GDS.anim_tf), //поднимаем хедер чтоб скрыть банер за пределами видимой части экрана
                header_overlay.animate({ "height": header_overlay_height + "px" }, GDS.anim_time, GDS.anim_tf) //плавно поднимаем подложку хедера и после того как анимация закончится вызываем колбек
            ]);

            //если меню открыто то после завершения анимация скрывания банера нужно вернуть нормальную высоту хедера
            //если открыт поиск с результатами то при скрытии банера нужно будет увеличить высоту блока поиска
            if (header_menu.hasClass("open_menu") || search_results.hasClass("open")) {
                header.css("height", header.height() - baner_height + "px");
            }

            //если открыт поиск с результатами то при скрытии банера нужно будет увеличить высоту скрытого блока
            if (search_results.hasClass("open")) {
                hidden_header_part.css("height", hidden_header_part.height() + baner_height + "px");
            }

            //разрешеам сворачивание/разворачивание хедера если только закрыто окно поиска
            if (!header_menu.hasClass("open_search")) {
                GDS.header.toggle = true; //разрешаем сворачивание/разворачивание хедера
            }

            top_baner.css("display", "none"); //скрываем банер из документа
            header.css("top", "0") //попутно быстро меняем верхнюю позицию для хедера сразу после удаленяи банера


            GDS.header.height = get_header_h(); //обновляем высоту хедера


            //если банер нужно скрыть на всегда
            if (cookie) {
                //bf.setCookie("top_baner_hide_" + baner_id, true); //записываем в куки что верхний банер с таким id не показывать
            }
            //если банер нужно скрыть на всегда
        };
    //bf.deleteCookie("top_baner_hide_id_NKkGUF0X9DGuvct")
    //скрываем банер

    close_baner_button.on("click touchend", () => {
        hide_baner(true)
    }); //скрываем банер при клике на крестик

    //скрываем банер свайпом
    top_baner.on("swipe", () => {}, {}, {
        permission_directions: {
            top: false,
            right: true,
            bottom: false,
            left: true
        }, //направления в которых нужно учитывать свайп
        min_percent_dist_x: 5, //минимальная дистанция, которую должен пройти указатель, чтобы жест считался как свайп в % от ширины экрана
        max_time: 5000, //максимальное время, за которое должен быть совершен свайп (ms)

        //двигаем банер за указателем
        callback_move: function() {
            //если свайп начался на крестике банера или на его оболочке или на любом из его элементов
            if ($(this.start_terget_el)[0] === top_baner.find(".close_banner_wrap")[0] || $(this.start_terget_el).parents(".close_banner_wrap").length > 0) {
                this.abort_swipe_fail = true; //прерываем свайп
                return;
            }
            //если свайп начался на крестике банера или на его оболочке или на любом из его элементов

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
                }
            }
        },
        //двигаем банер за указателем

        //уводим банер с нужную сторону и скрываем его
        callback_success: function() {
            $(this.el).animate({
                [this.start_direction]: "-100%"
            }, GDS.anim_time, GDS.anim_tf, hide_baner);
        },
        //уводим банер с нужную сторону и скрываем его

        //в случае неудачного свайпа возвращаем банер в исходное положение
        callback_fail: function() {
            let el = $(this.el),
                dir = this.start_direction || null;

            if (!dir) return; //если не задано стартовое направление движения

            el.animate({
                [dir]: "0px"
            }, 400, GDS.anim_tf, function() {
                el.removeAttr("style");
            });
        },
        //в случае неудачного свайпа возвращаем банер в исходное положение

        //только при малом смещении или при отсутствии смещения вовсе делаем переход по ссылке из банера
        callback_finally: function() {
            if ($(this.start_terget_el)[0] === top_baner.find(".close_banner_wrap")[0] || $(this.start_terget_el).parents(".close_banner_wrap").length > 0) return; //если свайп начался на крестике банера или на его оболочке или на любом из его элементов

            if (Math.abs(this.x - this.start_x) <= 10 || this.x === 0) {
                let el = $(this.el),
                    a = el.find("a"),
                    href = a.attr("href");
                document.location.href = href
            }
        }
        //только при малом смещении или при отсутствии смещения вовсе делаем переход по ссылке из банера
    });
    //скрываем банер свайпом

    //
    //
    //БАНЕР
    //
    //


    // $().animate([{
    //     "elements": $("#block_1"),
    //     "left": "300px"
    // }], 5000, "linear", () => console.log("GOOD!"));

    // $("#block_1, .header_menu_item").animate({
    //     "left": "300px",
    //     "opacity": "0.5"
    // }, 50, "linear", () => console.log("GOOD!"));


    // $().animate([{
    //     "elements": $("#block_1"),
    //     "left": "30%",
    //     "opacity": "0.5"
    // },
    // {
    //     "elements": $("#block_2, #block_3"),
    //     "left": "50%",
    //     "opacity": "0.2"
    // },
    // {
    //     "elements": $(".header_menu_item"),
    //     "opacity": "0.5",
    //     "padding-left": "+=20px"
    // }], 5000, "linear", ()=>console.log("GOOD!"));





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