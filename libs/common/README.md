# @aetheria/common

🚀 Welcome to `@aetheria/common` - the ultimate collection of common methods, utilities, and modules for Aetheria's
headless CMS! This package provides a comprehensive set of tools that cover a wide range of functionalities, from
generating random strings to validation utilities and much more.

## Features

✨ Here are some key features of `@aetheria/common`:

- **Random string generation**: Need a random string of a specific length? Look no further! With
  the `makeRandomString(length)` utility, you can easily generate secure random strings to suit your needs.

- **Validation utilities**: Simplify your validation process with the `validate(value, zod_schema)` method. It provides
  an intuitive way to validate your data against a Zod schema, making data validation a breeze.

- **Bootstrap utilities**: The package includes helpful bootstrap utilities to streamline the initialization process of
  your Aetheria application. These utilities provide a solid foundation for your project's setup and configuration.

- **Decorators**: Enhance your NestJS application with the included decorators. The `PublicEndpoint(is_public)`
  decorator allows you to define whether an API endpoint should be publicly accessible. The `RestUser()` decorator
  provides convenient access to the authenticated user within your controllers.

- **Hashing module**: The package includes a simple hashing module that integrates with the `HashService` provided by
  NestJS. This module handles bcrypt hashing and verification, ensuring secure password storage for your application.

- **Application models**: Find the basic application models, `User` and `Template`, along with their related services,
  NestJS modules, and controllers. These models serve as a solid starting point for building your Aetheria CMS
  application.

## Installation

📦 To install `@aetheria/common`, simply run the following command:

```bash
npm install @aetheria/common
```

## Usage

🔧 Once installed, you can start utilizing the powerful features of `@aetheria/common` within your Aetheria CMS project
or plugin.

Here's an example of how to import and use some of the utilities and modules:

```typescript
import {
  HashService,
  makeRandomString,
  PublicEndpoint,
  RestUser,
  Template,
  User,
  validate,
  UserDocument
} from "@aetheria/common";

// Generate a random string
const randomString = makeRandomString(10);

// Validate data against a Zod schema
const data = { /* Your data here */};
const schema = { /* Your Zod schema here */};
validate(data, schema);

// Decorators usage
@PublicEndpoint(true)
class MyController {
  getUser(@RestUser() user: UserDocument) {
    // Access the authenticated user
    // ...
  }
}

// Hashing module
const hashService = new HashService();
const hashedPassword = hashService.make("password");
const isValid = hashService.compare("password", hashedPassword);
```

For detailed documentation, examples, and additional features, please visit
the [official Aetheria documentation](https://aetheria-docs.override.sh/packages/common).

## Contributing

🤝 We welcome contributions from the community to enhance `@aetheria/common`. If you have any ideas, bug fixes, or
improvements, please feel free to submit a pull request or open an issue on the GitHub repository.

Want some quick links? Here are some useful places to get started:

- [Report a bug](https://github.com/override-sh/aetheria-headless/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5B%40aetheria%2Fcommon%5D%20BUG_TITLE)
- [Request a feature](https://github.com/override-sh/aetheria-headless/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=%5B%40aetheria%2Fcommon%5D%20FEATURE_TITLE)

## License

📜 This package is [MIT licensed](https://github.com/aetheria-io/aetheria/blob/main/LICENSE).

## Get Started Now!

💪 With `@aetheria/common`, you have access to a powerful set of utilities, modules, and models that will supercharge
your Aetheria CMS development.
Dive into the extensive documentation, examples, and more by visiting the
[official Aetheria documentation](https://aetheria-docs.override.sh/packages/common).
Unleash the full potential of your Aetheria CMS projects with ease!

Happy coding! 🎉
