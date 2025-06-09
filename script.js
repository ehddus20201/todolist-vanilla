const addInput = document.querySelector('#addInput');
const addBtn = document.querySelector('#addBtn');
const allDelBtn = document.querySelector('#allDelBtn');
const todoList = document.querySelector('#todoList');
const inputWrap = todoForm.getElementsByClassName("input_wrap")[0];
let todoListArray = [];

let isInitialLoad = true; // 로드 직후
updateCount(); // isInitialLoad = true 

/* --- 할 일 추가하기 --- */

/* 추가할 li 돔으로 형성 */
// 보안&유지보수 측면에서는 안전한 방법: dom api로 생성
function createItem(value, id, isChecked) {
  const li = document.createElement('li');
  li.setAttribute('data-id', id);

  const label = document.createElement('label');
  label.className = 'todo_label';
  label.htmlFor = `chk_${id}`;

  const chkBox = document.createElement('input');
  chkBox.type = 'checkbox';
  chkBox.className = 'todo_chkbox';
  chkBox.id = `chk_${id}`;
  chkBox.checked = isChecked;

  const chkMark = document.createElement('span');
  chkMark.className = 'chkmark';

  const todoText = document.createElement('span');
  todoText.className = 'todo_text';
  todoText.textContent = value;
  
  // label 안에 요소로 넣음
  // append() : 요소, 텍스트, 여러개 추가가능
  label.append(chkBox, chkMark, todoText);

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'delete_btn';

  const delBlind = document.createElement('span');
  delBlind.className = 'blind';
  delBlind.textContent = '삭제';

  //appendChild() : 요소만 추가 가능(텍스트 x), 하나만 추가
  delBtn.appendChild(delBlind);

  li.append(label, delBtn);

  return li;
}

/* todoList 안 li 추가 */
function renderItem({target, value, id, isChecked = false}) {
  const li = createItem(value, id, isChecked);
  // prepend(): DOM 요소에 자식 요소를 맨 앞에 추가
  target.prepend(li);
}

/* 추가한 값 배열에 저장 */
function addItemArray(id, value, isChecked = false) {
  //unshift() : 맨 앞에 하나 이상의 요소를 추가
  todoListArray.unshift({ id, value, isChecked });
  saveTodos();
}

/* 할일 추가 값이 Null일 경우 경고 표시 */
function createErrorMsg() {
    const errorMsg = document.createElement("div");
    errorMsg.className = "inputErrorMsg";
    
    const alertImage = document.createElement("img");
    alertImage.src = "./assets/images/message-alert-circle.svg"
    alertImage.alt = "경고"
    errorMsg.appendChild(alertImage);

    const alertMsg = document.createElement("span");
    alertMsg.innerText = "할 일을 입력해주세요!"
    errorMsg.appendChild(alertMsg);

    if (!inputWrap.querySelector(".inputErrorMsg")) {
    inputWrap.appendChild(errorMsg);
  } 
} 

/* 할일 추가 이벤트 */
function handleTodoList(e) {
  const target = todoList;
  let value = addInput.value;

  //안전하고 충돌 없는 고유 ID(=UUID v4)를 생성함 => IE 지원x
  const id = crypto.randomUUID();

  // trim() :문자열 앞뒤의 공백을 제거
  if (value.trim().length === 0) {
    createErrorMsg();

  } else {
    renderItem({ target, value, id });
    addItemArray(id, value, false);
    updateCount();
    const existingErrorMsg = inputWrap.querySelector(".inputErrorMsg");
    if (existingErrorMsg) existingErrorMsg.remove();
  }

  addInput.value = '';
  addInput.focus();
}

/* 키보드 엔터 이벤트 */
function handleEnterKey(e) {
  if(e.code === 'Enter' && !e.shiftKey) {
    //기본동작 차단하기 위해 (줄바꿈, 폼제출 등등)
    e.preventDefault();

    handleTodoList();
  }
}

addInput.addEventListener('keypress', handleEnterKey);
addBtn.addEventListener('click', handleTodoList);


