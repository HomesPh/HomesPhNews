import axios from 'axios';

export interface NagerHoliday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string[] | null;
    launchYear: number | null;
    types: string[];
}

/**
 * Fetch public holidays for a specific country and year using Nager.Date API
 * @param countryCode ISO 3166-1 alpha-2 country code (e.g., "PH")
 * @param year Year to fetch holidays for
 */
export async function getPublicHolidays(countryCode: string, year: number): Promise<NagerHoliday[]> {
    if (!countryCode || countryCode === 'Global' || countryCode === 'All Countries') {
        return [];
    }

    if (!year || isNaN(year)) {
        return [];
    }

    try {
        console.log(`Fetching holidays for ${countryCode} in ${year}...`);
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
        
        if (!response.ok) {
            console.warn(`Nager API returned ${response.status} for ${countryCode}`);
            return [];
        }

        const text = await response.text();
        if (!text) {
            return [];
        }

        const data = JSON.parse(text);
        console.log(`Found ${data.length} holidays for ${countryCode}`);
        return data;
    } catch (error) {
        console.error(`Failed to fetch holidays for ${countryCode} in ${year}:`, error);
        return [];
    }
}
