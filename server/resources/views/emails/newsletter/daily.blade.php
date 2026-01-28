<x-mail::message>
# Good Morning! ☀️

Here is your personalized news digest from **HomesTV**, tailored to your interests in **{{ implode(', ', $subscriber->category) }}** and **{{ implode(', ', $subscriber->country) }}**.

<x-mail::panel>
### Latest News Selected For You
</x-mail::panel>

@foreach($articles as $article)
## {{ $article->title }}
{{ Str::limit($article->summary, 120) }}

<x-mail::button :url="$clientUrl . '/article?id=' . $article->id">
Read Full Article
</x-mail::button>
<br>
---
@endforeach

<x-mail::panel>
Want to change what you see? [Click here to edit your preferences]({{ $clientUrl }}/subscribe/edit?id={{ $subscriber->sub_Id }})
</x-mail::panel>

Thanks for staying informed with us,<br>
**The {{ config('app.name') }} Team**
</x-mail::message>
