(function(){
const box=document.getElementById('pc'),$=id=>document.getElementById(id);
const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(R.domElement);
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.92;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,100),V=(x,y,z)=>new THREE.Vector3(x,y,z);
function rect(w,h,r){const s=new THREE.Shape(),a=w/2,b=h/2;s.moveTo(-a+r,-b);s.lineTo(a-r,-b);s.quadraticCurveTo(a,-b,a,-b+r);s.lineTo(a,b-r);s.quadraticCurveTo(a,b,a-r,b);s.lineTo(-a+r,b);s.quadraticCurveTo(-a,b,-a,b-r);s.lineTo(-a,-b+r);s.quadraticCurveTo(-a,-b,-a+r,-b);return s}
function RB(w,h,d,r){const b=Math.min(r,w/2.5,h/2.5,d/2.5),rr=Math.min(b*.8,(w-2*b)/2.1,(h-2*b)/2.1);const g=new THREE.ExtrudeGeometry(rect(w-2*b,h-2*b,rr),{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:4,curveSegments:6});g.center();return g}
{const pm=new THREE.PMREMGenerator(R),es=new THREE.Scene();es.background=new THREE.Color(0x58616d);
const lt=(x,y,z,w,h,d,c,k)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(k)}));m.position.set(x,y,z);es.add(m)};
lt(0,9,0,16,.3,16,0xffffff,5);lt(-9,3,6,.3,7,9,0xfff3dc,4);lt(9,3,-5,.3,6,9,0xd6e8ff,3.2);lt(0,2,10,10,5,.3,0xffffff,2.2);lt(0,-6,0,16,.3,16,0xb8aa90,.9);
S.environment=pm.fromScene(es,.03).texture;pm.dispose()}
S.add(new THREE.HemisphereLight(0xffffff,0x998877,.18));
const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(5,12,7);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);dl.shadow.bias=-.0003;dl.shadow.normalBias=.02;dl.shadow.radius=5;Object.assign(dl.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:40});S.add(dl);
const cvs=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return[c,c.getContext('2d')]};
const nz=(()=>{const[c,x]=cvs(128,128),d=x.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=120+Math.random()*50;d.data[i+3]=255}x.putImageData(d,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,5);return t})();
const radial=a=>{const[c,x]=cvs(128,128),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)};
const mk=(c,r,m,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:r,metalness:m},o));
const fur=mk(0xd4902f,.7,0,{bumpMap:nz,bumpScale:.05,clearcoat:.1,clearcoatRoughness:.6,envMapIntensity:.5}),dark=mk(0x120e0c,.25,.1,{clearcoat:1}),white=mk(0xffffff,.2,0),grn=mk(0x2e9e5b,.4,.1,{clearcoat:.6}),
geo=new THREE.MeshStandardMaterial({color:0x1b1c1f,roughness:.6,metalness:.05,flatShading:true,envMapIntensity:.6}),steel=mk(0xc9ced4,.25,1);
const M=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o};
// ---- celular de muestra (pantalla hacia +z)
const[pc,px]=cvs(280,580);{const g=px.createLinearGradient(0,0,0,580);g.addColorStop(0,'#10263f');g.addColorStop(1,'#0b4a37');px.fillStyle=g;px.fillRect(0,0,280,580);px.fillStyle='#fff';px.textAlign='center';px.font='700 62px sans-serif';px.fillText('9:41',140,150);px.font='20px sans-serif';px.fillStyle='#c9d6e2';px.fillText('Jueves 12 de noviembre',140,186)}
function phoneG(){const g=new THREE.Group(),sg=new THREE.ShapeGeometry(rect(1.56,3.46,.14)),uv=sg.attributes.uv,ps=sg.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,ps.getX(i)/1.56+.5,ps.getY(i)/3.46+.5);
 g.add(M(RB(1.7,3.6,.22,.09),mk(0x15181c,.3,.8)),M(sg,new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(pc),toneMapped:false}),0,0,.113),M(RB(.7,.7,.06,.15),mk(0x0d0f12,.3,.5),-.42,1.35,-.14),M(RB(.05,.5,.06,.02),mk(0x3a3f46,.3,.9),.86,.5,0));return g}
