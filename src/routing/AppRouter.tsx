import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginDef } from '../components/auth/LoginDef';
import { Login } from '../components/auth/Login';
import { TermsConditions } from '../components/auth/TermsConditions';
import { Not_Found } from '../components/common/Not_Found';
import { Panel } from '../components/main/Panel';
import { Folders } from '../components/pages/Folders';
import { NewFolder } from '../components/pages/NewFolder';
import Calendar from '../components/pages/Calendar';
import { PaymentsMethods } from '../components/pages/PaymentsMethods';
import { Questions } from '../components/pages/Questions';
import { Welcome } from '../components/pages/Welcome';
import { FolderDetail } from '../components/pages/FolderDetail';
import  NewPurchase  from '../components/pages/NewPurchase';


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login-default" element={<LoginDef />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        <Route path="/panel" element={<Panel />}>
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path='welcome' element={<Welcome />} />
          <Route path='folders' element={<Folders />} />
          <Route path='new-folder' element={<NewFolder />} />
          <Route path='calendar' element={<Calendar />} />
          <Route path='payments-methods' element={<PaymentsMethods />} />
          <Route path='questions' element={<Questions />} />

          {/* Nested routes for folder detail and purchases */}
          <Route path='folders/:folderId' element={<FolderDetail />} />
          <Route path='folders/:folderId/new-purchase' element={<NewPurchase />} />
        </Route>


        <Route path='*' element={<Not_Found />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;