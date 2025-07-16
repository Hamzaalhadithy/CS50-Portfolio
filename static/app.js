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
