---
title: "Navigating Web3 in Government: My Experience as a Blockchain Developer at Kemdikbudristek"
date: "2024-12-20"
excerpt: "Insights from my internship at the Directorate General of Higher Education (Dikti), focusing on frontend Web3 development, smart contract integration, and collaborating within a large-scale government technical team."
tags: ["Web3", "Blockchain", "Government", "Solidity", "Frontend", "Internship"]
img: "/images/blog/magang-dikti.jpeg"
readingTime: "3 min read"
--- 

## Introduction

Blockchain technology is often associated with the fast-paced world of decentralized finance (DeFi). However, its potential for transparency and security makes it equally compelling for government infrastructure. 

From September to December 2024, I served as a **Web3 Developer Intern** at the **Directorate General of Higher Education, Research, and Technology (Dikti), Kemdikbudristek**. This role was an incredible opportunity to apply decentralized solutions within a public institution, specifically focusing on the intersection of frontend engineering and blockchain logic.

![Me and the team during the internship at Kemdikbudristek](/images/blog/magang-dikti.jpeg)

## The Role: Bridging Frontend and Smart Contracts

While my background often leans towards the backend, my time at Kemdikbudristek was deep in the trenches of **Frontend Web3 Development**. My core responsibility was to bridge the gap between high-level user interfaces and low-level Solidity smart contracts.

Developing for a government entity requires a higher level of scrutiny. Security and accessibility aren't just features—they are fundamental requirements. I worked extensively with JavaScript frameworks to build client-side functionalities that could interact securely with on-chain data.

### Technical Focus: On-Chain Interaction

The challenge was not just writing Solidity, but ensuring the frontend could handle asynchronous blockchain states gracefully. This involved:
-   Implementing secure wallet connections.
-   Managing transaction lifecycles (pending, success, failure) in the UI.
-   Optimizing contract calls to minimize latency for the end-user.

Here is a simplified example of how we handled smart contract interactions using a modern hook-based approach:

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

Working at **Kemdikbudristek** taught me that large-scale technical projects are as much about **human coordination** as they are about code. 

### 1. Discipline and Deadlines

The government sector operates on strict timelines and regulatory requirements. I learned the importance of a disciplined approach to time management—consistently meeting internal sprint deadlines and ensuring that our technical deliverables were ready for routine progress meetings with senior stakeholders.

### 2. Technical Adaptability

In such a large technical team, specifications can evolve. I had to remain adaptable, frequently pivots my frontend integration logic as smart contract requirements were refined. This experience solidified my ability to work within a team environment, demonstrating effective communication and problem-solving skills when technical hurdles arose.

### 3. Professional Accountability

Maintaining a strong work ethic was paramount. Every task I was assigned carried a sense of responsibility toward the public sector. Whether it was debugging a contract interaction or refining a UI component, I aimed for high-quality results that reflected the institution's commitment to innovation.

## Conclusion

My internship at Dikti Kemdikbudristek was a pivotal experience. It proved that Web3 has a seat at the table in government digital transformation. By focusing on reliable frontend-to-blockchain integrations and fostering a culture of collaborative discipline, we can build public services that are more transparent, secure, and future-proof.

Thank you to the technical team at DTETI and the Directorate General of Higher Education for this invaluable opportunity.
