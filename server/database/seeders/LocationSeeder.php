<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\Province;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure Philippines exists
        Country::updateOrCreate(
            ['id' => 'PH'],
            [
                'name' => 'Philippines',
                'is_active' => true,
                'gl' => 'ph',
                'h1' => 'ph',
                'ceid' => '102715694'
            ]
        );

        // 2. Ensure other popular countries exist
        $otherCountries = [
            ['id' => 'AE', 'name' => 'United Arab Emirates'],
            ['id' => 'SA', 'name' => 'Saudi Arabia'],
            ['id' => 'SG', 'name' => 'Singapore'],
            ['id' => 'HK', 'name' => 'Hong Kong'],
            ['id' => 'US', 'name' => 'United States'],
            ['id' => 'CA', 'name' => 'Canada'],
            ['id' => 'GB', 'name' => 'United Kingdom'],
            ['id' => 'AU', 'name' => 'Australia'],
            ['id' => 'JP', 'name' => 'Japan'],
            ['id' => 'QA', 'name' => 'Qatar'],
            ['id' => 'KW', 'name' => 'Kuwait'],
        ];

        foreach ($otherCountries as $c) {
            Country::updateOrCreate(['id' => $c['id']], ['name' => $c['name'], 'is_active' => true]);
        }

        $this->command->info('Seeding provinces...');

        // 3. Seed provinces (PH only)
        try {
            $provincesUrl = 'https://raw.githubusercontent.com/darklight721/philippines/master/provinces.json';
            $provincesData = json_decode(file_get_contents($provincesUrl), true);

            $provinceMap = []; // key => id
            $provinceNameMap = []; // name => id

            foreach ($provincesData as $p) {
                $province = Province::updateOrCreate(
                    ['name' => $p['name'], 'country_id' => 'PH'],
                    ['is_active' => true]
                );
                $provinceMap[$p['key']] = $province->id;
                $provinceNameMap[strtolower($p['name'])] = $province->id;
            }

            $this->command->info('Provinces seeded: ' . count($provinceMap));

            // 4. Seed Curated Cities
            $this->command->info('Seeding curated popular cities...');

            // Mapping of city name => province key
            $popularPHCities = [
                'Manila' => 'MM', 'Quezon City' => 'MM', 'Caloocan' => 'MM', 'Las Piñas' => 'MM', 'Makati' => 'MM', 
                'Malabon' => 'MM', 'Mandaluyong' => 'MM', 'Marikina' => 'MM', 'Muntinlupa' => 'MM', 'Navotas' => 'MM', 
                'Parañaque' => 'MM', 'Pasay' => 'MM', 'Pasig' => 'MM', 'San Juan' => 'MM', 'Taguig' => 'MM', 'Valenzuela' => 'MM',
                'Cebu City' => 'CEB', 'Mandaue City' => 'CEB', 'Lapu-Lapu City' => 'CEB', 'Davao City' => 'DAS', 
                'Zamboanga City' => 'ZAS', 'General Santos' => 'SCO', 'Bacolod City' => 'NEC', 'Iloilo City' => 'ILI', 
                'Cagayan de Oro' => 'MSR', 'Baguio' => 'BEN', 'Angeles City' => 'PAM', 'San Fernando' => 'PAM', 
                'Olongapo' => 'ZMB', 'Batangas City' => 'BTG', 'Lipa City' => 'BTG', 'Naga' => 'CAS', 'Legazpi' => 'ALB', 
                'Tacloban' => 'LEY', 'Dumaguete' => 'NER', 'Tagbilaran' => 'BOH', 'Puerto Princesa' => 'PLW', 
                'Butuan' => 'AGN', 'Cotabato City' => 'NCO', 'Cabanatuan' => 'NUE', 'Tarlac City' => 'TAR', 
                'Dagupan' => 'PAN', 'Laoag' => 'ILN', 'Vigan' => 'ILS', 'Santiago' => 'ISA', 'Tuguegarao' => 'CAG', 
                'Malaybalay' => 'BUK', 'Koronadal' => 'SCO', 'Kidapawan' => 'NCO', 'Digos' => 'DAS', 'Tagum' => 'DAV', 
                'Surigao City' => 'SUN', 'Antipolo' => 'RIZ', 'Dasmarinas' => 'CAV', 'Bacoor' => 'CAV', 'Imus' => 'CAV', 
                'Calamba' => 'LAG', 'Binan' => 'LAG', 'Santa Rosa' => 'LAG', 'San Pedro' => 'LAG', 'Lucena' => 'QUE',
                'Tagaytay' => 'CAV', 'Roxas City' => 'CAP', 'Ormoc' => 'LEY'
            ];

            foreach ($popularPHCities as $name => $pKey) {
                $pId = $provinceMap[$pKey] ?? null;
                City::updateOrCreate(
                    ['name' => $name, 'country_id' => 'PH'],
                    ['province_id' => $pId, 'is_active' => true]
                );
            }

            $internationalCities = [
                ['name' => 'Dubai', 'country_id' => 'AE'],
                ['name' => 'Abu Dhabi', 'country_id' => 'AE'],
                ['name' => 'Singapore', 'country_id' => 'SG'],
                ['name' => 'Hong Kong', 'country_id' => 'HK'],
                ['name' => 'New York', 'country_id' => 'US'],
                ['name' => 'Los Angeles', 'country_id' => 'US'],
                ['name' => 'San Francisco', 'country_id' => 'US'],
                ['name' => 'London', 'country_id' => 'GB'],
                ['name' => 'Sydney', 'country_id' => 'AU'],
                ['name' => 'Toronto', 'country_id' => 'CA'],
            ];

            foreach ($internationalCities as $ic) {
                City::updateOrCreate(
                    ['name' => $ic['name'], 'country_id' => $ic['country_id']],
                    ['is_active' => true]
                );
            }

            $this->command->info('Curated cities seeded.');

            // 5. Populate province_id for existing cities
            $this->command->info('Populating province_id for existing cities...');
            
            // Re-fetch all cities data for mapping existing records
            $citiesUrl = 'https://raw.githubusercontent.com/darklight721/philippines/master/cities.json';
            $citiesData = json_decode(file_get_contents($citiesUrl), true);
            $cityNameToProvinceKey = [];
            foreach ($citiesData as $c) {
                $cityNameToProvinceKey[strtolower($c['name'])] = $c['province'];
            }

            $existingCities = City::whereNull('province_id')->where('country_id', 'PH')->get();
            $updatedCount = 0;

            foreach ($existingCities as $city) {
                $pKey = $cityNameToProvinceKey[strtolower($city->name)] ?? null;
                $pId = $pKey ? ($provinceMap[$pKey] ?? null) : null;
                
                if ($pId) {
                    $city->province_id = $pId;
                    $city->save();
                    $updatedCount++;
                }
            }

            $this->command->info("Legacy data updated: $updatedCount cities matched with provinces.");

        } catch (\Exception $e) {
            $this->command->error('Failed to seed locations: ' . $e->getMessage());
            Log::error('LocationSeeder failed: ' . $e->getMessage());
        }
    }
}
