import { useContext } from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import { Login } from './pages/Login';
import { Loading } from './components/Loading';
import { Home } from './pages/Home';
import { Movie } from './pages/Movie';
import { Account } from './pages/Account';

function AuthRoute({...props}: RouteProps){
  const { loading, authenticated } = useContext(AuthContext);

  if(loading) return <Loading />
  else if (props.path === '/' && authenticated){
    return <Redirect to='/home' />
  }    
  else if(!authenticated && props.path !== '/'){
    return <Redirect to='/' />
  }
  
  return <Route {...props} />
}

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <AuthRoute path='/' exact component={Login}/>
        <AuthRoute path='/home' exact component={Home}/>
        <AuthRoute path='/movie/:id' exact component={Movie}/>
        <AuthRoute path='/account' exact component={Account}/>
      </Switch>
    </BrowserRouter>
  )
}