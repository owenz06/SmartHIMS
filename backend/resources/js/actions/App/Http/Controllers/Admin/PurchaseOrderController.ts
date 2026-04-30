import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:23
 * @route '/admin/purchase-orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/purchase-orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:23
 * @route '/admin/purchase-orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:23
 * @route '/admin/purchase-orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:23
 * @route '/admin/purchase-orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:23
 * @route '/admin/purchase-orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:23
 * @route '/admin/purchase-orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:23
 * @route '/admin/purchase-orders'
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
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:40
 * @route '/admin/purchase-orders/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/purchase-orders/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:40
 * @route '/admin/purchase-orders/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:40
 * @route '/admin/purchase-orders/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:40
 * @route '/admin/purchase-orders/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:40
 * @route '/admin/purchase-orders/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:40
 * @route '/admin/purchase-orders/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:40
 * @route '/admin/purchase-orders/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
 * @route '/admin/purchase-orders'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/purchase-orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
 * @route '/admin/purchase-orders'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
 * @route '/admin/purchase-orders'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
 * @route '/admin/purchase-orders'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
 * @route '/admin/purchase-orders'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:104
 * @route '/admin/purchase-orders/{id}/edit'
 */
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/purchase-orders/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:104
 * @route '/admin/purchase-orders/{id}/edit'
 */
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:104
 * @route '/admin/purchase-orders/{id}/edit'
 */
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:104
 * @route '/admin/purchase-orders/{id}/edit'
 */
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:104
 * @route '/admin/purchase-orders/{id}/edit'
 */
    const editForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:104
 * @route '/admin/purchase-orders/{id}/edit'
 */
        editForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:104
 * @route '/admin/purchase-orders/{id}/edit'
 */
        editForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:117
 * @route '/admin/purchase-orders/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/purchase-orders/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:117
 * @route '/admin/purchase-orders/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:117
 * @route '/admin/purchase-orders/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:117
 * @route '/admin/purchase-orders/{id}'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:117
 * @route '/admin/purchase-orders/{id}'
 */
        updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:152
 * @route '/admin/purchase-orders/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/purchase-orders/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:152
 * @route '/admin/purchase-orders/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:152
 * @route '/admin/purchase-orders/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:152
 * @route '/admin/purchase-orders/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:152
 * @route '/admin/purchase-orders/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
 * @route '/admin/purchase-orders/{id}/status'
 */
export const updateStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/admin/purchase-orders/{id}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
 * @route '/admin/purchase-orders/{id}/status'
 */
updateStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
 * @route '/admin/purchase-orders/{id}/status'
 */
updateStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
 * @route '/admin/purchase-orders/{id}/status'
 */
    const updateStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::updateStatus
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
 * @route '/admin/purchase-orders/{id}/status'
 */
        updateStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, options),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generateFromSuggestions
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
 * @route '/admin/purchase-orders/generate/suggestions'
 */
export const generateFromSuggestions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateFromSuggestions.url(options),
    method: 'get',
})

generateFromSuggestions.definition = {
    methods: ["get","head"],
    url: '/admin/purchase-orders/generate/suggestions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generateFromSuggestions
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
 * @route '/admin/purchase-orders/generate/suggestions'
 */
generateFromSuggestions.url = (options?: RouteQueryOptions) => {
    return generateFromSuggestions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generateFromSuggestions
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
 * @route '/admin/purchase-orders/generate/suggestions'
 */
generateFromSuggestions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateFromSuggestions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generateFromSuggestions
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
 * @route '/admin/purchase-orders/generate/suggestions'
 */
generateFromSuggestions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateFromSuggestions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generateFromSuggestions
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
 * @route '/admin/purchase-orders/generate/suggestions'
 */
    const generateFromSuggestionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generateFromSuggestions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generateFromSuggestions
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
 * @route '/admin/purchase-orders/generate/suggestions'
 */
        generateFromSuggestionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generateFromSuggestions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generateFromSuggestions
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
 * @route '/admin/purchase-orders/generate/suggestions'
 */
        generateFromSuggestionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generateFromSuggestions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generateFromSuggestions.form = generateFromSuggestionsForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generatePDF
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:304
 * @route '/admin/purchase-orders/{id}/pdf'
 */
export const generatePDF = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatePDF.url(args, options),
    method: 'get',
})

generatePDF.definition = {
    methods: ["get","head"],
    url: '/admin/purchase-orders/{id}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generatePDF
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:304
 * @route '/admin/purchase-orders/{id}/pdf'
 */
generatePDF.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return generatePDF.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generatePDF
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:304
 * @route '/admin/purchase-orders/{id}/pdf'
 */
generatePDF.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatePDF.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generatePDF
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:304
 * @route '/admin/purchase-orders/{id}/pdf'
 */
generatePDF.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generatePDF.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generatePDF
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:304
 * @route '/admin/purchase-orders/{id}/pdf'
 */
    const generatePDFForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generatePDF.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generatePDF
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:304
 * @route '/admin/purchase-orders/{id}/pdf'
 */
        generatePDFForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatePDF.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::generatePDF
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:304
 * @route '/admin/purchase-orders/{id}/pdf'
 */
        generatePDFForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatePDF.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generatePDF.form = generatePDFForm
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:97
 * @route '/admin/purchase-orders/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/purchase-orders/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:97
 * @route '/admin/purchase-orders/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:97
 * @route '/admin/purchase-orders/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:97
 * @route '/admin/purchase-orders/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:97
 * @route '/admin/purchase-orders/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:97
 * @route '/admin/purchase-orders/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
 * @see app/Http/Controllers/Admin/PurchaseOrderController.php:97
 * @route '/admin/purchase-orders/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const PurchaseOrderController = { index, create, store, edit, update, destroy, updateStatus, generateFromSuggestions, generatePDF, show }

export default PurchaseOrderController