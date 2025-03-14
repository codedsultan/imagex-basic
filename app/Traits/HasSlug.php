<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::creating(function (Model $model) {
            $slugField = $model->slugField ?? 'title';

            $title = ($model->addTimestampsToSlug ?? false) ? $model->{$slugField}.'-'.now()->timestamp : $model->{$slugField};

            $model->slug = $model->generateSlug($title);
        });
    }

    protected function generateSlug(string|array $title): string
    {
        return Str::slug($title).'-'.Str::of(Str::random(3))->lower()->__toString();
    }
}
