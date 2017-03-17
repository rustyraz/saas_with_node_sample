'use strict';
function set_delete_id(id){
	$('#delete_form_id').val(id);
}
function delete_confirmed(){
	var form_id = $('#delete_form_id').val();
	$('#delete_'+form_id).submit();
}
(function($) {
	$('.delete_product').submit(function(e){
		e.preventDefault();
		var id = $('#delete_form_id').val();     
		$.ajax({
		  type: 'POST',
		  url: '/admin/products/delete/'+id,
		  beforeSend: function(){
		  	$('#delete_progress_bar').show();
		  },
		  success: function(data){
		    console.log(data);
		    if(data.success == true){
		    	location.reload();
		    }
		  }
		});
	});

	//ajax images
	$('#ajax_images').submit(function(e){
		e.preventDefault();
		var url = $(this).attr('action');
		var ajax_form = new FormData(this);

		$.ajax({
			type: 'POST',
			url: url,
			processData: false, 
			contentType: false,
			data: ajax_form,
			beforeSend: function(){},
			success: function(data){
				console.log(data);
			},
			xhr: function() {
		        var xhr = new window.XMLHttpRequest();
		       //progress
				xhr.upload.addEventListener('progress', function(e){
					console.log(e.loaded/e.total*100 + ' %');
				}, false);

				//complete
				xhr.addEventListener('load', function(e){
					//console.log(JSON.parse(e.target.responseText));
				});
				return xhr;
		    }
		});
	});
})(jQuery);
