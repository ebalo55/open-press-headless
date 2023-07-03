# @aetheria/plugin-auth

🔒 Welcome to `@aetheria/plugin-auth` - a simple authentication plugin for Aetheria's headless CMS!
This package provides simple authentication functionalities using local credentials (username + password) and JSON Web
Tokens (JWT).
It includes two NestJS guards: `JwtAuthGuard` and `LocalAuthGuard`, which can be easily integrated into your Aetheria
CMS project.

## Features

✨ Here are the key features of `@aetheria/plugin-auth`:

- **Local Authentication**: The package enables local authentication using username and password credentials.
  The `LocalAuthGuard` can be used to protect routes and endpoints that require user authentication.

- **JWT Authentication**: JSON Web Tokens (JWT) are utilized for secure authentication. The `JwtAuthGuard` is provided
  as a global guard by default, ensuring that authenticated requests are authorized based on the provided JWT.

## Installation

📦 To install `@aetheria/plugin-auth`, simply run the following command:

```bash
npm install @aetheria/plugin-auth
```

## Usage

🔧 If you've installed the plugin via the dedicated cli you can immediately start utilizing the plugin within your
Aetheria CMS project.
For manual installation refer to
the [official Aetheria documentation](https://aetheria-docs.override.sh/plugins/auth).

## License

📜 This package is licensed under
the [GPL-2.0 licensed](https://github.com/override-sh/aetheria-headless/blob/main/LICENSE).

## Contributing

🤝 We welcome contributions from the community to enhance `@aetheria/plugin-auth`. If you have any ideas, bug fixes, or
improvements, please feel free to submit a pull request or open an issue on the GitHub repository.

Want some quick links? Here are some useful places to get started:

- [Report a bug](https://github.com/override-sh/aetheria-headless/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5B%40aetheria%2Fplugin-auth%5D%20BUG_TITLE)
- [Request a feature](https://github.com/override-sh/aetheria-headless/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5B%40aetheria%2Fplugin-auth%5D%20FEATURE_TITLE)

## Get Started Now!

✨ Start implementing secure authentication functionalities in your Aetheria CMS projects using `@aetheria/plugin-auth`.
Visit the [official Aetheria documentation](https://aetheria-docs.override.sh/) to learn more and integrate
authentication into your application.

Secure your application and provide a seamless user experience! 🚀
