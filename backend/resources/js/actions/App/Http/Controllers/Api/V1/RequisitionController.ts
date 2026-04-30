import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\RequisitionController::index
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:11
 * @route '/api/v1/requisitions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/requisitions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\RequisitionController::index
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:11
 * @route '/api/v1/requisitions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\RequisitionController::index
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:11
 * @route '/api/v1/requisitions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\RequisitionController::index
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:11
 * @route '/api/v1/requisitions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\RequisitionController::index
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:11
 * @route '/api/v1/requisitions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\RequisitionController::index
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:11
 * @route '/api/v1/requisitions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\RequisitionController::index
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:11
 * @route '/api/v1/requisitions'
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
* @see \App\Http\Controllers\Api\V1\RequisitionController::show
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:30
 * @route '/api/v1/requisitions/{requisition}'
 */
export const show = (args: { requisition: number | { id: number } } | [requisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/requisitions/{requisition}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\RequisitionController::show
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:30
 * @route '/api/v1/requisitions/{requisition}'
 */
show.url = (args: { requisition: number | { id: number } } | [requisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisition: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { requisition: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    requisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        requisition: typeof args.requisition === 'object'
                ? args.requisition.id
                : args.requisition,
                }

    return show.definition.url
            .replace('{requisition}', parsedArgs.requisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\RequisitionController::show
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:30
 * @route '/api/v1/requisitions/{requisition}'
 */
show.get = (args: { requisition: number | { id: number } } | [requisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\RequisitionController::show
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:30
 * @route '/api/v1/requisitions/{requisition}'
 */
show.head = (args: { requisition: number | { id: number } } | [requisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\RequisitionController::show
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:30
 * @route '/api/v1/requisitions/{requisition}'
 */
    const showForm = (args: { requisition: number | { id: number } } | [requisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\RequisitionController::show
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:30
 * @route '/api/v1/requisitions/{requisition}'
 */
        showForm.get = (args: { requisition: number | { id: number } } | [requisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\RequisitionController::show
 * @see app/Http/Controllers/Api/V1/RequisitionController.php:30
 * @route '/api/v1/requisitions/{requisition}'
 */
        showForm.head = (args: { requisition: number | { id: number } } | [requisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const RequisitionController = { index, show }

export default RequisitionController