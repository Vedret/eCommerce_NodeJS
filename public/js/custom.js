$(function(){

    $('#search1').keyup(function(){
        var search_term=$(this).val();

        $.ajax({
            method:'POST',
            url:'/api/search',
            data:{
                search_term
            },
            dataType:'json',
            success:function(json){
                console.log("json" +json);
                var data = json.hits
                console.log("data" +data);
                
                $('#searchResults').empty();
                for (var i=0;i,data.length;i++){
                var html ="";
                html +='<div class="col-md-4">';
                html +=' <a href ="/product/'+ data[i]._id  +'">';
                html +='<div class="thumbnail">';
                html +='<img src="' + data[i].image  +' ">' ;
                html +='<div class="caption">';
                html +='<h3>'+ data[i].name  +'</h3>';
                html +='<p>' + data[i].category.name  + '</p>';
                html +='<p>$'+ data[i].price + '</p>';
                html +='</div></div></a></div>';

                $('#searchResults').append(html);
                }
            },
            err:function(err){
                console.log(err);
            }
        });
    });
});


//apply event driven method, onclick targeting buttonn plus
$(document).on('click','#plus',function(e){
    //prevent from page to be refreshed
    e.preventDefault();
    //parse value of the text price value  
    let priceValue=parseFloat($('#priceValue').val());
    //parse value of text
    let quantity = parseInt($('#quantity').val());

    priceValue+=parseFloat($('#priceHidden').val());
    quantity+=1;

    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
});

//apply event driven method, onclick targeting buttonn plus
$(document).on('click','#minus',function(e){
    //prevent from page to be refreshed
    e.preventDefault();
    //parse value of the text price value  
    let priceValue=parseFloat($('#priceValue').val());
    //parse value of text
    let quantity = parseInt($('#quantity').val());

    if(quantity==1){
        
        priceValue=$('#priceHidden').val();
        quantity=1;
    }else{

        priceValue-=parseFloat($('#priceHidden').val());
        quantity-=1;

    }


    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
});