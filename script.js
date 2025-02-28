

const baseUrl = "https://tarmeezacademy.com/api/v1"
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
                    <img src="${post.image}" alt="">
                    <h6 class="mt-1">
                        ${post.created_at}
                    </h6> 
                    <h5>${postTitle}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <i class="fa-solid fa-pen-clip"></i>
                        <span>(${post.comments_count}) Comments</span>
                    </div>
                </div>
            </div>
            
        `

        document.getElementById("posts").innerHTML += content
    }
})

function loginBynClicke(){
    const username = document.getElementById("username-input").value
    const password = document.getElementById("floatingPassword").value
    const params = {
        "username": username,
        "password": password
    }
    const url = `${baseUrl}/login`
    axios.post(url, params)
    .then((response)=>{
        console.log(response.data)
    })
}