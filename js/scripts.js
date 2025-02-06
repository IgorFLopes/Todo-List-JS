// Seleção de elementos

const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const searchInput = document.querySelector("#search-input")
const eraseBtn = document.querySelector("#erase-button")
const filterBtn = document.querySelector("#filter-select")


// vou criar uma variavel para receber o texto antigo, antes da edição
let oldInputValue


// Funções 

// como estamos esperando um "texto" deixei como "text"
const saveTodo = (text, done = 0, save = 1) => {
// estamos criando uma div, e dentro dessa div, vamos colocar a classe ".todo" "Criando a div externa que engloba tudo."
    const todo = document.createElement("div")
    todo.classList.add("todo")

    // agora preciso criar meu titulo.
    const todoTitle = document.createElement("h3")
    // como vou inserir o texto nesse elemento que criei? acessar a propriedade "innerText" vou atribuir a text, mesmo que recebo da função, que vai pelo valor do input
    todoTitle.innerText = text
    // depois eu tenho que colocar dentro do meu "todo" meu "h3"
    todo.appendChild(todoTitle)

    // agora os proximos elementos a ser criado são os botões! "Primeiro eu crio o elemento, depois adiciono a classe nele" 

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    // agora que tenho o elemento criado e classe, priciso colocar o icone dentro dele. Não é innerText, agora é com "InnerHTML"
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    // agora o botão está pronto, preciso colocar ele no "todo"
    todo.appendChild(doneBtn)

    // agora copiei os elementos acima para criar os proximos botões, vamos lá
    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    // agora o botão está pronto, preciso colocar ele no "todo"
    todo.appendChild(editBtn)

    // de baixo o proximo botão

    const removeBtn = document.createElement("button")
    removeBtn.classList.add("remove-todo")
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(removeBtn)


    // Utilizando dados da localStorage

    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({ text, done })
    }


    // agora vamos pegar a lista do 'todo' e dar um appendChild. Vou colocar o "todo" na lista geral! Colocando ele na div principal.(pai)
    
    todoList.appendChild(todo)

    // Para limpar o valor após o usuário digitar.

    todoInput.value = ""

    // para focar "adicione sua tarefa"

    todoInput.focus()
}

// vamos criar a função toggleForms ( primeira coisa que acontece quando a pessoa clica na opção de edição)

    const toggleForms = () => {
        editForm.classList.toggle("hide")
        todoForm.classList.toggle("hide")
        todoList.classList.toggle("hide")
    }


    const updateTodo = (text) => {

        const todos = document.querySelectorAll(".todo")

        todos.forEach((todo) => {

            let todoTitle = todo.querySelector("h3")

            if(todoTitle.innerText === oldInputValue) {
                todoTitle.innerText = text

                updateTodoLocalStorage(oldInputValue, text)
            }

        })
    }

// vou criar outra função, essa em especifico para buscar! 

    const getSearchTodos = (search) => {

        const todos = document.querySelectorAll(".todo")

        todos.forEach((todo) => {
            let todoTitle = todo.querySelector("h3").innerText.toLowerCase()

            // agora vou criar outra váriavel para padronizar o search, para que ele também seja LeLowerCase
            const normalizedSearch = search.toLowerCase()

            todo.style.display = "flex"

            if(!todoTitle.includes(normalizedSearch)) {
                todo.style.display = "none"
            }
        })
    }

    // agora vou criar uma função para filterTodos, filtrar as informações;

        const filterTodos = (filterValue) => {

            const todos = document.querySelectorAll(".todo")

            switch(filterValue) {
                case "all":
                  todos.forEach((todo) => todo.style.display = "flex")
                  break

                  case "done":
                    todos.forEach((todo) => todo.classList.contains("done") 
                    ? (todo.style.display = "flex") 
                    : (todo.style.display = "none")
            
                  );  
                   break;

                   
                  case "todo":
                    todos.forEach((todo) => 
                    !todo.classList.contains("done") 
                      ? (todo.style.display = "flex") 
                      : (todo.style.display = "none")
                   );  
                    break;

                 default:
                   break;
            }
        }





