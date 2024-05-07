
const firebaseConfig = {
    apiKey: "AIzaSyAcQ-2znaa6cd9Mvfvt4Rm4CIhwHjkvSO4",
    authDomain: "htmxcsci322.firebaseapp.com",
    projectId: "htmxcsci322",
    storageBucket: "htmxcsci322.appspot.com",
    messagingSenderId: "707612747446",
    appId: "1:707612747446:web:9a7b37ec260ed7a1f8a817",
    measurementId: "G-FK270PWKYW"
};
firebase.initializeApp(firebaseConfig);
// Assign Firebase Authentication instance to window.auth
window.auth = firebase.auth();

// Assign Firestore instance to window.db
window.db = firebase.firestore();

document.addEventListener('DOMContentLoaded', (event) => {
    window.onload = function() {
      // Add an onAuthStateChanged listener
      window.auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, hide the sign up and sign in forms
          document.getElementById('signUpForm').style.display = 'none';
          document.getElementById('signInForm').style.display = 'none';
        } else {
          // User is signed out, show the sign up and sign in forms
          document.getElementById('signUpForm').style.display = 'block';
          document.getElementById('signInForm').style.display = 'block';
        }
      });
    };
  
    document.getElementById('signInForm').addEventListener('submit', function(e) {
      e.preventDefault();
      window.auth.signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value)
        .catch(function(error) {
          console.error('Error signing in: ', error);
        });
    });
  
    // Sign up form submission
    document.getElementById('signUpForm').addEventListener('submit', function(e) {
      e.preventDefault();
      window.auth.createUserWithEmailAndPassword(document.getElementById('signUpEmail').value, document.getElementById('signUpPassword').value)
        .catch(function(error) {
          console.error('Error signing up: ', error);
        });
    });
  
    // Add task form submission
    document.getElementById('addTaskForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const taskName = document.getElementById('task').value;
      const user = window.auth.currentUser;
      if (user) {
        window.db.collection('tasks').doc(user.uid).collection('userTasks').add({
          name: taskName,
          completed: false
        }).then(function() {
          document.getElementById('task').value = '';
          getTasks(user.uid);
        });
      }
    });
  
    function getTasks(userId) {
      console.log('Getting tasks for user:', userId);
      window.db.collection('tasks').doc(userId).collection('userTasks').onSnapshot(function(snapshot) {
        console.log('Received snapshot:', snapshot);
        const tasksContainer = document.getElementById('tasksContainer');
        const completedTasksContainer = document.getElementById('completedTasksContainer');
        tasksContainer.innerHTML = '';
        completedTasksContainer.innerHTML = '';
        snapshot.forEach(function(doc) {
          console.log('Task data:', doc.data());
          const task = document.createElement('div');
          task.className = 'task';
          task.id = doc.id;  // Set the id of the task div to the taskId
    
          const taskName = document.createElement('span');
          taskName.textContent = doc.data().name;
          task.appendChild(taskName); // Append taskName to task
    
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = doc.data().completed;
          checkbox.addEventListener('click', function() {
            toggleTask(userId, doc.id, !doc.data().completed);
          });
          task.appendChild(checkbox);
    
          if (doc.data().completed) {
            completedTasksContainer.appendChild(task);
          } else {
            tasksContainer.appendChild(task);
          }
          console.log('Task added to tasksContainer:', task);
        });
      });
    }
    
    function toggleTask(userId, taskId, completed) {
      window.db.collection('tasks').doc(userId).collection('userTasks').doc(taskId).update({
        completed: completed
      }).then(function() {
        const task = document.getElementById(taskId);
        if (completed) {
          task.classList.add('completed');
        } else {
          task.classList.remove('completed');
        }
      });
    }
      
      // Get tasks when user state changes
      window.auth.onAuthStateChanged(function(user) {
        if (user) {
          getTasks(user.uid);
        }
      });
});