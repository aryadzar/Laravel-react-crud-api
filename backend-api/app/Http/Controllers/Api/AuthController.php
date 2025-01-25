<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request){
        $credentials = $request->validated();

        if(!Auth::attempt($credentials)){
            return response([
                "message" => "Invalid credentials email or password incorect"
            ], 422);
        }
        /**
         * @var User $user
         */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('token', 'user'));

    }
    public function signup(SignupRequest $request){
        $data = $request->validated();

        /**
         * @var User $user
         */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('token', 'user'));
    }
    public function logout(Request $request){
        /**
         * @var User $user
         */

         $user = $request->user();
         $user->currentAccessToken()->delete();

         return response('', 204);
    }
}