// ---- PERRITO (cara a +x)
const dogG=new THREE.Group(),sph=new THREE.SphereGeometry(1,48,32);
const E=(sx,sy,sz,x,y,z,m=fur,rz=0,rx=0,ry=0)=>{const o=new THREE.Mesh(sph,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);dogG.add(o);return o};
const E2=(sx,sy,sz,x,y,z,m,rz,rx,ry)=>[1,-1].forEach(s=>E(sx,sy,sz,x,y,z*s,m,rz,rx,ry));
E(2,.95,.95,0,.95,0);E(1,1,.95,1.5,1,0);E(.95,.95,.95,-1.55,.95,0);
E2(.85,.62,.42,-1.9,.7,.5);E2(.8,.2,.22,-2.45,.42,.5,fur,.35);E2(.4,.13,.2,-2.95,.14,.5);
E2(.85,.2,.22,2.45,.3,.42,fur,-.05);E2(.4,.15,.25,3.2,.17,.42);
E(.6,.7,.55,2.15,1.45,0,fur,-.6);E(.62,.58,.58,2.75,1.95,0);E(.45,.27,.3,3.25,1.82,0);E(.12,.1,.14,3.62,1.9,0,dark);E(.38,.02,.2,3.3,1.66,0,dark);
E2(.075,.075,.075,3.05,2.1,.3,dark);E2(.022,.022,.022,3.1,2.14,.29,white);
E2(.24,.5,.2,2.6,1.78,.58,fur,.18,.3);
const col=M(new THREE.TorusGeometry(.55,.07,14,40),grn,2.3,1.58,0);col.quaternion.setFromUnitVectors(V(0,0,1),V(.5,.85,0).normalize());dogG.add(col);
const tc=new THREE.CatmullRomCurve3([V(-2.2,1.2,0),V(-2.55,1.5,0),V(-2.5,1.9,0),V(-2.3,2.25,0)]);dogG.add(M(new THREE.TubeGeometry(tc,28,.14,14),fur),M(sph,fur,-2.3,2.25,0));dogG.children[dogG.children.length-1].scale.setScalar(.14);
const dp=new THREE.Group(),dph=phoneG();dph.rotation.y=-Math.PI/2;dp.add(dph);dp.rotation.z=-.349;dp.position.set(-2.58,1.81,0);dogG.add(dp);
// ---- LLAVERO GEOMÉTRICO
const geoG=new THREE.Group(),ico=new THREE.IcosahedronGeometry(1,0);
[[-1.2,.5,.8,1.25,.66,.74,.3,.5,.1],[-1.2,.5,-.8,1.25,.66,.74,.9,.2,.3],[-1.2,.16,0,1.1,.3,1.1,0,0,0],[.35,.58,.05,.95,.78,.9,.5,.9,.2],[1.5,.46,-.12,.76,.64,.72,.2,.4,.8],[.5,.3,.82,.52,.5,.52,.7,.1,.5]].forEach(a=>{const o=M(ico,geo,a[0],a[1],a[2]);o.scale.set(a[3],a[4],a[5]);o.rotation.set(a[6],a[7],a[8]);geoG.add(o)});
[[2.27,.4,-.12,0],[2.43,.27,-.12,1.57]].forEach(([x,y,z,r])=>{const l=M(new THREE.TorusGeometry(.1,.026,10,24),steel,x,y,z);l.rotation.y=r;geoG.add(l)});
const ring=M(new THREE.TorusGeometry(.52,.045,12,48),steel,3,.07,-.12);ring.rotation.x=Math.PI/2;geoG.add(ring);
const gp=new THREE.Group(),gph=phoneG();gp.add(gph);gp.position.set(-1.2,2.05,0);gp.rotation.z=.04;geoG.add(gp);
// ---- suelo
const floor=M(new THREE.CircleGeometry(14,48),new THREE.ShadowMaterial({opacity:.3}));floor.rotation.x=-Math.PI/2;
const blob=M(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:radial(.7),color:0,transparent:true,opacity:.35,depthWrite:false}),0,.01,0);blob.rotation.x=-Math.PI/2;
S.add(floor,blob,dogG,geoG);
S.traverse(o=>{if(o.isMesh){o.castShadow=!o.material.isMeshBasicMaterial&&o!==floor;o.receiveShadow=o!==blob}});floor.castShadow=blob.castShadow=false;
// ---- catálogo
const PR=[
{k:'Resina pintada a mano',n:'Perrito soporte',p:'$249',d:'Un labrador cachorro que sostiene tu celular recostado sobre su lomo. Decora tu escritorio y mantiene la pantalla a la vista.',m:fur,g:dogG,ph:dp,c:[['Dorado','#d4902f'],['Chocolate','#6b4430'],['Negro','#26262a'],['Crema','#efe0c5']],
 f:['Figura de resina pintada a mano','Base con fieltro antiderrapante','Para celulares de hasta 6.9 pulgadas'],s:[['Medidas','12 × 4 × 6 cm'],['Peso','180 g'],['Material','Resina'],['Entrega','3 a 5 días']],t:[.2,1.3,0],d2:17},
{k:'Impreso en 3D',n:'Llavero soporte geométrico',p:'$129',d:'Soporte de bolsillo con diseño facetado: una ranura para el celular y una argolla para llevarlo siempre contigo.',m:geo,g:geoG,ph:gp,c:[['Negro','#1b1c1f'],['Blanco','#f1efe8'],['Cobre','#b0684a'],['Gris','#8f949a']],
 f:['Ranura para celular y argolla incluida','Acabado mate y bordes facetados','Cabe en el bolsillo o en las llaves'],s:[['Medidas','7 × 3 × 3.5 cm'],['Peso','35 g'],['Material','PLA mate'],['Entrega','2 a 4 días']],t:[.8,1.2,0],d2:15.5}];
