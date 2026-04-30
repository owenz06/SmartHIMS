import auth from './auth'
import items from './items'
import stockTransactions from './stock-transactions'
import purchaseOrders from './purchase-orders'
import requisitions from './requisitions'
const v1 = {
    auth: Object.assign(auth, auth),
items: Object.assign(items, items),
stockTransactions: Object.assign(stockTransactions, stockTransactions),
purchaseOrders: Object.assign(purchaseOrders, purchaseOrders),
requisitions: Object.assign(requisitions, requisitions),
}

export default v1