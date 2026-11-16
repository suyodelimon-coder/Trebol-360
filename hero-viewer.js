window.T3={ex:0};
(function(){
const box=document.getElementById('c'),$=id=>document.getElementById(id);
const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(R.domElement);
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.1;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(36,1,.1,200);
function rect(w,h,r){const s=new THREE.Shape(),a=w/2,b=h/2;s.moveTo(-a+r,-b);s.lineTo(a-r,-b);s.quadraticCurveTo(a,-b,a,-b+r);s.lineTo(a,b-r);s.quadraticCurveTo(a,b,a-r,b);s.lineTo(-a+r,b);s.quadraticCurveTo(-a,b,-a,b-r);s.lineTo(-a,-b+r);s.quadraticCurveTo(-a,-b,-a+r,-b);return s}
function RB(w,h,d,r){const b=Math.min(r,w/2.5,h/2.5,d/2.5),rr=Math.min(b*.8,(w-2*b)/2.1,(h-2*b)/2.1);const g=new THREE.ExtrudeGeometry(rect(w-2*b,h-2*b,rr),{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:4,curveSegments:6});g.center();return g}
const M=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o};
// entorno de estudio
{const pm=new THREE.PMREMGenerator(R),es=new THREE.Scene();es.background=new THREE.Color(0x4a5360);
const lt=(x,y,z,w,h,d,c,k)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(k)}));m.position.set(x,y,z);es.add(m)};
lt(0,9,0,16,.3,16,0xffffff,5);lt(-9,3,6,.3,7,9,0xfff3dc,4);lt(9,3,-5,.3,6,9,0xd6e8ff,3.5);lt(0,2,10,10,5,.3,0xffffff,2);lt(0,-6,0,16,.3,16,0x7a8a80,.8);
S.environment=pm.fromScene(es,.03).texture;pm.dispose()}
S.add(new THREE.HemisphereLight(0xffffff,0x667788,.25));
const dl=new THREE.DirectionalLight(0xffffff,1.15);dl.position.set(5,14,8);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);dl.shadow.bias=-.0003;dl.shadow.normalBias=.02;dl.shadow.radius=4;Object.assign(dl.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:50});S.add(dl);
// texturas procedurales
const cvs=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return[c,c.getContext('2d')]};
const nz=(()=>{const[c,x]=cvs(128,128),d=x.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=128+Math.random()*22;d.data[i+3]=255}x.putImageData(d,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t})();
const radial=(a)=>{const[c,x]=cvs(128,128),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)};
const logoTex=(()=>{const[c,x]=cvs(256,256);x.translate(128,122);x.scale(.9,.9);x.fillStyle='#3ddc84';
for(let k=0;k<3;k++){x.save();x.rotate(k*2*Math.PI/3);x.translate(0,-48);x.beginPath();x.moveTo(0,70);x.bezierCurveTo(-95,0,-48,-72,0,-30);x.bezierCurveTo(48,-72,95,0,0,70);x.fill();x.restore()}
x.strokeStyle='#3ddc84';x.lineWidth=13;x.lineCap='round';x.beginPath();x.moveTo(0,20);x.quadraticCurveTo(0,85,-34,118);x.stroke();return new THREE.CanvasTexture(c)})();
// materiales
const mk=(c,r,m,o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:r,metalness:m},o));
const abs=mk(0x2a3038,.55,.1,{bumpMap:nz,bumpScale:.12,envMapIntensity:.55}),alu=mk(0xb9c1ca,.3,.95),rub=mk(0x14171b,.95,0,{bumpMap:nz,bumpScale:.2,envMapIntensity:.5}),grn=mk(0x2e9e5b,.4,.1,{clearcoat:.7,clearcoatRoughness:.2}),dk=mk(0x0e1013,.35,.3,{clearcoat:.6,envMapIntensity:.7});
const decM=new THREE.MeshStandardMaterial({map:logoTex,transparent:true,roughness:.45,metalness:.1,polygonOffset:true,polygonOffsetFactor:-2});
const dec=s=>new THREE.Mesh(new THREE.PlaneGeometry(s,s),decM);
// ---- POSTE
const pole=new THREE.Group(),t1=M(new THREE.CylinderGeometry(.2,.2,1,40),abs),t2=M(new THREE.CylinderGeometry(.155,.155,1,40),alu),pc=M(new THREE.TorusGeometry(.215,.05,12,40),abs),pcap=M(new THREE.SphereGeometry(.2,28,18),abs);
pc.rotation.x=Math.PI/2;pole.add(t1,t2,pc,pcap,M(RB(.32,.32,.06,.03),alu,0,.9,.19));
const pd=dec(.24);pd.position.set(0,.9,.224);pole.add(pd);
[.55,.85].forEach((y,i)=>{const b=M(new THREE.CylinderGeometry(.055,.055,.07,24),i?grn:dk,.2,y,0);b.rotation.z=Math.PI/2;pole.add(b)});
const H=4.4,L=3.4;t1.scale.y=.55*H;t1.position.y=.275*H;t2.scale.y=.5*H;t2.position.y=.75*H;pc.position.y=.55*H;pcap.position.y=H;
// ---- ARO DE LUZ
const aro=new THREE.Group(),ledM=new THREE.MeshStandardMaterial({color:0xfff6e2,emissive:0xffe9b8,emissiveIntensity:2.2,roughness:.4});
const led=M(new THREE.TorusGeometry(1.15,.125,20,96),ledM);led.scale.z=.55;led.position.z=.09;
const knk=M(new THREE.CylinderGeometry(.15,.15,.34,24),alu,0,-1.34,-.04);knk.rotation.z=Math.PI/2;
const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:radial(1),color:0xffe7b0,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending}));glow.scale.set(4.2,4.2,1);glow.position.z=.3;
const rl=new THREE.PointLight(0xffe9c8,1.5,12);rl.position.z=1.4;
aro.add(M(new THREE.TorusGeometry(1.15,.17,24,96),abs),led,M(new THREE.CylinderGeometry(.1,.1,.62,24),abs,0,-1.61,0),knk,glow,rl);
// ---- SOPORTE (puck + celular)
const hold=new THREE.Group(),padM=new THREE.MeshStandardMaterial({color:0x2e9e5b,emissive:0x3ddc84,emissiveIntensity:1});
const body=M(new THREE.ExtrudeGeometry(rect(1.46,2.96,.2),{depth:.06,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:3}),mk(0x1a1e24,.28,.85),0,0,.3);
const[cv,cx]=cvs(280,580),tex=new THREE.CanvasTexture(cv);
const sg=new THREE.ShapeGeometry(rect(1.38,2.84,.16)),uv=sg.attributes.uv,ps=sg.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,ps.getX(i)/1.38+.5,ps.getY(i)/2.84+.5);
const scr=M(sg,new THREE.MeshBasicMaterial({map:tex,toneMapped:false}),0,0,.385);
const notch=M(new THREE.ShapeGeometry(rect(.5,.1,.05)),new THREE.MeshBasicMaterial({color:0}),0,1.37,.386);
const isl=M(RB(.64,.64,.06,.14),mk(0x0d0f12,.3,.5),-.36,1.0,.25);hold.add(body,scr,notch,isl);
[[-.5,1.12],[-.5,.88],[-.24,1],].forEach(([x,y])=>hold.add(M(new THREE.CylinderGeometry(.1,.1,.05,24),mk(0x050608,.1,.5),x+.02,y,.21)));hold.children.slice(-3).forEach(o=>o.rotation.x=Math.PI/2);
const pk=M(new THREE.CylinderGeometry(.6,.62,.12,64),dk,0,0,.2);pk.rotation.x=Math.PI/2;
hold.add(pk,M(new THREE.TorusGeometry(.42,.02,10,64),padM,0,0,.268),M(new THREE.TorusGeometry(.53,.012,8,64),alu,0,0,.264));
const hc=new THREE.Group(),rod=M(new THREE.CylinderGeometry(.09,.09,.42,20),abs,0,0,-.04),col=M(new THREE.TorusGeometry(.25,.08,14,40),abs,0,0,-.3);rod.rotation.x=Math.PI/2;col.rotation.x=Math.PI/2;hc.add(rod,col);
const cr=new THREE.Group();cr.add(M(RB(1.7,.17,.5,.07),rub,0,-1.6,.34),M(RB(1.4,.14,.34,.06),rub,0,1.58,.42),M(RB(.16,.8,.28,.06),rub,-.8,-1.2,.34),M(RB(.16,.8,.28,.06),rub,.8,-1.2,.34),M(RB(.5,.05,.06,.02),grn,0,-1.52,.6));
hold.add(hc,cr);
const waves=[0,1,2].map(()=>{const w=M(new THREE.RingGeometry(.9,1,64),new THREE.MeshBasicMaterial({color:0x4cff9a,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}),0,0,.27);hold.add(w);return w});
let lastD=0;
function drawScr(t,chg){if(t-lastD<200)return;lastD=t;const pct=chg?Math.floor(20+(t/700)%80):55,x=cx;
const g=x.createLinearGradient(0,0,0,580);g.addColorStop(0,'#0f2742');g.addColorStop(1,chg?'#0b4a37':'#1c2530');x.fillStyle=g;x.fillRect(0,0,280,580);
x.textAlign='center';x.fillStyle='#fff';x.font='700 62px sans-serif';x.fillText('9:41',140,150);x.font='20px sans-serif';x.fillStyle='#c9d6e2';x.fillText('Jueves 12 de noviembre',140,186);
x.lineWidth=12;x.strokeStyle='#ffffff22';x.beginPath();x.arc(140,350,72,0,7);x.stroke();x.strokeStyle=chg?'#4cff9a':'#9aa6b2';x.lineCap='round';x.beginPath();x.arc(140,350,72,-Math.PI/2,-Math.PI/2+Math.PI*2*pct/100);x.stroke();
x.fillStyle='#fff';x.font='700 38px sans-serif';x.fillText(pct+'%',140,364);x.font='22px sans-serif';x.fillStyle=chg?'#9be9bd':'#c9d6e2';x.fillText(chg?'Carga inalámbrica':'Sin carga',140,480);tex.needsUpdate=true}
// ---- PATAS
const patas=new THREE.Group();patas.add(M(new THREE.CylinderGeometry(.32,.32,.32,40),abs),M(new THREE.TorusGeometry(.33,.03,8,40),alu,0,.12,0));patas.children[1].rotation.x=Math.PI/2;
const legs=[0,1,2].map(i=>{const p=new THREE.Group();p.rotation.y=i*Math.PI*2/3;const t=new THREE.Group();t.position.x=.22;p.add(t);
 const a=M(new THREE.CylinderGeometry(.095,.095,1,24),abs),b=M(new THREE.CylinderGeometry(.075,.075,1,24),alu),c=M(new THREE.TorusGeometry(.11,.035,10,24),abs),f=M(new THREE.SphereGeometry(.13,16,12),rub),fr=M(new THREE.TorusGeometry(.115,.02,8,24),grn);c.rotation.x=fr.rotation.x=Math.PI/2;t.add(a,b,c,f,fr);patas.add(p);return{t,a,b,c,f,fr}});
