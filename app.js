const $ = (id) => document.getElementById(id);
let dataset = null;
let activeView = 'head';
function parseCSV(text) {
  const rows=[]; let row=[], cell='', quoted=false;
  text=text.replace(/^\uFEFF/, '');
  for(let i=0;i<text.length;i++) { const c=text[i];
    if(quoted) { if(c==='"' && text[i+1]==='"'){cell+='"';i++;} else if(c==='"') quoted=false; else cell+=c; }
    else if(c==='"') quoted=true;
    else if(c===','){row.push(cell);cell='';}
    else if(c==='\n'){row.push(cell.replace(/\r$/, '')); if(row.some(v=>v.trim()!=='')) rows.push(row); row=[];cell='';}
    else cell+=c;
  }
  if(cell.length || row.length){row.push(cell.replace(/\r$/, ''));if(row.some(v=>v.trim()!==''))rows.push(row);}
  if(rows.length<2) throw new Error('This CSV needs a header row and at least one data row.');
  const headers=rows[0].map((h,i)=>h.trim()||`column_${i+1}`);
  const data=rows.slice(1).map(r=>headers.map((_,i)=>(r[i]??'').trim()));
  return {headers,data};
}
function isMissing(v){return v===undefined||v===null||String(v).trim()===''||String(v).trim().toLowerCase()==='na'||String(v).trim().toLowerCase()==='null';}
function numericValues(values){const valid=values.filter(v=>!isMissing(v));if(!valid.length)return null;const nums=valid.map(v=>Number(v));return nums.every(n=>Number.isFinite(n))?nums:null;}
function setNotice(msg,error=false){$('notice').textContent=msg;$('notice').className='notice'+(error?' error':'');}
function cellText(v){return isMissing(v)?'—':String(v);}
function render(data,name){dataset={...data,name};const {headers,data:rows}=dataset;const cols=headers.map((h,i)=>{const vals=rows.map(r=>r[i]??'');const nums=numericValues(vals);return {name:h,vals,nums,missing:vals.filter(isMissing).length,filled:vals.filter(v=>!isMissing(v)).length,type:nums?'numeric':(vals.some(v=>!isMissing(v))?'categorical':'empty')};});
 $('rowCount').textContent=rows.length.toLocaleString();$('colCount').textContent=headers.length.toLocaleString();$('numericCount').textContent=cols.filter(c=>c.type==='numeric').length;$('missingCount').textContent=cols.reduce((s,c)=>s+c.missing,0).toLocaleString();$('schemaTag').textContent=`${headers.length} COLUMNS`;
 $('schemaBody').innerHTML=cols.map(c=>`<tr><td>${escapeHTML(c.name)}</td><td><span class="type-badge ${c.type==='categorical'?'text':''}">${c.type}</span></td><td>${c.filled}</td><td>${c.missing}</td></tr>`).join('');
 const col=cols.find(c=>c.nums);$('statColumnHeading').textContent=col?col.name:'No numeric column';
 if(col){const sorted=[...col.nums].sort((a,b)=>a-b),n=sorted.length,mean=col.nums.reduce((a,b)=>a+b,0)/n,median=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;const fmt=x=>Number(x).toLocaleString(undefined,{maximumFractionDigits:3});const stats=[['count',n],['mean',fmt(mean)],['std',fmt(Math.sqrt(col.nums.reduce((s,x)=>s+(x-mean)**2,0)/(n>1?n-1:1)))],['min',fmt(sorted[0])],['25%',fmt(quantile(sorted,.25))],['50% · median',fmt(median)],['75%',fmt(quantile(sorted,.75))],['max',fmt(sorted[n-1])]];$('statsBody').innerHTML=stats.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('');}
 else $('statsBody').innerHTML='<tr><td colspan="2" class="empty">No numeric columns found.</td></tr>';
 renderPreview();setNotice(`Loaded “${name}” successfully. ${rows.length} rows and ${headers.length} columns detected.`);}
function quantile(a,q){const p=(a.length-1)*q,lo=Math.floor(p),hi=Math.ceil(p);return a[lo]+(a[hi]-a[lo])*(p-lo);}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderPreview(){if(!dataset)return;const {headers,data}=dataset;const rows=activeView==='head'?data.slice(0,5):data.slice(-5);$('previewTable').querySelector('thead').innerHTML='<tr>'+headers.map(h=>`<th>${escapeHTML(h)}</th>`).join('')+'</tr>';$('previewTable').querySelector('tbody').innerHTML=rows.map(r=>'<tr>'+headers.map((_,i)=>`<td>${escapeHTML(cellText(r[i]??''))}</td>`).join('')+'</tr>').join('');$('previewLabel').textContent=`Showing ${activeView==='head'?'first':'last'} ${rows.length} of ${data.length} rows`;}
$('fileInput').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(!file.name.toLowerCase().endsWith('.csv'))throw new Error('Please select a .csv file.');render(parseCSV(await file.text()),file.name);}catch(err){setNotice(err.message||'Could not read this file.',true);}e.target.value='';});
$('sampleBtn').addEventListener('click',()=>{const csv='sepal_length,sepal_width,petal_length,petal_width,species\n5.1,3.5,1.4,0.2,setosa\n4.9,3.0,1.4,0.2,setosa\n4.7,3.2,1.3,0.2,setosa\n4.6,3.1,1.5,0.2,setosa\n5.0,3.6,1.4,0.2,setosa\n5.4,3.9,1.7,0.4,setosa\n6.4,3.2,4.5,1.5,versicolor\n6.9,3.1,4.9,1.5,versicolor\n5.5,2.3,4.0,1.3,versicolor\n6.5,3.0,5.2,2.0,virginica\n6.2,3.4,5.4,2.3,virginica\n5.9,3.0,5.1,1.8,virginica';render(parseCSV(csv),'iris_sample.csv');});
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));b.classList.add('active');activeView=b.dataset.view;renderPreview();}));
