# Lunar

A high-performance Telegram trading platform built for fast and simple trading on Solana.

Lunar abstracts away much of the complexity of interacting with Solana programs. Users can create a wallet, discover tokens, and execute trades directly through Telegram.

## Overview

The project was built around three main goals:

* **Speed** — minimize the time between a user's action and transaction submission.
* **Simplicity** — make on-chain trading accessible through a familiar Telegram interface.
* **Reliability** — maintain secure wallet access and predictable transaction execution.

Rather than relying entirely on third-party infrastructure, the system was designed with control over the full request path in mind.

## Architecture

```text
Telegram User
      │
      ▼
Telegram Bot
      │
      ├── Authentication / User State
      │
      ├── Wallet Management
      │
      ├── Trading Logic
      │
      └── Referral & Cashback Engine
      │
      ▼
Transaction Builder
      │
      ├── Solana Web3
      ├── Anchor IDLs
      └── Program Instructions
      │
      ▼
Self-Hosted Solana RPC
      │
      ▼
Solana Network
```

The Telegram frontend, application backend, database, and Solana RPC infrastructure were designed to work closely together to reduce unnecessary network latency.

## Key Features

### Telegram-native trading

Users interact with the platform entirely through Telegram.

The bot manages persistent user state so actions can be performed without repeatedly configuring wallets or accounts.

### Solana wallet management

Each Telegram user is mapped to their own Solana wallet.

The backend maintains the relationship between:

```text
Telegram User
      ↓
Application User
      ↓
Solana Wallet
```

Wallet access and authentication are handled by the backend rather than exposing sensitive key material through Telegram.

### On-chain trading

Lunar constructs and submits Solana transactions directly.

The trading system handles:

* Transaction construction
* Program instructions
* Transaction signing
* RPC submission
* Priority fees
* Blockhash management
* Failed transactions
* Changing on-chain conditions

### Anchor program integration

Some integrations required working directly with Solana program interfaces rather than relying on a complete third-party SDK.

Anchor IDLs were used to understand instruction structures and construct the required transactions.

This allowed Lunar to interact directly with programs such as **Pump.fun**.

### Token analysis

The platform can retrieve and process on-chain token information, including token accounts and holder distribution.

Solana RPC calls and SPL Token data are processed directly to produce useful trading information inside Telegram.

### Low-latency infrastructure

Performance was an important part of the project.

The system was developed around dedicated infrastructure in Germany, including:

* Self-hosted Solana RPC
* 512 GB RAM
* Multiple TB of NVMe storage
* Application services located close to RPC infrastructure
* Database and backend latency optimization
* Cached frequently accessed user state

Keeping the application and RPC infrastructure close together reduces network round trips during transaction preparation and submission.

## Referral System

Lunar includes a **three-level affiliate system**.

Referral relationships can propagate across multiple levels, allowing commissions to be distributed through the referral tree.

```text
User A
  │
  └── User B
        │
        └── User C
              │
              └── User D
```

The backend tracks referral relationships, trading activity, commissions, and payouts.

## Cashback

Part of the platform's fee system can be returned to users through cashback.

The accounting system therefore handles both:

```text
Trading Fees
     │
     ├── Platform Revenue
     ├── Affiliate Commission
     └── User Cashback
```

This required keeping trading, referral, and reward accounting synchronized.

## Performance

A major focus of Lunar was reducing delays that become noticeable in Telegram trading bots.

Optimization work included:

* Reducing database requests on common actions
* Caching frequently accessed user information
* Indexing Telegram user lookups
* Keeping backend services close to RPC infrastructure
* Avoiding unnecessary RPC calls
* Optimizing transaction construction
* Controlling the RPC layer rather than depending entirely on shared public infrastructure

The goal was simple: **a Telegram button press should feel immediate even when significant blockchain work happens behind it.**

## Technology

Core technologies used across the project include:

```text
JavaScript / Node.js
Telegram Bot API
Solana Web3.js
Anchor / IDLs
SPL Token Program
PostgreSQL
Solana RPC
Linux / Ubuntu
```

The project also involved integrating external Solana infrastructure where appropriate while progressively moving performance-critical infrastructure under direct control.

## What I Learned

Lunar became more than a Telegram bot.

Building it required working across:

* Distributed systems
* Blockchain transactions
* Database design
* Authentication
* Wallet security
* RPC infrastructure
* Low-latency networking
* On-chain program interfaces
* Financial accounting
* Backend performance optimization

The biggest engineering challenge was making a complicated distributed system feel simple to the user.

A trade may involve authentication, database state, wallet access, transaction construction, program instructions, signing, RPC communication and confirmation.

To the user, however, it should feel like pressing one button.

That principle shaped the architecture of Lunar.
