import { exec } from 'child_process';
import dedent from 'ts-dedent';
import fs from 'node:fs';

class SymfonyPreviewRenderingError extends Error {
    constructor(public readonly errorPage: string) {
        super('Unable to render preview.');
    }
}

type CommandOptions = {
    /**
     * Path to the PHP binary used to execute the command.
     */
    php?: string;

    /**
     * Path to the Symfony Console entrypoint.
     */
    script?: string;
};

const defaultOptions: CommandOptions = {
    php: 'php',
    script: 'bin/console',
};

const prepareSymfonyCommand = (command: string, inputs: string[] = [], options: CommandOptions = {}) => {
    const finalOptions = {
        ...defaultOptions,
        ...options,
    };

    return [finalOptions.php, finalOptions.script, command]
        .concat([...inputs, '-v'])
        .map((part) => `'${part}'`)
        .join(' ');
};

const execSymfonyCommand = async (finalCommand: string) => {
    return new Promise<string>((resolve, reject) => {
        exec(finalCommand, (error, stdout, stderr) => {
            if (error) {
                reject(
                    new Error(dedent`
                    Symfony console failed with exit status ${error.code}:
                    CMD: ${error.cmd}
                    Output: ${stdout}
                    Error output: ${stderr}
                `)
                );
            }

            resolve(stdout);
        });
    });
};

/**
 * Run a Symfony command.
 */
export const runSymfonyCommand = async (command: string, inputs: string[] = [], options: CommandOptions = {}) => {
    const finalCommand = prepareSymfonyCommand(command, inputs, options);

    return execSymfonyCommand(finalCommand);
};

/**
 * Run a Symfony command with JSON formatted output and get the result as a JS object.
 */
export const runSymfonyCommandJson = async <T = any>(
    command: string,
    inputs: string[] = [],
    options: CommandOptions = {}
): Promise<T> => {
    const finalCommand = prepareSymfonyCommand(command, [...inputs, '--format=json'], options);
    const result = await execSymfonyCommand(finalCommand);

    try {
        return JSON.parse(result);
    } catch (err) {
        throw new Error(dedent`
        Failed to process JSON output for Symfony command.
        CMD: ${finalCommand}
        Raw output: ${result}
        `);
    }
};

export const generateSymfonyPreview = async (server: string) => {
    const fetchUrl = new URL(`${server}/_storybook/preview`);

    const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
            Accept: 'text/html',
        },
    });

    const html = await response.text();

    if (!response.ok) {
        throw new SymfonyPreviewRenderingError(html);
    }

    return html;
}

type SymfonyConfiguration = {
    storybook_bundle_config: StorybookBundleConfig;
    twig_config: SymfonyTwigConfiguration;
    twig_component_config: SymfonyTwigComponentConfiguration;
}

export const getSymfonyConfig = async (storybookCachePath: string): Promise<SymfonyConfiguration> => {
    const filePath = `${storybookCachePath}/symfony_parameters.json`;

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

type StorybookBundleConfig = {
    runtime_dir: string;
};

type SymfonyTwigComponentConfiguration = {
    anonymous_template_directory: string;
    defaults: {
        [p: string]: {
            name_prefix: string;
            template_directory: string;
        };
    };
};

export type TwigComponentConfiguration = {
    anonymousTemplateDirectory: [string];
    namespaces: {
        [p: string]: [string];
    };
};

type SymfonyTwigConfiguration = {
    paths: {
        [p: string]: string;
    };
};

export type TwigConfiguration = {
    paths: string[];
};
