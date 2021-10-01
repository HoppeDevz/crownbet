import { BrowserRouter, Switch, Route } from 'react-router-dom';

/**
 * 
 * @Pages
 */
import Home from '../pages/Home';

function Router() {

    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router;