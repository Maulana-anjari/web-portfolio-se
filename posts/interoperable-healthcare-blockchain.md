---
title: "Interoperable Blockchain: Building a Testbed for Secure Healthcare Data Exchange"
date: "2024-01-30"
excerpt: "Exploring a Hyperledger Fabric and IPFS-based architecture for secure, scalable, and interoperable healthcare data management between hospitals and insurance providers."
tags: ["Blockchain", "Hyperledger Fabric", "Healthcare", "IPFS", "Interoperability"]
img: "/images/blog/healthcare-blockchain-interoperability.png"
readingTime: "2 min read"
--- 

## Introduction

In the current healthcare landscape, data silos between hospitals and insurance providers often lead to delays in patient treatment and insurance claims processing. Secure and scalable data exchange is no longer just a luxury—it's a necessity.

From August 2023 to January 2024, I had the opportunity to intern as a Blockchain Engineer at the Faculty of Engineering, Universitas Gadjah Mada (UGM) under the guidance of [Guntur Dharma Putra, S.T., M.Sc., Ph.D.](https://gdputra.github.io). Working alongside my colleague Novaldy Pratama, we focused on applying software engineering principles to solve healthcare data management challenges using an interoperable blockchain testbed.

![Architecture overview of the healthcare blockchain testbed](/images/blog/healthcare-blockchain-interoperability.png)

## The Interoperability Challenge

Healthcare data is sensitive, high-volume, and typically distributed across multiple organizations. A "one-size-fits-all" blockchain approach often fails because:
1.  **On-Chain Storage Limits**: Storing large medical records directly on a ledger makes the system slow and expensive.
2.  **Privacy Requirements**: Different stakeholders (Hospitals vs. Insurers) require distinct access levels.
3.  **Cross-Network Communication**: Data often needs to move between private (off-chain) storage and public (on-chain) validation layers.

## The Solution: A Permissioned Testbed

We developed a testbed using **Hyperledger Fabric** to simulate a secure network between two primary organizations: the **Hospital** and the **Insurance Provider**.

### Core Architecture Components

Our solution followed a "Hybrid Data Management" pattern:
-   **On-Chain (Hyperledger Fabric)**: Stores the metadata, access control lists, and cryptographic hashes of the medical records.
-   **Off-Chain (IPFS)**: Stores the actual medical documents (PDFs/Images). The IPFS CID (Content Identifier) is then anchored on the Fabric ledger.

```

mermaid
graph LR
    subgraph HospitalNode[Hospital Organization]
        H_App[Hospital Client] --> H_Peer[Fabric Peer]
        H_App --> H_IPFS[IPFS Node]
    end

    subgraph InsuranceNode[Insurance Organization]
        I_App[Insurance Client] --> I_Peer[Fabric Peer]
        I_App --> I_IPFS[IPFS Node]
    end

    H_Peer --- I_Peer[Consensus Layer]
    H_IPFS --- I_IPFS[P2P Storage Layer]

    style HospitalNode fill:#f9f,stroke:#333
    style InsuranceNode fill:#bbf,stroke:#333

```

## Benchmarking with Hyperledger Caliper

A critical part of our research was ensuring the system could handle enterprise loads. We used **Hyperledger Caliper** to measure performance metrics:
-   **Throughput (TPS)**: How many transactions the network can process per second.
-   **Latency**: The time taken for a transaction to be finalized.
-   **Success Rate**: Ensuring 100% data integrity under heavy concurrent load.

## Technical Stack

| Category             | Technology                           |
| -------------------- | ------------------------------------ |
| **Blockchain**       | Hyperledger Fabric, Caliper          |
| **Data Storage**     | IPFS Kubo, IPFS-NodeJS               |
| **Databases**        | MongoDB, PostgreSQL                  |
| **Frameworks/Tools** | Node.js, Fabric-SDK-Node, Docker, Git |
| **Environment**      | WSL2, Ubuntu                         |

## Reflections

This internship was more than just a coding exercise; it was a lesson in **Software Engineering Application**. We had to manage complex Docker deployments with multiple peer nodes, handle asynchronous transaction lifecycles in Node.js, and ensure our chaincode (smart contracts) adhered to strict medical data privacy standards.

The project demonstrated that blockchain, when combined with off-chain storage like IPFS, can provide a scalable and secure foundation for the future of global healthcare interoperability.
