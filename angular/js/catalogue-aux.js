			$(function() { // DOM ready
			
			  var txt = ['movies', 'tv shows', 'documentaries', 'concerts'],
			      n = txt.length,
			      $swap = $('#swap'),
			      $span,
			      c = -1;
			
			  // CREATE SPANS INSIDE SPAN
			  for(var i=0; i<txt.length; i++) $swap.append($('<span />',{text:txt[i]}));
			  // HIDE AND COLLECT THEM
			  $span = $("span", $swap).hide(); 
			
			  (function loop(){
			    c = ++c % n;
			    $swap.animate({width: $span.eq( c ).width() });
			    $span.stop().fadeOut().eq(c).fadeIn().delay(1000).show(0, loop);
			  }()); 
			
			});	