$(function(){


    $(document)
    .on('click',function(){
        $(this).find(".drop-down").removeClass('active')
    })
    .find(".drop-down")
        .on('click',function(e){
            e.stopPropagation()
        })
        .find(">a")
        .on('click',function(){
            $(this).parent('.drop-down').toggleClass('active')
        })


})