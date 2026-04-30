import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
 * @see routes/web.php:38
 * @route '/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:38
 * @route '/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:38
 * @route '/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:38
 * @route '/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:38
 * @route '/notifications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:38
 * @route '/notifications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:38
 * @route '/notifications'
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
 * @see routes/web.php:193
 * @route '/notifications/{id}/read'
 */
export const read = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

read.definition = {
    methods: ["post"],
    url: '/notifications/{id}/read',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:193
 * @route '/notifications/{id}/read'
 */
read.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return read.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:193
 * @route '/notifications/{id}/read'
 */
read.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: read.url(args, options),
    method: 'post',
})

    /**
 * @see routes/web.php:193
 * @route '/notifications/{id}/read'
 */
    const readForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: read.url(args, options),
        method: 'post',
    })

            /**
 * @see routes/web.php:193
 * @route '/notifications/{id}/read'
 */
        readForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: read.url(args, options),
            method: 'post',
        })
    
    read.form = readForm
/**
 * @see routes/web.php:199
 * @route '/notifications/mark-all'
 */
export const markAll = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: markAll.url(options),
    method: 'get',
})

markAll.definition = {
    methods: ["get","head"],
    url: '/notifications/mark-all',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:199
 * @route '/notifications/mark-all'
 */
markAll.url = (options?: RouteQueryOptions) => {
    return markAll.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:199
 * @route '/notifications/mark-all'
 */
markAll.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: markAll.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:199
 * @route '/notifications/mark-all'
 */
markAll.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: markAll.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:199
 * @route '/notifications/mark-all'
 */
    const markAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: markAll.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:199
 * @route '/notifications/mark-all'
 */
        markAllForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: markAll.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:199
 * @route '/notifications/mark-all'
 */
        markAllForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: markAll.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    markAll.form = markAllForm
/**
 * @see routes/web.php:206
 * @route '/notifications/count'
 */
export const count = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: count.url(options),
    method: 'get',
})

count.definition = {
    methods: ["get","head"],
    url: '/notifications/count',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:206
 * @route '/notifications/count'
 */
count.url = (options?: RouteQueryOptions) => {
    return count.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:206
 * @route '/notifications/count'
 */
count.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: count.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:206
 * @route '/notifications/count'
 */
count.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: count.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:206
 * @route '/notifications/count'
 */
    const countForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: count.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:206
 * @route '/notifications/count'
 */
        countForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: count.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:206
 * @route '/notifications/count'
 */
        countForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: count.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    count.form = countForm
const notifications = {
    index: Object.assign(index, index),
read: Object.assign(read, read),
markAll: Object.assign(markAll, markAll),
count: Object.assign(count, count),
}

export default notifications