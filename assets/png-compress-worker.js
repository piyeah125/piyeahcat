/* UPNG by Photopea (MIT); DEFLATE provided by bundled fflate (MIT). */
self.window=self;
importScripts('fflate.min.js');
self.pako={deflate:(data)=>fflate.zlibSync(data,{level:9})};
importScripts('UPNG.js');
self.onmessage=event=>{
 try{
  const {rgba,width,height,colours}=event.data;
  const result=UPNG.encode([rgba],width,height,colours);
  self.postMessage({result},[result]);
 }catch(error){self.postMessage({error:error.message||String(error)})}
};
