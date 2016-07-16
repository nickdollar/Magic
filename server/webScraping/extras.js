createTheWinLosses = function(){
    _Deck.find({victory : {$exists : true}, draw : {$exists : true}, loss : {$exists : true}}).forEach(function(obj){
            _Deck.update({_id : obj._id},
                {$set : {result : {victory : obj.victory, draw : obj.draw, loss : obj.loss}}}
            )
    });

    _Deck.find({position : {$exists : true}}).forEach(function(obj){
        _Deck.update({_id : obj._id},
            {$set : {result : {position : obj.position}}}
        )
    });
}


queryInsideASubset = function(){
    //var test = _Deck.aggregate([
    //    {
    //        $match : {victory : {$exists : true}, draw : {$exists : true}, loss : {$exists : true}}, {limit : 10}
    //    },
    //]
    //var test2 = test.find({victory : 3}).fetch();
    //
    //console.log(test2);

}