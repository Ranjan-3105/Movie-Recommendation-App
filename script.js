document.addEventListener("mousemove",function(dets){
    document.querySelector("#cursor").style.left = dets.x + "px";
    document.querySelector("#cursor").style.top = dets.y + "px";
    document.querySelector("#cursor-blur").style.left = dets.x-150 + "px";
    document.querySelector("#cursor-blur").style.top = dets.y-150 + "px";
});
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let index = 0;

function showSlide(n) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[n].classList.add("active");
  dots[n].classList.add("active");
}

function nextSlide() {
  index++;
  if (index >= slides.length) index = 0;
  showSlide(index);
}

setInterval(nextSlide, 3000); // change every 3 sec
