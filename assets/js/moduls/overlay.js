let overlay = $("#overlay"); //полупрозрачная бела подложка для всплывающих окон

GDS.overlay = {
    //скрываем/показываем подложку для сплывающих окон
    //status - true/false показать/скрыть соответственно
    show_overlay: function(status) {
        return new Promise(async (resolve) => {
            //показывыаем подложку
            if (status) {
                overlay.css("display", "block");
                await overlay.animate({ "opacity": "0.8" }, GDS.anim_time, GDS.anim_tf);
                resolve();
            }

            //скрываем подложку
            else {
                await overlay.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf);
                overlay.css("display", "none");
                resolve();
            }
        });
    },
    //скрываем/показываем подложку для сплывающих окон
};