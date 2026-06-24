<?php

use Illuminate\Support\Facades\Route;

// Login page
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

// Main app (requires auth in future)
Route::get('/', function () {
    return view('app');
})->name('home');

// Logout route
Route::get('/logout', function () {
    // In future, will handle session logout
    return redirect('/login');
})->name('logout');
