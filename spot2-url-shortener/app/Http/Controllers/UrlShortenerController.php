<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\UrlShortener;
use Illuminate\Support\Facades\Route;

class UrlShortenerController extends Controller
{

    /**
     * @OA\Post(
     *     path="/url/shortener",
     *     summary="Acorta la url",
     *     tags={"URL"},
     *     @OA\Parameter(
     *         name="toUrl",
     *         in="query",
     *         description="URL a acortar",
     *         required=true,
     *      ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(
     *                      type="object",
     *                      @OA\Property(
     *                          property="toUrl",
     *                          type="string"
     *                      )
     *                 ),
     *                 example={
     *                     "toUrl":"test",
     *                }
     *             )
     *         )
     *      ),
     *     @OA\Response(response=200, description="Operación exitosa")
     * )
     */
    public function generate(){

        $request = request(['toUrl']);

        $toUrl = $request['toUrl'];

        $countToUrl = strlen($toUrl);

        $randomKey = Str::random($countToUrl-1);

        while(UrlShortener::where('key_url', $randomKey)->exists()){
            $randomKey = Str::random($countToUrl-1);
        }

        UrlShortener::create([
            'to_url' => $toUrl,
            'key_url' => $randomKey
        ]);

        $return = json_encode([
            'status' => 200,
            'to_url' => $toUrl,
            'key_url' => $randomKey
        ]);

        return $return;
    }

    /**
     * @OA\Get(
     *     path="/{key_url}",
     *     summary="Acorta la url",
     *     tags={"URL"},
     *     @OA\Response(response=200, description="Operación exitosa"),
     *     @OA\Response(response=404, description="URL no encontrada")
     * )
     */
    public function view($key_url)
    {
        $url = UrlShortener::where('key_url', $key_url)->first();

        if(isset($url)){

            return json_encode([
                'urlshortener' => 1,
                'status' => 200,
                'to_url' => $url->to_url
            ]);

        }else{
            return json_encode([
                'urlshortener' => 1,
                'status' => 404,
                'msg' => 'URL no encontrada'
            ]);
        }
    }

    /**
     * @OA\Get(
     *     path="/url/",
     *     summary="Ver todas mis URL's",
     *     tags={"URL"},
     *     @OA\Response(response=200, description="Operación exitosa"),
     *     @OA\Response(response=204, description="No se encontraron url acortadas")
     * )
     */
    public function index()
    {
        $urls = UrlShortener::all();

        if(isset($urls)){

            return json_encode([
                'status' => 200,
                'urls' => $urls
            ]);

        }else{
            return json_encode([
                'status' => 204,
                'msg' => 'No se encontraron url acortadas para mostrar'
            ]);
        }
    }

}
