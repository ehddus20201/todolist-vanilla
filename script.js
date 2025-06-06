
const todoListArray = [];
const addInput = document.getElementById("addInput");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementsByClassName("delete_btn");
const ul = document.getElementById("todoList");



function createItem(value, id){
  return `<li data-id=${id}>
  <label class="todo_label">
              <input type="checkbox" class="todo_chkbox" />
              <span class="chkmark"></span>
              <span class="todo_text">${value}</span>
            </label>
            <button type="button" class="delete_btn"><span class="blind">삭제</span></button>
  </li>`
}

function renderItem(target, value, id){
    value = createItem(value,id);
    target.insertAdjacentHTML("beforeend", value); // beforeend: 요소 바로 안에서 마지막 자식 이후에 위치
}


function addItemArray(id, value){
  todoListArray.push({ id, value });
}





addBtn.addEventListener("click", () =>{
  const id = Math.random();
  const value = addInput.value;
  const target = ul;
  if(value===''){
    alert("메세지를 입력해주세요!");
    
  }else{
    renderItem(target,value,id);
    addItemArray(id,value);
  }
  
  addInput.value='';
})


// ul.insertAdjacentHTML("beforeend", '<li>asdf</li>');



