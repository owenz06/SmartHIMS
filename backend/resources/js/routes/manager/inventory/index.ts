import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\InventoryController::index
 * @see app/Http/Controllers/Admin/InventoryController.php:15
 * @route '/manager/inventory'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/manager/inventory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::index
 * @see app/Http/Controllers/Admin/InventoryController.php:15
 * @route '/manager/inventory'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::index
 * @see app/Http/Controllers/Admin/InventoryController.php:15
 * @route '/manager/inventory'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\InventoryController::index
 * @see app/Http/Controllers/Admin/InventoryController.php:15
 * @route '/manager/inventory'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\InventoryController::index
 * @see app/Http/Controllers/Admin/InventoryController.php:15
 * @route '/manager/inventory'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\InventoryController::index
 * @see app/Http/Controllers/Admin/InventoryController.php:15
 * @route '/manager/inventory'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\InventoryController::index
 * @see app/Http/Controllers/Admin/InventoryController.php:15
 * @route '/manager/inventory'
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
const inventory = {
    index: Object.assign(index, index),
}

export default inventory