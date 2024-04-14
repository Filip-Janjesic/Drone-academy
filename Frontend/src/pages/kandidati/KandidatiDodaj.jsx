import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Service from '../../services/KandidatService';
import { RoutesNames } from '../../constants';
import useError from '../../hooks/useError';
import InputText from '../../components/InputText';
import Akcije from '../../components/Akcije';
import useLoading from '../../hooks/useLoading';


export default function KandidatiDodaj() {
  const navigate = useNavigate();
  const { prikaziError } = useError();
  const { showLoading, hideLoading } = useLoading();


  async function dodajKandidat(Kandidat) {
    showLoading();
    const odgovor = await Service.dodaj('Kandidat',Kandidat);
    if(odgovor.ok){
      hideLoading();
      navigate(RoutesNames.KANDIDATI_PREGLED);
      return
    }
    prikaziError(odgovor.podaci);
    hideLoading();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    dodajKandidat({
      ime: podaci.get('ime'),
      prezime: podaci.get('prezime'),
      oib: podaci.get('oib'),
      email: podaci.get('email'),
      brojugovora: podaci.get('brojugovora'),
      slika: ''
    });
  }

  return (
    <Container className='mt-4'>
      <Form onSubmit={handleSubmit}>
        <InputText atribut='ime' vrijednost='' />
        <InputText atribut='prezime' vrijednost='' />
        <InputText atribut='oib' vrijednost='' />
        <InputText atribut='email' vrijednost='' />
        <InputText atribut='brojugovora' vrijednost='' />
        <Akcije odustani={RoutesNames.KANDIDATI_PREGLED} akcija='Dodaj kandidata' />  
      </Form>
    </Container>
  );
}
