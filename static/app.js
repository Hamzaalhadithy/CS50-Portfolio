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
                        style="width: 90%;" src="${article.image_url}" alt="${article.title}" /></div>
                <div class="d-flex flex-column gap-2 col justify-content-start">
                    <div class="">
                        <h2>${article.title}</h2>
                    </div>
                    <div class="">
                        <p>${article.content}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span style="font-size: 10pt;">Published ${formated}</span>
                        ${USER_ID ? `
                            <form action="/blog" method="post">
                                <input type="hidden" value="${article.id}">
                                <span class="gap-3">
                                    <button class="btn btn-primary" name="edit" value="edit">Edit</button>
                                    <button class="btn btn-danger" name="delete" value="delete">Delete</button>
                                </span>
                            </form>
                        ` : ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      `;
    }
    article_container.innerHTML += html;
  });
}