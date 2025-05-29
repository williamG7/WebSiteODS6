//progres line
window.addEventListener("scroll", () => {
  const timeline = document.querySelector(".timeline-container");
  const progressLine = document.querySelector(".timeline-progress");
  const dots = document.querySelectorAll(".timeline-dot");
  const stopElement = document.querySelector(".div_card");

  const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
  const timelineHeight = timeline.offsetHeight;
  const stopY = stopElement.getBoundingClientRect().top + window.scrollY;

  const triggerY = window.scrollY + window.innerHeight * 0.8;


  let progressHeight = triggerY - timelineTop;

  const maxProgress = stopY - timelineTop;
  progressHeight = Math.max(0, Math.min(progressHeight, maxProgress));


  progressLine.style.height = `${progressHeight}px`;


  dots.forEach(dot => {
    const dotTop = dot.getBoundingClientRect().top;
    if (dotTop < window.innerHeight * 0.8) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
});




//fondo de div_card
window.addEventListener("scroll", () => {
  const card = document.querySelector(".div_card");
  const triggerY = window.innerHeight * 0.75;

  const cardTop = card.getBoundingClientRect().top;

  if (cardTop < triggerY) {
    card.classList.add("visible");
  } else {
    card.classList.remove("visible");
  }
});


//header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const mainWrapper = document.querySelector('.main_wrapper');
  const maxScroll = mainWrapper.offsetHeight;
  const scrollY = window.scrollY;

  let opacity = 0;

  if (scrollY > 0) {
    opacity = Math.min(scrollY / maxScroll, 1);
  }

  header.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
});





document.addEventListener('DOMContentLoaded', () => {
  const drops = document.querySelectorAll('.drop .water');

  drops[0].style.setProperty('--water-level', '70%');
  drops[1].style.setProperty('--water-level', '50%');
});