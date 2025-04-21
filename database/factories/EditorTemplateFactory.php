<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\EditorTemplate;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EditorTemplate>
 */
class EditorTemplateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EditorTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $types = ['mockup', 'design', 'packaging'];
        $type = $this->faker->randomElement($types);

        $configurations = [
            'mockup' => [
                'width' => 800,
                'height' => 600,
                'backgroundGrid' => true,
                'snapToGrid' => true,
                'gridSize' => 10
            ],
            'design' => [
                'width' => 1200,
                'height' => 800,
                'backgroundGrid' => false,
                'snapToGrid' => false,
                'artboard' => true
            ],
            'packaging' => [
                'width' => 1000,
                'height' => 1000,
                'backgroundGrid' => true,
                'snapToGrid' => true,
                'gridSize' => 20,
                'dieLine' => true
            ]
        ];

        return [
            // 'id' => Str::uuid()->toString(),
            'name' => $this->faker->words(3, true) . ' Template',
            'type' => $type,
            'layers' => '[]',
            'configuration' => json_encode($configurations[$type]),
            'width' => $configurations[$type]['width'],
            'height' => $configurations[$type]['height'],
            'thumbnail_url' => $this->faker->imageUrl($configurations[$type]['width'] / 4, $configurations[$type]['height'] / 4)
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function mockup()
    {
        return $this->state(function (array $attributes) {
            $config = [
                'width' => 800,
                'height' => 600,
                'backgroundGrid' => true,
                'snapToGrid' => true,
                'gridSize' => 10
            ];

            return [
                'type' => 'mockup',
                'configuration' => json_encode($config),
                'width' => $config['width'],
                'height' => $config['height'],
            ];
        });
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function design()
    {
        return $this->state(function (array $attributes) {
            $config = [
                'width' => 1200,
                'height' => 800,
                'backgroundGrid' => false,
                'snapToGrid' => false,
                'artboard' => true
            ];

            return [
                'type' => 'design',
                'configuration' => json_encode($config),
                'width' => $config['width'],
                'height' => $config['height'],
            ];
        });
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function packaging()
    {
        return $this->state(function (array $attributes) {
            $config = [
                'width' => 1000,
                'height' => 1000,
                'backgroundGrid' => true,
                'snapToGrid' => true,
                'gridSize' => 20,
                'dieLine' => true
            ];

            return [
                'type' => 'packaging',
                'configuration' => json_encode($config),
                'width' => $config['width'],
                'height' => $config['height'],
            ];
        });
    }
}
