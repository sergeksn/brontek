//HEADER
let header = $("header"), //хедер
    header_overlay = $("#header_overlay"); //подложка для того чтоб header не перекрывал контент сверху

GDS.header = {
    toggle: true, //разрешаем сворачивание/разворачивание хедера

    height: function() { return this.get_header_h() }, //записываем/обновляем значение в данных высорты хедера

    //?? нужно ли ??
    overlay_height: function() { return header_overlay.height() }, //записываем/обновляем значение в данных высорты подложки хедера

    //функция получае нужные высоты в хедере
    get_header_h: function() {
        let top_banner_wrap = $(".top_banner_wrap"),
            header_menu_wrapper_h = $(".header_menu_wrapper").height(),
            top_banner_wrap_h = top_banner_wrap.length > 0 ? top_banner_wrap.height() : 0;

        return header_menu_wrapper_h + top_banner_wrap_h;
    },
    //функция получае нужные высоты в хедере

    //функция запускает проверки и все слушатели событий для определения состояния хедера
    init: function() {
        let win = $(window);
        win.on("load", () => {
            win.on("scroll resize", () => {
                if (!this.toggle) return; //проверяем разрешено ли сворачивать/разворачивать хедер

                //если скролим вверх
                if (GDS.pageYOffset > window.pageYOffset) {
                    header.animate({ "top": "0px" }, GDS.anim_time, GDS.anim_tf);
                }
                //если скролим вверх

                //если скролим вниз
                else {
                    let hide = window.pageYOffset >= this.height() ? true : false; //при скроле ВНИЗ проверяем на сколько мы проскролили от верху страницы

                    if (hide) { header.animate({ "top": "-" + this.height() + "px" }, GDS.anim_time, GDS.anim_tf) } //скрываем/показываем header при скроле или ресайзе
                }
                //если скролим вниз

                GDS.pageYOffset = window.pageYOffset; //обновляем данные о текущем отступе от верха страницы до верха окна браузера
            });
        });

        win.on("resize", () => header_overlay.css("height", header.css("height"))); //при изменении размера экрана пересчитываем новую высоту подкладки хедера
    }
    //функция запускает проверки и все слушатели событий для определения состояния хедера
};
//HEADER