import { useState } from 'react';
import { auth } from '../../FirebaseConnection';
import { signOut } from 'firebase/auth';
import './admin.css';

function Admin() {

  const [tarefaInput, setTarefaInput] = useState();

  async function handleRegister(e) {
    e.peventDefault();
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className='admin-container'>
        <h1>Minhas tarefas</h1>

        <form onSubmit={handleRegister} className='form'>
            <textarea
              placeholder='Digite sobre sua tarefa' 
              value={tarefaInput}
              onChange={e => setTarefaInput(e.target.value)}/>

              <button type='submit' className='btn-register'>Registrar Tarefa</button>
        </form>

        <article className='list'>
          <p>Estudar JavaScript e React</p>
          <div>
            <button>Editar</button>
            <button className='btn-delete'>Concluir</button>
          </div>
        </article>

        <button className='btn-logout' onClick={handleLogout}>Sair</button>
    </div>
  )
}

export default Admin;