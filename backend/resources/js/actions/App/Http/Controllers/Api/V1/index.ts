import AuthController from './AuthController'
import ItemController from './ItemController'
import StockTransactionController from './StockTransactionController'
import PurchaseOrderController from './PurchaseOrderController'
import RequisitionController from './RequisitionController'
const V1 = {
    AuthController: Object.assign(AuthController, AuthController),
ItemController: Object.assign(ItemController, ItemController),
StockTransactionController: Object.assign(StockTransactionController, StockTransactionController),
PurchaseOrderController: Object.assign(PurchaseOrderController, PurchaseOrderController),
RequisitionController: Object.assign(RequisitionController, RequisitionController),
}

export default V1