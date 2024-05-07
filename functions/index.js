const functions = require('firebase-functions');
const firebase = require('firebase-admin'); 

// Add task
function addTask(userId, taskName) {
    const task = {
        name: taskName,
        completed: false
    };
    return db.collection('tasks').doc(userId).set({
        [Date.now()]: task
    }, { merge: true });
}

// Toggle task
function toggleTask(userId, taskId, completed) {
  return db.collection('tasks').doc(userId).get().then(doc => {
    const tasks = doc.data().tasks;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = completed;
      return db.collection('tasks').doc(userId).update({ tasks: tasks });
    }
  });
}

// Delete task
function deleteTask(userId, taskId) {
  return db.collection('tasks').doc(userId).get().then(doc => {
    const tasks = doc.data().tasks;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      return db.collection('tasks').doc(userId).update({ tasks: tasks });
    }
  });
}

// Get tasks
function getTasks(userId) {
  return db.collection('tasks').doc(userId).get().then(doc => doc.data().tasks || []);
}

module.exports = { addTask, toggleTask, deleteTask, getTasks };
  
