<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    |
    | This file is for storing the permissions used in the application. You can
    | define your permissions here and use them throughout your application to
    | control access to various features and resources.
    |
    */
    'permissions' => [
        // users
        'view_users',
        'create_users',
        'edit_users',
        'delete_users',

        // roles
        'view_roles',
        'create_roles',
        'edit_roles',
        'delete_roles',

        // articles
        'view_articles',
        'create_articles',
        'edit_articles',
        'delete_articles',
    ],

    'roles' => [
        'admin' => [
            'permissions' => '*',
        ],
    ],
];
