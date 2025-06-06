<?php

namespace App\Traits;

trait Encryptable
{
    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if (in_array($key, $this->encryptable, true)) {
            return decrypt($value);
        }

        return $value;
    }

    public function setAttribute($key, $value)
    {
        if (in_array($key, $this->encryptable, true)) {
            $value = encrypt($value);
        }

        return parent::setAttribute($key, $value);
    }
}
