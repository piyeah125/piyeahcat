let lang='vi',currentTool=null,toolView='',matches=[],resultPage=0,lastQuery='';
const $=s=>document.querySelector(s),v=a=>Array.isArray(a)?a[0]:a,t=k=>v(T[k]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9#]+/g,' ').trim();
const btn=(s,a='',p=false)=>'<button class="btn '+(p?'primary':'')+'" '+a+'>'+esc(s)+'</button>';
const copy=(s,d)=>btn(d||'Sao chép','data-copy="'+esc(s)+'"');
function mountAdvanced(){if(toolTab==='qr')drawQr();if(toolTab==='images')mountBatch();if(toolTab==='contrast')updateContrast();if(toolTab==='pdf')mountPdf()}
let toastTimer;function toast(s){$('#toast').textContent=s;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,2600)}
async function clipboard(s){try{await navigator.clipboard.writeText(s);toast('Đã sao chép')}catch{toast('Chưa sao chép được. Hãy chọn nội dung và sao chép thủ công.')}}
const toolEntries=[
 ['qr','Tạo QR','Nhập link hoặc nội dung, tạo và tải mã QR.','qr code ma vach tao ma link','⌗'],
 ['colour','Lấy màu','Chọn một điểm trên ảnh để lấy mã HEX hoặc RGB.','lay mau hut mau picker color colour ma mau','◉'],
 ['compress','Nén ảnh','Giảm dung lượng ảnh, giữ tên và kích thước.','nen anh giam dung luong hinh thu nho file image compress','↘'],
 ['convert','Đổi định dạng ảnh','Chuyển ảnh giữa JPG, PNG và WebP.','doi dinh dang chuyen anh jpg jpeg png webp sang convert','⇄'],
 ['rename','Đổi tên ảnh hàng loạt','Đặt tên và đánh số nhiều ảnh cùng lúc.','doi ten anh hang loat hinh rename danh so','Aa'],
 ['pdf','Chỉnh trang PDF','Gộp, tách, xoay, bỏ và sắp xếp các trang.','pdf gop tach xoay xoa trang sap xep ghep','▤'],
 ['contrast','Đo tương phản','Kiểm tra độ rõ của màu chữ trên nền.','do tuong phan mau chu nen contrast wcag','◐'],
 ['nameplate','Tạo bảng tên','Chọn phôi, nhập thông tin và xuất bảng tên UEL.','tao bang ten de ban ho ten chuc vu nameplate','▱']
].map(([tool,name,desc,aliases,icon])=>({tool,name,desc,aliases,icon,kind:'Công cụ'}));
const entries=[...toolEntries];
function add(o){if(o.name)entries.push({kind:'Tài nguyên',desc:'',aliases:'',...o})}
function loadResources(){
 add({name:'Logo UEL',desc:'Bộ logo Trường Đại học Kinh tế – Luật.',aliases:'logo bieu trung nhan dien uel',url:L.logo,image:'logo-full.svg'});
 ['Roboto','Lora'].forEach(name=>add({name:'Font '+name,desc:'Font chữ trong bộ nhận diện UEL.',aliases:'phong chu kieu chu font uel',url:L[name.toLowerCase()]}));
 add({name:'Font tránh lỗi',desc:'Bộ font hỗ trợ hiển thị tài liệu.',url:L.fonts,aliases:'font phong chu loi'});
 D.brand.colours.forEach((colour,i)=>add({name:i?'Màu cam UEL':'Màu xanh UEL',desc:colour,aliases:'ma mau nhan dien hex '+colour,colour}));
 // The three original slide placeholders all point to one folder: show one honest result.
 add({name:'Mẫu PowerPoint UEL',desc:'Mở kho slide theo nhận diện UEL.',aliases:'ppt slide thuyet trinh trinh chieu powerpoint template',url:L.ppt});
 D.powerpoint.filter(r=>r.link!=='ppt').forEach(r=>add({name:v(r.name),desc:v(r.desc),url:L[r.link],aliases:'ppt powerpoint slide thuyet trinh'}));
 D.video.forEach(r=>add({name:v(r.name),desc:'Video UEL · Mở kho video',url:L[r.link],image:r.image,aliases:'video phim clip uel'}));
 D.led.forEach(r=>add({name:r[0],desc:r[2],image:r[3],url:r[4],aliases:'background phong nen man hinh led '+r[1],value:r[2]}));
 [['invitations','Thư mời sự kiện'],['party','Thư mời tiệc'],['thankYou','Thư cảm ơn'],['nameplate','Mẫu bảng tên']].forEach(([id,name])=>{const o=D[id];add({name,desc:v(o.size),image:o.images[0],url:o.canva,extraUrl:o.drive,aliases:name+' mau template van phong',note:v(o.note)})});
 D.sizes.forEach(g=>g.rows.forEach(r=>add({name:'Kích thước '+r[0],desc:r[2]+' × '+r[3]+' '+r[4],value:r[2]+' × '+r[3]+' '+r[4],aliases:'kich thuoc kho size rong cao '+r[1],kind:'Thông số'})));
 ['resources','uel','slideSources'].forEach(key=>(D[key]||[]).forEach(r=>add({name:v(r.name),desc:v(r.desc),url:r.url,aliases:key==='slideSources'?'ppt powerpoint slide thuyet trinh':''})));
 (D.techTips||[]).forEach(r=>add({name:v(r.name),desc:v(r.desc),url:r.url,kind:'Hướng dẫn',aliases:r.type}));
 Object.entries(D.quickLinks).forEach(([group,rows])=>rows.forEach(r=>add({name:r[0].split('|')[0],desc:group,url:r[3]==='copy'?null:r[1],value:r[3]==='copy'?r[1]:null,aliases:group,kind:'Liên kết'})));
 entries.forEach((e,i)=>{e.id=i;e.title=norm(e.name);e.words=norm(e.name+' '+e.aliases+' '+e.desc).split(' ')});
}
function distance(a,b){if(Math.abs(a.length-b.length)>1)return 2;let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let row=[i];for(let j=1;j<=b.length;j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]!==b[j-1]));prev=row}return prev[b.length]}
function find(query){const q=norm(query),terms=q.split(' ').filter(Boolean);if(!terms.length)return[];return entries.map(e=>{let score=e.title===q?200:e.title.includes(q)?90:0;for(const word of terms){if(e.title.split(' ').includes(word))score+=25;else if(e.words.includes(word))score+=16;else if(e.words.some(w=>w.startsWith(word)))score+=9;else if(word.length>=3&&e.words.some(w=>w.length>=3&&distance(w,word)<=1))score+=3;else return {e,score:0}}return{e,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.e.id-b.e.id).map(x=>x.e)}
function pageSize(){return Math.max(2,Math.min(6,Math.floor(($('#content').clientHeight-12)/76)))}
function leaveTool(){if(currentTool==='pdf')stopPdfThumbnails();if(currentTool==='qr')qrState.version++;currentTool=null;$('#content').classList.remove('qr-content');$('#back').hidden=true;$('#home-short').hidden=true}
function home(){if(batchState.busy||pdfState.busy){toast('Đợi xử lý xong hoặc bấm Dừng trước nhé.');return}leaveTool();$('#search').value='';$('#clear').hidden=true;$('#context').textContent='';$('.surface-head').hidden=true;$('#pagination').innerHTML='';$('#content').innerHTML='<div class="suggestions">'+toolEntries.map(e=>'<button class="suggestion" data-open="'+e.id+'"><i>'+e.icon+'</i><span>'+e.name+'</span><span>↗</span></button>').join('')+'</div><p class="hint">Hoặc tìm nhanh tài nguyên UEL</p><div class="quick-picks">'+['Logo UEL','Mẫu PowerPoint','Thư mời','Kích thước LED'].map(s=>'<button data-query="'+s+'">'+s+'</button>').join('')+'</div>';$('#content').scrollTop=0}
function search(){if(batchState.busy||pdfState.busy){toast('Đợi xử lý xong hoặc bấm Dừng trước nhé.');return}leaveTool();lastQuery=$('#search').value;$('#clear').hidden=!lastQuery;if(!norm(lastQuery)){home();return}matches=find(lastQuery);resultPage=0;renderResults()}
function renderResults(){leaveTool();const size=pageSize(),pages=Math.ceil(matches.length/size);resultPage=Math.min(resultPage,Math.max(0,pages-1));$('.surface-head').hidden=false;$('#home-short').hidden=false;$('#context').textContent=matches.length+' KẾT QUẢ';$('#content').innerHTML=matches.length?matches.slice(resultPage*size,(resultPage+1)*size).map(e=>'<button class="result" data-open="'+e.id+'"><span class="result-type">'+esc(e.kind)+'</span><span class="result-info"><strong>'+esc(e.name)+'</strong><small>'+esc(e.desc)+'</small></span><span>↗</span></button>').join(''):'<div class="empty"><h2>Mèo chưa tìm thấy.</h2><p>Thử “logo”, “slide”, “QR” hoặc “nén ảnh” nhé.</p><div class="quick-picks" style="margin-top:20px"><button data-query="nén ảnh">Nén ảnh</button><button data-query="logo UEL">Logo UEL</button><button data-query="tạo QR">Tạo QR</button></div></div>';$('#pagination').innerHTML=pages>1?'<button data-turn="-1" aria-label="Trang trước" '+(!resultPage?'disabled':'')+'>←</button><span>'+(resultPage+1)+' / '+pages+'</span><button data-turn="1" aria-label="Trang sau" '+(resultPage===pages-1?'disabled':'')+'>→</button>':'';$('#content').scrollTop=0}
function openEntry(id){if(batchState.busy||pdfState.busy){toast('Đợi xử lý xong hoặc bấm Dừng trước nhé.');return}leaveTool();const e=entries[id];$('.surface-head').hidden=false;$('#home-short').hidden=false;$('#back').hidden=!$('#search').value;$('#pagination').innerHTML='';$('#context').textContent=e.kind.toUpperCase();$('#content').scrollTop=0;if(e.tool){currentTool=e.tool;toolTab=['compress','convert','rename'].includes(e.tool)?'images':e.tool;if(toolTab==='images'){batchState.files=[];batchState.outputs=[];batchState.message='';batchState.progress=0;batchState.mode=e.tool==='rename'?'rename':'convert';batchState.format=e.tool==='compress'?'original':'webp';batchState.rename=e.tool==='rename';batchState.width=batchState.height=''}renderTools();return}$('#content').innerHTML='<article class="detail"><h2>'+esc(e.name)+'</h2><p>'+esc(e.desc)+'</p>'+(e.image?'<img src="assets/'+esc(e.image)+'" alt="'+esc(e.name)+'">':'')+(e.note?'<p>'+esc(e.note)+'</p>':'')+(e.colour?'<div style="height:90px;background:'+e.colour+';margin:20px 0"></div>':'')+'<div class="row">'+(e.url?'<a class="btn primary" target="_blank" rel="noopener noreferrer" href="'+esc(e.url)+'">'+(e.url.includes('canva')?'Mở mẫu Canva':'Mở tài nguyên')+' ↗</a>':'')+(e.extraUrl?'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(e.extraUrl)+'">Mở kho file ↗</a>':'')+(e.colour?copy(e.colour,e.colour):'')+(e.value?copy(e.value,e.value):'')+'</div></article>';$('#content').focus()}
function renderTools(){const e=toolEntries.find(e=>e.tool===currentTool);if(!e)return;if(currentTool==='nameplate'){$('#content').innerHTML='<iframe class="nameplate-frame" title="Tạo bảng tên UEL" src="nameplate.html"></iframe>';return}$('#content').innerHTML='<h2 class="tool-heading">'+e.name+'</h2><p class="tool-description">'+e.desc+'</p><div id="tools-body">'+(toolTab==='colour'?colourPanel():toolTab==='images'?batchPanel():toolTab==='qr'?qrPanel():toolTab==='pdf'?pdfPanel():contrastPanel())+'</div>';if(toolTab==='qr'){setupQrLayout()}if(toolTab==='colour'){wireColour();if(pickedImage)drawImage()}else mountAdvanced()}
function init(){loadResources();home();$('#search-form').onsubmit=e=>{e.preventDefault();if(matches.length===1)openEntry(matches[0].id);else search()};$('#search').oninput=search;$('#clear').onclick=()=>{home();$('#search').focus()};$('#home').onclick=home;$('#home-short').onclick=home;$('#back').onclick=()=>{if(batchState.busy||pdfState.busy){toast('Đợi xử lý xong hoặc bấm Dừng trước nhé.');return}if(lastQuery&&$('#search').value)renderResults();else home()};document.addEventListener('click',e=>{const open=e.target.closest('[data-open]'),query=e.target.closest('[data-query]'),turn=e.target.closest('[data-turn]'),cp=e.target.closest('[data-copy]'),format=e.target.closest('[data-copy-format]');if(open)openEntry(Number(open.dataset.open));if(query){$('#search').value=query.dataset.query;search()}if(turn){resultPage+=Number(turn.dataset.turn);renderResults()}if(cp)clipboard(cp.dataset.copy);if(format){copyFormat=format.dataset.copyFormat;renderTools()}});document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search').focus()}if(e.key==='Escape'&&!batchState.busy&&!pdfState.busy)home();if(e.key==='ArrowDown'&&e.target===$('#search')){e.preventDefault();$('#content button')?.focus()}});window.addEventListener('resize',()=>{if(!currentTool&&$('#search').value)renderResults()})}

function setupQrLayout(){
 $('#content').classList.add('qr-content');
 const fields=$('#tools-body .tool-fields');
 const customize=document.createElement('details');customize.className='tool-details qr-customize';
 const summary=document.createElement('summary');summary.textContent='Tùy chỉnh màu sắc & kiểu dáng';customize.append(summary);
 const preset=fields.querySelector(':scope > .row');
 const options=[...fields.querySelectorAll(':scope > details')];
 if(preset)customize.append(preset);options.forEach(node=>customize.append(node));
 fields.insertBefore(customize,fields.querySelector(':scope > .tool-two'));
 const action=document.createElement('div');action.className='qr-actions';
 const label=document.createElement('span');label.textContent='Mã sẵn sàng? Tải về tại đây.';
 action.append(label,$('#qr-download'));$('#tools-body').append(action);
}
