import React from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import {
  homeOutline,
  shieldCheckmarkOutline,
  peopleOutline,
  cardOutline,
  personOutline,
} from 'ionicons/icons';

import Osago from './pages/Osago/Osago';
import Home from './pages/Home/Home';
import Agents from './pages/Agents/Agents';
import ReferralInfo from './pages/Referral/ReferralInfo';
import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/ProfileEdit/ProfileEdit';
import ProfileIdentification from './pages/ProfileIdentification/ProfileIdentification';
import ProfileIdentificationPassport from './pages/ProfileIdentificationPassport/ProfileIdentificationPassport';
import IdentificationProcess from './pages/IdentificationProcess/IdentificationProcess';
import InviteFriend from './pages/InviteFriend';
import Withdraw from './pages/Withdraw/Withdraw';
import WithdrawIdentification from './pages/WithdrawIdentification/WithdrawIdentification';
import WithdrawInfo from './pages/WithdrawInfo/WithdrawInfo';
import Onboarding from './pages/Onboarding/Onboarding';
import Auth from './pages/Auth/Auth';
import AuthVerify from './pages/Auth/AuthVerify';
import Finances from './pages/Finances';
import InstructionAccident from './pages/InstructionAccident/InstructionAccident';
import MyFaqPage from './pages/FaqPage/FaqPage';

import logo from './assets/logo.svg';
import { TextsProvider } from './context/TextsContext';
import { getIconUrl } from './icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
// {"refresh":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1OTQ2ODc0NiwiaWF0IjoxNzUxNjkyNzQ2LCJqdGkiOiJiYjAxMTNkNmIxYjg0YjNlODVkYTMzMzE3ZmMxNWMyOCIsInVzZXJfaWQiOjEwMX0.DNFtWT2S65ZEpIDGOBMS5ilIaCax94qt0-ovOuGcHhA","access":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxNjk2MzQ2LCJpYXQiOjE3NTE2OTI3NDYsImp0aSI6IjM1ODUwZTdjN2RiYzRjMTE5ODYwNmU1NjFkMGJlMTZmIiwidXNlcl9pZCI6MTAxfQ.w3Oj1CXXZSCSA2EjsE2IhWvWK8vw3DvBKY6Ti4YFXSA"}
/* Theme variables */
import './theme/variables.css';
import './app.css';

setupIonicReact();

const AppTabs: React.FC = () => {
  const location = useLocation();
  const hideTabBar =
    location.pathname === '/a/onboarding' || location.pathname === '/a/auth';

  // Глобальный редирект на Onboarding при первом заходе
  React.useEffect(() => {
    if (
      localStorage.getItem('onboardingSeen') !== 'true' &&
      location.pathname !== '/a/onboarding'
    ) {
      window.location.replace('/a/onboarding');
    }
  }, [location.pathname]);

  const [lang, setLang] = React.useState<'ky' | 'ru'>(() => {
    const stored = localStorage.getItem('lang');
    return stored === 'ru' || stored === 'ky' ? stored : 'ky';
  });

  // Resolve custom SVG icons from src/assets/cline-icons when present
  const homeIconUrl = getIconUrl(['home', 'Главная']);
  const osagoIconUrl = getIconUrl(['osago', 'ОСАГО', 'Оформить ОСАГО']);
  const agentsIconUrl = getIconUrl(['agents', 'Команда', 'team']);
  const financesIconUrl = getIconUrl(['finances', 'Финансы', 'card']);
  const profileIconUrl = getIconUrl(['profile', 'Профиль', 'user']);
  // Prefer compact Figma mark; try several common names, fallback to bundled logo.svg
  const headerLogoUrl = getIconUrl(['header-logo']);

  return (
    <>
      <IonHeader className='header'>
        <div className='header-left'>
          <img src={headerLogoUrl || logo} alt='' style={{ height: 22 }} />
          <span className='brand'>iShop.kg</span>
        </div>
        <span
          className='lang-toggle'
          style={{ background: 'transparent', padding: 8, cursor: 'pointer' }}
          onClick={() => {
            const newLang = lang === 'ky' ? 'ru' : 'ky';
            localStorage.setItem('lang', newLang);
            setLang(newLang);
            window.location.reload();
          }}
        >
          {lang === 'ky' ? 'Русский' : 'Кыргызча'}
        </span>
      </IonHeader>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path='/a/onboarding'>
            <Onboarding />
          </Route>
          <Route exact path='/a/auth'>
            <Auth />
          </Route>
          <Route exact path='/a/auth/:id'>
            <Auth />
          </Route>
          <Route exact path='/a/auth/verify'>
            <AuthVerify />
          </Route>
          <Route exact path='/a/home' component={Home} />
          <Route exact path='/a/osago' component={Osago} />
          <Route exact path='/a/agents' component={Agents} />
          <Route exact path='/a/finances' component={Finances} />
          <Route exact path='/a/profile' component={Profile} />
          <Route exact path='/a/profile/edit' component={ProfileEdit} />
          <Route exact path='/a/referral' component={ReferralInfo} />
          <Route exact path='/a/invite' component={InviteFriend} />
          <Route exact path='/a/withdraw' component={Withdraw} />
          <Route
            exact
            path='/a/withdraw/identification'
            component={WithdrawIdentification}
          />
          <Route exact path='/a/withdraw/info' component={WithdrawInfo} />
          <Route
            exact
            path='/a/profile/identification'
            component={ProfileIdentification}
          />
          <Route
            exact
            path='/a/profile/identification/passport'
            component={ProfileIdentificationPassport}
          />
          <Route
            exact
            path='/a/profile/identification/process'
            component={IdentificationProcess}
          />
          <Route exact path='/a/instruction' component={InstructionAccident} />
          <Route exact path='/a/my-faq' component={MyFaqPage} />
          <Route exact path='/a/'>
            <Redirect to='/a/home' />
          </Route>
          <Route exact path='/'>
            <Redirect to='/a/home' />
          </Route>
        </IonRouterOutlet>
        {!hideTabBar && (
          <IonTabBar slot='bottom'>
            <IonTabButton tab='home' href='/a/home'>
              <IonIcon
                aria-hidden='true'
                {...(homeIconUrl ? { src: homeIconUrl } : { icon: homeOutline })}
              />
              <IonLabel>Главная</IonLabel>
            </IonTabButton>
            <IonTabButton tab='osago' href='/a/osago'>
              <IonIcon
                aria-hidden='true'
                {...(osagoIconUrl ? { src: shieldCheckmarkOutline } : { icon: shieldCheckmarkOutline })}
              />
              <IonLabel>ОСАГО</IonLabel>
            </IonTabButton>
            <IonTabButton tab='agents' href='/a/agents'>
              <IonIcon
                aria-hidden='true'
                {...(agentsIconUrl ? { src: agentsIconUrl } : { icon: peopleOutline })}
              />
              <IonLabel>Команда</IonLabel>
            </IonTabButton>
            <IonTabButton tab='finances' href='/a/finances'>
              <IonIcon
                aria-hidden='true'
                {...(financesIconUrl ? { src: financesIconUrl } : { icon: cardOutline })}
              />
              <IonLabel>Финансы</IonLabel>
            </IonTabButton>
            <IonTabButton tab='profile' href='/a/profile'>
              <IonIcon
                aria-hidden='true'
                {...(profileIconUrl ? { src: profileIconUrl } : { icon: personOutline })}
              />
              <IonLabel>Профиль</IonLabel>
            </IonTabButton>
          </IonTabBar>
        )}
      </IonTabs>
    </>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <TextsProvider>
          <AppTabs />
        </TextsProvider>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
