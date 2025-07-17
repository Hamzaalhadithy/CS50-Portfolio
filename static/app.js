if (window.location.pathname == '/'){

  document.getElementById('home').classList.add("active");
  document.getElementById('home').classList.add("nav-link-active");
  let doing = document.getElementById('doing');
  setInterval(change, 1000)
  const things = [
      "Developer",
      "Student",
      "Gamer",
      "Software Engineer",
  ]
  const emojis = [
      "🧑‍🏫",
      "🧑‍🎓",
      "🎮",
      "🧑‍💻",
  ]
  let count = 0;
  function change(){
      if(count == things.length){
          count = 0;
      }
      doing.innerHTML = `<span id="doing"><b> ${emojis[count]} </b> ${things[count]} </span>`;
      count++;
  }
  setTimeout(() => {
    alert("Hey! You have been staring for too long? am I that handsome? ");
  }, 120000);
}
if (window.location.pathname == '/blog'){
  document.getElementById('blog').classList.add('active');
  document.getElementById('blog').classList.add('nav-link-active');
  
}
if (window.location.pathname == '/projects')
  {
  document.getElementById('projects').classList.add('active');  
  document.getElementById('projects').classList.add('nav-link-active');  
}
if (window.location.pathname == '/contact')
  {
  document.getElementById('contact').classList.add('active');
  document.getElementById('contact').classList.add('nav-link-active');
  
}
if (window.location.pathname == '/blog')
{
  article_container = document.getElementById('article-container');
  document.addEventListener('DOMContentLoaded', async function(event){
    let response = await fetch("/articles");
    let articles = await response.json();
    let html = ''
    for(article of articles){
      let date = new Date(article.timestamp)
      let formated = date.toLocaleString('en-TR',{
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        }
      );
      html +=`
          <div class="article-card d-flex align-items-center m-2 glassy" id="article">
            <div class="row gap-2">
                <div class="d-flex article-image col-lg-3 justify-content-end"><img class="rounded-circle"
                        style="width: 95%;" src="${article.image_url}" alt="${article.title}" /></div>
                <div class="d-flex flex-column gap-2 col justify-content-start">
                    <div class="">
                        <h2>${article.title}</h2>
                    </div>
                    <div class="">
                        <p>${(article.content.length < 150) ? article.content : article.content.slice(0, 150) + "...."}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span style="font-size: 10pt;">Published ${formated}</span>
                        <span class="gap-3">
                        <button class="btn btn-primary read-btn" data-id="${article.id}">Read More</button>
                        ${USER_ID ? `
                                    <button class="btn btn-primary edit-btn" data-id="${article.id}">Edit</button>
                                    <button class="btn btn-danger delete-btn" data-id="${article.id}"  name="delete" value="delete">Delete</button>
                                    ` : ''}
                          </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
      `;
    }
    article_container.innerHTML += html;
    if(USER_ID){
      let currentArticleId = null;

      document.querySelectorAll(".edit-btn").forEach(button =>{
        button.addEventListener('click', ()=>{
          currentArticleId = button.dataset.id;

          const articleCard = button.closest('.article-card');
          document.getElementById("edit-title").value = articleCard.querySelector("h2").innerText;
          document.getElementById("edit-image").value = articleCard.querySelector("img").src;
          document.getElementById("edit-content").value = articleCard.querySelector("p").innerText;

          new bootstrap.Modal(document.getElementById("editModal")).show();
        });
      });

      document.getElementById("save-edit").addEventListener("click", async () => {
        const updatedArticle = {
          title: document.getElementById("edit-title").value,
          image_url: document.getElementById("edit-image").value,
          content: document.getElementById("edit-content").value
        };

        const response = await fetch(`/articles/${currentArticleId}/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedArticle)
        });

        const result = await response.json();

        if(response.ok){
          alert("Article Updated Successfully");
          location.reload();
        }else{
          alert("Error " + result.error);
        }
      });
    
      document.querySelectorAll(".delete-btn").forEach(button =>{
        button.addEventListener('click', ()=>{
          currentArticleId = button.dataset.id
          new bootstrap.Modal(document.getElementById("DeleteModal")).show();
        })
      });

      document.getElementById("delete").addEventListener('click', async ()=>{
        const response = await fetch(`/articles/${currentArticleId}/delete`, {
          method: "DELETE",
        });

        const result = await response.json()

        if(response.ok){
          alert("Article Deleted Successfully");
          location.reload();
        }
        else{
          alert("Error " + result.error);
        }
      });
      
      document.getElementById("create-article").addEventListener('click', ()=>{
        new bootstrap.Modal(document.getElementById("CreateModal")).show();
      })
    
      document.getElementById("create").addEventListener('click', async () =>{

        const createdArticle = {
          title: document.getElementById("create-title").value,
          image_url: document.getElementById("create-image").value,
          content: document.getElementById("create-content").value,
        }

        const response = await fetch('/articles/create', {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify(createdArticle),
        });

        const result = await response.json()

        if(response.ok){
          alert("Article Created Successfully!");
          location.reload()
        }else{
          alert("Error " + result.error)
        }
      })
      }

    document.querySelectorAll(".read-btn").forEach(button =>{
      button.addEventListener('click', async ()=>{
        let response = await fetch(`/articles/${button.dataset.id}`)
        result = await response.json();
        
        document.getElementById("article-image").src = result.image_url;
        document.getElementById("article-title").innerText = result.title;
        document.getElementById("article-content").innerText = result.content;

        new bootstrap.Modal(document.getElementById("readArtical")).show();
      });
    });
  });
}
