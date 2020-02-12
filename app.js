var budgetController = (function(){

})();


var UIController = (function(){
    return {
        getInput: function (){
            var type = document.querySelector("add__type").value; // this is income or expense selector. 

        }
    }
})();




var budgetController = (function(){

    var ctrlAddItem = function (){


    }

    // here we add the event listener for the click of the button, and passing the function that process the data.
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem)

    // the code to listen for the 'Enter' key press
    document.addEventListener("keypress", function(event){
        if (event.keyCode === 13 || event.which === 13) { // event.which is an older browser keyCode functionality
            ctrlAddItem();
        }     
    })
       
})();
    
