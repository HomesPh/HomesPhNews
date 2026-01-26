# HomesPhNews API Server

So, What Did I Build? The Brains of Our News App
Basically, I built the entire engine that works behind the scenes for our news website. It handles all the data, figures out what's popular, and serves it up to the frontend (the part users actually see).

## API Documentation

### Auto-Generated OpenAPI Documentation

This project uses [Scramble](https://scramble.dedoc.co/) to automatically generate OpenAPI 3.1.0 documentation from your code. No manual annotations needed!

- **View Documentation UI**: Visit `/docs/api` when your server is running
- **OpenAPI JSON**: Available at `/docs/api.json`
- **Auto-Generated**: Documentation updates automatically when you change your code

### Generating Client SDKs

You can automatically generate TypeScript (or other language) client SDKs from the OpenAPI specification:

#### Using npm script:
```bash
npm run generate-sdk
```

#### Using the shell script:
```bash
./scripts/generate-sdk.sh [output-directory]
```

The script will:
1. Fetch the OpenAPI JSON from your running server
2. Generate a TypeScript Axios client SDK
3. Output to `../client-sdk` (or your specified directory)

**Note**: Make sure your Laravel server is running (`php artisan serve`) before generating the SDK.

#### Exporting OpenAPI JSON for CI/CD:
```bash
php artisan scramble:export
```

This generates a static `api.json` file that can be used in CI/CD pipelines or version control.

## Migration Notes

This project was migrated from `l5-swagger` to `Scramble` for better auto-generation capabilities:
- Removed all manual OpenAPI annotations (`#[OA\...]` attributes)
- Documentation now auto-generates from validation rules and return types
- Better suited for automated SDK generation workflows

    Think of it in three main parts:

        1. The Basic Controls
        I started by building all the usual controls for our news articles. You can now:

    Create a new article.
    
    Read a list of all articles, or just a single one.
    
    Update an article if you need to fix a typo.
    
    Delete an article.

        This is the standard, essential stuff that lets us actually manage our news content.

    2. The Smart Features (The Fun Part)
    This is where it gets cool. I added a few special, custom links that the frontend can use to display dynamic content, making the site feel alive.

    A "Trending" Feed (/news/trending): Think of this as the "What's New?" section. It automatically grabs the 5 most recently published articles.        

    A "Most-Read" List (/news/most-read): This is the "What's Hot?" section. I added a little counter that ticks up every time someone reads an article. This link uses that count to show the top 10 most popular articles.

    A "Global News" Channel (/news/latest-global): This lets us create special sections on the website. I made sure our news articles can be properly organized into categories (like "Global," "Sports," etc.), and this link     grabs only the latest articles from the "Global News" category.

    3. How It's All Built to Last
    To make sure this system is solid and easy for anyone to use, I didn't just mess around in the database by hand.

Database Blueprints (Migrations): I created a set of "blueprints" for our database. This means any developer can run a single command and instantly have the exact same database structure. No more guessing what the tables should look like!

Automatic Fake Data (Seeders): This is a huge time-saver. I built a "magic button" (php artisan db:seed) that automatically fills the database with realistic-looking fake news, categories, authors, etc. This is a lifesaver for development because it means you're never working with an empty, boring website.