// Eventos
// sempre que for criar um evento vamos usar o "addEventListener"

todoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    // colocamos o "e.preventDefault para não enviar para o backend"

    // agora vou pegar o valor do input que o usuário digita! ->

    const inputValue = todoInput.value

    // armazenando o input em uma váriavel, vamos realizar uma pequena validação através do IF para que o usuário não crie uma tarefa sem titulo.

    if(inputValue) {
        //vou criar uma função para salvar o "todo" ^logo acima^ 
        saveTodo(inputValue)
    }
})

// Agora vamos criar o segundo Evento (2) Evento para clicar nos botões

document.addEventListener("click", (e) => {

    const elementTarget = e.target
    // vamos selecionar o elemento pai, mas proximo
    const elementFather = elementTarget.closest("div")
    // agora vou precisar mapear a edição tanto o titulo do input como o valor da edição depois, pois não tenho nenhum id para saber qual item estou editando.
    // então vai ser com base no titulo.
    let todoTitle

    if(elementFather && elementFather.querySelector("h3")) {
        todoTitle = elementFather.querySelector("h3").innerText
    }


    if(elementTarget.classList.contains("finish-todo")) {
        elementFather.classList.toggle("done")

        updateTodoStatusLocalStorage(todoTitle)
    }
// diferente do "add" que apenas adiciona, o "toggle" tira e coloca...

// Seguindo essa mesma ideia vamos para o remove que é mais simples!.

    if(elementTarget.classList.contains("remove-todo")) {
        // o que precisamos remover? elemento pai
        elementFather.remove()

        removeTodoLocalStorage(todoTitle)
    }

    // agora vamos fazer o de edição, um pouco mais complexo...

    if(elementTarget.classList.contains("edit-todo")) {
    // para fazer a edicação a primeira coisa que vamos fazer é esconder o formulário e mostrar a edição, para isso
    //  vamos criar uma função para o mesmo:
       toggleForms()

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }

})


// criando um evento para CANCELAR A EDITAÇÃO 

cancelEditBtn.addEventListener("cllick", (e) => {
    e.preventDefault()

    toggleForms()
})


// criando um evento para clicar no botão e alterar o texto, se submeter ao formulário

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const editInputValueNew = editInput.value

    if(editInputValueNew) {
        updateTodo(editInputValueNew)
    }

    toggleForms()
})


// agora vou criar um evento para minha busca (search)

searchInput.addEventListener("keyup", (e) => {
// logo abaixo estou pegando o valor do input
    const search = e.target.value

    // função abaixo
    getSearchTodos(search)
})


// Agora vamos criar um evento para resetar a busca no botão que criamos para o mesmo.

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault()

    searchInput.value = ""

    searchInput.dispatchEvent(new Event("keyup"))
})

// agora vamos criar um novo

filterBtn.addEventListener("change", (e) => {

    const filterValue = e.target.value
    filterTodos(filterValue)

})

// Local Storge

// para pegar o todo do local storge vamos criar uma função

const getTodosLocalStorge = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos;

}


const loadTodos = () => {
    const todos = getTodosLocalStorge()

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })

}


const saveTodoLocalStorage = (todo) => {

    // pegar todos os todos da Local Storge

    const todos = getTodosLocalStorge()


    // adicionar o novo todo no array
    todos.push(todo)


    // salvar tudo na local storge novamente
    localStorage.setItem("todos", JSON.stringify(todos))

}

// vamos criar uma função para remover o todo de vez, até mesmo no nosso local storge.

const removeTodoLocalStorage = (todoText) => {

    const todos = getTodosLocalStorge()

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("todos", JSON.stringify(filteredTodos))

}


// função/evento para marcar como true ou false se foi ou não ticado como DONE. 
const updateTodoStatusLocalStorage = (todoText) => {
    
    const todos = getTodosLocalStorge()

    todos.map((todo) => 
        todo.text === todoText ? (todo.done = !todo.done) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos))

}

// função/evento para editar o texto do todo no local storge

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    
    const todos = getTodosLocalStorge()

    todos.map((todo) => 
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos))

}

loadTodos();