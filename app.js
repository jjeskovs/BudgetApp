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

    // we do this calculation outside of the RETURN below to keep it private. as no other parts of the app needs this functionality
    var calculateTotal = function(){
        var sum = 0;

        data.allItems[type].forEach(function(current){
            sum += current.value 
        });
        // adding the total to the data array
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        // -1 means the value does not exist. simply a better way then setting it to 0
        percentage: -1
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
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // to add the item to an empty array. 
            data.allItems[type].push(newItem);
            // to make the new budget item accessible from outside 
            return newItem;
        },

        calculateBudget: function(){
            // 1. calculate the total for each income and expense
            calculateTotal("exp");
            calculateTotal("inc");

            // 2. Calculates total income - expense
            data.budget = data.totals.inc - data.totals.exp;

            //3. Calculate %
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },

        getBudget: function (){
            return {
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        // this is for testing purpose only, it give us access to the data object 
        testing: function(){
            console.log(data)
        }
    }

})();






var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }; 
    
    return {
        getInput: function (){
            // THIS creates an object with the data we get from the input fields. 
            return {
                type: document.querySelector(DOMstrings.inputType).value, // this is income or expense selector. 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;

            // creating an HTML with the placeholders (hidden in the % ... %)
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // replacing the placeholders with the actual values 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value, type);
            
            // placing the new HTML onto the screen. 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function(){
            var fields, fieldsArr;
            
            // here we targeting each input field
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " +  DOMstrings.inputValue)
            fieldsArr = Array.prototype.slice.call(fields);
            
            // loops through all inputs stored in teh fieldsArr 
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            // brings focus to description field. 
            fieldsArr[0].focus();
        }, 

        // here we are exposing the DOMstrings to the other modules in the app. 
        getDOMstrings: function() {
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

    var updateBudget = function(){

        // 1. calculates the budget
        budgetCtrl.calculateBudget();
        
        //2. returns budget
        var budget = budgetCtrl.getBudget()
        // 3. Display the budget DOM

        console.log(budget)

    }

    
    var ctrlAddItem = function (){
        var input, newItem;
        
        // 1. getting the input from the form. 
        input = UICtrl.getInput();
        console.log(input)

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. add the items to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);

            // 3. add item to the screen
            UICtrl.addListItem(newItem, input.type)

            // 4. Clearing input fields. 
            UICtrl.clearFields();

            // 5. Calculating and updating the budget
           updateBudget();
        }

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