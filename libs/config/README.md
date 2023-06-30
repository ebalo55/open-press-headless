# @aetheria/config

🚀 Welcome to `@aetheria/config`.
This package provides a seamless way to import and manage configurations within your NestJS modules.
It also includes powerful utilities for loading the `etheria.json` config file and enforcing strong environment
validation rules.

## Features

✨ Here are some key features of `@aetheria/config`:

- **Simplified configuration management**: Import the package and access your configuration settings effortlessly within
  your
  NestJS modules.
- **`etheria.json` support**: The package comes with built-in utilities to load and parse the `etheria.json`
  configuration file,
  allowing you to centralize your application's configuration in one place.
- **Strong environment validation**: The default configurations are subjected to strict environment validation rules,
  ensuring
  that your application runs with the correct settings.
  These validation rules can be easily extended using the `EnvValidation` singleton class.
- **Easy integration**: Seamlessly integrate the package into your existing NestJS projects without any hassle.

## Installation

📦 To install `@aetheria/config`, simply run the following command:

```bash
npm install @aetheria/config
```

## Usage

🔧 Once installed, you can import and utilize the configuration features of `@aetheria/config` in your NestJS modules.

Here's an example of how to import and use the configuration:

```typescript
import { AuthConfig, AUTH_CONFIG_KEY } from '@aetheria/config';
import { Injectable } from "@nestjs/common";

@Injectable()
export class MyService {
  constructor(@Inject(AUTH_CONFIG_KEY) private _auth_config: AuthConfig) {}

  async sampleMethod() {
    console.log(this._auth_config.jwt.encryption)
    // Use the configuration in your code
    // ...
  }
}
```

For detailed documentation, usage examples, and additional features, please visit the
[official Aetheria documentation](https://aetheria-docs.override.sh/packages/config).

## Contributing

🤝 We welcome contributions from the community to enhance `@aetheria/config`.
If you have any ideas, bug fixes, or improvements, please feel free to submit a pull request or open an issue on the
GitHub repository.

Want some quick links? Here are some useful places to get started:

- [Report a bug](https://github.com/override-sh/aetheria-headless/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5B%40aetheria%2Fconfig%5D%20BUG_TITLE)
- [Request a feature](https://github.com/override-sh/aetheria-headless/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5B%40aetheria%2Fconfig%5D%20FEATURE_TITLE)

## License

📜 This package
is [GPL-2.0 licensed](https://github.com/override-sh/aetheria-headless/blob/feature/plugin-loader/LICENSE).

## Get Started Now!

💪 With `@aetheria/config`, managing your NestJS configurations has never been easier!
Explore the full potential of this package by visiting the
[official Aetheria documentation](https://aetheria-docs.override.sh/).
Discover in-depth guides, examples, and more to supercharge your NestJS applications.

Happy configuring! 🎉
