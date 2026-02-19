<?php

namespace Tests\Feature;

use App\Models\AdUnit;
use App\Models\Campaign;
use Tests\TestCase;

class AdModelStructureTest extends TestCase
{
    public function test_ad_unit_structure()
    {
        $adUnit = new AdUnit();
        $this->assertTrue(in_array('page_url', $adUnit->getFillable()));
        $this->assertTrue(in_array('impressions', $adUnit->getFillable()));
        $this->assertTrue(in_array('clicks', $adUnit->getFillable()));
        $this->assertTrue(in_array('size', $adUnit->getFillable()));

        $this->assertEquals('integer', $adUnit->getCasts()['impressions']);
        $this->assertEquals('adaptive', AdUnit::SIZE_ADAPTIVE);
    }

    public function test_campaign_structure()
    {
        $campaign = new Campaign();
        $this->assertTrue(in_array('name', $campaign->getFillable()));
        $this->assertTrue(in_array('type', $campaign->getFillable()));
        $this->assertTrue(in_array('status', $campaign->getFillable()));
        $this->assertTrue(in_array('budget', $campaign->getFillable()));
        $this->assertTrue(in_array('image_url', $campaign->getFillable()));

        $this->assertEquals('date', $campaign->getCasts()['start_date']);
        $this->assertEquals('poster', Campaign::TYPE_POSTER);
        $this->assertEquals('banner', Campaign::TYPE_BANNER);
        $this->assertEquals('leader_board', Campaign::TYPE_LEADER_BOARD);
    }
}