let cp=0,showPh=true,auto=true,th=.55,ph=1.3,vth=0,drag=false,lx=0,ly=0,dist=17;const TV=V(0,1.3,0);
function setColor(i){const p=PR[cp];p.m.color.set(p.c[i][1]);$('swn').textContent='Color: '+p.c[i][0];document.querySelectorAll('#sw button').forEach((b,j)=>b.classList.toggle('on',j===i))}
function render(){const p=PR[cp];$('pk').textContent=p.k;$('pn').textContent=p.n;$('pd').textContent=p.d;$('pp').textContent=p.p;
 $('pf').innerHTML=p.f.map(x=>`<li>${x}</li>`).join('');$('ps').innerHTML=p.s.map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
 $('sw').innerHTML=p.c.map((c,i)=>`<button aria-label="${c[0]}" style="background:${c[1]}"></button>`).join('');document.querySelectorAll('#sw button').forEach((b,i)=>b.onclick=()=>setColor(i));
 document.querySelectorAll('#plist button').forEach((b,i)=>b.classList.toggle('on',i===cp));setColor(0)}
document.querySelectorAll('#plist button').forEach((b,i)=>b.addEventListener('click',()=>{cp=i;render()}));
const tg=(id,fn)=>{const b=$(id);b.addEventListener('click',()=>{b.classList.toggle('on');fn(b.classList.contains('on'))})};tg('tp',v=>showPh=v);tg('ar',v=>auto=v);
$('add').addEventListener('click',e=>{const b=e.currentTarget;b.textContent='Agregado (demo)';setTimeout(()=>b.textContent='Agregar al pedido',1800)});
const el=R.domElement;
el.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;el.setPointerCapture(e.pointerId)});
el.addEventListener('pointerup',()=>drag=false);el.addEventListener('pointercancel',()=>drag=false);
el.addEventListener('pointermove',e=>{if(!drag)return;vth=-(e.clientX-lx)*.006;th+=vth;ph=Math.min(2.2,Math.max(.5,ph-(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY});
function resize(){const w=box.clientWidth,h=box.clientHeight;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const fade=(o,on)=>{const s=o.scale.x+((on?1:.001)-o.scale.x)*.15;o.scale.setScalar(s);o.visible=s>.02};
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
function frame(){requestAnimationFrame(frame);if(!vis)return;const p=PR[cp];
 fade(dogG,cp===0);fade(geoG,cp===1);dp.visible=showPh;gp.visible=showPh;
 TV.lerp(V(p.t[0],p.t[1],p.t[2]),.1);dist+=(p.d2*Math.max(1,.95/cam.aspect)-dist)*.1;
 if(auto&&!drag)th+=.0035;else if(!drag){th+=vth;vth*=.9}
 cam.position.set(TV.x+dist*Math.sin(ph)*Math.sin(th),TV.y+dist*Math.cos(ph),TV.z+dist*Math.sin(ph)*Math.cos(th));cam.lookAt(TV);
 R.render(S,cam)}
render();frame();
})();
