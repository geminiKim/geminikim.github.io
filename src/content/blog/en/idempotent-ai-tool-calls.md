---
title: "When an AI Agent Calls the Same Tool Twice"
description: "Retries are normal in distributed systems and AI workflows. Use database constraints, idempotency keys, and bounded retries to prevent duplicate side effects."
lang: en
translationKey: idempotent-ai-tool-calls
publishedAt: 2023-10-28
tags:
  - ai-agents
  - backend
  - reliability
draft: false
---

> **Source and AI note:** This article is based on Gemini Kim's YouTube content recorded in 2023. It was generated and edited with the `gpt-5.6-sol` model.

I was asked how a backend should stop the same request from being submitted twice. The visible cause was a double click. The difficult case had nothing to do with the button.

A client sends a request. The server completes the work, but the connection drops before the response arrives. The client sees a timeout. It cannot tell whether the operation failed or succeeded, so it sends the request again.

AI agents inherit this old distributed-systems problem and add more ways to trigger it. A model may choose the same tool again. An orchestration layer may retry a timed-out step. A human may resume a workflow whose last result was lost. If the tool creates an order, issues a refund, sends an email, or starts a deployment, the second call has a real cost.

The caller will retry. The API has to decide what a repeated request means.

## Start with the business invariant, not Redis

Duplicate prevention is not one technical problem. It depends on the operation.

A repeated comment may be annoying but tolerable. Issuing the same coupon twice may violate a product rule. Charging the same payment twice is unacceptable. Before choosing a lock, cache, or queue, write the invariant in plain language.

> A user can receive a given coupon only once.

That rule already has a natural identity: `(user_id, coupon_id)`. When every writer goes through one authoritative database, a unique constraint can enforce it across every application process.

```sql
CREATE TABLE issued_coupon (
  user_id   BIGINT NOT NULL,
  coupon_id BIGINT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, coupon_id)
);
```

Two requests can pass an application-level `exists` check at the same time. If the same global unique index covers both writes, they cannot both commit. Let the database protect the invariant, then translate the constraint violation into the API result your product needs.

This is usually a better starting point than adding a distributed lock service. Keep the database constraint as the source of truth even if Redis is later added for admission control or load shedding. A lease-based lock does not replace the invariant: correctness would also require ownership checks, expiry handling, and fencing at the protected resource.

Client-side button disabling still helps the user experience. It does not protect the system. Requests also come from scripts, mobile retries, queues, and agents. Correctness belongs at the boundary that owns the data.

## Use an idempotency key when the request has no natural identity

Some operations do not have a useful business key before they run. A client may ask to create an order, send a message, or start a job. In those cases, give one logical attempt an idempotency key and reuse that key for every retry.

```http
POST /orders
Idempotency-Key: 7dc3e9c2-0f27-4f8e-9aa1-a4b92d2f7834
```

The server needs more than a set of keys. It needs enough information to distinguish a valid retry from accidental or malicious key reuse.

```sql
CREATE TABLE idempotency_request (
  scope            VARCHAR(100) NOT NULL,
  idempotency_key  VARCHAR(255) NOT NULL,
  request_hash     CHAR(64) NOT NULL,
  state            VARCHAR(20) NOT NULL
                   CHECK (state IN ('processing', 'succeeded', 'failed')),
  owner_token      VARCHAR(100),
  lease_expires_at TIMESTAMPTZ,
  status_code      INTEGER,
  resource_id      VARCHAR(100),
  response_body    JSONB,
  result_expires_at TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, idempotency_key)
);
```

A practical request flow looks like this:

1. Authenticate, authorize, and validate the request.
2. Create a versioned fingerprint from every behavior-affecting input and store it as `request_hash`: operation, authenticated scope, route, query, body after defaults, relevant headers, and API version.
3. Atomically claim `(scope, idempotency_key)` with state `processing`.
4. If the key already exists, compare the request hash.
5. Reject the request if the same key carries different input.
6. Replay the stored result if the first attempt reached a terminal state.
7. Return a documented in-progress result, or wait for a short bounded period, if the first attempt is still running.
8. Complete the business operation and store its outcome.

If the business effect is stored in the same database, claim the key, perform the business write, and mark the request `succeeded` in one transaction. A rollback must remove both the claim and the business write. Do not keep that transaction open across a remote call.

Long-running work needs a separate ownership rule. A `processing` row can survive a crashed worker, while a slow worker can remain alive after its lease expires. Allow takeover only when the local effect is fenced or the downstream effect is safely deduplicated, and verify the owner or fencing token when committing the result. Result retention and processing leases need separate expiry fields; prune only terminal records under the replay-retention policy.

`scope` should include the boundary that makes reuse safe, such as tenant, user, tool, and operation. A key for `create_order` must not silently match a key for `refund_order`.

Storing the whole response makes exact replay easy, but it can retain sensitive data and grow quickly. Storing a resource ID and reconstructing the response may be safer. The right choice depends on the API contract. Either way, result retention must be longer than the caller's maximum retry window. Once a terminal record is pruned, a late retry can become a new operation.

The contract must also define which failures become terminal and replayable. Validation failures should usually not reserve the key, while an unknown remote side effect must not be retried merely because the local response was `500`.

## Client-generated keys are not a trust decision

Client-generated idempotency keys can look risky because the server appears to trust client input to protect an important operation. That concern mixes two different responsibilities.

