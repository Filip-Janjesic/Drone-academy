import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { RoutesNames, App } from '../constants';

import './NavBar.css';


function NavBar() {

    const navigate = useNavigate();
    const { logout, isLoggedIn } = useAuth();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand 
            className='linkPocetna'
            onClick={()=>navigate(RoutesNames.HOME)}
        >
            Drone Academy
        </Navbar.Brand>

        {isLoggedIn ? (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                
                <NavDropdown title="Programi" id="basic-nav-dropdown">
                  <NavDropdown.Item 
                    onClick={()=>navigate(RoutesNames.OZNAKE_PREGLED)}
                  >
                    Oznake
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    onClick={()=>navigate(RoutesNames.TECAJEVI_PREGLED)}
                  >
                    Tečajevi
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                  onClick={()=>navigate(RoutesNames.INSTRUKTORI_PREGLED)}
                  >
                    Instruktori
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                  onClick={()=>navigate(RoutesNames.KANDIDATI_PREGLED)}
                  >
                    Kandidati
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item 
                  onClick={()=>navigate(RoutesNames.GRUPE_PREGLED)}
                  >
                    Grupe
                  </NavDropdown.Item>
                </NavDropdown>
                
              </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
                <Nav>
                  <Nav.Link onClick={logout}>Odjava</Nav.Link>
                  <Nav.Link target="_blank" href={App.URL + '/swagger/index.html'}>API dokumentacija</Nav.Link>
                </Nav>
              </Navbar.Collapse>
          </>
         ) : (
          <>
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link onClick={() => navigate(RoutesNames.LOGIN)}>
              Prijava
            </Nav.Link>
          </Navbar.Collapse>
          </>
        )}
        
        
      </Container>
    </Navbar>
  );
}

export default NavBar;