/* --- 할 일 삭제 --- */

/* 해당 li 돔에서 제거 */
function removeItem(id) {
  const li = todoList.querySelector(`li[data-id="${id}"]`);
  if(li) {
    li.remove();
  }
}

/* 해당 아이템 배열에서도 제거 */
function removeItemArray(id) {
  //filter() : 배열을 순회하며 콜백함수 조건을 만족하는 요소만 모아 새배열 생성
  todoListArray = todoListArray.filter(todo => todo.id !== id);
  saveTodos();
}

/* 삭제 버튼 이벤트 */
function handleRemove(e) {
  //closest(): css선택자와 일치하는 가장 가까운 조상요소를 찾는데 사용.
  const btn = e.target.closest('.delete_btn');
  if(!btn) return;

  const li = btn.closest('li');
  if(!li) return;

  const id = li.dataset.id;

  removeItem(id);
  removeItemArray(id);
  updateCount();
}


/* 전체 삭제 */
function removeAllItem(){
  const allList = todoList.querySelectorAll('li');
  for (let i=0; i<allList.length; i++){
    allList[i].remove();
  }
}

function removeAllItemArray(){
  todoListArray = [];
  saveTodos();
}

function handleRemoveAll(e) {
  const li = todoList.querySelector('li');
  if(!li){
    alert('삭제할 항목이 없습니다.');
    return;
  }

  const confirmAns = confirm('할 일 목록을 전부 삭제하시겠습니까?');
  if(confirmAns){ 
    removeAllItem();
    removeAllItemArray();
    isInitialLoad = true;
    updateCount();
  }
}

allDelBtn.addEventListener('click',handleRemoveAll);
// 삭제 버튼은 동적으로 생성되기 때문에 부모에 이벤트
todoList.addEventListener('click',handleRemove);



/* --- 해야할 일 갯수 표시 --- */

// 할 일 개수 표시를 업데이트
function updateCount(){
    const countWrap = document.querySelector("#todoCount");
    if(!countWrap) return;

    
    let count = 0;
    todoListArray.forEach(todo => {
    const checkbox = document.querySelector(`#chk_${todo.id}`);
    if (checkbox && !checkbox.checked) {
      count++;
    }});

    if(todoListArray.length === 0 && isInitialLoad){
        countWrap.innerHTML = "오늘 할 일을 적어봐 !! 🤓";
        return;
      }
    
    if(todoListArray.length === 0 || count === 0) {
        countWrap.innerHTML =  "오늘 할 일 끝 !! 🥳";
    } else {
      countWrap.innerHTML = `남은 할 일 : <span id="remainingCount">${count}</span>개`;
    };

    isInitialLoad = false; 
}


// 체크박스가 바뀔 때 실행
function handleCheckbox(e) {
    if(e.target.classList.contains("todo_chkbox")){
        updateCount();
        changeArray(e);
    }
}

todoList.addEventListener("change", handleCheckbox);


/* 체크할 때마다 배열 상태 변경 및 저장 */
function changeArray(e) {
  if (!e.target.matches('input[type="checkbox"]')) return;

  const li = e.target.closest('li');
  const id = li.dataset.id;
  const isChecked = e.target.checked;

  const todo = todoListArray.find(todo => todo.id === id);
  if (todo) {
    todo.isChecked = isChecked;
    saveTodos();
  }
};


/* localStorage 저장 */
const TODOS_KEY = "todoArray"
function saveTodos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todoListArray));
}

/* localStorage에서 불러오기 */
const savedTodoList = localStorage.getItem(TODOS_KEY);
if (savedTodoList) {
  const parsedTodoList = JSON.parse(savedTodoList);

  parsedTodoList.forEach( function(item){
  const li = createItem(item.value, item.id, item.isChecked);
  todoList.append(li); 

  // todoListArray에 localStorage 저장 항목 추가
  todoListArray = parsedTodoList.slice();
  isInitialLoad = false;
  updateCount();
  } );

}