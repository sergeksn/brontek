let media = GDS.media = {
    //загружает переданные картинки принудительно
    load_img: function(images) {
        images.each(function() {
            let img = $(this),
                data_src = img.attr("data-src");
            img.attr("src", data_src);

            img.on("load", function() {
                $(this).addClass("loaded");
            });
        });
    },
    //загружает переданные картинки принудительно

    //загружаем и отображаем картики с блока в котором выводится картинка товара со всеми наложенными svg деталями
    load_img_prevu_product: function() {
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
    },
    //загружаем и отображаем картики с блока в котором выводится картинка товара со всеми наложенными svg деталями


    load_img_content: function() {
        let img_content = $("img[data-type='img_content']");

        this.load_img(img_content);
    },

};

export { media };