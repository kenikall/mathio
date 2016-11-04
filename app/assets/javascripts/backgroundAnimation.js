$(document).ready(function(){
  $(function(){
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

    $('#title').offset(titleCenter)
  })
});
