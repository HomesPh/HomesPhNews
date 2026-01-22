<?php

namespace Database\Seeders;

use App\Models\Site;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sites = [
            [
                'site_name' => 'FilipinoHomes',
                'site_url' => 'filipinohomes.com',
                'site_logo' => '/images/HomesTV.png',
                'site_description' => 'Premier Philippine real estate platform focusing on properties for Filipino families.',
                'site_keywords' => ['Real Estate', 'Business', 'Property'],
                'site_status' => 'active',
                'contact_name' => 'John Reyes',
                'contact_email' => 'contact@filipinohomes.com',
            ],
            [
                'site_name' => 'Rent.ph',
                'site_url' => 'rent.ph',
                'site_logo' => '/images/HomesTV.png',
                'site_description' => 'Leading property rental and investment platform in the Philippines.',
                'site_keywords' => ['Real Estate', 'Rentals', 'Economy'],
                'site_status' => 'active',
                'contact_name' => 'Maria Santos',
                'contact_email' => 'info@rent.ph',
            ],
            [
                'site_name' => 'Homes',
                'site_url' => 'homes.ph',
                'site_logo' => '/images/HomesTV.png',
                'site_description' => 'Your trusted source for home buying guides and property listings in the Philippines.',
                'site_keywords' => ['Real Estate', 'Home Buying', 'Lifestyle'],
                'site_status' => 'active',
                'contact_name' => 'Anna Cruz',
                'contact_email' => 'hello@homes.ph',
            ],
            [
                'site_name' => 'Bayanihan',
                'site_url' => 'bayanihan.com',
                'site_logo' => '/images/HomesTV.png',
                'site_description' => 'Connects Filipino communities worldwide by showcasing local events, restaurants, festivals, and cultural stories.',
                'site_keywords' => ['Community', 'Culture', 'Events'],
                'site_status' => 'active',
                'contact_name' => 'Miguel Dela Cruz',
                'contact_email' => 'community@bayanihan.com',
            ],
            [
                'site_name' => 'Main News Portal',
                'site_url' => 'mainnewsportal.com',
                'site_logo' => '/images/HomesTV.png',
                'site_description' => 'The main news aggregation portal for all HomesPh network articles.',
                'site_keywords' => ['News', 'General', 'All Categories'],
                'site_status' => 'active',
                'contact_name' => 'Admin',
                'contact_email' => 'admin@mainnewsportal.com',
            ],
        ];

        foreach ($sites as $siteData) {
            Site::updateOrCreate(
                ['site_name' => $siteData['site_name']],
                $siteData
            );
        }

        $this->command->info('✅ Sites seeded: ' . count($sites) . ' partner sites created.');
    }
}
