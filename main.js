gsap.registerPlugin(ScrollTrigger);
const hd=document.getElementById('hd'),pin=document.querySelector('.pin'),mq=document.querySelector('.mq div');
mq.innerHTML+=mq.innerHTML;
document.querySelectorAll('#modes button').forEach(b=>b.addEventListener('click',()=>{pin.dataset.m=['soporte','tripode','selfie','car'].indexOf(b.dataset.m)}));
const cl=x=>Math.min(1,Math.max(0,x)),sm=t=>t*t*(3-2*t),bx=document.getElementById('bx');let last=-1;
ScrollTrigger.create({trigger:'.story',start:'top top',end:'bottom bottom',onUpdate:s=>{const p=s.progress,i=p<.26?0:p<.66?1:2;
 T3.ex=sm(cl((p-.16)/.2))-sm(cl((p-.56)/.18));
 if(i!==last){pin.dataset.s=i;if(i<2){if(bx.classList.contains('on'))bx.click();document.querySelector('#modes [data-m="tripode"]').click()}last=i}}});
ScrollTrigger.create({start:60,end:'max',onUpdate:s=>hd.classList.toggle('s',s.scroll()>60)});
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)',()=>{
 gsap.to('#bar',{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
 // Imágenes: escala 0.7→1.2 y opacidad 0→1 en 600 px; parallax 20 % más lento que el scroll
 document.querySelectorAll('.imgcol').forEach(col=>{
  const par=col.querySelector('.par'),sc=col.querySelector('.scl');
  gsap.fromTo(sc,{scale:.7,opacity:0},{scale:1.2,opacity:1,ease:'power2.out',scrollTrigger:{trigger:col,start:'top bottom',end:'+=600',scrub:true}});
  gsap.fromTo(par,{y:()=>-.1*(col.offsetHeight+innerHeight)},{y:()=>.1*(col.offsetHeight+innerHeight),ease:'none',scrollTrigger:{trigger:col,start:'top bottom',end:'bottom top',scrub:true,invalidateOnRefresh:true}});
 });
 document.querySelectorAll('.rv').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:.8,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none reverse'}}));
 gsap.to('.wm',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'footer',start:'top bottom',end:'bottom bottom',scrub:true}});
});
document.getElementById('f').addEventListener('submit',e=>{e.preventDefault();document.getElementById('ok').textContent='¡Gracias! Te avisaremos pronto.';e.target.reset()});
