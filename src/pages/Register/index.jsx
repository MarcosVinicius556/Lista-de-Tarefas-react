import { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.css';

function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleRegister(e){
    e.preventDefault();

    if(email !== '' && password !== ''){
      alert('teste');
    } else {
      alert('Preencha todos os campos');
    }

  }

    return(
       <div className='home-container' onSubmit={handleRegister}>
         <h1>Cadastre-se</h1>
         <span>Vamos criar sua conta!</span>
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

            <button type='submit' >Cadastrar</button>
         </form>

         <Link to="/" className='btn-link'>
            Já possui uma conta? Faça o login
         </Link>
       </div>
     )
   }
   
   export default Register;
   