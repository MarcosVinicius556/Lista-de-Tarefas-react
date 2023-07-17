/**
 * @apiNote Componente responsável por fazer o 
 *          controle de acesso para as rotas
 * 
 * @param Componente children, recebe um componente,
 *                   verifica o login, e então retorna ele
 */

import { useState, useEffect } from "react"
import { auth } from "../FirebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
function Private( { children } ) { 

    const[ loading, setLoading ] = useState(true);
    const[ signed, setSigned ] = useState(false);

    useEffect(() => {
        async function checkLogin() {
            const unsub = onAuthStateChanged(auth, (user) => {
                if(user) { //Se tiver usuário, é por que está logado
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                    }

                    localStorage.setItem('@detailUser', JSON.stringify(userData));

                    setLoading(false);
                    setSigned(true);
                } else {
                    setLoading(false);
                    setSigned(false);
                }
            });
        }

        checkLogin();
    }, []);

    if(loading){
        return <div></div>
    }

    if(!signed){
        return <Navigate to='/' />
    }

    return children
}

export default Private