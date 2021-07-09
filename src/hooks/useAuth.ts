import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContexts'

export function useAuth(){
		//Hook de autenticação: Uni duas funções (useContext consumindo authcontext)  em uma constante e retorna a constante
		//Diminuindo a quantidade de importações nas páginas
    const value = useContext(AuthContext)
		return value;
}