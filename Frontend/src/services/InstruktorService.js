import  { get,obrisi,dodaj,getBySifra,promjeni, httpService, obradiUspjeh, obradiGresku } from "./httpService";

async function postaviDatoteku(sifra,datoteka,config) {
    return await httpService.patch('/Instruktor/' + sifra,datoteka,config).then((res)=>{return obradiUspjeh(res);}).catch((e)=>{ return obradiGresku(e);});
  }

export default{get,obrisi,dodaj,getBySifra,promjeni,postaviDatoteku};