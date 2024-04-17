import { httpService, obradiGresku, obradiUspjeh } from './httpService';

// Modified logInService function without authentication-related content
export async function logInService(userData) {
  // Modify the endpoint to remove authentication-related path
  return await httpService
    .post('/login', userData) // Adjust the endpoint to your login route
    .then((res) => { return obradiUspjeh(res); })
    .catch((e) => { 
      // Modify error handling as needed, without authentication-related response
      return { greska: true , podaci: [{svojstvo: 'Autorizacija', poruka: e.response.data}]}; 
    });
}
