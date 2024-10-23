$("#post1").on("click", () => {
    $("#sidebra").toggleClass("w-1/6", 200);
    $("#sidebra").toggleClass("w-fit", 200);
    $("#home").toggle("fast");
    $("#explore").toggle("fast");
    $("#notification").toggle("fast");
    $("#settings").toggle("fast");

    $("#pstbtn").css("border-radius",999    );
    
    $("#main").toggleClass("w-1/2", 200);
    $("#main").toggleClass("w-3/5", 200);
    $("#post1").toggleClass("h-1/2");
    $("#post1").toggleClass("h-3/5");
    for (let i = 1; i <= 4; i++) {
        $(`#sbtn${i}`).toggleClass("500");
        $(`#sbtn${i}`).toggleClass("px-10 justify-center");

        $(`#sbtn${i}`).css({
            "margin-right": 0,
            "margin-left": 0
        
        });
}
    

});