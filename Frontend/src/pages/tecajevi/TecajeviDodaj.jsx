import { Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RoutesNames } from "../../constants";
import Service from "../../services/TecajService";
import useError from '../../hooks/useError';
import InputText from "../../components/InputText";
import InputCheckbox from "../../components/InputCheckbox";
import Akcije from "../../components/Akcije";
import useLoading from "../../hooks/useLoading";

export default function TecajeviDodaj(){
    const navigate = useNavigate();
    const { prikaziError } = useError();
    const { showLoading, hideLoading } = useLoading();

    async function dodajTecaj(tecaj){
        showLoading();
        const odgovor = await Service.dodaj('Tecaj',tecaj);
        if(odgovor.ok){
          navigate(RoutesNames.TECAJEVI_PREGLED);
          return
        }
        prikaziError(odgovor.podaci);
        hideLoading();
    }

    function handleSubmit(e){
        e.preventDefault();
        const podaci = new FormData(e.target);
        dodajTecaj({
            naziv: podaci.get('naziv'),
            trajanje: parseInt(podaci.get('trajanje')),
            cijena: parseFloat(podaci.get('cijena')),
            upisnina: parseFloat(podaci.get('upisnina')),
            verificiran: podaci.get('verificiran')=='on' ? true: false
        });
    }

    return (

        <Container>
           <Form onSubmit={handleSubmit}>
                <InputText atribut='naziv' vrijednost='' />
                <InputText atribut='trajanje' vrijednost='' />
                <InputText atribut='cijena' vrijednost='' />
                <InputText atribut='upisnina' vrijednost='' />
                <InputCheckbox atribut='verificiran' vrijednost={false} />
                <Akcije odustani={RoutesNames.TECAJEVI_PREGLED} akcija='Dodaj tecaj' />
           </Form>
        </Container>

    );

}