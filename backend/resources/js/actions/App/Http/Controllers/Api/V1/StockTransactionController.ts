import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\StockTransactionController::store
 * @see app/Http/Controllers/Api/V1/StockTransactionController.php:20
 * @route '/api/v1/stock-transactions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/stock-transactions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\StockTransactionController::store
 * @see app/Http/Controllers/Api/V1/StockTransactionController.php:20
 * @route '/api/v1/stock-transactions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\StockTransactionController::store
 * @see app/Http/Controllers/Api/V1/StockTransactionController.php:20
 * @route '/api/v1/stock-transactions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\StockTransactionController::store
 * @see app/Http/Controllers/Api/V1/StockTransactionController.php:20
 * @route '/api/v1/stock-transactions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\StockTransactionController::store
 * @see app/Http/Controllers/Api/V1/StockTransactionController.php:20
 * @route '/api/v1/stock-transactions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const StockTransactionController = { store }

export default StockTransactionController