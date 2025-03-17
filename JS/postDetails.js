
const baseUrl = "https://tarmeezacademy.com/api/v1"


const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("postId")
console.log(id)



function setupUi(){
    const token =localStorage.getItem("token")

    const loginDiv = document.getElementById("logged-in-dev")
    const logoutDiv = document.getElementById("logout-div")
    const addBtn = document.getElementById("add-btn")
    if(token == null) { // USER IS GUEST (NOT LOGGED IN)

        loginDiv.style.setProperty("display", "flex", "important")
        
        if(addBtn != null){
            addBtn.style.setProperty("display", "none", "important")
        }
        

        logoutDiv.style.setProperty("display", "none", "important")
    }else{  // FOR LOGGED IN USER
        loginDiv.style.setProperty("display", "none", "important")
        if(addBtn != null){
            
            addBtn.style.setProperty("display", "block", "important")
        }

        logoutDiv.style.setProperty("display", "flex", "important")


        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
}












showPost()

function showPost(){
    toggleLoader(true)
    axios.get(`${baseUrl}/posts/${id}`)
    .then((response)=>{
        toggleLoader(false)
        const post = response.data.data
        const comments = post.comments
        const author = post.author

        let  postTitle = ""
        if(post.title != null){
            postTitle = post.title
        }

        let commentsContent = ``

        for(comment of comments){

            commentsContent += `
                <!-- COMMENT -->
                    <div class="p-3" style="background-color: rgb(187, 187, 187); display: flex; align-items: center;">
                        <!-- PROFILE PIC + USERNAME -->
                        <div style="border-right: 1px solid #555454; padding-right: 10px;">
                            <img class="rounded-circle" style="width: 40px; height: 40px;" src="${comment.author.profile_image}" alt="">
                            <b>@${comment.author.username}</b>
                        </div>
                        <!-- // PROFILE PIC + USERNAME // -->
                        <!-- COMMENT'S BODY -->
                        <div style="padding-left: 10px;">
                            ${comment.body}
                        </div>
                        <!-- // COMMENT'S BODY // -->
                    </div>
                    <!-- // COMMENT // -->
                    <hr>
            `

        }

        document.getElementById("username-span").innerHTML = author.name
        
        // document.getElementById("showPost").innerHTML = ""


        const postContent = `
            <div class="card shadow-lg p-3 mb-5 bg-body-tertiary">
                <div class="card-header">
                    <img src="${author.profile_image}" alt="" >
                    <b>@${author.username}</b>
                </div>
                <div class="card-body">
                    <h2>${postTitle}</h2>
                    <p>${post.body}</p>
                    <img src="${post.image}" alt="">
                    <h6 class="mt-1">
                        ${post.created_at}
                    </h6>
                    <hr>
                    <div>
                        <i class="fa-solid fa-pen-clip"></i>
                        <span>(${post.comments_count}) Comments</span>
                    </div>
                </div>

                <div id="comments">
                    ${commentsContent}
                </div>

                <div class="input-group mb-3" id="add-comment-div">
                    <input id="comment-input" type="text" placeholder="Add Your Comment Here.." class="form-control">
                    <button class="btn btn-outline-primary" onclick="createCommentClicked()">Send</button>
                </div>

            </div>
        `

        document.getElementById("showPost").innerHTML = postContent

    })
}











// اضافة تعليق
function createCommentClicked(){
    let commentBody = document.getElementById("comment-input").value
    

    
    let params = {
        "body": commentBody
    }
    let token = localStorage.getItem("token")
    let url = `${baseUrl}/posts/${id}/comments`
    toggleLoader(true)
    axios.post(url, params, {
        headers:{

            "authorization": `Bearer ${token}`
        }
    })
    .then((response)=>{
        console.log(response.data)
        showAlert("The Comment Has Been Created Successfully", "success")
        showPost()
    }).catch((error)=>{
        const errorMessage = error.response.data.message 
        showAlert(errorMessage, "danger")
    }).finally(()=>{
        toggleLoader(false)
    })

}


















function loginBtnClicke(){
    const username = document.getElementById("username-input").value
    const password = document.getElementById("floatingPassword").value

    const params ={
        "username": username,
        "password": password
    }

    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then((response) =>{
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        const modal = document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("Logged In  Sussessfully", "success")
        setupUi()
    })
    .catch((error)=>{
        const message = error.response.data.message
        showAlert(message, "danger")
    })
    .finally(()=>{
        toggleLoader(false)
    })
}








function registerBtnClicke(){
    const ProfileImage = document.getElementById("register-Profile-Image-input").files[0]
    const email = document.getElementById("register-email-input").value
    const Name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value

    let formData = new FormData()
    formData.append("image", ProfileImage)
    formData.append("email", email)
    formData.append("name", Name)
    formData.append("username", username)
    formData.append("password", password)
    


    const url = `${baseUrl}/register`
    toggleLoader(true)
    axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            }
    })
    .then((response)=>{
        console.log(response.data)
        console.log(response.data.token)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        const modal = document.getElementById("Register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New User Registered Sussessfully", "success")
        setupUi()

    }).catch((error)=>{
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(()=>{
        toggleLoader(false)
    })
}










function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out successfully", "success")
    setupUi()
}






function showAlert(customMessage, type="success"){
    const alertPlaceholder = document.getElementById('succes-alert')

    const alert = (message, type) => {
    const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    alert(customMessage, type);
        // todo:
    setTimeout(() => {
        // const alertToHide = bootstrap.Alert.getOrCreateInstance('#succes-alert')
        // alertToHide.dispose()
        // const alert = document.getElementById("succes-alert")
        // const modalAlert = bootstrap.Alert.getInstance(alert)
        // modalAlert.hide()
    }, 2000);
}





function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")

    if(storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
}




function toggleLoader(show = true){
    if(show){
        document.getElementById("loader").style.visibility = "visible"
    }else{
        document.getElementById("loader").style.visibility = "hidden"

    }
}
