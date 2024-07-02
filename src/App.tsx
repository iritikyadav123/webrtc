import { BrowserRouter, Routes ,Route} from "react-router-dom"
import Reciver from "./pages/Receiver"
import Sender from "./pages/Sender"

 
export default function App() {
  return (
   <div>
    <BrowserRouter>
    <Routes>
        <Route path="/receiver" element={<Reciver />}/>
        <Route path="/sender" element={<Sender />}/>
    </Routes>
    </BrowserRouter>

   </div>
  )
}


