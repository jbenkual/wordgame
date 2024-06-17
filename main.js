var start = "soil";
var end = "tree"
var wordlist = [];
var rawWords = [];
var pword = start;
var steps = 0;

function loadWords() {
    jQuery.get('words.txt', function (data) {
        rawWords = data.split("\n");
        curate();
    });
}

function curate() {
    var list = rawWords.filter(function (w) {
        if (w.length === start.length) {
            wordlist.push(w);
        }

    });
    wordlist.push.apply(wordlist, list);
     suggest();
}

function suggest() {
    var text = $("input").val();
   // if (text.length === start.length ) {
        var list = wordlist.filter(function (w) {
            return isNear(w, pword)
            //return (w.substr(0, w.length-1) === text)
        });
        $("#hint-list").text(list.join(", "));
    //}
    //else {
        //$("#hint-list").text("");
    //}

}

function isNear(w1, w2) {
    var count = 0;
    for (var i = 0; i < w1.length; i++) {
        if (w1[i] === w2[i]) {
            count++;
        }
    }
    return count + 1 === w1.length;
}

function validate() {
    var text = $("input").val();
   
     if(text.length !== start.length || !isNear(pword, text)) {
        return false;
    }

    if(wordlist.indexOf(text) === -1) {
        return false;
    }

    return true;
}

function submit() {
    var text = $(".input").val();
    if(text.length !== start.length) {
        return;
    } 
    if(validate()) {
        pword = text;
        var word = $("<li>");
        word.text(text);
        $(".input").val("");
        $("#word-list").append(word);
        $(".checkmark").addClass("hidden");
        
        steps++;

        if(text === end) {
            victory()
        }
        else{
            suggest();
        }
    }
   
}

function victory() {
    $(".message").text("You won in " + steps + " steps!")
    $("#submit").hide();
    $("#start").show();
}

function startGame() {
    steps = 0;
    pword = start;
    $(".message").text("");
    $("#submit").show();
    $("#start").hide();
}

function keypress(e) {
    if(validate()) {
        $(".checkmark").removeClass("hidden");
    }
    else {
        suggest();
        $(".checkmark").addClass("hidden");
    }    
}

$(document).ready(function () {
    loadWords();
    $(".start-word").text(start);
    $(".end-word").text(end);

    $("#submit").on("click", submit);
    $("#start").on("click", startGame);
    $(".input").on("input", keypress);
    $(".show-hints").on("click", function() {
        $("#hint-list").toggleClass("hidden")
        
    });
    $("input").keypress(function (e) {
        if (e.which == 13) {
            submit();
            return false;    //<---- Add this line
        }
    });
   
});