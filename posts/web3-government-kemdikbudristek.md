---
title: "Navigating Web3 in Government: My Experience as a Blockchain Developer at Kemdikbudristek"
date: "2024-12-20"
excerpt: "Insights from my internship at the Directorate General of Higher Education (Dikti), focusing on frontend Web3 development, smart contract integration, and collaborating within a large-scale government technical team."
tags: ["Web3", "Blockchain", "Government", "Solidity", "Frontend", "Internship"]
img: "/images/blog/magang-dikti.jpeg"
readingTime: "3 min read"
--- 

## Introduction

People often associate blockchain technology with decentralized finance (DeFi). Its transparency and security make it compelling for government infrastructure. 

From September to December 2024, I served as a **Web3 Developer Intern** at the **Directorate General of Higher Education, Research, and Technology (Dikti), Kemdikbudristek**. This role was an incredible opportunity to apply decentralized solutions within a public institution, specifically focusing on the intersection of frontend engineering and blockchain logic.

![Me and the team during the internship at Kemdikbudristek](/images/blog/magang-dikti.jpeg)

## The Role: Bridging Frontend and Smart Contracts

While my background often leans toward the backend, at Kemdikbudristek I worked deep in the trenches of **Frontend Web3 Development**. My core responsibility was to bridge the gap between user interfaces and Solidity smart contracts.

Developing for a government entity requires a higher level of scrutiny. Security and accessibility are fundamental requirements. I worked extensively with JavaScript frameworks to build client-side functionalities that interact securely with on-chain data.

### Technical Focus: On-Chain Interaction

Ensuring the frontend could handle asynchronous blockchain states gracefully was the key challenge. This involved:
-   Implementing secure wallet connections.
-   Managing transaction lifecycles (pending, success, failure) in the UI.
-   Optimizing contract calls to minimize latency for the end-user.

A simplified hook-based approach for smart contract interactions:

```

javascript
// Example of integrating a smart contract call in a React-based frontend
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { MY_CONTRACT_ABI } from './abi';

function CertificateClaim({ certificateId }) {
  const { config } = usePrepareContractWrite({
    address: '0x...',
    abi: MY_CONTRACT_ABI,
    functionName: 'claimCertificate',
    args: [certificateId],
  });

  const { write, isLoading, isSuccess } = useContractWrite(config);

  return (
    <button disabled={!write || isLoading} onClick={() => write()}>
      {isLoading ? 'Processing...' : 'Claim Digital Certificate'}
      {isSuccess && <span>Success! Check your wallet.</span>}
    </button>
  );
}

```

## Collaborating in a Government Ecosystem

At **Kemdikbudristek**, I learned that large-scale technical projects depend as much on **human coordination** as on code. 

### 1. Discipline and Deadlines

The government sector operates on strict timelines and regulatory requirements. I learned a disciplined approach to time management: consistently meeting internal sprint deadlines and preparing technical deliverables for routine progress meetings with senior stakeholders.

### 2. Technical Adaptability

In such a large technical team, specifications evolve frequently. I remained adaptable, pivoting my frontend integration logic as smart contract requirements were refined. This work strengthened my ability to collaborate within a team, demonstrating effective communication and problem-solving when technical hurdles arose.

### 3. Professional Accountability

Maintaining a strong work ethic was paramount. Every task assigned to me carried a sense of responsibility toward the public sector. Debugging a contract interaction or refining a UI component, I aimed for high-quality results that reflected the institution's commitment to innovation.

## Conclusion

My internship at Dikti Kemdikbudristek was a pivotal experience. I saw that Web3 belongs in government digital transformation. By focusing on reliable frontend-to-blockchain integrations and collaborative discipline, we can build public services that are more transparent and secure.

Thank you to the technical team at DTETI and the Directorate General of Higher Education for this invaluable opportunity.
