<?php

namespace App\Traits;

trait EnumTrait
{
    public static function values(): array
    {
        return self::cases();
    }

    public static function asOptions()
    {
        return collect(self::labels())
            ->map(fn ($value, $key) => ['label' => $value, 'value' => $key])
            ->values()
            ->toArray();
    }

    public static function getOption($value)
    {
        return collect(self::asOptions())->firstWhere('value', $value);
    }
}
