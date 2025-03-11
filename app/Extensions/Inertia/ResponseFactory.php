<?php

declare(strict_types=1);

namespace App\Extensions\Inertia;

use Inertia\Response;
use Inertia\ResponseFactory as BaseResponseFactory;

/**
 * @method Response renderAdmin(string $component, array $props = [])
 * @method Response renderBusiness(string $component, array $props = [])
 * @method Response renderTalent(string $component, array $props = [])
 */
class ResponseFactory extends BaseResponseFactory {}
