<?php


namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Validator;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * @OA\Post(
     *     path="/auth/login",
     *     summary="Loguearse para obtener token de acceso",
     *     tags={"Auth"},
     *     @OA\Parameter(
     *         name="email",
     *         in="query",
     *         description="Correo",
     *         required=true,
     *      ),
     *      @OA\Parameter(
     *         name="password",
     *         in="query",
     *         description="Contraseña",
     *         required=true,
     *      ),
     *      @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 example={
     *                     "email": "admin@spot2.mx",
     *                     "password": "admin"
     *                }
     *             )
     *         )
     *      ),
     *      @OA\SecurityScheme(
     *           securityScheme="bearerAuth",
     *           type="http",
     *           scheme="bearer",
     *           bearerFormat="JWT",
     *       ),
     *     @OA\Response(response=200, description="Operación exitosa"),
     *     @OA\Response(response=401, description="Credenciales incorrectas")
     * )
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * @OA\Post(
     *     path="/auth/me",
     *     summary="Obtener datos del usuario por el token",
     *     tags={"Auth"},
     *     @OA\Response(response=200, description="Operación exitosa"),
     *     @OA\Response(response=400, description="Token expirado")
     * )
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * @OA\Post(
     *     path="/auth/logout",
     *     summary="Cerrar sesion e inhabilitar token de acceso",
     *     tags={"Auth"},
     *     @OA\Response(response=200, description="Operación exitosa")
     * )
     */
    public function logout()
    {
        auth()->logout();

        return response()->json([
            'status' => 200,
            'message' => 'Successfully logged out']
        );
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'status' => 200,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
