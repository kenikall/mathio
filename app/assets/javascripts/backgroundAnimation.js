$(document).ready(function(){
  $(function(){
    var aPos = {left: $('#cloud-A').offset().left, top: $('#cloud-A').offset().left};
    var bPos = {left: $('#cloud-B').offset().left, top: $('#cloud-B').offset().left};
    var cPos = {left: $('#cloud-C').offset().left, top: $('#cloud-C').offset().left};

    setInterval(function(){
      aPos.left >= -136 ? aPos.left-- : aPos.left = 936;
      bPos.left >= -136 ? bPos.left-- : bPos.left = 936;
      cPos.left >= -136 ? cPos.left-- : cPos.left = 936;

      $('#cloud-A').offset(aPos);
      $('#cloud-B').offset(bPos);
      $('#cloud-C').offset(cPos);
    }, 50);
  })
});
