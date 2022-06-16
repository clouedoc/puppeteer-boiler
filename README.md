# puppeteer-boiler

## Archived

You should migrate to my more recent template: [here](https://github.com/clouedoc/typescript-boilerplate).
This repository is still a great learning resource for beginners!

![cool boilerplate image](assets/images/boilerplate-readme.jpeg)

## Introduction

With NodeJS and TypeScript, you can structure your project how you want. However, this can be a bit intimidating for beginners.

The puppeteer-extra-boilerplate is a good learning source for scraping beginners and allows advanced users to have a batteries-included template ready.

This is a WIP boilerplate. You might want to check prescience's one: <https://github.com/prescience-data/foundation>.

### If you are a beginner

Then welcome to scraping ! Make sure to [join the Scraping Enthusiasts discord server](https://discord.gg/QDbpFyenhA)

You can use this project to help you get started in architecturing your own projects.

### If you are already experienced

Then you probably will want to compare your stack with mine.

## Important setup

You need to rename `.env.example` to a plain `.env`.

## Tools used

### Prisma (database)

To access and edit the database, you'll need to setup a local PostgreSQL instance. Then, you can edit the connection string in `.env`

[Prisma's TypeScript getting started guide](https://www.prisma.io/docs/getting-started/quickstart-typescript)

### puppeteer-extra

This package is used to extend the base functionnalities of puppeteer.

It is required to use puppeteer-extra plugins.

### GCP Logging

**Setup:**

1. Create a GCP project <https://console.cloud.google.com>
2. [Enable the Cloud Logging API](https://console.cloud.google.com/marketplace/product/google/logging.googleapis.com)
3. [Create a service account](https://console.cloud.google.com/apis/api/logging.googleapis.com/credentials?folder=true&organizationId=true)
    - required roles:
      - Logging > Logs Writer
      - Monitoring > Monitoring Metric Writer
      - source: <https://cloud.google.com/logging/docs/agent/authorization>
4. Download the service account's credentials in JSON format
5. Add the key to the root of the project and rename it to "gcp-creds.json"

## Contributing

**Rules:**

1. You need to respect the code format. If you are using VSCode, install the Prettier extension, which should automatically pick up the .prettierrc file.
2. All contributions are accepted. Documentation, code, etc...

### What's next

- [ ] Add stealth utils (jitter, stealth mouse movements)
- [ ] Add stealth measures where there are `// STEALTH` comments. These measures should be activated thanks to an env varialbe. It would add delay, so not great for development.

## Troubleshooting

### My project is slow to use since VSCode updated !

Check VSCode's and TypeScript's issues.

See: https://github.com/microsoft/TypeScript/issues/43249

## License

This package is licensed under the MIT license.

## Contact

Feel free to raise an issue.
