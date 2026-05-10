---
title: "PoA vs PoS: A Performance Analysis for Private vs Public Blockchain Use Cases"
date: "2026-02-22"
excerpt: "An analytical deep dive into Proof of Authority (PoA) and Proof of Stake (PoS) consensus mechanisms, based on my UGM undergraduate thesis performance metrics."
tags: ["Blockchain", "Ethereum", "Evaluation", "Academic"]
img: "/images/blog/poa-vs-pos-analysis.png"
readingTime: "3 min read"
--- 

## Introduction

Choosing the right consensus mechanism is the most critical architectural decision when designing a blockchain network. While Proof of Work (PoW) popularized the technology, modern enterprise and scalable public blockchains have largely migrated towards **Proof of Stake (PoS)** and **Proof of Authority (PoA)**.

For my undergraduate thesis at Universitas Gadjah Mada (UGM), supervised by [Ir. Noor Akhmad Setiawan, S.T., M.T., Ph.D., IPM.](https://acadstaff.ugm.ac.id/nasetiawan) and [Dr. Teguh Bharata Adji, S.T., M.T., M.Eng., Ph.D.](https://acadstaff.ugm.ac.id/tba), I conducted an exhaustive performance analysis comparing PoA and PoS. The focus of the research was **DChain (Dikti Chain)**, a national blockchain infrastructure designed for higher education in Indonesia. The goal was to provide empirical data to determine which protocol is most effective for specific organizational needs—specifically contrasting private consortium use cases against public networks.

![Technical illustration comparing Proof of Authority (PoA) and Proof of Stake (PoS) architectures](/images/blog/poa-vs-pos-analysis.png)

## Architecture Overview

Before delving into the metrics, it is vital to understand the fundamental difference in how these two mechanisms achieve consensus.

*   **Proof of Stake (PoS):** Validators commit a financial stake (cryptocurrency) to the network. The probability of being chosen to validate a block is proportional to their stake. It prioritizes decentralization and economic security.
*   **Proof of Authority (PoA):** Validators are explicitly chosen based on their identity and reputation within a consortium. No staking is required. It prioritizes high throughput and absolute known trust over decentralization.

```

mermaid
graph TD
    subgraph PoA[Proof of Authority - Consortium]
        A1(Known Authority Node) -->|Validates| B1[New Block]
        A2(Known Authority Node) -->|Validates| B1
    end

    subgraph PoS[Proof of Stake - Public]
        S1(Staked Node: 32 ETH) -->|High Probability| B2[New Block]
        S2(Staked Node: 1 ETH) -.->|Low Probability| B2
    end

```

## Implementation & Testing Methodology

To conduct a fair comparison, I orchestrated a distributed multi-node environment using Docker and Kubernetes.
1.  **PoA Network:** Configured using the *Clique* consensus engine.
2.  **PoS Network:** Configured using the *Prysm* consensus client.

I utilized **Hyperledger Caliper** to inject traffic into both networks at varying transaction send rates, while monitoring the system stability and resource consumption via **Prometheus and Grafana**.

## Evaluation: The Performance Matrix

The testing focused on three core metrics: Transaction Throughput (successful TPS), Latency (time to finality), and Resource Utilization (CPU/Memory).

| Metric | Proof of Authority (PoA) | Proof of Stake (PoS) |
| :--- | :--- | :--- |
| **Max Throughput** | ≈30 - 40 TPS | ≈60 TPS |
| **Average Latency** | 4.6 seconds | 8.0 seconds |
| **CPU Efficiency** | High (Better) | Moderate |
| **Decentralization** | Low (Federated) | High |
| **Ideal Use Case** | User-interactive academic services | Highly scalable public ledgers |

### Analyzing the Data

1.  **Latency & Responsiveness:** PoA demonstrated vastly superior latency (4.6s vs 8.0s). Because validators are predefined and implicitly trusted, blocks can be sealed almost instantly. In contrast, PoS requires network-wide voting and epoch finalization algorithms, introducing deliberate delay to ensure global consistency.
2.  **Throughput vs. Scale:** Interestingly, the PoS network demonstrated a higher overall throughput capacity (≈60 TPS compared to PoA's 40 TPS) under stress. However, for a system like DChain which prioritizes user-interactive academic services (like issuing certificates), the rapid responsiveness and lower CPU overhead of PoA outweighs the sheer volume throughput of PoS.

## Conclusion

The data from my thesis conclusively shows that there is no "perfect" consensus mechanism—only the right mechanism for the required context. 

If you are building a **Public Blockchain** where censorship resistance and sheer data volume scalability are paramount, the higher throughput of **PoS** makes it the better choice despite its higher latency. However, for a **National Infrastructure Consortium** like DChain where rapid transaction speed (responsiveness) is critical for a smooth user experience, and all participants are known entities, **PoA** decisively remains the most optimal solution.
