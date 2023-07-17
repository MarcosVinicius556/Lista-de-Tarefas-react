import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../FirebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './home.css';

function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      await signInWithEmailAndPassword(auth, email, password)
            .then((promisse) => {
              navigate('/admin', { //Passando options para o useNavigate
                replace:true //Replace no histórico de navegação
              })
            }).catch((error) => {

            });
    } else {
      alert('Preencha todos os campos');
    }

  }

    return(
       <div className='home-container' onSubmit={handleLogin}>
         <h1>Lista de tarefas</h1>
         <span>Gerencie sua agenda de forma fácil</span>
         <form className='form'>
          <input 
            type="text" 
            placeholder='Digite seu email...' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input 
            autoComplete='false'
            type="password" 
            placeholder='Digite sua senha...' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button type='submit' >Acessar</button>
         </form>

         <Link to="/register" className='btn-link'>
            Não possui uma conta? Cadastre-se aqui
         </Link>
       </div>
     )
   }
   
   export default Home
   