Stripe's API asks the client to generate a high-entropy key. After endpoint execution begins, Stripe stores the status and body, including `500` responses, and replays that result for later requests. It does not store validation failures or requests that conflict with another concurrent execution, so those can be retried. Keys may be pruned after they are at least 24 hours old, and reuse after pruning is treated as a new request. Authentication and authorization still decide whether the caller may perform the operation. The idempotency key only identifies retries of one logical attempt.

A server-issued key is also valid. It can fit a checkout session or a workflow that has a preparation step. It is not automatically safer, and it creates unused records when many sessions never submit. Choose based on the product flow.

Clients that create keys should use enough entropy and keep personal data out of them. The server should enforce a bounded length and accepted format, scope storage and quotas by authenticated principal, and reject abusive key creation. It should bind the key to an operation, compare the full request fingerprint on reuse, and document retention and replay behavior. For correlation, log a digest or a bounded, escaped representation instead of assuming raw client input is safe to record.

An idempotency key is not authentication, authorization, rate limiting, or abuse prevention.

## Close the gap around external side effects

A local idempotency table does not solve every duplicate.

Suppose the service calls a payment provider. The provider completes the charge, then the process crashes before the local idempotency record is marked `succeeded`. A retry claims or resumes the local operation and can charge the customer again.

The idempotency identity has to cross the side-effect boundary. Do not blindly forward the raw incoming key. Derive a stable downstream key from the full local operation identity, or persist a unique child-operation ID. Its uniqueness must match the provider's namespace, and each distinct downstream side effect needs its own key. Persist the provider's request and resource IDs for reconciliation.

For asynchronous work, write the business change and an outbox record in one database transaction. Give the consumer a unique event or command ID and make its write idempotent as well.

Querying remote state helps only when the lookup uses a unique correlation ID and the provider offers a strong enough read-after-write contract. A `not found` result from an eventually consistent or non-correlatable system is inconclusive. Do not automatically repeat the side effect in that case; record `unknown` and reconcile or compensate. A timeout proves that the caller stopped waiting. It does not prove that the remote side did nothing.

This is why I avoid claiming "exactly once" for an entire distributed workflow. We can enforce a unique business effect at specific boundaries. We still have to design every handoff between them.

## Describe AI tools by their effects

Tool names are often too vague to carry a safety policy. `update_record` might be harmless, expensive, or destructive depending on the record. I prefer contracts that expose the effect directly:

- Does the tool only read?
- Can it modify or delete external state?
- Does repeating the same input create another effect?
- Can it interact with external entities outside a closed, controlled domain?
- Does it require human confirmation?

The Model Context Protocol includes `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint` in tool annotations. Its definition of `idempotentHint` is close to what an orchestrator needs: calling the tool repeatedly with the same arguments has no additional effect on the environment.

In the MCP schema, `idempotentHint` defaults to `false` and is meaningful only when `readOnlyHint == false`. The specification also says these fields are hints, not guarantees, and clients must not base decisions on annotations from untrusted servers. Setting `idempotentHint: true` does not make a tool idempotent. The server's storage constraints and side-effect handling do.

Idempotency does not prove that the user wanted the first call. Refunds, deployments, data deletion, and other high-impact operations may still need an approval step. Duplicate safety and human intent solve different problems.

## Give retries a budget

Retries improve availability during short failures. They also add load to a system that may already be struggling.

The AWS Builders' Library calls retries "selfish" for this reason. It recommends timeouts, bounded exponential backoff, and jitter. It also warns that a timeout does not tell us whether a remote side effect occurred, which is why APIs with side effects should be idempotent before clients retry them.

Choose one retry-owning layer by default. Disable or delegate retries in nested clients so attempts do not multiply across the call stack. At that layer, I want the retry policy to answer concrete questions:

- Which failures are transient enough to retry?
- How many attempts are allowed for this whole workflow?
- Which layer owns the retry so that nested clients do not multiply attempts?
- What backoff and jitter separate the attempts?
- Can an operator see the original call and every retry in one trace?
- When does the workflow stop and ask a person to reconcile the result?

Without a retry limit, a brief failure can become an unbounded incident.

## Test the race, not only the happy path

A sequential test proves very little here. Send the same request concurrently to separate application instances. Interrupt the connection after the business write but before the response. Crash the worker between an external side effect and the local status update. Expire a processing lease and verify that the old worker can no longer commit. Retry after a terminal replay record has been pruned.

The test should verify the business outcome, not just the HTTP response:

- one coupon exists;
- one order was created;
- one refund reached the provider;
- one deployment started;
- repeated requests returned a documented and consistent result.

Also make the operation observable. Record an idempotency-key digest, request or workflow ID, attempt number, tool name, result, and downstream correlation ID. Do not log secrets or a sensitive request body just because replay handling needs a hash.

## Keep the design proportional

AI agents did not invent duplicate execution. They make an old assumption fail more often: the assumption that one intent produces one call.

Start with the business invariant. Use a database constraint when the data already has a natural unique key. Add an idempotency record when one logical attempt needs an identity. Carry that identity across external side effects, limit retries, and test concurrent requests.

If calling the same tool twice can charge, send, delete, or deploy twice, the tool is not ready for autonomous use.

## References

- [Stripe API: Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Model Context Protocol schema: ToolAnnotations](https://modelcontextprotocol.io/specification/2026-07-28/schema#toolannotations)
- [Model Context Protocol: Tools and human-in-the-loop guidance](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [AWS Builders' Library: Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
