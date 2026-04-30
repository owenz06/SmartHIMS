import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::index
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:18
 * @route '/api/v1/purchase-orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/purchase-orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::index
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:18
 * @route '/api/v1/purchase-orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::index
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:18
 * @route '/api/v1/purchase-orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::index
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:18
 * @route '/api/v1/purchase-orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::index
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:18
 * @route '/api/v1/purchase-orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::index
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:18
 * @route '/api/v1/purchase-orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::index
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:18
 * @route '/api/v1/purchase-orders'
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
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::show
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:37
 * @route '/api/v1/purchase-orders/{purchaseOrder}'
 */
export const show = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/purchase-orders/{purchaseOrder}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::show
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:37
 * @route '/api/v1/purchase-orders/{purchaseOrder}'
 */
show.url = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { purchaseOrder: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    purchaseOrder: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        purchaseOrder: typeof args.purchaseOrder === 'object'
                ? args.purchaseOrder.id
                : args.purchaseOrder,
                }

    return show.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::show
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:37
 * @route '/api/v1/purchase-orders/{purchaseOrder}'
 */
show.get = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::show
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:37
 * @route '/api/v1/purchase-orders/{purchaseOrder}'
 */
show.head = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::show
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:37
 * @route '/api/v1/purchase-orders/{purchaseOrder}'
 */
    const showForm = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::show
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:37
 * @route '/api/v1/purchase-orders/{purchaseOrder}'
 */
        showForm.get = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::show
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:37
 * @route '/api/v1/purchase-orders/{purchaseOrder}'
 */
        showForm.head = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:48
 * @route '/api/v1/purchase-orders/{purchaseOrder}/status'
 */
export const updateStatus = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/purchase-orders/{purchaseOrder}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:48
 * @route '/api/v1/purchase-orders/{purchaseOrder}/status'
 */
updateStatus.url = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { purchaseOrder: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    purchaseOrder: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        purchaseOrder: typeof args.purchaseOrder === 'object'
                ? args.purchaseOrder.id
                : args.purchaseOrder,
                }

    return updateStatus.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:48
 * @route '/api/v1/purchase-orders/{purchaseOrder}/status'
 */
updateStatus.patch = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:48
 * @route '/api/v1/purchase-orders/{purchaseOrder}/status'
 */
    const updateStatusForm = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Api/V1/PurchaseOrderController.php:48
 * @route '/api/v1/purchase-orders/{purchaseOrder}/status'
 */
        updateStatusForm.patch = (args: { purchaseOrder: number | { id: number } } | [purchaseOrder: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
const purchaseOrders = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
updateStatus: Object.assign(updateStatus, updateStatus),
}

export default purchaseOrders