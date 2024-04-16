import { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Service from '../../services/KandidatService';
import { App, RoutesNames } from '../../constants';
import { dohvatiPorukeAlert } from '../../services/httpService';
import InputText from '../../components/InputText';
import Akcije from '../../components/Akcije';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import drone from '../../assets/drone.png'; 
import useLoading from '../../hooks/useLoading';
import useError from '../../hooks/useError';

export default function KandidatiPromjeni() {
  const [kandidat, setKandidat] = useState({});

  const [trenutnaSlika, setTrenutnaSlika] = useState('');
  const [slikaZaCrop, setSlikaZaCrop] = useState('');
  const [slikaZaServer, setSlikaZaServer] = useState('');
  const cropperRef = useRef(null);
  const routeParams = useParams();
  const navigate = useNavigate();
  const { prikaziError } = useError();
  const { showLoading, hideLoading } = useLoading();


  async function dohvatiKandidat() {
    showLoading();
    const odgovor = await Service.getBySifra('Kandidat',routeParams.sifra);
    if(!odgovor.ok){
      hideLoading();
      prikaziError(odgovor.podaci);
      return;
    }
    setKandidat(odgovor.podaci);

    if(odgovor.podaci.slika!=null){
      setTrenutnaSlika(App.URL + odgovor.podaci.slika + `?${Date.now()}`);
    }else{
      setTrenutnaSlika(drone);
    }
    hideLoading();
  }

  useEffect(() => {
    dohvatiKandidat();

  }, []);

  async function promjeniKandidat(kandidat) {
    showLoading();
    const odgovor = await Service.promjeni('Kandidat',routeParams.sifra, kandidat);
    if(odgovor.ok){
      hideLoading();
      navigate(RoutesNames.KANDIDATI_PREGLED);
      return;
    }
    alert(dohvatiPorukeAlert(odgovor.podaci));
    hideLoading();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const podaci = new FormData(e.target);
    promjeniKandidat({
      ime: podaci.get('ime'),
      prezime: podaci.get('prezime'),
      oib: podaci.get('oib'),
      email: podaci.get('email'),
      brojugovora: podaci.get('brojugovora'),
      slika: ''
    });
  }



  function onCrop() {
    setSlikaZaServer(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
  }

  function onChangeImage(e) {
    e.preventDefault();

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSlikaZaCrop(reader.result);
    };
    try {
      reader.readAsDataURL(files[0]);
    } catch (error) {
      console.error(error);
    }
  }

  async function spremiSliku() {
    showLoading();
    const base64 = slikaZaServer;

    const odgovor = await Service.postaviSliku(routeParams.sifra, {Base64: base64.replace('data:image/png;base64,', '')});
    if(!odgovor.ok){
      hideLoading();
      prikaziError(odgovor.podaci);
    }
    setTrenutnaSlika(slikaZaServer);
    hideLoading();
  }

  return (
    <Container className='mt-4'>
       <Row>
        <Col key='1' sm={12} lg={6} md={6}>
          <Form onSubmit={handleSubmit}>
            <InputText atribut='ime' vrijednost={kandidat.ime} />
            <InputText atribut='prezime' vrijednost={kandidat.prezime} />
            <InputText atribut='oib' vrijednost={kandidat.oib} />
            <InputText atribut='email' vrijednost={kandidat.email} />
            <InputText atribut='brojugovora' vrijednost={kandidat.brojugovora} />
            <Akcije odustani={RoutesNames.KANDIDATI_PREGLED} akcija='Promjeni kandidata' /> 
          </Form>
          <Row className='mb-4'>
              <Col key='1' sm={12} lg={6} md={12}>
                <p className='form-label'>Trenutna slika</p>
                <Image

                  src={trenutnaSlika}
                  className='slika'
                />
              </Col>
              <Col key='2' sm={12} lg={6} md={12}>
                {slikaZaServer && (
                  <>
                    <p className='form-label'>Nova slika</p>
                    <Image
                      src={slikaZaServer || slikaZaCrop}
                      className='slika'
                    />
                  </>
                )}
              </Col>
            </Row>
        </Col>
        <Col key='2' sm={12} lg={6} md={6}>
        <input className='mb-3' type='file' onChange={onChangeImage} />
              <Button disabled={!slikaZaServer} onClick={spremiSliku}>
                Spremi sliku
              </Button>

              <Cropper
                src={slikaZaCrop}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                guides={true}
                viewMode={1}
                minCropBoxWidth={50}
                minCropBoxHeight={50}
                cropBoxResizable={false}
                background={false}
                responsive={true}
                checkOrientation={false}
                cropstart={onCrop}
                cropend={onCrop}
                ref={cropperRef}
              />
        </Col>
      </Row>
      
    </Container>
  );
}
