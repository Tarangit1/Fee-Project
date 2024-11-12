let isCollapsed = false;

$("#logo").on("click", () => {
    if (isCollapsed) {
        // Expand the sidebar
        $("#sidebra").removeClass("w-fit ml-5").addClass("w-1/6", 200);
        $("#home, #explore, #notification, #settings").show("fast");
        $("#main").removeClass("w-3/5").addClass("w-1/2", 200);
        for (let i = 1; i <= 4; i++) {
            $(`#sbtn${i}`).removeClass("500 justify-center").css({
                "margin-right": "",
                "margin-left": "20px"
                
            });
        }
    } else {
        // Collapse the sidebar
        $("#sidebra").removeClass("w-1/6").addClass("w-fit ml-5", 200);
        $("#home, #explore, #notification, #settings").hide("fast");
        $("#main").removeClass("w-1/2").addClass("w-3/5", 200);
        for (let i = 1; i <= 4; i++) {
            $(`#sbtn${i}`).addClass("500 justify-center").css({
                "margin-right": 0,
                "margin-left": 0
            });
        }
    }
    isCollapsed = !isCollapsed;
});
