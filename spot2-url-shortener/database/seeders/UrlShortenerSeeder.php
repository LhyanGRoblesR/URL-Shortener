<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UrlShortenerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('url_shorteners')->insert([
            'key_url' => 'tHq',
            'to_url' => 'test',
        ]);

        DB::table('url_shorteners')->insert([
            'key_url' => 'cHuH8ihbDTUlt0b',
            'to_url' => '/test?id_users=1',
        ]);

        DB::table('url_shorteners')->insert([
            'key_url' => 'cHuH8ihxdqbDTUlt0b',
            'to_url' => '/testing?id_users=3',
        ]);

        DB::table('url_shorteners')->insert([
            'key_url' => 'nMkWDf0',
            'to_url' => 'loquesea',
        ]);
    }
}
