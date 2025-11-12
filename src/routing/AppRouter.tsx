import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginDef } from '../components/auth/LoginDef';
import { Login } from '../components/auth/Login';
import { TermsConditions } from '../components/auth/TermsConditions';
import { Not_Found } from '../components/common/Not_Found';
import { Panel } from '../components/main/Panel';
import { Folders } from '../components/pages/Folders';
import { NewFolder } from '../components/pages/NewFolder';
import { EditFolder } from '../components/pages/EditFolder';
import Calendar from '../components/pages/Calendar';
import { MyCards } from '../components/pages/MyCards';
import { Questions } from '../components/pages/Questions';
import { Welcome } from '../components/pages/Welcome';
import { FolderDetail } from '../components/pages/FolderDetail';
import { AddNewCard } from '../components/pages/AddNewCard';
import  NewPurchase  from '../components/pages/NewPurchase';
import { InstallPWA } from '../components/common/InstallPWA';

import { AdminLayout } from '../layout/admin/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { ExpenseReports } from '../components/admin/ExpenseReports';
import { Approvals } from '../components/admin/Approvals';
import { Settings } from '../components/admin/Settings';
import { EditCard } from '../components/pages/EditCard';
import { ReportCard } from '../components/pages/ReportCard';
import { AdminLogin } from '../components/admin/AdminLogin';
import { RegularLogin } from '../components/auth/RegularLogin';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginDef />} />

        <Route path="/login-default" element={<LoginDef />} />
        <Route path="/change-password" element={<Login />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/login" element={<RegularLogin />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/panel" element={<Panel />}>
          <Route index element={<Navigate to="welcome" replace />} />
          <Route path='welcome' element={<Welcome />} />
          <Route path='folders' element={<Folders />} />
          <Route path='new-folder' element={<NewFolder />} />
          <Route path="folders/:folderId/edit" element={<EditFolder />} />

          <Route path='calendar' element={<Calendar />} />

          <Route path='my-cards' element={<MyCards />} />
          <Route path='my-cards/new-card' element={<AddNewCard />} />
          <Route path='my-cards/edit/:cardId' element={<EditCard />} />
          <Route path='my-cards/report/:cardId' element={<ReportCard />} />

          <Route path='questions' element={<Questions />} />

          {/* Nested routes for folder detail and purchases */}
          <Route path='folders/:folderId' element={<FolderDetail />} />
          <Route path='folders/:folderId/new-purchase' element={<NewPurchase />} />

        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='expense-reports' element={<ExpenseReports />} />
          <Route path='approvals' element={<Approvals />} />
          <Route path='settings' element={<Settings />} />
        </Route>


        <Route path='*' element={<Not_Found />} />
      </Routes>
      <InstallPWA/>
    </BrowserRouter>
  );
}

export default AppRouter;