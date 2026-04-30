import AuthController from './AuthController'
import Api from './Api'
import DashboardController from './DashboardController'
import PredictiveDashboardController from './PredictiveDashboardController'
import Admin from './Admin'
import StockOutController from './StockOutController'
import Settings from './Settings'
const Controllers = {
    AuthController: Object.assign(AuthController, AuthController),
Api: Object.assign(Api, Api),
DashboardController: Object.assign(DashboardController, DashboardController),
PredictiveDashboardController: Object.assign(PredictiveDashboardController, PredictiveDashboardController),
Admin: Object.assign(Admin, Admin),
StockOutController: Object.assign(StockOutController, StockOutController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers