import { useEffect, useState } from "react";
import {  Button, Container, Table } from "react-bootstrap";
import Service from "../../services/TecajService";
import { NumericFormat } from "react-number-format";
import { GrValidate } from "react-icons/gr";
import { IoIosAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RoutesNames } from "../../constants";
import useError from "../../hooks/useError";
import useLoading from "../../hooks/useLoading";


export default function Tecajevi(){
    const [tecajevi,setTecajevi] = useState();
    const navigate = useNavigate();
    const { prikaziError } = useError();
    const { showLoading, hideLoading } = useLoading();

    async function dohvatiTecajeve(){
        showLoading();
        const odgovor = await Service.get('Tecaj');
        if(!odgovor.ok){
            prikaziError(odgovor.podaci);
            return;
        }
        setTecajevi(odgovor.podaci);
        hideLoading();
    }

    async function obrisiTecaj(sifra){
        showLoading();
        const odgovor = await Service.obrisi('Tecaj',sifra);
        prikaziError(odgovor.podaci);
        if (odgovor.ok){
            dohvatiTecajeve();
        }
        hideLoading();
    }
     // Ovo se poziva dvaput u dev ali jednom u produkciji
    // https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
    useEffect(()=>{
        dohvatiTecajeve();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    

    return (

        <Container>
            <Link to={RoutesNames.TECAJEVI_NOVI} className="btn btn-success gumb">
                <IoIosAdd
                size={25}
                /> Dodaj
            </Link>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Trajanje</th>
                        <th>Cijena</th>
                        <th>Upisnina</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {tecajevi && tecajevi.map((tecaj,index)=>(
                        <tr key={index}>
                            <td>{tecaj.naziv}</td>
                            <td className="desno">{tecaj.trajanje}</td>
                            <td className={tecaj.cijena==null ? 'sredina' : 'desno'}>
                                {tecaj.cijena==null 
                                ? 'Nije definirano'
                                :
                                    <NumericFormat 
                                    value={tecaj.cijena}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    prefix={'€'}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    />
                                }
                            </td>
                            <td className={tecaj.upisnina==null ? 'sredina' : 'desno'}>
                                {tecaj.upisnina==null 
                                ? 'Nije definirano'
                                :
                                    <NumericFormat 
                                    value={tecaj.upisnina}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    prefix={'€'}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    />
                                }
                            </td>
                            <td className="sredina">
                            <GrValidate 
                            size={30} 
                            />
                            </td>
                            <td className="sredina">
                                <Button 
                                variant="primary"
                                onClick={()=>{navigate(`/tecajevi/${tecaj.sifra}`)}}>
                                    <FaEdit 
                                    size={25}
                                    />
                                </Button>
                                
                                    &nbsp;&nbsp;&nbsp;
                                <Button
                                    variant="danger"
                                    onClick={()=>obrisiTecaj(tecaj.sifra)}
                                >
                                    <FaTrash  
                                    size={25}
                                    />
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>

    );

}