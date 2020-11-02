// Storage Controller

//Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.calories = calories;
    this.name = name;

  }

  //Data Structure / State
  const data = {
    items: [
      // {id: 0, name: "Steak dinner", calories: 1200},
      // {id: 1, name: "Cookie", calories: 400},
      // {id: 2, name: "Eggs", calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function(){
      return data.items;
    },
    
    addItem: function(name, calories){
      //Create ID
      let ID;
      if(data.items.length > 0) {
        ID = data.items[data.items.length-1].id + 1;
      } else {
        ID = 0;
      }
      calories = parseInt(calories)
      
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      return newItem;
    },
    getItemById: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(function(item){
        total += item.calories;
      });

      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function(){
      return data;
    }  
  }
  

})();

//UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    listItems: "#item-list li"
  }

  return {
    populateItemList: function(items){
      let html = "";

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>           
      </li>
        
        `
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      document.querySelector(UISelectors.itemList).style.display = "block";
      
      // Create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li)

    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function(){

        document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
      

    },

    updateListItem: function(name, calories){
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute("id");
        if(itemID === `item=${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`
        }
      })


    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function(){
      return UISelectors;
    }
  }

})();

//App Controller
const App = (function(ItemCtrl, UICtrl){
    //Load event listeners
    const loadEventListeners = function(){
      const UISelectors = UICtrl.getSelectors();

      document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

      document.addEventListener("keypress",function(e){
        if(e.keyCode === 13 || e.which === 13){
          e.preventDefault();
          return false;
        }
      })

      document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

      document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

    }

    //Add item submit

    const itemAddSubmit = function(e){
      const input = UICtrl.getItemInput();
      
      //Check for name and calorie input
      if(input.name !== "" && input.calories !== "") {
         const newItem = ItemCtrl.addItem(input.name, input.calories);
      }
      UICtrl.addListItem(newItem)
      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);


      UICtrl.clearInput();

      e.preventDefault();

    }
  
    //Update item submit
    const itemEditClick = function(e){
      if(e.target.classList.contains("edit-item")){
        const listId = e.target.parentNode.parentNode.id;
        const listIdArr = listId.split("-");
        const id = parseInt(listIdArr[1]);
        const itemToEdit = ItemCtrl.getItemById(id);
        
        ItemCtrl.setCurrentItem(itemToEdit);
        UICtrl.addItemToForm();
      }
      e.preventDefault()
    };

    const itemUpdateSubmit = function(e){

      const input = UICtrl.getItemInput();
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
      UICtrl.updateListItem(updatedItem);
      
      e.preventDefault();
    }

  //Public methods
  return {
    init: function() {

      UICtrl.clearEditState();
      //Fetch items from data structure
      const items = ItemCtrl.getItems();
      //Populat list with itens
    if(items.length === 0 ) {
      UICtrl.hideList();
    } else {
      UICtrl.populateItemList(items);
    }

    const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);


      loadEventListeners();
    }
  }
  

})(ItemCtrl, UICtrl);

App.init()