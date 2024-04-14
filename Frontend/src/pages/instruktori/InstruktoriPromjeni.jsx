import { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Service from '../../services/InstruktorService';
import { RoutesNames } from '../../constants';
import useError from '../../hooks/useError';
import InputText from '../../components/InputText';
import Akcije from '../../components/Akcije';

export default function InstruktoriPromjeni() {
  const [instruktor, setInstruktor] = useState({});

  const routeParams = useParams();
  const navigate = useNavigate();

  const { prikaziError } = useError();


  async function dohvatiInstruktor() {
    const odgovor = await Service.getBySifra('Instruktor',routeParams.sifra);
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
      return;
    }
    setInstruktor(odgovor.podaci);
  }

  async function promjeniInstruktor(instruktor) {
    const odgovor = await Service.promjeni('Instruktor',routeParams.sifra, instruktor);
    if(odgovor.ok){
      navigate(RoutesNames.INSTRUKTORI_PREGLED);
      return;
    }
    prikaziError(odgovor.podaci);
  }

  useEffect(() => {
    dohvatiInstruktor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  function handleSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    promjeniInstruktor({
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
        <InputText atribut='ime' vrijednost={instruktor.ime} />
        <InputText atribut='prezime' vrijednost={instruktor.prezime} />
        <InputText atribut='oib' vrijednost={instruktor.oib} />
        <InputText atribut='email' vrijednost={instruktor.email} />
        <InputText atribut='iban' vrijednost={instruktor.iban} />
        <Akcije odustani={RoutesNames.INSTRUKTORI_PREGLED} akcija='Promjeni instrukotra' />
      </Form>
    </Container>
  );
}