function fitLegs(sp){legs.forEach(l=>{l.t.rotation.z=sp;l.a.scale.y=.55*L;l.a.position.y=-.275*L;l.b.scale.y=.5*L;l.b.position.y=-.75*L;l.c.position.y=-.55*L;l.f.position.y=-L;l.f.scale.y=.7;l.fr.position.y=-L+.08})}
// ---- BASE ESCRITORIO
const desk=new THREE.Group(),lathe=(pts,m)=>M(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),64),m);
desk.add(lathe([[0,0],[.82,0],[.82,.07],[0,.07]],rub),lathe([[0,.07],[.64,.07],[.62,.14],[.58,1],[.5,1.12],[0,1.12]],abs));
const nk=M(new THREE.CylinderGeometry(.24,.24,1.08,32),alu,0,1.66,0),hg=M(new THREE.CylinderGeometry(.2,.2,.8,32),abs,0,2.2,0);hg.rotation.z=Math.PI/2;
const ks=M(RB(.9,.1,1.5,.05),abs,0,.45,-.9);ks.rotation.x=-.6435;const dd=dec(.42);dd.position.set(0,.6,.585);
desk.add(nk,hg,ks,dd,M(new THREE.CylinderGeometry(.06,.06,.7,16),alu,0,.88,-.3));desk.children[desk.children.length-1].rotation.z=Math.PI/2;
// ---- BRAZO PARA AUTO
const car=new THREE.Group(),arc=new THREE.Group();arc.rotation.y=-Math.PI/2;
const cu=new THREE.CatmullRomCurve3([[0,.35,0],[-.7,1.5,0],[-.2,2.8,0],[1,3.6,0],[2.2,3.7,0]].map(p=>new THREE.Vector3(...p)));
{const N=70,Mm=16,pos=[],idx=[];for(let i=0;i<=N;i++){const t=i/N,p=cu.getPoint(t),T=cu.getTangent(t),b=.5-.2*t;for(let k=0;k<Mm;k++){const a=k/Mm*Math.PI*2,c=Math.cos(a),s=Math.sin(a),x=b*Math.sign(c)*Math.pow(Math.abs(c),.35),y=.12*Math.sign(s)*Math.pow(Math.abs(s),.35);pos.push(p.x-T.y*y,p.y+T.x*y,x)}}
for(let i=0;i<N;i++)for(let k=0;k<Mm;k++){const a=i*Mm+k,b=i*Mm+(k+1)%Mm,c=(i+1)*Mm+k,d=(i+1)*Mm+(k+1)%Mm;idx.push(a,b,c,b,d,c)}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();arc.add(new THREE.Mesh(g,new THREE.MeshPhysicalMaterial({color:0x2a3038,roughness:.55,metalness:.1,side:THREE.DoubleSide,bumpMap:nz,bumpScale:.1,envMapIntensity:.55})))}
const cb=M(new THREE.ExtrudeGeometry(rect(1.98,1.98,.6),{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:4}),abs,0,.06,0);cb.rotation.x=-Math.PI/2;
const cp=M(new THREE.ExtrudeGeometry(rect(2.1,2.1,.66),{depth:.05,bevelEnabled:false}),grn,0,-.04,0);cp.rotation.x=-Math.PI/2;
const cd=dec(1.1);cd.rotation.x=-Math.PI/2;cd.position.y=.43;
car.add(arc,cb,cp,cd,M(new THREE.CylinderGeometry(.72,.72,.2,64),dk,0,3.7,2.06),M(new THREE.TorusGeometry(.72,.03,10,64),alu,0,3.7,2.16));car.children[4].rotation.x=Math.PI/2;
// ---- SUELO Y SOMBRAS
const floor=M(new THREE.CircleGeometry(20,48),new THREE.ShadowMaterial({opacity:.32}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;
const blob=M(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:radial(.9),color:0,transparent:true,opacity:.5,depthWrite:false}),0,.01,0);blob.rotation.x=-Math.PI/2;
const P={poste:pole,aro,soporte:hold,patas,brazo:car,escritorio:desk};
S.add(floor,blob);Object.values(P).forEach(o=>S.add(o));
S.traverse(o=>{if(o.isMesh){o.castShadow=!o.material.isMeshBasicMaterial&&o!==floor;o.receiveShadow=o!==blob}});blob.castShadow=false;
// ---- ESTADO Y CONTROLES
let mode='tripode',explo=false,solo=null,light=true,chg=true,auto=false;
const cur={sp:.4,ex:0},TV=new THREE.Vector3(0,5,0);let dist=18,th=.45,ph=1.32,vth=0,drag=false,lx=0,ly=0;
const modes=document.querySelectorAll('#modes button');
function upd(){$('parts').style.display=explo?'flex':'none';$('bx').classList.toggle('on',explo);document.querySelectorAll('#parts button').forEach(x=>x.classList.toggle('on',x.dataset.p===(solo||'')));modes.forEach(x=>x.classList.toggle('on',x.dataset.m===mode))}
modes.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.m;explo=false;solo=null;upd()}));
[['bl',v=>light=v],['bc',v=>chg=v],['br',v=>auto=v]].forEach(([id,fn])=>{const b=$(id);b.addEventListener('click',()=>{b.classList.toggle('on');fn(b.classList.contains('on'))})});
$('bx').addEventListener('click',()=>{explo=!explo;solo=explo?'poste':null;upd()});
document.querySelectorAll('#parts button').forEach(b=>b.addEventListener('click',()=>{solo=b.dataset.p||null;upd()}));
const el=R.domElement;
el.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;el.setPointerCapture(e.pointerId)});
el.addEventListener('pointerup',()=>drag=false);el.addEventListener('pointercancel',()=>drag=false);
el.addEventListener('pointermove',e=>{if(!drag)return;vth=-(e.clientX-lx)*.006;th+=vth;ph=Math.min(2.4,Math.max(.4,ph-(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY;if(auto){auto=false;$('br').classList.remove('on')}});
function resize(){const w=box.clientWidth,h=box.clientHeight;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const fade=(o,on)=>{const s=o.scale.x+((on?1:.001)-o.scale.x)*.14;o.scale.setScalar(s);o.visible=s>.02};
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
let first=true;
let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
function frame(t){requestAnimationFrame(frame);if(!vis)return;
 const eff=solo?'tripode':mode,polar=eff==='tripode'||eff==='selfie';
 cur.sp+=((eff==='selfie'?.02:.4)-cur.sp)*.08;fitLegs(cur.sp);
 cur.ex+=((solo||explo?0:T3.ex)-cur.ex)*.12;const ex=cur.ex,Y0=L*Math.cos(cur.sp)+ex*1.4;
 const tp={poste:V3(0,Y0,0),patas:V3(0,Y0,0),aro:V3(0,Y0+H+1.9+ex*2.2,0),brazo:V3(0,0,0),escritorio:V3(0,0,0),
  soporte:polar?V3(0,Y0+H*.52+.4,.3+ex*3.2):eff==='soporte'?V3(0,2.65,.1):V3(0,3.7,1.98)};
 const show=solo?{[solo]:1}:polar?{poste:1,aro:1,soporte:1,patas:1}:eff==='soporte'?{escritorio:1,soporte:1}:{brazo:1,soporte:1};
 if(first){for(const k in P)P[k].position.copy(tp[k]);first=false}
 for(const k in P){P[k].position.lerp(tp[k],.14);fade(P[k],!!show[k])}
 hold.rotation.x+=((eff==='soporte'?-.26:0)-hold.rotation.x)*.14;
 fade(cr,eff!=='car');fade(hc,polar);
 // cámara
 let c;if(solo){const q={poste:[0,Y0+H/2,0,11],aro:[0,tp.aro.y,0,7.5],soporte:[0,tp.soporte.y,tp.soporte.z,8.5],patas:[0,Y0-L/2,0,10],brazo:[0,2.6,.8,11],escritorio:[0,1.4,0,8.5]};c=q[solo]}
 else if(polar){const top=Y0+H+3.3+2.2*ex;c=[0,top/2,0,top/2/.325*1.3]}else if(eff==='soporte')c=[0,2.2,0,10.5];else c=[0,2.6,.7,12.5];
 TV.lerp(V3(c[0],c[1],c[2]),.08);dist+=(c[3]*Math.max(1,.9/cam.aspect)-dist)*.08;
 if(auto)th+=.004;else if(!drag){th+=vth;vth*=.9}
 cam.position.set(TV.x+dist*Math.sin(ph)*Math.sin(th),TV.y+dist*Math.cos(ph),TV.z+dist*Math.sin(ph)*Math.cos(th));cam.lookAt(TV);
 // efectos
 const pul=.5+.5*Math.sin(t*.004);
 ledM.emissiveIntensity=light?2.2:0;ledM.color.set(light?0xfff6e2:0x8a8a8a);glow.material.opacity=light?.22:0;rl.intensity=light?1.5:0;
 padM.emissiveIntensity=chg?.6+.5*pul:0;padM.color.set(chg?0x2e9e5b:0x333333);
 waves.forEach((w,i)=>{const p=((t*.0006)+i/3)%1;w.scale.setScalar(.55+p*.9);w.material.opacity=chg?(1-p)*.65:0});
 drawScr(t,chg);
 const bs=solo?0:polar?5+ex*2:eff==='soporte'?4:5.5;blob.scale.setScalar(bs);floor.visible=!solo;
 R.render(S,cam)}
upd();requestAnimationFrame(frame);
})();
