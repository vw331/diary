$(function(){


    $('#btn-bar')
        .data('current','1')
        .click(function(){

           if(  $(this).data('current') == 1 )
           {
               $('.register-form').show().siblings('form').hide()

               $(this).data('current',2 ).val('登录').addClass('login')
           }
           else
           {
               $('.login-form').show().siblings('form').hide()
               $(this).data('current',1 ).val('注册').removeClass('login')
           }


        })

})