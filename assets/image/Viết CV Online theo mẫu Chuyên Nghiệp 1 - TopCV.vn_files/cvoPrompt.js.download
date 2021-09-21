function cvoPromptClassic(callback,val){if(val===undefined||val===null){val='';}
var input=window.prompt('Enter rating',val);callback(input);}
function cvoPrompt(callback,val){var cvoMask=$('<div/>').addClass('cvoPromptMask');var htmlForm='<form id="frmCvoPrompt"><input type="text" id="cvoPromptInput"></form>';cvoMask.html(htmlForm);if(val!==undefined&&val!==null){cvoMask.find('input#cvoPromptInput').val(val);}
cvoMask.appendTo($('body'));$('#frmCvoPrompt').submit(function(e){var input=$('#cvoPromptInput').val();callback(input);e.preventDefault();$('.cvoPromptMask').remove();});cvoMask.show();}
function cvoPromptStars(callback,val){var cvoMask=$('<div/>').addClass('cvoPromptMask');var htmlForm='<form id="frmCvoPromptStars">'+
'<div class="cvoStarsRating">'+
'<span value="5" class="btn_star"><i class="fa fa-star"></i></span>'+
'<span value="4" class="btn_star"><i class="fa fa-star"></i></span>'+
'<span value="3" class="btn_star"><i class="fa fa-star"></i></span>'+
'<span value="2" class="btn_star"><i class="fa fa-star"></i></span>'+
'<span value="1" class="btn_star"><i class="fa fa-star"></i></span>'+
'</div>'+
'</form>';cvoMask.html(htmlForm);if(val!==undefined&&val!==null){cvoMask.find('span[value='+val+']').addClass('rated');}
cvoMask.find('.btn_star').click(function(e){var input=$(this).attr('value');callback(input);e.preventDefault();$('.cvoPromptMask').remove();});cvoMask.appendTo($('body'));cvoMask.show();}