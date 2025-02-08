<?php

declare(strict_types=1);

namespace Storybook\CacheWarmer;

use Symfony\Component\Config\ConfigCacheFactory;
use Symfony\Component\Config\ConfigCacheFactoryInterface;
use Symfony\Component\Config\ConfigCacheInterface;
use Symfony\Component\HttpKernel\CacheWarmer\CacheWarmerInterface;

class StorybookCacheWarmer implements CacheWarmerInterface
{
    private ConfigCacheFactory $configCacheFactory;

    public function __construct(
        private readonly ?string $cacheDir,
        private readonly bool $debug,
        private readonly string $projectDir,
        private readonly array $storybookConfig,
        private readonly array $twigConfig,
        private readonly array $twigComponentConfig,
    ) {
    }

    public function isOptional(): bool
    {
        return true;
    }

    public function warmUp(string $cacheDir, ?string $buildDir = null): array
    {
        $this->getConfigCacheFactory()->cache(
            $this->cacheDir.'/symfony_parameters.json',
            function (ConfigCacheInterface $cache) {
                $this->generateSymfonyParameters($cache);
            }
        );

        return [];
    }

    /**
     * Provides the ConfigCache factory implementation, falling back to a
     * default implementation if necessary.
     */
    private function getConfigCacheFactory(): ConfigCacheFactoryInterface
    {
        $this->configCacheFactory ??= new ConfigCacheFactory($this->debug);

        return $this->configCacheFactory;
    }

    private function generateSymfonyParameters(ConfigCacheInterface $cache): void
    {
        $parameters = [
            'kernel_project_dir' => $this->projectDir,
            'storybook_config' => $this->storybookConfig,
            'twig_config' => $this->twigConfig,
            'twig_component_config' => $this->twigComponentConfig,
        ];

        $cache->write(json_encode($parameters, JSON_PRETTY_PRINT));
    }
}
