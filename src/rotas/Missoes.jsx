import PlacaEmBreve from '../Imgs/placaEmBreve.png'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Missoes =({usuario})=>{
    const navigate = useNavigate();

    useEffect(() => {
      if (usuario === '') {
        navigate('/');
      }
    }, [usuario, navigate]);


    return(<>
    <p>missoes</p><img id='emBreve' src={PlacaEmBreve}/>
    </>)
}
export default Missoes