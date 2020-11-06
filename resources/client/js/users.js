"use strict";
function getUsersList() {
    //debugger;
    console.log("Invoked getUsersList()");                                                                              //console.log your BFF for debugging client side - also use debugger statement
    const url = "/users/list/";    		                                                                                // API method on web server will be in Users class, method list
    fetch(url, {
        method: "GET",				                                                                                    //Get method
    }).then(response => {
        return response.json();                                                                                         //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {                                                                      //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));                                                                            // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatUsersList(response);                                                                                  //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}

function formatUsersList(myJSONArray){
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.userID + "<td><td>" + item.userName + "<tr><td>";
    }
    document.getElementById("UsersTable").innerHTML = dataHTML;
}

/*getUser() returns one row of data from the database using a GET and path parameter*/
function getUser() {
    console.log("Invoked getUser()");                                                                                   //console.log your BFF for debugging client side
    const userID = document.getElementById("userID").value;                                                             //get the UserId from the HTML element with id=userID
    //let userID = 1; 			                                                                                        //You could hard code it if you have problems
    //debugger;				                                                                                            //debugger statement to allow you to step through the code in console dev F12
    const url = "/users/getUser/";                                                                                      // API method on webserver
    fetch(url + userID, {                                                                                               // userID as a path parameter
        method: "GET",
    }).then(response => {
        return response.json();                                                                                         //return response to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {                                                                      //checks if response from server has an "Error"
            alert(JSON.stringify(response));                                                                            // if it does, convert JSON object to string and alert
        } else {
            document.getElementById("DisplayOneUser").innerHTML = response.userID + " " + response.userName;  //output data
        }
    });
}
                                                                                                                        /*Add the form elements to index.html inside <body tags*/

<form id="userDetails">
 User id: <input type="text" id="userID">
</form>
<button onClick='getUser();'>Run getUser</button>
<div id="DisplayOneUser"/>
<br>

                                                                                                                        /*addUser function to add a user to the database*/
function addUser() {
    console.log("Invoked AddUser()");
    const formData = new FormData(document.getElementById('InputUserDetails'));
    let url = "/users/add";
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            window.open("/client/welcome.html", "_self");                                                               //URL replaces the current page.  Create a new html file
        }                                                                                                               //in the client folder called welcome.html
    });
}

                                                                                                                        /*Add the form elements to index.html inside <body tags*/
<form id="InputUserDetails">
    Username: <input type="text" name="userName">
    Password: <input type="text" name="PassWord">
    Skill Level: <input type="text" name="UserSkillLevel">
</form>
<button onClick='addUser();'>Add User</button>
                                                                                                                        /*If you want two bits of data but there is no form, you can create a form and stick the values in eg:*/

function postWeightAdd() {
    console.log("invoked postWeightAdd()");
    const date = document.getElementById('datepicker').value;
    const weightInKG = document.getElementById('weightInKG').value;
    var formData = new FormData();
    formData.append('date', date);
    formData.append('weightInKG', weightInKG);
    var url = "/weight/add";
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json()                                                                                          //method returns a promise, have to return from here to get text
    }).then(response => {
        if (response.hasOwnProperty("Error")) {                                                                         //checks if response from server has a key "Error"
            alert(JSON.stringify(response));                                                                            // if it does, convert JSON object to string and alert
        } else {
            getWeightList();
        }
    });
}

function UsersLogin() {
    //debugger;
    console.log("Invoked UsersLogin() ");
    let url = "/users/login";
    let formData = new FormData(document.getElementById('LoginForm'));
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
    return response.json();                 //now return that promise to JSON
    }).then(response => {

        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            Cookies.set("Token", response.Token);
            Cookies.set("UserName", response.UserName);
            window.open("index.html", "_self");       //open index.html in same tab
        }
    });
}

function UsersLogout() {
    //debugger;
    console.log("Invoked UsersLogout()");
    let url = "/users/logout";
    fetch(url, {
        method: "POST"
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {

        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            Cookies.remove("Token", response.Token);    //UserName and Token are removed
            Cookies.remove("UserName", response.UserName);
            window.open("index.html", "_self");       //open index.html in same tab
        }
    });
}
