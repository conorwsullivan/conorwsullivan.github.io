$(document).ready(function () {
  var $bullets = $('.item-detail, .links li, .interactions li');
  var iteration = 0;
  var paused = true;
  setInterval(function() {
    if(paused) {
      return;
    }
    $bullets.eq(iteration).addClass('move');
    $bullets.eq((iteration + $bullets.length - 4) % $bullets.length).removeClass('move');
    iteration = (iteration + 1) % $bullets.length;

  }, 100);

  $('.print-link').click(function() {
    //document.title = "Conor Sullivan, JavaScript Developer";
    window.print();
    return false;
  });
  $('.pause-link').click(function() {
    paused = !paused;
    $('.pause-link').toggleClass('pressed', !paused);

    $('h2').toggleClass('animate', !paused);

    $('.move').removeClass('move');
    iteration = 0;

    $('.gif, .was-gif').toggleClass('gif', !paused).toggleClass('was-gif', paused);

    return false;
  });
});
