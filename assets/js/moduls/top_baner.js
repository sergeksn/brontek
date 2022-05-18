//БАНЕР

let header = $("header"), //header
    header_overlay = $("#header_overlay"), //подложка для того чтоб header не перекрывал контент сверху
    top_baner = $(".top_banner_wrap"), //верхний банер если нашли
    header_menu = $(".header_menu_wrapper"), //верхнее меню
    search_results = $(".search_results"),
    close_baner_button = top_baner.find(".close_banner_wrap"); //кнопка-крестик закрытия банера




GDS.top_baner = {
    //инициализируем все скрипты для работы с верхним банером
    init: function() {
        if (top_baner.length < 1) return; //если блока банера нет в теле документа прерываем инициализацию модуля

        close_baner_button.on("click touchend", this.hide_baner); //скрываем банер при клике на крестик

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
                }, GDS.anim_time, GDS.anim_tf, () => GDS.top_baner.hide_baner(false));
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
    },
    //инициализируем все скрипты для работы с верхним банером

    //скрываем банер
    //cookie - указывает скрывать банер без каписи в куки или с записью
    hide_baner: async function(cookie = true) {
        GDS.header.toggle = false; //блокируем сворачивание/разворачивание хедера

        let baner_id = top_baner.attr("id"),
            baner_height = top_baner.height(), //высота блока банера
            header_h = GDS.header.get_header_h(),//получаем актуальную высоту блока хедера без учёта скрытой части
            header_overlay_height = header_h - baner_height; //высота для подложки хедера




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


        //если банер нужно скрыть на всегда
        if (cookie) {
            //bf.setCookie("top_baner_hide_" + baner_id, true); //записываем в куки что верхний банер с таким id не показывать
        }
        //если банер нужно скрыть на всегда
    },
    //bf.deleteCookie("top_baner_hide_id_NKkGUF0X9DGuvct")
    //скрываем банер
};
//БАНЕР