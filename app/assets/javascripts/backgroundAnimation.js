$(document).ready(function(){
  $(function(){
    if($('body').is('.games_index')){
      var titleCenter = {left: 100, top: 20};

      var aCloudPos = {left: $('#cloud-A').offset().left, top: $('#cloud-A').offset().top};
      var bCloudPos = {left: $('#cloud-B').offset().left, top: $('#cloud-B').offset().top};
      var cCloudPos = {left: $('#cloud-C').offset().left, top: $('#cloud-C').offset().top};

      setInterval(function(){
        aCloudPos.left >= -136 ? aCloudPos.left-- : aCloudPos.left = screen.width+136;
        bCloudPos.left >= -136 ? bCloudPos.left-- : bCloudPos.left = screen.width+136;
        cCloudPos.left >= -136 ? cCloudPos.left-- : cCloudPos.left = screen.width+136;

        $('#cloud-A').offset(aCloudPos);
        $('#cloud-B').offset(bCloudPos);
        $('#cloud-C').offset(cCloudPos);
      }, 50);

      $('#title').offset(titleCenter);
    }
    $('.icon').hover(function(){
        // console.log('over');
      },function(){
        // console.log('out');
    });
    $('.icon').on('click', function(){
      console.log(this)
      if ($(this).is('#hunt')){var gameUrl = '/games/mathhunt'}
      else if ($(this).is('#flappy')){var gameUrl = '/games/flappymath'}
      else if ($(this).is('#leaders')){var gameUrl = '/leaders/index'}
      // else if ($(this).hasClass("flappy")){var gameUrl = '/games/flappymath'}
      // else if ($(this).hasClass("leaders")){var gameUrl = '/leaders/index'}
      console.log(gameUrl);

      request = $.ajax({
        method: 'get',
        url: gameUrl
      })

      request.done(function(response){
        //console.log(response);
        $('body').empty().append(response);
      })

      request.fail(function(response){
        console.log("Error with the route")
      })
    })
  })
});
