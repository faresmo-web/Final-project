setupUi()
getUser()
getPost()

function getCurrentUserId(){
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}


function getUser(){
    const id = getCurrentUserId()
    toggleLoader(true)
    axios.get(`${baseUrl}/users/${id}`)
    .then((response)=>{
        toggleLoader(false)
        const user = response.data.data

        document.getElementById("header-image").src = user.profile_image
        document.getElementById("main-info-email").innerHTML = user.email
        document.getElementById("main-info-name").innerHTML = user.name
        document.getElementById("main-info-username").innerHTML = user.username

        document.getElementById("name-posts").innerHTML = user.name


        document.getElementById("posts-count").innerHTML = user.posts_count
        document.getElementById("comments-count").innerHTML = user.comments_count

    })

}






function getPost(){
    const id = getCurrentUserId()
    toggleLoader(true)
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response)=>{

        toggleLoader(false)

        
        const posts = response.data.data

        
        document.getElementById("user-posts").innerHTML = ""
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
                        <img src="${author.profile_image}" alt="" >
                        <b>@${author.username}</b>
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

            document.getElementById("user-posts").innerHTML += content
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






function toggleLoader(show = true){
    if(show){
        document.getElementById("loader").style.visibility = "visible"
    }else{
        document.getElementById("loader").style.visibility = "hidden"

    }
}
