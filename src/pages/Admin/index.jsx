import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../../FirebaseConnection';

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import './admin.css';

function Admin() {

  const [tarefaInput, setTarefaInput] = useState('');
  const [user, setUser] = useState({});

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas(){
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));

      if(userDetail) { //Se encontrar dados do usuário logado
        //Verifica tarefas cadastradas
        const data = JSON.parse(userDetail);

        const tarefaRef = collection(db, 'tarefas'); //Referencia no banco
        const q = query( //Montando busca
          tarefaRef, //Passando referencia
          //Parâmetros que serão utilizados
          orderBy("created", "desc"), //Como deverá retornar a busca
          where("userUid", "==", data?.uid) //Condição da busca
        );
        const unsub = onSnapshot(q, //Passando a query como referência para observar no banco
          (snapshot) => { //Pegando retorno do firebase
              let lista = [];
              snapshot.forEach((doc) => { //Percorrendo todos os documentos retornados do banco
                  lista.push(
                    {
                      id: doc.id,
                      tarefa: doc.data().tarefa,
                      userUid: doc.data().userUid
                    }
                  );
              });
              setTarefas(lista);
          });

      }
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
    .then(() => { //Sucesso
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