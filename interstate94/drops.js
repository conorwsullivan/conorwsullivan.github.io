var max_size = 50, min_size = 10, min_move_size = 20, min_gen_size = 50;
var margin = 10;
var drop_frequency = 0.75;
var move_frequency = 0.05;
var min_move_x = -0.5, max_move_x = -1.5;
var min_move_y =  0, max_move_y =  1;

var drops = [];

function get_free_drop() {
  for (var i = 0; i < drops.length; i ++) {
    if (!drops[i].visible) {
      return drops[i];
    }
  }
  return undefined;
}

function update_drop(drop, duration) {
  drop.time_til_move -= duration;
  if (drop.time_til_move < 0 && drop.size > min_move_size) {
    move_x = rand_range(min_move_x, max_move_x) * drop.size;
    move_y = rand_range(min_move_y, max_move_y) * drop.size;
    if (drop.size/2 >= min_size) {
      get_and_place_drop(drop.x, drop.y, drop.size/4);
      get_and_place_drop(drop.x + move_x/2, drop.y + move_y/2, drop.size/4);
      drop.size *= 0.5;
    }
    drop.x += move_x;
    drop.y += move_y;
    place_drop(drop, drop.x, drop.y, drop.size, true);

    drop.time_til_move = 2000 * Math.random() * Math.random() / move_frequency;
  }
  if (drop.visible && drop.collision_dirty) {
    collide(drop);
  }
}

function collide(drop) {
  drop.collision_dirty = false;

  for (var i = 0; i < drops.length; i ++) {
    var coll_drop = drops[i];
    if (coll_drop.visible && coll_drop !== drop) {
      var dist = distance(coll_drop.x, coll_drop.y, drop.x, drop.y);
      var sum_size = drop.size + coll_drop.size;
      if (dist < sum_size) {
        drop.x = (drop.x * drop.size + coll_drop.x * coll_drop.size) / sum_size;
        drop.y = (drop.y * drop.size + coll_drop.y * coll_drop.size) / sum_size;
        drop.size = Math.min(sum_size, max_size);
        drop.time_til_move /= 2;
        place_drop(drop, drop.x, drop.y, drop.size, true);

        coll_drop.visible = false;
        coll_drop.$drop.css('visibility', 'hidden');
        return;
      }
    }
  }
}

function add_drop() {
  var drop = {
    x: -100,
    y: -1000,
    size: 0,
    time_til_move: 0,
    visible: false,
    collision_dirty: true
  };
  var $drop = $($('.drop_template').html());
  $drop
    .css('width', drop.size)
    .css('height', drop.size)
    .css('left', drop.x - drop.size/2)
    .css('top',  drop.y - drop.size/2);
  $('.drops').append($drop);
  drop.$drop = $drop;
  drops.push(drop);
}
function place_drop(drop, x, y, size, transition) {
  var window_width  = $(window).width();
  var window_height = $(window).height();
  if (!x && !y) {
    x = rand_range(margin, (window_width  - 2*margin));
    y = rand_range(margin, (window_height - 2*margin));
  }
  if (!size) {
    size = rand_range(min_gen_size, max_size);
  }
  if (size < min_size ||
    x > window_width  || x < 0 ||
    y > window_height || y < 0) {
    drop.visible = false;
  } else {
    drop.visible = true;
  }
  drop.x = x;
  drop.y = y;
  drop.size = size;
  drop.$drop
    .css('width', drop.size)
    .css('height', drop.size)
    .css('left', drop.x - drop.size/2)
    .css('top',  drop.y - drop.size/2)
    .css('visibility', drop.visible ? 'visible' : 'hidden')
    .toggleClass('no_transition', !transition);
  drop.collision_dirty = true;
}
function get_and_place_drop(x, y, size) {
  var drop = get_free_drop();
  if (drop) {
    place_drop(drop, x, y, size, false);
  }
}

var last_timestamp;
var time_til_drop = 0;

function loop(timestamp) {
  requestAnimationFrame(loop);

  var duration = 0;
  if (last_timestamp) {
    duration = timestamp - last_timestamp;
  }
  last_timestamp = timestamp;

  time_til_drop -= duration;
  if (time_til_drop < 0) {
    var new_drop = get_free_drop();
    if(new_drop) {
      place_drop(new_drop);
      new_drop.time_til_move = 0;
    }
    time_til_drop += 2000 * Math.random() / drop_frequency;
  }

  for (var i = 0; i < 200; i ++) {
    if (drops[i].visible) {
      update_drop(drops[i], duration);
    }
  }
}

$(document).ready(function() {
  for (var i = 0; i < 200; i ++) {
    add_drop();
  }

  loop();

  $('body').addClass('animate');
});

function rand_range(min, max) {
  return Math.random() * (max - min) + min;
}
function distance(x1, y1, x2, y2) {
  var xd = x1 - x2;
  var yd = y1 - y2;
  return Math.sqrt(xd*xd + yd*yd);
}
