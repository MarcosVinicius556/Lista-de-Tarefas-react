import { useState, useEffect } from 'react';
import { auth, db } from '../../FirebaseConnection';
import { signOut } from 'firebase/auth';

import { 
  addDoc, 
  collection
 } from 'firebase/firestore';
import './admin.css';

function Admin() {

  const [tarefaInput, setTarefaInput] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    async function loadTarefas(){
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));
    }

    loadTarefas();
  }, []);

  async function handleRegister(e) {
    e.preventDefault()

    if(tarefaInput === '') {
      alert("Nenhuma tarefa informada!");
      return;
    }

    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput,
      created: new Date(),
      userUid: user?.uid //Se vier nulo não vai quebrar a aplicação
    })
    .then(() => {
      console.log("Tarefa criada com sucesso!");
      setTarefaInput('');
    })
      .catch(error => {
      console.log(error);
    })

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