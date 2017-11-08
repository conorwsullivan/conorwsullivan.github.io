var $textarea = $('textarea');

var maxLength = 2;

$('textarea').keyup(function (event) {
  var textareaDOM = $textarea.get(0);
  var coordinates = getCaretCoordinates(textareaDOM, textareaDOM.selectionStart);
  var val = $textarea.val();
  console.log(coordinates.top);
  if(coordinates.top / 30 > maxLength + 1) {
    $textarea.val(val.substring(5));
  }
});
