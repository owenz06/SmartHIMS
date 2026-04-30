import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\AuthController::token
 * @see app/Http/Controllers/Api/V1/AuthController.php:17
 * @route '/api/v1/auth/token'
 */
export const token = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: token.url(options),
    method: 'post',
})

token.definition = {
    methods: ["post"],
    url: '/api/v1/auth/token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthController::token
 * @see app/Http/Controllers/Api/V1/AuthController.php:17
 * @route '/api/v1/auth/token'
 */
token.url = (options?: RouteQueryOptions) => {
    return token.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthController::token
 * @see app/Http/Controllers/Api/V1/AuthController.php:17
 * @route '/api/v1/auth/token'
 */
token.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: token.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\AuthController::token
 * @see app/Http/Controllers/Api/V1/AuthController.php:17
 * @route '/api/v1/auth/token'
 */
    const tokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: token.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\AuthController::token
 * @see app/Http/Controllers/Api/V1/AuthController.php:17
 * @route '/api/v1/auth/token'
 */
        tokenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: token.url(options),
            method: 'post',
        })
    
    token.form = tokenForm
/**
* @see \App\Http\Controllers\Api\V1\AuthController::logout
 * @see app/Http/Controllers/Api/V1/AuthController.php:51
 * @route '/api/v1/auth/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/api/v1/auth/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthController::logout
 * @see app/Http/Controllers/Api/V1/AuthController.php:51
 * @route '/api/v1/auth/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthController::logout
 * @see app/Http/Controllers/Api/V1/AuthController.php:51
 * @route '/api/v1/auth/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\V1\AuthController::logout
 * @see app/Http/Controllers/Api/V1/AuthController.php:51
 * @route '/api/v1/auth/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\V1\AuthController::logout
 * @see app/Http/Controllers/Api/V1/AuthController.php:51
 * @route '/api/v1/auth/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
const AuthController = { token, logout }

export default AuthController