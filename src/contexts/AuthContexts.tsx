import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string  
}
  
type AuthContextType = {
    user: User | undefined; //Pode ser do tipo Usuário ou do tipo undefined (quando não está logado é undefined)
    signInWithGoogle: () => Promise<void>;
}

type AuthContentProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType); //Tipagem dos itens que vão ser passados no context

export function AuthContextProvider(props: AuthContentProviderProps){ //Tipagem do children que vem do App (routes e etc...)

    const [user, setUser] = useState<User>() //Tipagem do estado

    useEffect(() => {
      //O Firebase localiza o usuário, caso ele já tenha feito login anteriormente, com alguma informação que identifica a máquina/ip/etc
      //Declarando eventlisteners
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
          if(user){
            const { displayName, photoURL, uid} = user
      
            if(!displayName || !photoURL){
              throw new Error('Missing information from Google Account');
            }
      
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
          }
        }
      })
  
      //Roda apenas 1x
      //Descadastrando o eventlisteners
      return () => {
        unsubscribe();
      }
    }, [])
  
    async function signInWithGoogle(){
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider)
      
      if(result.user){
        const { displayName, photoURL, uid} = result.user
  
        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
  
    }
    
    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}