const baseUrl = "https://tarmeezacademy.com/api/v1"
let currentPage = 1
let lastPage = 1


// ======= INFINITE SCROLL ========
window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight

    // console.log(endOfPage)

    if(endOfPage && currentPage < lastPage){
        currentPage = currentPage + 1
        getPost(false, currentPage)
    }
})
// ======= // INFINITE SCROLL // ========

setupUi()

function userClicked(userId){
    
    window.location = `profile.html?userid=${userId}`
}




getPost()
function getPost(reload = true, page = 1){
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=6&page=${page}`)
    .then((response)=>{
        toggleLoader(false)
        const posts = response.data.data

        lastPage = response.data.meta.last_page

        if(reload == true){
            
            document.getElementById("posts").innerHTML = ""
        }
        
        for(post of posts){

            const author = post.author
            let  postTitle = ""


            // SHOW OR HIDE (EDIT) BUTTON
            let user = getCurrentUser()

            let isMyPost = user != null && post.author.id == user.id

            let editButtonContent  = ``
            if(isMyPost){

                editButtonContent = `
                    <button class="btn btn-danger" style="float: right; margin-left: 5px" onclick="deletePostBtnClick('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>
                    <button class="btn btn-primary " style="float: right;" onclick="editPostBtnClick('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>
                
                `
            }
            
            if(post.title != null){
                postTitle = post.title
            }
            let content = `
                
                <div class="card shadow-lg p-3 mb-5 bg-body-tertiary">
                    <div class="card-header">
                        <span onclick="userClicked(${author.id})" style="cursor: pointer;">
                            <img src="${author.profile_image}" alt="" >
                            <b>@${author.username}</b>
                        </span>
                        ${editButtonContent}
                    </div>
                    <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
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
                            <span id="post-tags-${post.id}"></span
                                
                        </div>
                    </div>
                </div>
                
            `

            document.getElementById("posts").innerHTML += content
            const cuurentPostTagsId = `post-tags-${post.id}`
            document.getElementById(cuurentPostTagsId).innerHTML = ""
            for(tag of post.tags){
                let tagsContent = `
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;">
                        ${tag.name}
                    </buttton>
                `

                document.getElementById(cuurentPostTagsId).innerHTML += tagsContent
            }
        }
    })
}







function postClicked(postId){
    
    window.location = `postDetails.html?postId=${postId}`
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
        toggleLoader(false)
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
    }).finally(()=>{
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





function createNewPostClicked(){
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""
    

    



    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)
    
    let url = ``
    

    if(isCreate){
        url = `${baseUrl}/posts`
    }else{
        formData.append("_method", "put")

        url = `${baseUrl}/posts/${postId}`

    }
    
    toggleLoader(true)
    axios.post(url, formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
        }
    })
    .then((response)=>{
        toggleLoader(false)
        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New Post Has Been Create", "success")
        getPost()
    })
    .catch((error) =>{
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(()=>{
        toggleLoader(false)
    })
}






function editPostBtnClick(postObject){
    
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    // document.getElementById("post-image-input").files = post.image
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}


function addBtnClicked(){
    
    document.getElementById("post-modal-submit-btn").innerHTML = "Create"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
    // document.getElementById("post-image-input").files = post.image
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}






function deletePostBtnClick(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    
    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}


function confirmPostDelete(){

    const postid = document.getElementById("delete-post-id-input").value 
    const token = localStorage.getItem("token")

    const url = `${baseUrl}/posts/${postid}`
    toggleLoader(true)
    axios.delete(url, {
        headers: {
                "Content-Type": "multipart/form-data",
                "authorization": `Bearer ${token}`
            }
    })
    .then((response) =>{
        toggleLoader(false)
        console.log(response)
        
        const model = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(model)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Sussessfully", "success")
        getPost()
    })
    .catch((error)=>{
        const message = error.response.data.message
        showAlert(message, "danger")
    }).finally(()=>{
        toggleLoader(false)
    })
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



 
function profileClicked(){
    const user = getCurrentUser()
    const userId = user.id
    window.location = `profile.html?userid=${userId}`

}


function setupUi(){
    const token =localStorage.getItem("token")

    const loginDiv = document.getElementById("logged-in-dev")
    const logoutDiv = document.getElementById("logout-div")
    const addBtn = document.getElementById("add-btn")
    if(token == null) { // USER IS GUEST (NOT LOGGED IN)

        loginDiv.style.setProperty("display", "flex", "important")
        
        
        addBtn.style.setProperty("display", "none", "important")
        

        logoutDiv.style.setProperty("display", "none", "important")
    }else{  // FOR LOGGED IN USER
        loginDiv.style.setProperty("display", "none", "important")
        
        addBtn.style.setProperty("display", "block", "important")

        logoutDiv.style.setProperty("display", "flex", "important")


        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
    }
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


