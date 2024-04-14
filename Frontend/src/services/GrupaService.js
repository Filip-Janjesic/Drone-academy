import { httpService, obradiGresku, obradiUspjeh, get,obrisi,dodaj,getBySifra,promjeni  } from "./httpService";

async function getKandidati(naziv,sifra){
  return await httpService.get('/' + naziv + '/Kandidati/' + sifra).then((res)=>{return obradiUspjeh(res);}).catch((e)=>{ return obradiGresku(e);});
}
async function dodajKandidata(naziv,grupa, kandidat) {
  return await httpService.post('/' + naziv + '/' + grupa + '/dodaj/' + kandidat).then((res)=>{return obradiUspjeh(res);}).catch((e)=>{ return obradiGresku(e);});
}
async function obrisiKandidata(naziv,grupa, kandidat) {
  return await httpService.delete('/'+naziv+'/' + grupa + '/obrisi/' + kandidat).then((res)=>{return obradiUspjeh(res);}).catch((e)=>{ return obradiGresku(e);});
}

export default{
    get,
    obrisi,
    dodaj,
    getBySifra,
    promjeni,
    getKandidati,
    dodajKandidata,
    obrisiKandidata
};