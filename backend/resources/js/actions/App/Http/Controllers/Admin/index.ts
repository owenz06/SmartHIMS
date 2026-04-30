import UserManagementController from './UserManagementController'
import DepartmentController from './DepartmentController'
import PurchaseOrderController from './PurchaseOrderController'
import SupplierController from './SupplierController'
import StockInController from './StockInController'
import InventoryController from './InventoryController'
import CategoryController from './CategoryController'
import RequisitionController from './RequisitionController'
import ReportsController from './ReportsController'
const Admin = {
    UserManagementController: Object.assign(UserManagementController, UserManagementController),
DepartmentController: Object.assign(DepartmentController, DepartmentController),
PurchaseOrderController: Object.assign(PurchaseOrderController, PurchaseOrderController),
SupplierController: Object.assign(SupplierController, SupplierController),
StockInController: Object.assign(StockInController, StockInController),
InventoryController: Object.assign(InventoryController, InventoryController),
CategoryController: Object.assign(CategoryController, CategoryController),
RequisitionController: Object.assign(RequisitionController, RequisitionController),
ReportsController: Object.assign(ReportsController, ReportsController),
}

export default Admin