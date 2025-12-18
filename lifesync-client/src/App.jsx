import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import api from "./servcies/axios";
import { API_PATHS } from "./servcies/apiPaths";

const App = ({children}) =>{
  const { setUser, setLoading } = useAuthStore();

  useEffect(()=>{
    const loadUser = async()=>{
        try{
            const {data} = await api.get(API_PATHS.ME);
            setUser(data)
        }catch{
            setUser(null)
        }finally{
            setLoading(false);
        }   
    }
    loadUser();
  },[])

  return children

}

export default  App;