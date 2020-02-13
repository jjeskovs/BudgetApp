var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val){
            var newItem, ID;
            // creating a unique ID for each type 
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }

        
            
            // to create a new budget item based on the user's selection  
            if (type === "exp"){
                newItem = new Expense(ID, des, val)
            } else if (type === "inc"){
                newItem = new Income(ID, des, val)
            };

            // to add the item to an empty array. 
            data.allItems[type].push(newItem);
            // to make the new budget item accessible from outside 
            return newItem;
        },

        // this is for testing purpose only, it give us access to the data object 
        testing: function(){
            console.log(data)
        }

    }



})();


var UIController = (function(){

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
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
        
        addListItem: function(obj, type){
            var html, newHTML, element;

            // creating an HTML with the placeholders (hidden in the % ... %)
            if (type === "inc"){
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if (type === "exp"){
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // replacing the placeholders with the actual values 
            newHTML = html.replace('%id%', obj.id),
            newHTML = html.replace('%description%', obj.description),
            newHTML = html.replace('%value%', obj.value),
            
            // placing the new HTML onto the screen. 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },


        // here we are exposing the DOMstrings to the other modules in the app. 
        getDOMstrings: function(){
            return DOMstrings;
        },

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
        var input, newItem;
        
        // 1. getting the input from the form. 
        input = UICtrl.getInput();
        console.log(input)
        // 2. add the items to the budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);

        // 3. add item to the screen
        UICtrl.addListItem(newItem, input.type)

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