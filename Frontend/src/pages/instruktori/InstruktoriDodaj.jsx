import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Service from '../../services/InstruktorService';
import { RoutesNames } from '../../constants';
import useError from '../../hooks/useError';
import InputText from '../../components/InputText';
import Akcije from '../../components/Akcije';


export default function InstruktoriDodaj() {
  const navigate = useNavigate();
  const { prikaziError } = useError();


  async function dodajInstruktor(Instruktor) {
    const odgovor = await Service.dodaj('Instruktor',Instruktor);
    if(odgovor.ok){
      navigate(RoutesNames.INSTRUKTORI_PREGLED);
      return
    }
    prikaziError(odgovor.podaci);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);


    dodajInstruktor({
      ime: podaci.get('ime'),
      prezime: podaci.get('prezime'),
      oib: podaci.get('oib'),
      email: podaci.get('email'),
      iban: podaci.get('iban')
    });
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <InputText atribut='ime' vrijednost='' />
        <InputText atribut='prezime' vrijednost='' />
        <InputText atribut='oib' vrijednost='' />
        <InputText atribut='email' vrijednost='' />
        <InputText atribut='iban' vrijednost='' />
        <Akcije odustani={RoutesNames.INSTRUKTORI_PREGLED} akcija='Dodaj instruktora' />       
      </Form>
    </Container>
  );
}
