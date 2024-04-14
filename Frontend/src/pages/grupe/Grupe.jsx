import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import moment from "moment";
import Service from "../../services/GrupaService";
import { RoutesNames } from "../../constants";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";

export default function Grupe(){
    const [grupe,setGrupe] = useState();
    let navigate = useNavigate(); 
    const { showLoading, hideLoading } = useLoading();

    const { prikaziError } = useError();

    async function dohvatiGrupe(){
        showLoading();
        const odgovor = await Service.get('Grupa');
        if(!odgovor.ok){
            hideLoading();
            prikaziError(odgovor.podaci);
            return;
        }
        setGrupe(odgovor.podaci);
        hideLoading();
    }

    async function obrisiGrupu(sifra) {
        showLoading();
        const odgovor = await Service.obrisi('Grupa',sifra);
        hideLoading();
        prikaziError(odgovor.podaci);
        if (odgovor.ok){
            dohvatiGrupe();
        }
    }

    useEffect(()=>{dohvatiGrupe();},[]);

    function progressStatus(entitet){
    return entitet.brojkandidata + " kandidata od ukupno " +
    entitet.maksimalnokandidata + " kandidata na grupi.";
    }

    function progressLabel(entitet){
    return entitet.brojkandidata + "/" +
    entitet.maksimalnokandidata;
    }

    function progressPostotak(entitet){
    if (entitet.maksimalnokandidata==0 || entitet.brojkandidata==0){
        return 0;
    }

    return (entitet.brojkandidata / entitet.maksimalnokandidata) * 100;
    }

    function formatirajDatum(datumpocetka){
    let mdp = moment.utc(datumpocetka);
    if(mdp.hour()==0 && mdp.minutes()==0){
        return mdp.format('DD. MM. YYYY.');
    }
    return mdp.format('DD. MM. YYYY. HH:mm');
    
    }

    return (

        <Container>
            <Link to={RoutesNames.GRUPE_NOVI} className="btn btn-success gumb">
                <IoIosAdd
                size={25}
                /> Dodaj
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Tečaj</th>
                        <th>Instruktor</th>
                        <th>Datum početka</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {grupe && grupe.map((entitet,index)=>(
                        <tr key={index}>
                            <td>{entitet.naziv}</td>
                            <td>{entitet.tecajNaziv}</td>
                            <td>{entitet.instruktorImePrezime}</td>
                            <td>
                                <p>
                                {entitet.datumpocetka==null 
                                ? 'Nije definirano'
                                :   
                                formatirajDatum(entitet.datumpocetka)
                                }
                                </p>
                                <ProgressBar 
                                label={progressLabel(entitet)}
                                variant="success"
                                title={progressStatus(entitet)} now={progressPostotak(entitet)} />
                               
                                {}
                            </td>
                            <td className="sredina">
                                    <Button
                                        variant='primary'
                                        onClick={()=>{navigate(`/grupe/${entitet.sifra}`)}}
                                    >
                                        <FaEdit 
                                    size={25}
                                    />
                                    </Button>
                               
                                
                                    &nbsp;&nbsp;&nbsp;
                                    <Button
                                        variant='danger'
                                        onClick={() => obrisiGrupu(entitet.sifra)}
                                    >
                                        <FaTrash
                                        size={25}/>
                                    </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>

    );

}