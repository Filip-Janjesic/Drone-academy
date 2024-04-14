import { useState, useEffect, useRef } from 'react';
import { Button, Container, Form, Row, Col, Table } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import moment from 'moment';
import Service from '../../services/GrupaService';
import KandidatService from "../../services/KandidatService";
import { RoutesNames } from '../../constants';
import useError from '../../hooks/useError';
import InputText from '../../components/InputText';
import Akcije from '../../components/Akcije';
import useLoading from '../../hooks/useLoading';


export default function GrupePromjeni() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const [grupa, setGrupa] = useState({});

  const [tecajevi, setTecajevi] = useState([]);
  const [sifraTecaj, setSifraTecaj] = useState(0);

  const [instruktori, setInstruktori] = useState([]);
  const [sifraInstruktor, setSifraInstruktor] = useState(0);

  const [kandidati, setKandidati] = useState([]);
  const [pronadeniKandidati, setPronadeniKandidati] = useState([]);

  const [searchName, setSearchName] = useState('');

  const typeaheadRef = useRef(null);

  const { prikaziError } = useError();
  const { showLoading, hideLoading } = useLoading();



  async function dohvatiGrupa() {
    const odgovor = await Service.getBySifra('Grupa',routeParams.sifra);
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
      return;
    }
    let grupa = odgovor.podaci;
    grupa.vrijeme =moment.utc(grupa.datumpocetka).format('HH:mm');
    grupa.datum= moment.utc(grupa.datumpocetka).format('yyyy-MM-DD');
    delete grupa.datumpocetka;
    setGrupa(grupa);
    setSifraTecaj(grupa.tecajSifra);
    if(grupa.instruktorSifra!=null){
      setSifraInstruktor(grupa.instruktorSifra);
    }       
  }

  async function dohvatiKandidati() {
    const odgovor = await Service.getKandidati('Grupa',routeParams.sifra);
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
      return;
    }
    setKandidati(odgovor.podaci);
  }

  async function dohvatiTecajevi() {
    const odgovor =  await Service.get('Tecaj');
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
      return;
    }
    setTecajevi(odgovor.podaci);
    setSifraTecaj(odgovor.podaci[0].sifra);
      
  }

  async function dohvatiInstruktori() {
    const odgovor =  await Service.get('Instruktor');
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
      return;
    }
    setInstruktori(odgovor.podaci);
    setSifraInstruktor(odgovor.podaci[0].sifra);
  }

  async function traziKandidat(uvjet) {
    const odgovor =  await KandidatService.traziKandidat('Kandidat',uvjet);
    if(!odgovor.ok){
      prikaziError(odgovor.podaci);
      return;
    }
    setPronadeniKandidati(odgovor.podaci);
    setSearchName(uvjet);
  }

  async function dohvatiInicijalnePodatke() {
    showLoading();
    await dohvatiTecajevi();
    await dohvatiInstruktori();
    await dohvatiGrupa();
    await dohvatiKandidati();
    hideLoading();
  }

  useEffect(() => {
    dohvatiInicijalnePodatke();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function promjeni(e) {
    const odgovor = await Service.promjeni('Grupa',routeParams.sifra, e);
    if(odgovor.ok){
      navigate(RoutesNames.GRUPE_PREGLED);
      return;
    }
    prikaziError(odgovor.podaci);
  }


  async function obrisiKandidata(grupa, kandidat) {
    const odgovor = await Service.obrisiKandidata('Grupa',grupa, kandidat);
    if(odgovor.ok){
      await dohvatiKandidati();
      return;
    }
    prikaziError(odgovor.podaci);
  }

  async function dodajKandidata(e) {
    showLoading();
    const odgovor = await Service.dodajKandidata('Grupa',routeParams.sifra, e[0].sifra);
    if(odgovor.ok){
      await dohvatiKandidati();
      hideLoading();
      return;
    }
    hideLoading();
    prikaziError(odgovor.podaci);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);

    //console.log(podaci.get('datum'));
    //console.log(podaci.get('vrijeme'));
    const datum = moment.utc(podaci.get('datum') + ' ' + podaci.get('vrijeme'));
    //console.log(datum);

    promjeni({
      naziv: podaci.get('naziv'),
      datumpocetka: datum,
      tecajSifra: parseInt(sifraTecaj), 
      instruktorSifra: parseInt(sifraInstruktor),
      maksimalnokandidata: parseInt(podaci.get('maksimalnokandidata'))
    });
    
  }

  async function dodajRucnoKandidat(Kandidat) {
    showLoading();
    const odgovor = await KandidatService.dodaj('Kandidat',Kandidat);
    if (odgovor.ok) {
      const odgovor2 = await Service.dodajKandidata('Grupa',routeParams.sifra, odgovor.podaci.sifra);
      if (odgovor2?.ok) {
        typeaheadRef.current.clear();
        await dohvatiKandidati();
        hideLoading();
        return;
      }
      hideLoading();
      prikaziError(odgovor2.podaci);
      return;
    }
    hideLoading();
    prikaziError(odgovor.podaci);
      
  }

  function dodajRucnoKandidata(){
    let niz = searchName.split(' ');
    if(niz.length<2){
      prikaziError([{svojstvo:'',poruka:'Obavezno ime i prezime'}]);
      return;
    }

    dodajRucnoKandidat({
      ime: niz[0],
      prezime: niz[1],
      oib: '',
      email: '',
      brojugovora: ''
    });

    
  }

  return (
    <Container className='mt-4'>
      <Form onSubmit={handleSubmit}>
      <Row>
          <Col key='1' sm={12} lg={6} md={6}>
            <InputText atribut='naziv' vrijednost={grupa.naziv} />
            <Row>
              <Col key='1' sm={12} lg={6} md={6}>
                <Form.Group className='mb-3' controlId='datum'>
                  <Form.Label>Datum</Form.Label>
                  <Form.Control
                    type='date'
                    name='datum'
                    defaultValue={grupa.datum}
                  />
                </Form.Group>
              </Col>
              <Col key='2' sm={12} lg={6} md={6}>
                <Form.Group className='mb-3' controlId='vrijeme'>
                  <Form.Label>Vrijeme</Form.Label>
                  <Form.Control
                    type='time'
                    name='vrijeme'
                    defaultValue={grupa.vrijeme}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className='mb-3' controlId='tecaj'>
              <Form.Label>Tečaj</Form.Label>
              <Form.Select
                value={sifraTecaj}
                onChange={(e) => {
                  setSifraTecaj(e.target.value);
                }}>
                {tecajevi &&
                  tecajevi.map((tecaj, index) => (
                    <option key={index} value={tecaj.sifra}>
                      {tecaj.naziv}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3' controlId='instruktor'>
              <Form.Label>Instruktor</Form.Label>
              <Form.Select
                value={sifraInstruktor}
                onChange={(e) => {
                  setSifraInstruktor(e.target.value);
                }}>
                {instruktori &&
                  instruktori.map((instruktor, index) => (
                    <option key={index} value={instruktor.sifra}>
                      {instruktor.ime} {instruktor.prezime}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <InputText atribut='maksimalnokandidata' vrijednost={grupa.maksimalnokandidata} />
            <Akcije odustani={RoutesNames.GRUPE_PREGLED} akcija='Promjeni grupu' /> 
          </Col>
          <Col key='2' sm={12} lg={6} md={6}>
            <Form.Group className='mb-3' controlId='uvjet'>
              <Row>
                <Col key='1' sm={12} lg={10} md={10}>
                  <Form.Label>Traži kandidata</Form.Label>
                  <AsyncTypeahead
                  className='autocomplete'
                  id='uvjet'
                  emptyLabel='Nema rezultata'
                  searchText='Tražim...'
                  labelKey={(kandidat) => `${kandidat.prezime} ${kandidat.ime}`}
                  minLength={3}
                  options={pronadeniKandidati}
                  onSearch={traziKandidat}
                  placeholder='dio imena ili prezimena'
                  renderMenuItemChildren={(kandidat) => (
                    <>
                      <span>
                        {kandidat.prezime} {kandidat.ime}
                      </span>
                    </>
                  )}
                  onChange={dodajKandidata}
                  ref={typeaheadRef}
                  />
                  </Col>
                  <Col key='2' sm={12} lg={2} md={2}>
                    <Button onClick={dodajRucnoKandidata}>
                      Dodaj
                    </Button>
                </Col>
              </Row>
            </Form.Group>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Kandidati na grupi</th>
                    <th>Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  {kandidati &&
                    kandidati.map((kandidat, index) => (
                      <tr key={index}>
                        <td>
                          {kandidat.ime} {kandidat.prezime}
                          
                        </td>
                        <td>
                          <Button
                            variant='danger'
                            onClick={() =>
                              obrisiKandidata(routeParams.sifra, kandidat.sifra)
                            }
                          >
                            <FaTrash />
                          </Button>
                              &nbsp;
                          <Button
                  
                                          onClick={()=>{navigate(`/kandidati/${kandidat.sifra}`)}}
                                      >Detalji</Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
