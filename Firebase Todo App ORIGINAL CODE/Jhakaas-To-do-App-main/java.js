var x = "";
var title = "";
var todos = [];
var todoKeys = [];
var userUID = "";
var userName = "";

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user is signed in at Todo");
    userUID = user.uid;
    getTodos(user.uid);
  } else {
    alert(
      "Your login session has expired or you have logged out, login again to continue"
    );
    location = "../index.html";
  }
});

auth.onAuthStateChanged((user) => {
  const username = document.getElementById("username");
  if (user) {
    fs.collection("users")
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        // console.log(snapshot.data().Name);
        username.innerText = snapshot.data().Name;
      });
  } else {
    // console.log('user is not signed in to retrive username');
  }
});

function addTodo(ev) {
  ev.preventDefault();
  x = document.getElementById("text-feild").value;
  title = document.getElementById("get-title").value;

  var date = new Date().toLocaleDateString();
  // var uid = Date.now().toString(36) + Math.random().toString(36).substr(2)
  var todo = {
    item: x,
    date: date,
    title: title,
    uid: userUID,
    // uid: uid
  };
  // saving to db
  var db = firebase.firestore().collection(`todos`);
  db.add(todo)
    .then(() => {
      console.log("todo added!");
      getTodos(userUID);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  return false;
}

function resetValues() {
  document.getElementById("text-feild").value = "";
  document.getElementById("get-title").value = "";
  x = "";
  title = "";
}

function remove(index) {
  document.getElementById("table-body").innerHTML = "";
  var key = todoKeys[index];
  firebase
    .firestore()
    .collection("todos")
    .doc(key)
    .delete()
    .then(() => {
      // todos = []
      getTodos(userUID);
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

function clear() {
  todos = [];
  document.getElementById("table-body").innerHTML = " ";
  return false;
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
    });
  return false;
}

function getTodos(userUID) {
  todos = [];
  todoKeys = [];
  var docRef = firebase
    .firestore()
    .collection("todos")
    .where("uid", "==", userUID);

  docRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        todos.push(doc.data());
        todoKeys.push(doc.id);
        document.getElementById("table-body").innerHTML = "";
        todos.forEach((item, index) => {
          document.getElementById("table-body").innerHTML += `

        <tr>
          <td>
            ${index + 1}
          </td>
          <td>
            ${item.title}
          </td>
          <td>
            ${item.item}
          </td>
          <td>
            ${item.date}
          </td>
          <td>
            <button onclick="remove(${index})"  class="btn btn-danger"
            >
              Delete &nbsp; &nbsp;
            </button></td> 
        </tr>


        `;
        });
        resetValues();
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
