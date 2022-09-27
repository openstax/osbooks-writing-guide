
function Accessibility(itemlength)
{
    //console.log('itemlength=',itemlength);
    var updatedCounter=0;
    this.updateCounter=function(counter){
        //console.log('counter=',counter);
        updatedCounter=counter;
    }

    $(document).keyup(function(event){

		// if(event.keyCode==9){
		// 	alert('dfdfd')
		// 	$('.container').focus();
		// }

        if(event.keyCode == 39){ 
			//fetch id of focuesd element
			//console.log('updatedCounter=',updatedCounter);
			if(updatedCounter==itemlength-1){
				$('.reset_btn').trigger('click');
			}else{
				$('.next_btn').focus();
			$('.next_btn').trigger('click');
		}
		
			
		}
		if(event.keyCode == 37){ 
			$('.prev_btn').trigger('click');
			$('.prev_btn').focus();
		}

    })
}

