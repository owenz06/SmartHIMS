import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ReportsController::index
 * @see app/Http/Controllers/Admin/ReportsController.php:15
 * @route '/admin/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportsController::index
 * @see app/Http/Controllers/Admin/ReportsController.php:15
 * @route '/admin/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportsController::index
 * @see app/Http/Controllers/Admin/ReportsController.php:15
 * @route '/admin/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReportsController::index
 * @see app/Http/Controllers/Admin/ReportsController.php:15
 * @route '/admin/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ReportsController::index
 * @see app/Http/Controllers/Admin/ReportsController.php:15
 * @route '/admin/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ReportsController::index
 * @see app/Http/Controllers/Admin/ReportsController.php:15
 * @route '/admin/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ReportsController::index
 * @see app/Http/Controllers/Admin/ReportsController.php:15
 * @route '/admin/reports'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\ReportsController::stockMovement
 * @see app/Http/Controllers/Admin/ReportsController.php:94
 * @route '/admin/reports/stock-movement'
 */
export const stockMovement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockMovement.url(options),
    method: 'get',
})

stockMovement.definition = {
    methods: ["get","head"],
    url: '/admin/reports/stock-movement',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportsController::stockMovement
 * @see app/Http/Controllers/Admin/ReportsController.php:94
 * @route '/admin/reports/stock-movement'
 */
stockMovement.url = (options?: RouteQueryOptions) => {
    return stockMovement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportsController::stockMovement
 * @see app/Http/Controllers/Admin/ReportsController.php:94
 * @route '/admin/reports/stock-movement'
 */
stockMovement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockMovement.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReportsController::stockMovement
 * @see app/Http/Controllers/Admin/ReportsController.php:94
 * @route '/admin/reports/stock-movement'
 */
stockMovement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockMovement.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ReportsController::stockMovement
 * @see app/Http/Controllers/Admin/ReportsController.php:94
 * @route '/admin/reports/stock-movement'
 */
    const stockMovementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockMovement.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ReportsController::stockMovement
 * @see app/Http/Controllers/Admin/ReportsController.php:94
 * @route '/admin/reports/stock-movement'
 */
        stockMovementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockMovement.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ReportsController::stockMovement
 * @see app/Http/Controllers/Admin/ReportsController.php:94
 * @route '/admin/reports/stock-movement'
 */
        stockMovementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockMovement.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockMovement.form = stockMovementForm
/**
* @see \App\Http\Controllers\Admin\ReportsController::auditLog
 * @see app/Http/Controllers/Admin/ReportsController.php:117
 * @route '/admin/reports/audit-log'
 */
export const auditLog = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLog.url(options),
    method: 'get',
})

auditLog.definition = {
    methods: ["get","head"],
    url: '/admin/reports/audit-log',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportsController::auditLog
 * @see app/Http/Controllers/Admin/ReportsController.php:117
 * @route '/admin/reports/audit-log'
 */
auditLog.url = (options?: RouteQueryOptions) => {
    return auditLog.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportsController::auditLog
 * @see app/Http/Controllers/Admin/ReportsController.php:117
 * @route '/admin/reports/audit-log'
 */
auditLog.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: auditLog.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReportsController::auditLog
 * @see app/Http/Controllers/Admin/ReportsController.php:117
 * @route '/admin/reports/audit-log'
 */
auditLog.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: auditLog.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ReportsController::auditLog
 * @see app/Http/Controllers/Admin/ReportsController.php:117
 * @route '/admin/reports/audit-log'
 */
    const auditLogForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: auditLog.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ReportsController::auditLog
 * @see app/Http/Controllers/Admin/ReportsController.php:117
 * @route '/admin/reports/audit-log'
 */
        auditLogForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: auditLog.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ReportsController::auditLog
 * @see app/Http/Controllers/Admin/ReportsController.php:117
 * @route '/admin/reports/audit-log'
 */
        auditLogForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: auditLog.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    auditLog.form = auditLogForm
const reports = {
    index: Object.assign(index, index),
stockMovement: Object.assign(stockMovement, stockMovement),
auditLog: Object.assign(auditLog, auditLog),
}

export default reports