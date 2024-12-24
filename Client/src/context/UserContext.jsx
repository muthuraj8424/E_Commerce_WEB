import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [id, setId] = useState(null);
  const [name, setUsername] = useState(null);
  const [user,setuser] = useState(false)
  const [message, setmessage] = useState(null)
  // const navigate = useNavigate()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "/api/auth/profile",
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("UserId",data.id)
        // if(data===undefined){
        //  window.location.href = "/"
        // }
        const username = data?.user?.split("@")[0];
        console.log(username);
        
        // console.log();
        setmessage(data.message)
        // console.log(data.id);

        if (data.id) {
          setUsername(username);
          setEmail(data.user);
          setId(data.id);
          setRole(data.role);
          setuser(true)
        }
        else{
          setUsername(username)
          setEmail(data.user);
          setRole(data.role)
          setuser(true)
        }
      } catch (error) {
        console.log("User not authenticated:", error);
      }
    };

    fetchUser();
  }, []);
  // console.log("from useconstem "+id);

  return (
    <UserContext.Provider value={{ name, email, id, role,message,setRole,setId ,setuser}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
