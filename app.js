var budgetController = (function(){

})();


var UIController = (function(){

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    }; 
    
    return {
        getInput: function (){
            // THIS creates an object with the data we get from the input fields. 
            return {
                type: document.querySelector(DOMstrings.inputType).value, // this is income or expense selector. 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            };
        },

        // here we are exposing the DOMstrings to the other modules in the app. 
        getDOMstrings: function(){
            return DOMstrings;
        }

    };

})();






var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function (){
        //here we are receiving the exposed DOMString from UIController
        var DOM = UICtrl.getDOMstrings();

         // here we add the event listener for the click of the button, and passing the function that process the data.
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem)

        // the code to listen for the 'Enter' key press
        document.addEventListener("keypress", function(event){
            if (event.keyCode === 13 || event.which === 13) { // event.which is an older browser keyCode functionality
                ctrlAddItem();
            }     
        })
    }
    
    var ctrlAddItem = function (){
        // 1. getting the input from the form. 
        var input = UICtrl.getInput();
        console.log(input)
        // 2. add the items to the budget controller

    }

   return {
       init: function (){
           console.log("The App is running!!!");
           setupEventListeners();
       }
   };
       
})(budgetController, UIController);
    
// this is what starts the app
controller.init();