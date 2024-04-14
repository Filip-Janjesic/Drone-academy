import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import Service from "../../services/InstruktorService";
import { IoIosAdd } from "react-icons/io";
import { FaDownload, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import { App, RoutesNames } from "../../constants";
import { useNavigate } from "react-router-dom";
import useError from "../../hooks/useError";

export default function Instruktori(){
    const [Instruktori,setInstruktori] = useState();
    let navigate = useNavigate(); 
    const { prikaziError } = useError();
    const [prikaziModal, setPrikaziModal] = useState(false);
    const [odabraniInstruktor,setOdabraniInstruktor] = useState({});

    async function dohvatiInstruktore(){
        const odgovor = await Service.get('Instruktor');
        if(!odgovor.ok){
            prikaziError(odgovor.podaci);
            return;
        }
        setInstruktori(odgovor.podaci);
    }

    async function obrisiInstruktor(sifra) {
        const odgovor = await Service.obrisi('Instruktor',sifra);
        prikaziError(odgovor.podaci);
        if (odgovor.ok){
            dohvatiInstruktore();
        }
    }

    useEffect(()=>{
        dohvatiInstruktore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    function postaviDatotekuModal(instruktor){
        setOdabraniInstruktor(instruktor);
        setPrikaziModal(true);
    }

    function zatvoriModal(){
        setPrikaziModal(false);
    }

    async function postaviDatoteku(e){
        if (e.currentTarget.files) {
            const formData = new FormData();
            formData.append('datoteka', e.currentTarget.files[0]);
            const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
            };
            const odgovor = await Service.postaviDatoteku(odabraniInstruktor.sifra,formData,config);
            alert(dohvatiPorukeAlert(odgovor.podaci));
            if (odgovor.ok){
                dohvatiInstruktore();
                setPrikaziModal(false);
            }
        }
    }


    return (
        <>
        <Container>
            <Link to={RoutesNames.INSTRUKTORI_NOVI} className="btn btn-success gumb">
                <IoIosAdd
                size={25}
                /> Dodaj
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>OIB</th>
                        <th>Email</th>
                        <th>IBAN</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {Instruktori && Instruktori.map((instruktor,index)=>(
                        <tr key={index}>
                            <td>{instruktor.ime}</td>
                            <td>{instruktor.prezime}</td>
                            <td>{instruktor.oib}</td>
                            <td>{instruktor.email}</td>
                            <td>{instruktor.iban}</td>
                            <td className="sredina">
                                    <Button
                                        variant='primary'
                                        onClick={()=>{navigate(`/instruktori/${instruktor.sifra}`)}}
                                    >
                                        <FaEdit 
                                    size={25}
                                    />
                                    </Button>
                               
                                
                                    &nbsp;&nbsp;&nbsp;
                                    <Button
                                        variant='danger'
                                        onClick={() => obrisiInstruktor(instruktor.sifra)}
                                    >
                                        <FaTrash
                                        size={25}/>
                                    </Button>

                                   

                                        {instruktor.datoteka!=null ? 
                                        <>
                                        &nbsp;&nbsp;&nbsp;
                                        <a target="_blank" href={App.URL + instruktor.datoteka}>
                                            <FaDownload
                                            size={25}/>
                                        </a>
                                        </>
                                        
                                    : ''
                                    }
                                    &nbsp;&nbsp;&nbsp;
                                        <Button
                                            onClick={() => postaviDatotekuModal(instruktor)}
                                        >
                                            <FaUpload
                                            size={25}/>
                                        </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
            <Modal show={prikaziModal} onHide={zatvoriModal}>
                <Modal.Header closeButton>
                <Modal.Title>Postavljanje datoteke na <br /> {odabraniInstruktor.prezime}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type="file" size="lg" 
                            name='datoteka'
                            id='datoteka'
                            onChange={postaviDatoteku}
                            />
                        </Form.Group>
                        <hr />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant='secondary' onClick={zatvoriModal}>
                    Zatvori
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}