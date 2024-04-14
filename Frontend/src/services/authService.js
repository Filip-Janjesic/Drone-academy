import { httpService, obradiGresku, obradiUspjeh } from './httpService';

export async function logInService(userData) {
  return await httpService
    .post('/Autorizacija/token', userData)
    .then((res)=>{return obradiUspjeh(res);}).catch((e)=>{ return { greska: true , podaci: [{svojstvo: 'Autorizacija', poruka: e.response.data}]}});
}