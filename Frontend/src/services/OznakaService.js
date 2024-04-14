import  { httpService, obradiGresku, obradiUspjeh, get,obrisi,dodaj,getBySifra,promjeni  } from "./httpService";

async function traziOznaka(naziv,uvjet) {
  return await httpService    .get('/' + naziv +'/trazi/' + uvjet).then((res)=>{return obradiUspjeh(res);}).catch((e)=>{ return obradiGresku(e);});
}

export default{get,obrisi,dodaj,getBySifra,promjeni,traziOznaka};