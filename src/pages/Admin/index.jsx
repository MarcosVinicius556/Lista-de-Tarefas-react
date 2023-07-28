import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../../FirebaseConnection';

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import './admin.css';

function Admin() {

  const [tarefaInput, setTarefaInput] = useState('');
  const [user, setUser] = useState({});

  const [tarefas, setTarefas] = useState([]);
  const [edit, setEdit] = useState({});

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

    if(edit?.id) { //Se for um update, chama outra função
      handleUpdateTarefa();
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
  
  async function deleteTarefa(id) {
    const docRef = doc(db, 'tarefas', id); //Criando referência para o documento no banco
    await deleteDoc(docRef);
  }

  async function editTarefa(item) {
    setTarefaInput(item.tarefa)
    setEdit(item);
  }

  async function handleUpdateTarefa() {
    const docRef = doc(db, 'tarefas', edit.id); //Tarefa para atualizar
    await updateDoc(docRef, {
      tarefa: tarefaInput
    })
    .then(() => {
      console.log('Atualizado com sucesso!');
      setTarefaInput('');
      setEdit({});
    })
    .catch((error) => {
      console.log(error)
    });
  }

  return (
    <div className='admin-container'>
        <h1>Minhas tarefas</h1>

        <form onSubmit={handleRegister} className='form'>
            <textarea
              placeholder='Digite sobre sua tarefa' 
              value={tarefaInput}
              onChange={e => setTarefaInput(e.target.value)}/>

              {Object.keys(edit).length > 0 
                ? ( <button type='submit' style={{ background: '#6add39' }} className='btn-register'>Atualizar Tarefa</button> )
                : ( <button type='submit' className='btn-register'>Registrar Tarefa</button> )}
        </form>

        {
          tarefas.map((item) => (
            <article className='list' key={item.id}>
              <p>{item.tarefa}</p>
              <div>
                <button onClick={() => editTarefa(item)}>Editar</button>
                <button className='btn-delete' onClick={() => deleteTarefa(item.id)}>Concluir</button>
              </div>
            </article>
          ))
        }

        <button className='btn-logout' onClick={handleLogout}>Sair</button>
    </div>
  )
}

export default Admin;