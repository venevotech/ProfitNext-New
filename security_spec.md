# Security Specification & Threat Model

## Data Invariants
1. A user cannot read or tamper with another user's personal profile or PII.
2. Products and global settings are publicly readable, but only admins can mutate catalog pricing or settings.
3. Orders can be submitted by customers with valid verification information; only admins can approve, complete, or mutate order statuses.
4. Admin role is safeguarded against privilege escalation.

## Dirty Dozen Payloads Handled
1. Unauthenticated attempt to overwrite product pricing.
2. Customer attempting to mark their own order as 'completed' without payment verification.
3. Attacker trying to inject an oversized document ID or payload.
4. Non-admin attempting to list all customer orders.
5. User attempting to delete administrative settings.
6. Spoofed email address claiming admin access without verified identity.
7. Attempt to modify affiliate wallet without admin clearance.
8. Malformed order missing required TrxID or phone number.
9. Attempt to read other customers' private credentials.
10. Rapid spam writes blocked by schema key verification.
11. Arbitrary injection of ghost fields on order creation.
12. Unauthenticated deletion of withdrawal requests.
