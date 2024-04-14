import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Pagination, Row } from "react-bootstrap";
import Service from "../../services/KandidatService";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { App, RoutesNames } from "../../constants";
import nepoznato from '../../assets/nepoznato.png'; 
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function Kandidati(){
    const [kandidati,setKandidati] = useState([]);
    const [stranica, setStranica] = useState(1);
    const [uvjet, setUvjet] = useState('');
    const { prikaziError } = useError();
    const { showLoading, hideLoading } = useLoading();
    

    async function dohvatiKandidate(){
        showLoading();
        const odgovor = await Service.getStranicenje(stranica,uvjet);
        if(!odgovor.ok){
            prikaziError(odgovor.podaci);
            hideLoading();
            return;
        }
        if(odgovor.podaci.length==0){
            setStranica(stranica-1);
            hideLoading();
            return;
        }
        setKandidati(odgovor.podaci);
        hideLoading();
    }

    async function obrisiKandidat(sifra) {
        showLoading();
        const odgovor = await Service.obrisi('Kandidat',sifra);
        prikaziError(odgovor.podaci);
        if (odgovor.ok){
            dohvatiKandidate();
        }
        hideLoading();
    }

    useEffect(()=>{
            dohvatiKandidate(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[stranica, uvjet]);

    function slika(kandidat){
        if(kandidat.slika!=null){
            return App.URL + kandidat.slika+ `?${Date.now()}`;
        }
        return nepoznato;
    }

    function promjeniUvjet(e) {
        if(e.nativeEvent.key == "Enter"){
            setStranica(1);
            setUvjet(e.nativeEvent.srcElement.value);
            setKandidati([]);
        }
    }

    function povecajStranicu() {
        setStranica(stranica + 1);
      }
    
      function smanjiStranicu() {
        if(stranica==1){
            return;
        }
        setStranica(stranica - 1);
      }

    return (

        <Container>
           
            <Row>
                <Col key={1} sm={12} lg={4} md={4}>
                    <Form.Control
                    type='text'
                    name='trazilica'
                    placeholder='Dio imena i prezimena [Enter]'
                    maxLength={255}
                    defaultValue=''
                    onKeyUp={promjeniUvjet}
                    />
                </Col>
                <Col key={2} sm={12} lg={4} md={4}>
                    {kandidati && kandidati.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination size="lg">
                                <Pagination.Prev onClick={smanjiStranicu} />
                                <Pagination.Item disabled>{stranica}</Pagination.Item> 
                                <Pagination.Next
                                    onClick={povecajStranicu}
                                />
                            </Pagination>
                        </div>
                    )}
                </Col>
                <Col key={3} sm={12} lg={4} md={4}>
                    <Link to={RoutesNames.KADNIDATI_NOVI} className="btn btn-success gumb">
                        <IoIosAdd
                        size={25}
                        /> Dodaj
                    </Link>
                </Col>
            </Row>
            
                
            <Row>
                
            { kandidati && kandidati.map((p) => (
           
           <Col key={p.sifra} sm={12} lg={3} md={3}>
              <Card style={{ marginTop: '1rem' }}>
              <Card.Img variant="top" src={slika(p)} className="slika"/>
                <Card.Body>
                  <Card.Title>{p.ime} {p.prezime}</Card.Title>
                  <Card.Text>
                    {p.email}
                  </Card.Text>
                  <Row>
                      <Col>
                      <Link className="btn btn-primary gumb" to={`/kandidati/${p.sifra}`}><FaEdit /></Link>
                      </Col>
                      <Col>
                      <Button variant="danger" className="gumb"  onClick={() => obrisiKandidat(p.sifra)}><FaTrash /></Button>
                      </Col>
                    </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
      }
      </Row>
      <hr />
              {kandidati && kandidati.length > 0 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Pagination size="lg">
                    <Pagination.Prev onClick={smanjiStranicu} />
                    <Pagination.Item disabled>{stranica}</Pagination.Item> 
                    <Pagination.Next
                        onClick={povecajStranicu}
                    />
                    </Pagination>
                </div>
                )}
        </Container>


    );

}