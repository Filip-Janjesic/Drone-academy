import { Container, Form} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Service from '../../services/GrupaService';
import { RoutesNames } from '../../constants';
import useError from '../../hooks/useError';
import InputText from '../../components/InputText';
import Akcije from '../../components/Akcije';
import moment from 'moment';
import useLoading from '../../hooks/useLoading';

export default function GrupeDodaj() {
  const navigate = useNavigate();

  const [tecajevi, setTecajevi] = useState([]);
  const [tecajSifra, setTecajSifra] = useState(0);

  const [instruktori, setInstruktori] = useState([]);
  const [instruktorSifra, setInstruktorSifra] = useState(0);

  const { prikaziError } = useError();
  const { showLoading, hideLoading } = useLoading();

  async function dohvatiTecajeve(){
    
    const odgovor = await Service.get('Tecaj');
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
      return;
    }
    setTecajevi(odgovor.podaci);
    setTecajSifra(odgovor.podaci[0].sifra);
  }

  async function dohvatiInstruktori(){
    const odgovor = await Service.get('Instruktor');
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
        return;
    }
    setInstruktori(odgovor.podaci);
    setInstruktorSifra(odgovor.podaci[0].sifra);
  }

  async function ucitaj(){
    showLoading();
    await dohvatiTecajeve();
    await dohvatiInstruktori();
    hideLoading();
  }

  useEffect(()=>{ucitaj();},[]);

  async function dodaj(e) {
    showLoading();
    const odgovor = await Service.dodaj('Grupa',e);
    hideLoading();
    if(odgovor.ok){
      navigate(RoutesNames.GRUPE_PREGLED);
      return
    }
    prikaziError(odgovor.podaci); 
  }

  function handleSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    if(podaci.get('datum')=='' && podaci.get('vrijeme')!=''){
      alert('Ako postavljate vrijeme morate i datum');
      return;
    }
    let datumpocetka=null;
    if(podaci.get('datum')!=''){
      if (podaci.get('vrijeme')!=''){
        datumpocetka = moment.utc(podaci.get('datum') + ' ' + podaci.get('vrijeme'));
      }else{
        datumpocetka = moment.utc(podaci.get('datum'));
      }
      
    }

    dodaj({
      naziv: podaci.get('naziv'),
      datumpocetka: datumpocetka,
      tecajSifra: parseInt(tecajSifra),
      instruktorSifra: parseInt(instruktorSifra),
      maksimalnokandidata: parseInt(podaci.get('maksimalnokandidata'))
    });
  }

  function oibInstruktora(){
    for(let i=0;i<instruktori.length;i++){
      const e = instruktori[i];
      if(e.sifra==instruktorSifra){
        return e.email;
      }
    }
  }

  return (
    <Container className='mt-4'>
      <Form onSubmit={handleSubmit}>

        <InputText atribut='naziv' vrijednost='' />

        <Form.Group className='mb-3' controlId='datum'>
          <Form.Label>Datum</Form.Label>
          <Form.Control
            type='date'
            name='datum'
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='vrijeme'>
          <Form.Label>Vrijeme</Form.Label>
          <Form.Control
            type='time'
            name='vrijeme'
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='tecaj'>
          <Form.Label>Tečaj</Form.Label>
          <Form.Select multiple={true}
          onChange={(e)=>{setTecajSifra(e.target.value)}}
          >
          {tecajevi && tecajevi.map((s,index)=>(
            <option key={index} value={s.sifra}>
              {s.naziv}
            </option>
          ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3' controlId='instruktor'>
          <Form.Label>Predavač</Form.Label>
          <Form.Select
          onChange={(e)=>{setInstruktorSifra(e.target.value)}}
          >
          {instruktori && instruktori.map((e,index)=>(
            <option key={index} value={e.sifra}>
              {e.ime} {e.prezime}
            </option>
          ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className='mb-3' controlId='instruktorOib'>
          <Form.Label>{oibInstruktora()}</Form.Label>
        </Form.Group>

        <InputText atribut='maksimalnokandidata' vrijednost='' />
        <Akcije odustani={RoutesNames.GRUPE_PREGLED} akcija='Dodaj grupu' /> 
      </Form>
    </Container>
  );
}
