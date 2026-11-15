function initializeBankManager(container, getCode) {
  const find = id => container.querySelector('#'+id);
  const fileInput=find('bank-file'), preview=find('bank-preview');
  const controls=['bank-refresh','bank-template','bank-export','bank-validate','bank-file','bank-activate'].map(find);
  let pending=null,busy=false;
  const manager={loaded:false,refresh};
  function message(id,text) {const element=find(id);element.textContent=text;element.hidden=!text;}
  function clearErrors() {message('bank-error','');find('bank-errors').replaceChildren();find('bank-errors').hidden=true;}
  function showFailure(error) {
    message('bank-error',error.message);
    const list=find('bank-errors');
    list.replaceChildren(...(error.errors || []).map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    list.hidden=!list.childElementCount;
  }
  async function request(action,body={}) {
    let response;
    try {response=await fetch('/api/bank/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,code:getCode()})});}
    catch {throw new Error('Server tidak dapat dihubungi. Coba lagi.');}
    if(!response.ok) {
      const data=await response.json();const error=new Error(data.error || 'Permintaan bank soal gagal.');error.errors=data.errors;error.status=response.status;throw error;
    }
    return response;
  }
  function setBusy(value) {busy=value;controls.forEach(element=>{element.disabled=value;});}
  async function refresh() {
    if(busy || !getCode()) return;
    try {
      const data=await (await request('status')).json();
      const time=data.updatedAt?new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',dateStyle:'medium',timeStyle:'short'}).format(data.updatedAt)+' WIB':'bank awal';
      find('bank-info').textContent=`Ujian: ${data.examId} · ${data.total} soal · ${data.pairs} pasangan · ${data.source==='uploaded'?'Diperbarui '+time:'Bank bawaan V4'}`;
      manager.loaded=true;
    } catch(error) {showFailure(error);}
  }
  async function download(action,filename) {
    if(busy) return;clearErrors();setBusy(true);
    try {
      const response=await request(action);const blob=await response.blob();
      const url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch(error) {showFailure(error);} finally {setBusy(false);}
  }
  find('bank-refresh').addEventListener('click',()=>{clearErrors();void refresh();});
  find('bank-template').addEventListener('click',()=>void download('template','Template_Soal_UAS_Daya_Pertanian.xlsx'));
  find('bank-export').addEventListener('click',()=>void download('export','Bank_Soal_Aktif_UAS_Daya_Pertanian.xlsx'));
  fileInput.addEventListener('change',()=>{pending=null;preview.hidden=true;clearErrors();message('bank-success','');});
  find('bank-upload-form').addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    clearErrors();message('bank-success','');pending=null;preview.hidden=true;
    const file=fileInput.files[0];
    if(!file || !/\.xlsx$/i.test(file.name) || file.size>1024*1024 || file.size===0) return showFailure(new Error('Pilih file .xlsx dengan ukuran maksimal 1 MB.'));
    setBusy(true);find('bank-validate').textContent='Memeriksa…';
    try {
      const content=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('File tidak dapat dibaca.'));reader.readAsDataURL(file);});
      const body={fileName:file.name,content};
      const data=await (await request('validate',body)).json();
      pending={...body,activeVersion:data.activeVersion};
      find('bank-summary').textContent=`${file.name}: ${data.total} soal valid, ${data.pairs} pasangan. ${data.changed?'Bank siap digunakan untuk sesi baru.':'Isinya sama dengan bank aktif.'}`;
      find('bank-distribution').replaceChildren(...data.distribution.map(item=>{
        const row=document.createElement('tr');for(const value of [item.topic,item.pemahaman,item.hitungan]){const td=document.createElement('td');td.textContent=value;row.append(td);}return row;
      }));
      find('bank-preview-questions').replaceChildren(...data.preview.map(item=>{const li=document.createElement('li');li.textContent=item.id+': '+item.prompt;return li;}));
      preview.hidden=false;
    } catch(error) {showFailure(error);} finally {setBusy(false);find('bank-validate').textContent='Periksa file';}
  });
  find('bank-activate').addEventListener('click',async()=>{
    if(busy || !pending) return;
    clearErrors();setBusy(true);find('bank-activate').textContent='Menyimpan…';
    try {
      const data=await (await request('upload',pending)).json();
      message('bank-success',`${data.total} soal berhasil diperbarui untuk sesi baru. Sesi yang sudah berjalan tetap memakai bank semula.`);
      pending=null;preview.hidden=true;fileInput.value='';manager.loaded=false;
    } catch(error) {
      showFailure(error);
      if(error.status===409){pending=null;preview.hidden=true;}
    } finally {setBusy(false);find('bank-activate').textContent='Gunakan untuk sesi baru';}
    if(!manager.loaded) await refresh();
  });
  return manager;
}
