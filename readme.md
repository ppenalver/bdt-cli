## BDT CLI
### CLI for Stratio BDT, Acceptance Test Library

## Prerequisites

The CLI have dependencies that require Node 6.9.0 or higher, together
with NPM 3 or higher.

Selenium Driver (http://www.seleniumhq.org/projects/webdriver/)

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Initializing the tests](#initializing-the-tests)
* [Configuration on a project that already has acceptance test with the BDT library](#configuration-on-project-that-already-has-acceptance-test-with-the-BDT-library)
* [Test Commands](#test-commands)

## Installation

**BEFORE YOU INSTALL:** 

please read the [prerequisites](#prerequisites)
```bash
npm install -g bdt-cli
```

## Usage

```bash
bdt --help
```

## Initializing the tests

You can use the `bdt init` command to initialize test construction on an already created project

## Configuration on a project that already has acceptance test with the BDT library

If your project is already using the BDT Acceptance Test library and you want to use the cli you just have to execute this command

```bash
bdt config
```

This will generate a configuration file called .env on which the tests will run

## Test Commands

### Test Execute

To execute all the tests you have to perform the following command

```bash
bdt test
```

You can select the test you want to run for that type the following command

```bash
bdt test -o
```

### Test Config

You can configure the tests with two parameters:

```bash
bdt test -h
```

Specify the host of the server you are going to run the tests for and where Selenium is located. By default is your public ip.

```bash
bdt test -p
```

Specify the port of the server you are going to run the tests. By default is 8043.


### Test Create

You can create test automatically with the following command:

```bash
bdt test -c
```

You will begin a process where you will need to specify the number and name of the user history in Jira.

The final result will be the creation of a Java class and a Cucumber feature where to write the test,

### Test Delete

To remove a test run the following command:

```bash
bdt test -d
```
You will have to select from a list the test to be deleted, deleting it will remove both the Java class and the Cucumber feature.

## Work in progress

- Create a watcher to observe the tests and execute them when they change
- Templates to edit and change features
- Read user stories directly from Jira
- Interdependence of Selenium

## License

MIT




