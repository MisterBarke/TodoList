const categorieInput = document.getElementById("categorie");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descInput = document.getElementById("desc-input");
const statusInput = document.getElementById("status-input");
const submitTodo = document.getElementById("submitTodo");
const descriptionContent = document.getElementById("description-content");
const preview = document.getElementById("preview-ul");
const previewContent = document.getElementById("preview2");
const notification = document.getElementById("notif");

const tasksRows = document.getElementById('tasks-rows');
const tableRow = document.createElement('tr');
let debut = JSON.parse(localStorage.getItem('debut')) || 0;
let moyen = JSON.parse(localStorage.getItem('moyen')) || 0;
let terminer = JSON.parse(localStorage.getItem('terminer')) || 0;
let tasksList = []; 
const AddTasks = ()=>{
  
  const task = {
    date: dateInput.value,
    title: titleInput.value,
    categorie: categorieInput.value,
    description : descInput.value,
    status : statusInput.value,
    id: Date.now()  
  };
  tasksList.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasksList));
if (statusInput.value === 'Début'){
  debut = debut+1
}else if (statusInput.value === 'Moyen'){
  moyen = moyen+1;
}else if(statusInput.value === 'Terminer'){
  terminer = terminer+1;
}
}

function displayTasks() {

  const tasksRows = document.getElementById('tasks-rows');
  tasksRows.innerHTML = '';
  // Efface le contenu existant pour éviter de dupliquer les tâches

  tasksList.forEach((task, index) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${task.date}</td>
      <td>${task.title}</td>
      <td>${task.categorie}</td>
      <td class="op-icons">
        <i class="bi bi-eye"></i>
        <i class="bi bi-pencil"></i>
        <i class="bi bi-trash3"></i>
      </td>`;
    tasksRows.appendChild(tableRow);
    tableRow.addEventListener('click', ()=>{
      descriptionContent.innerHTML = task.description
    });
    const eyeIcon = tableRow.querySelector('.bi-eye');
    eyeIcon.addEventListener('click', () => {
      previewContent.style.display = 'block';
      preview.innerHTML = ` 
      <ul class="singleUl"><li>Title</li> <li>${task.title}</li></ul>
      <ul class="singleUl"><li>Categorie</li> <li>${task.categorie}</li></ul>
      <ul class="singleUl"><li>Description</li> <li>${task.description}</li></ul>
      <ul class="singleUl"><li>Date</li> <li>${task.date}</li></ul>
      <ul class="singleUl"><li>Status</li> <li>${task.status}</li></ul>`;
    });  
    let id = task.id
    const trashIcon = tableRow.querySelector('.bi-trash3');
    trashIcon.addEventListener('click', ()=>{
      const deletedTask = tasksList.find((task) => task.id === id);

  if (deletedTask.status === 'Début') {
    debut--;
  } else if (deletedTask.status === 'Moyen') {
    moyen--;
  } else if (deletedTask.status === 'Terminer') {
    terminer--;
  }
      tasksList = tasksList.filter((task) => task.id !== id);
      myNewChart.update();
      localStorage.setItem('tasks', JSON.stringify(tasksList));
      localStorage.setItem('debut', JSON.stringify(debut));
  localStorage.setItem('moyen', JSON.stringify(moyen));
  localStorage.setItem('terminer', JSON.stringify(terminer));
      tableRow.innerHTML = '';


      displayTasks();
      createChart();

    });
    const pencilIcons = tableRow.querySelector('.bi-pencil');
    pencilIcons.addEventListener('click', ()=>{
      console.log(task.title);
      const taskToEdit = tasksList[index];
      console.log(taskToEdit);
      dateInput.value = taskToEdit.date;
    titleInput.value = taskToEdit.title;
    categorieInput.value = taskToEdit.categorie;
    descInput.value = taskToEdit.description;
    statusInput.value = taskToEdit.status;

    if (statusInput.value === 'Début') {
      debut--;
    } else if (statusInput.value === 'Moyen') {
      moyen--;
    } else if (statusInput.value === 'Terminer') {
      terminer--;
    }
    localStorage.setItem('tasks', JSON.stringify(tasksList));
    localStorage.setItem('debut', JSON.stringify(debut));
localStorage.setItem('moyen', JSON.stringify(moyen));
localStorage.setItem('terminer', JSON.stringify(terminer));

    const saveButton = document.createElement('button');
    saveButton.addEventListener('click', () => {
      // Mettez à jour les propriétés de la tâche avec les nouvelles valeurs
      console.log(taskToEdit.date);
      taskToEdit.date = dateInput.value;
      taskToEdit.title = titleInput.value;
      taskToEdit.categorie = categorieInput.value;
      taskToEdit.description = descInput.value;
      taskToEdit.status = statusInput.value;

      if (taskToEdit.status === 'Début') {
        debut++;
      } else if (taskToEdit.status === 'Moyen') {
        moyen++;
      } else if (taskToEdit.status === 'Terminer') {
        terminer++;
      }

      localStorage.setItem('tasks', JSON.stringify(tasksList));
      localStorage.setItem('debut', JSON.stringify(debut));
  localStorage.setItem('moyen', JSON.stringify(moyen));
  localStorage.setItem('terminer', JSON.stringify(terminer));

      localStorage.setItem('tasks', JSON.stringify(tasksList));

      displayTasks();

      createChart();
     
      dateInput.value = '';
      titleInput.value = '';

      descInput.value = '';

      saveButton.remove();
    });

    
    saveButton.textContent = 'Enregistrer';
    saveButton.classList.add('btn1');
    const buttonContainer = document.querySelector('.btn-container');
    buttonContainer.appendChild(saveButton);
    myNewChart.update();
    })
  });
}

document.body.addEventListener('click', (event) => {
  const clickedElement = event.target;

  
  if (!clickedElement.classList.contains('bi-eye')) {
    previewContent.style.display = 'none';
  };
});


document.addEventListener('DOMContentLoaded', () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasksList = JSON.parse(savedTasks);
   
    displayTasks();
  }

  createChart();
});

submitTodo.addEventListener('click', (e)=>{
e.preventDefault();
taskAddedAlert()
AddTasks();
displayTasks();
createChart();
dateInput.value = '';
titleInput.value = '';

descInput.value = '';

localStorage.setItem('debut', JSON.parse(debut));
localStorage.setItem('moyen', JSON.parse(moyen));
localStorage.setItem('terminer', JSON.parse(terminer));
});

const ctx = document.getElementById('myChart');
let myNewChart;
function createChart(){  
   if (myNewChart) {
    myNewChart.destroy();
  }
 myNewChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    datasets: [{
      label: '# of Votes',
      data: [debut, moyen, terminer],
      backgroundColor: ["red", "blue", "black"],
      borderWidth: 2
    }]
  },
  options: {
    cutout: 2,
    maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      display : false,
    },
   
  }
}
});

myNewChart.update();

}

const taskAddedAlert = ()=>{
  notification.setAttribute('style', 'display: block' );
setTimeout(() => {
 notification.setAttribute('style', 'display: none');
}, 2000);
}