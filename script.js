

const baseUrl = "https://tarmeezacademy.com/api/v1"
getPost()
setupUi()
function getPost(){
    axios.get(`${baseUrl}/posts?limit=10`)
    .then((response)=>{
        const posts = response.data.data

        document.getElementById("posts").innerHTML = ""
        
        for(post of posts){

            const author = post.author
            let  postTitle = ""
            if(post.title != null){
                postTitle = post.title
            }
            let content = `
                
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
                            <span id="post-tags-${post.id}">
                                
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






function loginBtnClicke(){
    const username = document.getElementById("username-input").value
    const password = document.getElementById("floatingPassword").value

    const params ={
        "username": username,
        "password": password
    }

    const url = `${baseUrl}/login`
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
}




function registerBtnClicke(){
    const email = document.getElementById("register-email-input").value
    const Name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const params = {
        "name": Name,
        "email": email,
        "username": username,
        "password": password
    }
    const url = `${baseUrl}/register`
    axios.post(url, params)
    .then((response)=>{
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
    })
}





function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out successfully", "success")
    setupUi()
}





function createNewPostClicked(){
    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    const token = localStorage.getItem("token")

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)
    
    const url = `${baseUrl}/posts`
    
    axios.post(url, formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
        }
    })
    .then((response)=>{
        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New Post Has Been Create", "success")
        getPost()
    })
    .catch((error) =>{
        const message = error.response.data.message
        showAlert(message, "danger")
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







function setupUi(){
    const token =localStorage.getItem("token")

    const loginDiv = document.getElementById("logged-in-dev")
    const logoutDiv = document.getElementById("logout-div")
    const addBtn = document.getElementById("add-btn")
    if(token == null) {

        loginDiv.style.setProperty("display", "flex", "important")
        
        addBtn.style.setProperty("display", "none", "important")

        logoutDiv.style.setProperty("display", "none", "important")
    }else{
        loginDiv.style.setProperty("display", "none", "important")
        
        addBtn.style.setProperty("display", "block", "important")

        logoutDiv.style.setProperty("display", "flex", "important")
    }
}


