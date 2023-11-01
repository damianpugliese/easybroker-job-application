> Easyborker job application

## Installation

Before getting started, it is highly recommended having [nvm](https://github.com/creationix/nvm) installed to run the service.

1. Clone the project

```bash
$ git clone git@github.com:damianpugliese/easybroker-job-application.git && cd easybroker-job-application
```

2. Change the `Node.js` version to use the same one used in the project

```bash
$ nvm install 16
```

Or install node v.16

3. Install `npm` dependencies (NPM v8.x)

```bash
$ npm i
```

## Creating the .env File

1. Create a `.env` file in the root of the project.

2. Inside the `.env` file, add your API_KEY using the following format:

```bash
API_KEY=your_api_key
```

Make sure to replace `your_api_key` with your actual API key.

## Running Locally

To run the program locally using the nodemon server and view the output in the console, use the following command:

```bash
$ npm run dev
```

## Running Tests Locally

To run the tests locally, use the following command:

```bash
$ npm run test
```

## App Info

### Author

Damián Pugliese

### Date

31/10/2023

### Version

1.0.0
