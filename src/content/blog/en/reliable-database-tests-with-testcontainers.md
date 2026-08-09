---
title: "Reliable Database Tests Without a Shared Test Database"
description: "Choose mocks, an in-memory database, Testcontainers, or a real database by the failure you need to catch, while keeping ordinary tests isolated from shared infrastructure."
lang: en
translationKey: reliable-database-tests-with-testcontainers
publishedAt: 2023-12-04
tags:
  - testing
  - databases
  - backend
draft: false
---

> **Source and AI note:** This article is based on [Gemini's Devpractice](https://www.youtube.com/@geminikims) on YouTube. It was generated and edited with the `gpt-5.6-sol` model.

A component reads through a repository. Should its test use a mock, an in-memory database, Testcontainers, or a database that is already running somewhere? My answer is not one tool. I use the cheapest test that can catch the failure I care about, then add a more realistic test when the cheaper one leaves a risk I no longer accept.

For a validator whose decision depends on one repository result, a mock is often enough. I can supply the exact record set for each condition and test the validator quickly. The test is about the validator's policy, not whether a JPA query joins the right tables.

That same mock cannot prove the query works. A test suite can cover every branch in the service and still fail after deployment because the mapping, query, schema, or database behavior is wrong. When that possibility makes the release uncomfortable, the answer is not to stop using mocks. It is to test the next boundary too.

## Pick the test by the uncertainty

I think of the options as a rough progression in cost and realism.

A mock is fast and precise for business decisions. It is also farthest from database behavior. Use it when the test needs to say, "Given these repository results, the component must make this decision."

An in-memory database such as H2 can run repository and Spring integration tests without provisioning a separate server. It checks more wiring, JPA behavior, and basic queries. It remains a different database engine. SQL syntax, types, indexing behavior, locking, and vendor-specific functions can differ from production.

Testcontainers can provision a disposable database from a chosen engine for a test run. The project still has to configure the image, schema initialization, isolation, and lifecycle. It is slower and heavier than H2, but using the same engine family as production can catch compatibility failures that H2 cannot.

A long-lived real database environment is closest to a deployed system only in a narrow sense. It also introduces shared state, network availability, credentials, cleanup, and ownership. Those operational variables can make the test less reliable even while the database engine is more realistic.

The choice is not a ladder every test must climb. Different tests can stop at different points. A validator test can keep its mock while a smaller number of repository tests use Testcontainers.

## A shared test schema creates the wrong dependency

It is tempting to create a test schema in the development database and make CI connect to it. The database is already running, so test execution may appear fast. The maintenance cost arrives later.

Developer A prepares a release against one schema. Developer B changes the shared test schema for a feature branch. A's pipeline now fails even though A's application logic did not change. Or the network drops while a deployment pipeline is running and the suite fails before reaching the code under test. Parallel jobs can collide on data and cleanup. Someone must decide who owns migrations, stale records, permissions, and recovery.

These are failures in shared test infrastructure, not product failures. A required check that changes under another branch or disappears with the network is a poor gate for a commit.

I have used a shared database approach and found the management difficult. A team may have constraints that justify it, but I would not choose it as the ordinary default. If each test run needs a database, give that run an isolated database it can create and destroy.

Testcontainers can fit that rule when the project configures the database for the current test run and gives it a known starting schema. It provides realism without making one central test database a meeting point for every branch. Spring Boot 3.1 also makes Testcontainers integration more convenient, but I have not used recent versions enough to prescribe an exact setup, and convenience does not remove container startup time or resource usage.

## Keep the ordinary test command dependable

I have a personal preference for the normal Gradle `test` task: it should run even when Wi-Fi is off. A developer should be able to work on a plane, in a bad network environment, or during an external outage and still run the project's main tests.

That does not mean every integration test must fit in the fastest unit-test task. A project can separate test suites by purpose. Fast tests run on every local change. Database integration tests run on pull requests or through a dedicated task. The important part is that each suite has a clear contract and does not secretly depend on an unmanaged external service.

Compared with H2, a container-based database is heavier and slower. Use it where matching the database engine justifies that cost instead of making it the default for every test.

## Combine tests instead of choosing a winner

The useful question is how much confidence we need for each risk.

Use mocks to cover many business conditions cheaply. Use H2 when basic persistence wiring matters and its differences are acceptable. Use Testcontainers for queries, mappings, migrations, constraints, and database-specific behavior that must match the production engine. Use a separately managed real environment only when there is a property the disposable environment cannot reproduce and the team accepts the operational cost.

If mock-based tests pass but database bugs keep reaching production, add database integration coverage at the failing boundary. If H2 hides production-engine differences, move those tests to Testcontainers. If a container still cannot represent a managed database feature you depend on, test that feature in a controlled real environment. Each step should answer a failure you have reason to care about.

Testing reduces the fear of changing software, but only when the tests themselves are trustworthy. A fast test that proves the wrong thing is weak protection. A realistic test that fails because another developer changed a shared schema is also weak protection.

Keep the small tests fast. Put realism where it catches a concrete risk. Isolate the required path from shared infrastructure. That balance gives the team confidence without making every commit wait on a database nobody fully controls.