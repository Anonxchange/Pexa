export interface SupportStep {
  title: string;
  description: string;
}

export interface SupportSection {
  heading: string;
  content: string;
  steps?: SupportStep[];
  videoUrl?: string; // YouTube embed URL (use /embed/ format)
  tip?: string;      // Optional callout tip box
  warning?: string;  // Optional warning box
}

export interface SupportArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  readTime: string;
  sections: SupportSection[];
  related?: string[];
}

export interface SupportCategory {
  slug: string;
  title: string;
  description: string;
  articleSlugs: string[];
}

// ─── Articles ──────────────────────────────────────────────────────────────

export const supportArticles: Record<string, SupportArticle> = {
  "get-started-with-pexly": {
    slug: "get-started-with-pexly",
    title: "Get started with Pexly",
    description: "Learn the basics of Pexly — what it is, what you can do, and how to set up your account from scratch.",
    category: "Get started",
    categorySlug: "get-started",
    readTime: "6 min read",
    sections: [
      {
        heading: "What is Pexly?",
        content:
          "Pexly is a non-custodial, decentralized software platform that gives you full control of your digital assets — all in one place. Unlike traditional exchanges or banks, Pexly never holds your funds, never takes custody of your private keys, and never requires you to trust a third party with your money. Everything you do on Pexly happens directly on the blockchain, which means your transactions are transparent, verifiable, and final.\n\nWe built Pexly because the crypto space was fragmented. You needed one app to trade, another to stake, another to buy gift cards, and yet another to explore on-chain data. Pexly combines all of these into a single, clean experience so you can manage your entire crypto life without switching between a dozen different tools.\n\nPexly is available on web at pexly.app. Your account is tied to your wallet, not an email address, which means there's no central database storing your credentials. Your keys live on your device, encrypted with your password.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        heading: "What can you do on Pexly?",
        content:
          "Pexly is a full-featured crypto platform. Here's a breakdown of every major feature available to you as a user:",
        steps: [
          {
            title: "Spot and Perpetual Trading",
            description:
              "Trade cryptocurrency on live spot markets or open leveraged perpetual positions across all major pairs. Pexly's trading engine pulls real-time price feeds and connects to deep liquidity pools, so you get tight spreads whether you're buying a small amount or executing a large position. Perpetual contracts let you speculate on price movements with up to 10x leverage without an expiry date.",
          },
          {
            title: "Buy Crypto with Card or Bank Transfer",
            description:
              "Don't have crypto yet? Use Pexly's built-in on-ramp to purchase cryptocurrency instantly using a debit or credit card, or initiate a bank transfer for larger amounts. Supported currencies include USD, EUR, GBP, and many more. Funds land directly in your Pexly wallet within minutes for card payments, or 1-3 business days for bank transfers depending on your region.",
          },
          {
            title: "Instant Token Swaps",
            description:
              "Already have one token and need another? The Swap feature lets you exchange any supported token for another at real-time market rates with minimal fees — directly from your wallet. There's no order book to navigate; Pexly's liquidity aggregator finds the best available rate across multiple decentralized exchanges and routes your swap automatically.",
          },
          {
            title: "Earn with Staking",
            description:
              "Put your idle crypto to work. Pexly offers both liquid staking (receive pSOL tokens that accrue rewards while remaining tradeable) and native staking (delegate SOL directly to validators for higher APY). Staking rewards are calculated continuously and distributed according to each network's reward schedule. You can start staking with any amount.",
          },
          {
            title: "Price Predictions",
            description:
              "The Predictions feature lets you take positions on whether an asset's price will be higher or lower at a future point in time. It's a straightforward way to participate in market movements without trading derivatives. Correct predictions earn you a share of the prize pool funded by the opposing side.",
          },
          {
            title: "Gift Cards and Utility Bills",
            description:
              "Spend your crypto in the real world without converting it to fiat first. The Pexly Shop lets you purchase digital gift cards from over 1,000 brands including Amazon, Apple, Google Play, Netflix, Steam, and many more. You can also pay utility bills, top up mobile credit, and cover household expenses — all directly from your crypto balance.",
          },
          {
            title: "Blockchain Explorer",
            description:
              "The built-in explorer lets you search any transaction hash, wallet address, or block on supported networks. You can verify incoming deposits, audit smart contract addresses before interacting with them, and track the status of any on-chain transaction. This removes the need to use a separate block explorer tool.",
          },
          {
            title: "Crypto-Native Marketplace",
            description:
              "The Pexly Shop isn't just for gift cards. It's also a peer-to-peer marketplace where verified sellers can list products and services, and buyers can purchase them directly with crypto. The entire checkout flow is on-chain, which means no credit card fees and no chargebacks.",
          },
        ],
        tip: "New to crypto? Start with the 'Buy Crypto' section to get your first tokens, then explore staking to earn passive yield on what you hold.",
      },
      {
        heading: "Is Pexly safe to use?",
        content:
          "Security is at the core of Pexly's design. Because Pexly is non-custodial, we never hold your funds. Your private keys are generated locally on your device and encrypted with your password before being stored. We never transmit your private keys to our servers — not even in encrypted form.\n\nEvery transaction you make must be explicitly signed by your wallet before it's broadcast to the network. This means no one, including Pexly employees, can initiate a transaction on your behalf. The trade-off is that you are responsible for your own security. If you lose your recovery phrase and forget your password, we cannot recover your wallet.\n\nWe strongly recommend enabling two-factor authentication (2FA) immediately after creating your account. We also recommend writing your recovery phrase on paper — not storing it digitally — and keeping it in a secure, offline location.",
        warning: "Pexly support will NEVER message you first, ask for your recovery phrase, or request remote access to your device. Any message claiming to be from Pexly that asks for these things is a scam.",
      },
      {
        heading: "How do I get started?",
        content:
          "Getting started takes less than five minutes. Visit pexly.app, click 'Get Started', and follow the wallet creation flow. You'll set a password, receive your recovery phrase, and be taken directly to your wallet dashboard. From there, you can deposit crypto by sharing your wallet address, or buy crypto directly using your debit card.",
        steps: [
          {
            title: "Create your wallet",
            description: "Go to pexly.app and click 'Get Started'. Choose 'Create new wallet', set a strong password of at least 12 characters, and write down your 12 or 24-word recovery phrase on paper immediately.",
          },
          {
            title: "Enable 2FA",
            description: "Go to Account Settings and enable two-factor authentication using an authenticator app. This single step dramatically reduces the risk of unauthorised access to your account.",
          },
          {
            title: "Add funds",
            description: "Either copy your wallet address from the Wallet section and have someone send you crypto, or use the 'Buy Crypto' flow to purchase directly with a debit/credit card or bank transfer.",
          },
          {
            title: "Start exploring",
            description: "Once you have funds, you can swap tokens, stake for rewards, browse the Shop, or start trading. Each section has its own walkthrough — use the Help Center search bar any time you have questions.",
          },
        ],
      },
      {
        heading: "What networks does Pexly support?",
        content:
          "Pexly supports multiple blockchain networks including Solana, Ethereum, BNB Chain, Polygon, Arbitrum, and Optimism. Each network has its own native token used to pay transaction fees (SOL, ETH, BNB, MATIC, ETH on Arbitrum/Optimism). When sending or receiving tokens, always confirm you're using the same network on both sides of the transfer. Sending tokens on the wrong network can result in permanent loss.",
        tip: "Solana is the fastest and cheapest network on Pexly. If you're new to crypto, starting with Solana is a good choice for low fees and near-instant transactions.",
      },
    ],
    related: ["create-wallet", "receive-tokens", "get-help"],
  },

  "create-wallet": {
    slug: "create-wallet",
    title: "Create a new Pexly wallet",
    description: "A complete, step-by-step guide to creating your first Pexly wallet and securing your recovery phrase properly.",
    category: "Get started",
    categorySlug: "get-started",
    readTime: "7 min read",
    sections: [
      {
        heading: "Before you start",
        content:
          "Creating a crypto wallet is different from signing up for a regular app. There's no 'forgot password' button that sends a link to your email. Your recovery phrase — a set of 12 or 24 words generated when you create your wallet — is the only thing that can restore access to your funds if you lose your device, forget your password, or need to move your wallet to a different device.\n\nBefore you start the creation process, find a pen and at least two sheets of paper (one is your main copy, the second is your backup). Choose a secure location to store each copy separately — a fireproof safe, a locked drawer, or a safety deposit box are all good options. Never photograph your recovery phrase, type it into a notes app, or save it in cloud storage. The moment it exists in digital form, it becomes vulnerable.\n\nAlso make sure you're on the official Pexly website: pexly.app. Double-check the URL in your browser's address bar. Phishing sites often look identical to the real site but use slightly different domains like pexIy.app (capital i instead of l) or pexly-app.com.",
        warning: "Never create a wallet on a public computer, a shared network (like a coffee shop WiFi), or a device that may have malware. Your private key is generated during this process and a compromised device can steal it before it's encrypted.",
      },
      {
        heading: "Step-by-step: creating your wallet",
        content:
          "Follow these steps exactly. Do not skip the recovery phrase backup step — it cannot be shown again after you dismiss the screen.",
        steps: [
          {
            title: "Go to pexly.app and click 'Get Started'",
            description:
              "Find the 'Get Started' button in the top-right corner of the homepage and click it. You'll be taken to the wallet creation screen. If you already have an existing wallet from another app, you can choose 'Import wallet' instead — but for a brand new wallet, select 'Create new wallet'.",
          },
          {
            title: "Set a strong password",
            description:
              "Your password encrypts your private key on your device. Use at least 12 characters and include a mix of uppercase letters, lowercase letters, numbers, and special characters. A password manager like Bitwarden or 1Password is ideal for generating and storing a strong, unique password. Avoid using passwords you've used anywhere else. This password only unlocks your wallet on this specific device — it does not protect your funds if someone has your recovery phrase.",
          },
          {
            title: "Receive and write down your recovery phrase",
            description:
              "After setting your password, Pexly will display your recovery phrase — either 12 or 24 words in a specific order. Write every word down on paper, in the exact order shown. Number each word (1 through 12 or 1 through 24) so you know the sequence. Do this slowly and carefully — a single wrong word or wrong order makes the phrase useless.",
          },
          {
            title: "Make a second paper copy",
            description:
              "Before dismissing the recovery phrase screen, write a second copy on a separate sheet of paper. This is your backup in case the first copy is lost, damaged, or destroyed. Store your two copies in two physically separate locations — ideally in different buildings. If you want the most durable backup possible, consider a metal backup plate, which is fireproof and waterproof.",
          },
          {
            title: "Confirm your recovery phrase",
            description:
              "Pexly will ask you to re-enter certain words from your recovery phrase to confirm you've written it down. This is not a test you can pass by memory — look at your paper copy. If you make a mistake here, go back and carefully re-check what you wrote against the screen.",
          },
          {
            title: "Complete setup and enable 2FA",
            description:
              "Once confirmed, you'll be taken to your wallet dashboard. Your setup is not complete until you've also enabled two-factor authentication. Go to Account Settings, open the Security tab, and follow the 2FA setup flow. Use an authenticator app rather than SMS — authenticator apps are significantly harder to compromise.",
          },
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tip: "Pexly will only ever show your recovery phrase once during wallet creation. If you accidentally dismiss the screen before writing it down, you will need to create a new wallet and cannot recover the original.",
      },
      {
        heading: "Understanding your recovery phrase",
        content:
          "Your recovery phrase (also called a seed phrase or mnemonic) is a human-readable representation of your wallet's master private key. It's standardized using the BIP-39 protocol, which means the same 12 or 24 words in the same order will regenerate the exact same wallet on any compatible app, not just Pexly.\n\nThis is powerful — it means if Pexly ever ceased to exist, you could import your recovery phrase into any other non-custodial wallet (like MetaMask, Phantom, or Trust Wallet) and still have full access to your funds. It also means anyone who finds your phrase has complete and instant access to your funds from any device, anywhere in the world.\n\nThink of your recovery phrase as the master key to a safe. Your password is the alarm code — it matters for day-to-day use, but someone with the master key can bypass it entirely.",
        warning: "If anyone — even someone claiming to be Pexly support — asks for your recovery phrase, they are attempting to steal your funds. Legitimate support staff have no ability to view or request your phrase. Hang up immediately and report the contact to support@pexly.app.",
      },
      {
        heading: "What happens if I lose my recovery phrase?",
        content:
          "If you lose your recovery phrase but still have access to your device and remember your password, you can continue using your wallet normally. However, you should immediately create a new wallet, transfer all your funds to the new wallet, and properly back up the new recovery phrase.\n\nIf you lose both your recovery phrase and access to your device (or forget your password), your funds are permanently inaccessible. Pexly has no backdoor, no master key, and no way to recover your wallet. This is by design — it's what makes your wallet truly yours. No company or government can freeze or confiscate your funds, but it also means there's no safety net if you lose your phrase.\n\nThis is why two copies in two separate locations is the minimum recommended backup strategy for your recovery phrase.",
      },
      {
        heading: "Can I have multiple wallets?",
        content:
          "Yes. Pexly supports creating or importing multiple wallet accounts within the same app. Each account has its own set of addresses and its own independent balance. You might use one wallet for long-term savings (cold storage), a second for day-to-day trading, and a third for interacting with DeFi protocols. Each new wallet you create will generate its own unique recovery phrase. Keep each one backed up separately.",
        tip: "For most users, a single well-secured wallet is sufficient. Multiple wallets add complexity. Focus on getting your first wallet's security right before adding more.",
      },
    ],
    related: ["receive-tokens", "send-tokens", "get-started-with-pexly"],
  },

  "receive-tokens": {
    slug: "receive-tokens",
    title: "Receive tokens in Pexly",
    description: "How to find your wallet address, generate a QR code, and safely receive cryptocurrency from any exchange or wallet.",
    category: "Get started",
    categorySlug: "get-started",
    readTime: "5 min read",
    sections: [
      {
        heading: "How receiving crypto works",
        content:
          "Receiving cryptocurrency works the same way as receiving an email — you share your address with the sender, and they initiate the transfer. Unlike email addresses, each blockchain network has its own separate address format. Your Pexly wallet holds addresses for every supported network, but you must use the correct address for the correct network.\n\nFor example, your Ethereum address looks like '0x1a2b3c...' while your Solana address looks like '4B2a9C...' (base-58 encoded). These addresses are public — it's completely safe to share them. Anyone can see your balance and transaction history on a block explorer using just your address, but they cannot move any funds without your private key.",
      },
      {
        heading: "Finding your receive address",
        content:
          "Every token in your Pexly wallet has its own receive flow that shows both your address and a QR code. Here's how to access it:",
        steps: [
          {
            title: "Open the Wallet section",
            description:
              "Navigate to the Wallet tab from the main menu. You'll see a list of all your token balances. If you don't see a specific token, it may not be added to your portfolio yet — you can add it by searching for it in the token list.",
          },
          {
            title: "Select the token you want to receive",
            description:
              "Tap or click the specific token you want to receive. For example, if someone is sending you USDT, tap on USDT in your wallet. If you're receiving Bitcoin, tap on BTC. This step ensures you're shown the correct address for that specific asset.",
          },
          {
            title: "Tap the 'Receive' button",
            description:
              "On the token detail screen, tap 'Receive'. You'll see a QR code and your full wallet address displayed below it. The network is shown clearly at the top of the screen — double-check this matches the network the sender will be using.",
          },
          {
            title: "Select the correct network if prompted",
            description:
              "Some tokens like USDT and USDC exist on multiple networks simultaneously. If you're receiving USDT, for example, you'll be asked which network: Ethereum, Solana, BNB Chain, Polygon, etc. Ask the sender which network they're sending from and select the matching one.",
          },
          {
            title: "Share your address or QR code",
            description:
              "Copy the address using the copy button and paste it into a message to the sender, or have the sender scan your QR code directly from their wallet app. If you're receiving from an exchange, paste the address into the withdrawal form on that exchange. Always double-check the first and last 6 characters of the address after pasting.",
          },
        ],
        tip: "Always verify the full address after pasting it somewhere. Some malware (clipboard hijackers) replace copied addresses with attacker-controlled ones. Paste, then check the first 6 and last 6 characters against the original.",
      },
      {
        heading: "Network compatibility: the most important rule",
        content:
          "This is the most common source of lost funds in all of crypto. Always make sure the network you're receiving on matches the network the sender is sending from.\n\nIf someone sends ETH on the Ethereum network and you give them your BNB Chain address, you may lose your funds permanently or require complex technical recovery steps. If someone sends SOL and you give them an Ethereum address, the transaction will fail or the funds will be lost depending on the sending platform.\n\nAs a general rule: ask the sender which network they'll be using before sharing your address, and select that exact same network in your Pexly receive screen. If in doubt, ask them to confirm the network before sending a large amount — test with a small amount first.",
        warning: "Sending tokens to the wrong network address can result in permanent loss of funds. Neither Pexly nor the sending platform can reverse an on-chain transaction once it's confirmed.",
      },
      {
        heading: "How long does it take for funds to arrive?",
        content:
          "Transaction confirmation times vary by network. Here's what to expect for each major network supported by Pexly:",
        steps: [
          {
            title: "Solana",
            description:
              "Solana is nearly instant. Most transactions confirm in under 5 seconds. If you've been waiting more than a minute, check the transaction hash on the Pexly explorer to verify the sender actually broadcast the transaction.",
          },
          {
            title: "Ethereum",
            description:
              "Ethereum transactions typically confirm within 15 seconds to 3 minutes depending on gas prices and network congestion. During periods of high activity, confirmation times can stretch to 10-15 minutes. Your Pexly wallet will show the pending status while it's awaiting confirmation.",
          },
          {
            title: "Bitcoin",
            description:
              "Bitcoin is the slowest of the major networks. Most exchanges require 1 to 3 confirmations, and each Bitcoin block takes approximately 10 minutes. Expect 10 to 40 minutes for standard transactions. During mempool congestion, low-fee transactions can take hours or even days.",
          },
          {
            title: "BNB Chain, Polygon, Arbitrum, Optimism",
            description:
              "These EVM-compatible networks typically confirm within 5 to 30 seconds. They're faster and cheaper than Ethereum mainnet while using the same address format.",
          },
        ],
        tip: "If a deposit seems stuck, use the transaction hash provided by the sender to look it up in the Pexly blockchain explorer. If it shows as confirmed on-chain but isn't appearing in your wallet, contact support with the transaction hash.",
      },
      {
        heading: "What if I gave the wrong address?",
        content:
          "If the transaction hasn't been sent yet, simply share the correct address with the sender. If the transaction has already been broadcast and confirmed on-chain, it cannot be reversed. Blockchain transactions are final by design — there is no central authority to call and ask for a reversal.\n\nIn some specific cases, sending to the wrong address on the same network may be recoverable if you happen to control the private key for that address, but this is an advanced technical scenario. In most cases, sending to the wrong address means the funds are permanently lost. This is why careful address verification before sending is essential.",
      },
    ],
    related: ["send-tokens", "create-wallet", "buy-tokens"],
  },

  "shop-guide": {
    slug: "shop-guide",
    title: "How to buy in the Pexly Shop",
    description: "A complete guide to browsing, purchasing, and getting the most out of the Pexly crypto-native marketplace.",
    category: "Shop",
    categorySlug: "shop",
    readTime: "6 min read",
    sections: [
      {
        heading: "What is the Pexly Shop?",
        content:
          "The Pexly Shop is a crypto-native marketplace where you can discover and purchase products and services from verified sellers worldwide, paying entirely with cryptocurrency from your Pexly wallet. It covers two distinct areas: a digital goods marketplace (where independent sellers list their products and services), and the gift card and bills store (where Pexly itself sells gift cards from thousands of brands and lets you pay utility bills).\n\nBecause everything is paid with crypto on-chain, there are no credit card processing fees, no currency conversion fees, and no requirement to provide your card details to any third party. Payments settle instantly on the blockchain. Pexly takes a small platform fee on marketplace transactions, which is shown to you before you confirm any purchase.\n\nThe Shop is accessible to all Pexly users. To sell in the marketplace, you'll need to complete at least Level 2 identity verification.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        heading: "How to browse and search the Shop",
        content:
          "You can browse the Shop in several ways — by category, by search, or by exploring featured and trending listings. Here's how to find what you're looking for:",
        steps: [
          {
            title: "Open the Shop from the navigation menu",
            description:
              "Click or tap 'Shop' in the main navigation bar. You'll land on the Shop homepage which features curated categories, trending listings, and a search bar at the top.",
          },
          {
            title: "Browse by category",
            description:
              "Categories include Electronics, Digital Services, Gift Cards, Gaming, Software, Creative Services, and more. Each category page shows listings sorted by relevance and recency.",
          },
          {
            title: "Use the search bar",
            description:
              "Type what you're looking for in the search bar at the top of the Shop. Results show matching listings with price, seller rating, and a brief description. You can filter results by price range, network, and seller verification level.",
          },
          {
            title: "Check seller profiles",
            description:
              "Clicking a listing takes you to the product detail page, which shows the seller's profile, their overall rating, number of completed transactions, and when they joined. Favor sellers with a high rating, many completed sales, and active recent transactions.",
          },
        ],
      },
      {
        heading: "How to complete a purchase",
        content:
          "Purchasing from the Pexly Shop is straightforward, but there are a few things to check before confirming payment to protect yourself.",
        steps: [
          {
            title: "Read the listing carefully",
            description:
              "Before purchasing, read the full product description, the delivery method (digital download, email delivery, physical shipping, etc.), estimated delivery time, and any conditions or restrictions. If anything is unclear, use the 'Message Seller' button on the listing page to ask questions before buying.",
          },
          {
            title: "Click 'Buy Now'",
            description:
              "On the product detail page, click 'Buy Now'. You'll see a checkout summary showing the item price, the network fee, and the Pexly platform fee. The total is shown in both crypto and an approximate fiat equivalent.",
          },
          {
            title: "Confirm your payment",
            description:
              "Review all the details on the confirmation screen and tap 'Confirm'. Your wallet will sign the transaction and broadcast it to the network. For Solana-based payments, confirmation is near-instant. For Ethereum-based payments, it may take a few minutes.",
          },
          {
            title: "Track your order",
            description:
              "After purchase, go to Shop and then Your Orders to view the status of your purchase. The seller will receive a notification and is expected to fulfill the order according to their listed timeframe. You can message the seller directly from your order page.",
          },
          {
            title: "Leave a review",
            description:
              "Once you receive your order, leave an honest review for the seller. Reviews are the backbone of trust in the Pexly marketplace and help other buyers make informed decisions.",
          },
        ],
        tip: "For high-value purchases from new sellers, consider messaging the seller before buying to gauge their responsiveness. A seller who responds quickly and professionally is a good sign.",
      },
      {
        heading: "Gift cards and bill payments",
        content:
          "The gift card store is operated directly by Pexly, not third-party sellers, which means there's no seller risk. Browse over 1,000 brands including Amazon, Apple, Google Play, Netflix, Spotify, Steam, PlayStation, Uber, Airbnb, and many more. After purchase, the gift card code is delivered digitally to your Pexly account immediately after the transaction confirms.\n\nFor bill payments and mobile top-ups, enter your account number or phone number, select the amount, and pay with crypto. Supported services include major utility providers, telecom companies, and internet service providers across dozens of countries. Bill payments typically process within a few minutes and are credited to your account within 24 hours.",
        tip: "Gift card purchases are instant and irreversible. Make sure you select the correct region for your gift card — an Amazon US gift card cannot be used on Amazon UK, for example.",
      },
      {
        heading: "Buyer protection and dispute resolution",
        content:
          "Crypto transactions on-chain are irreversible once confirmed. This is a fundamental property of blockchain technology and Pexly cannot reverse a completed transaction. However, we take marketplace integrity seriously and have processes in place for buyer protection.\n\nIf a seller fails to deliver what was advertised, does not deliver within the stated timeframe, or delivers something materially different from the listing, you can file a dispute from your Order page within 7 days of the expected delivery date. Include screenshots, the transaction hash, and a clear description of the issue. Our support team reviews disputes and can take action against sellers, including removing their listings and flagging their accounts.\n\nBefore filing a dispute, always try messaging the seller first — most issues are resolved quickly through direct communication.",
        warning: "Be cautious of listings with prices significantly below market value. If a deal seems too good to be true, it usually is. Verify the seller's reputation before purchasing anything of significant value.",
      },
    ],
    related: ["sell-on-pexly", "buy-tokens", "send-tokens"],
  },

  "sell-on-pexly": {
    slug: "sell-on-pexly",
    title: "Sell on Pexly — how to post a listing",
    description: "Everything you need to know about listing products and services in the Pexly marketplace and getting paid in crypto.",
    category: "Shop",
    categorySlug: "shop",
    readTime: "7 min read",
    sections: [
      {
        heading: "Who can sell on Pexly?",
        content:
          "Any Pexly user who has completed Level 2 identity verification can create listings in the marketplace. Level 2 verification requires submitting a government-issued photo ID and completing a selfie verification. This verification step exists to maintain the quality and safety of the marketplace, protect buyers, and comply with applicable regulations.\n\nIf you haven't completed verification yet, go to Account Settings, then Verification, and follow the prompts. The process typically takes between a few minutes and 24 hours depending on the volume of verification requests at the time.",
        tip: "Completing identity verification also unlocks higher transaction limits for buying crypto and using the on-ramp features, so it's worth doing even if you don't plan to sell immediately.",
      },
      {
        heading: "Creating your first listing",
        content:
          "Good listings are clear, accurate, and include enough detail for the buyer to make an informed decision without needing to contact you. Here's the full listing creation flow:",
        steps: [
          {
            title: "Go to Shop and click 'Post an Ad'",
            description:
              "Open the Shop section from the navigation menu and look for the 'Post an Ad' button in the top-right area. You can also navigate directly to /shop/post. You'll be taken to the listing creation form.",
          },
          {
            title: "Choose your listing type",
            description:
              "Select Fixed Price for a set sale amount where the first buyer can purchase immediately at the listed price. Select Auction to let buyers place competing bids over a set time period — good for unique or hard-to-value items. Fixed price is recommended for most sellers, especially when starting out, as it requires less management.",
          },
          {
            title: "Write a clear, detailed title",
            description:
              "Your title is the first thing buyers see in search results and category pages. Be specific and descriptive. Include the brand, model, condition, and key features where relevant. For example, 'Adobe Photoshop 2024 License Key (1 Year, Windows/Mac)' is much better than 'Photoshop License'.",
          },
          {
            title: "Write a thorough description",
            description:
              "Use the description to answer every question a buyer might have before they need to ask. Include: what exactly is being sold, the condition, what's included, the delivery method and estimated delivery time, any limitations or restrictions, and your refund or exchange policy. The more detail you provide, the fewer messages you'll receive and the higher your conversion rate will be.",
          },
          {
            title: "Set your price in cryptocurrency",
            description:
              "Enter your asking price in your chosen cryptocurrency. The listing will automatically display the approximate fiat equivalent to buyers based on the current exchange rate. If you're selling something with a stable fiat value (like a $50 gift card), you may want to adjust your crypto price as rates move — or consider accepting a stablecoin like USDC or USDT to avoid volatility.",
          },
          {
            title: "Upload high-quality photos",
            description:
              "Add at least 3 clear photos of your product for physical items. For digital products, include screenshots of the product, proof of authenticity, or example work. Listings with good photos receive significantly more views and sell faster. Maximum file size is 10MB per image and we support JPEG, PNG, and WebP formats.",
          },
          {
            title: "Set your delivery method and timeframe",
            description:
              "Specify how you'll deliver the product (email, download link, physical shipping, etc.) and how long delivery will take. Be realistic and slightly conservative — it's better to deliver faster than promised than to miss a stated deadline. Buyers can open disputes if delivery takes significantly longer than advertised.",
          },
          {
            title: "Submit for review",
            description:
              "Click 'Post Listing' to submit. Your listing will be reviewed by our team against the marketplace rules. Most listings are approved and published within a few minutes. You'll receive a notification once your listing is live.",
          },
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        heading: "How you get paid",
        content:
          "When a buyer completes a purchase, the crypto payment is released directly to your Pexly wallet after a short holding period. For digital goods with instant delivery, payment is typically released within 24 hours of the buyer confirming receipt (or automatically if they don't respond). For physical goods or longer-delivery items, payment is held in escrow until delivery is confirmed.\n\nThe Pexly platform fee is deducted at the time of release. There are no monthly subscription fees or listing fees — Pexly only earns when you earn. Your received funds appear immediately in your wallet and can be spent, swapped, staked, or withdrawn.",
        tip: "Keep your Pexly wallet funded with enough to cover network fees for any platform interactions. The fees are tiny on Solana (fractions of a cent), but on Ethereum mainnet they can be noticeable.",
      },
      {
        heading: "Listing rules and prohibited items",
        content:
          "All listings must comply with Pexly's Terms of Service and marketplace policies. We have zero tolerance for prohibited items and will remove listings immediately, with repeated violations resulting in permanent account suspension and potential referral to law enforcement.\n\nProhibited items and services include: illegal goods or services of any kind, counterfeit or infringing products, financial instruments and investment schemes, prescription medications without proper licensing, weapons and related accessories in many jurisdictions, adult content, anything involving money laundering, and any product that violates applicable laws in the seller's or buyer's jurisdiction.\n\nIf you're unsure whether your listing is allowed, contact support before posting rather than having it removed after the fact.",
        warning: "Attempting to use the Pexly marketplace for fraudulent or illegal activity will result in immediate account suspension and your information being shared with relevant authorities.",
      },
      {
        heading: "Tips for becoming a top-rated seller",
        content:
          "Your seller reputation is your most valuable asset in the marketplace. Here's how to build it:",
        steps: [
          {
            title: "Deliver faster than promised",
            description:
              "If you say delivery takes 24 hours, aim for 12. If you say 48 hours, deliver in 24. Consistently early deliveries lead to positive reviews that mention your speed, which builds trust with future buyers.",
          },
          {
            title: "Communicate proactively",
            description:
              "If something unexpected comes up and delivery will be delayed, message the buyer immediately and explain the situation. Buyers are far more forgiving of delays when they're informed in advance than when they're left wondering.",
          },
          {
            title: "Keep listings accurate and up to date",
            description:
              "Remove listings for items you've sold or no longer have. Update prices when market conditions change. Misleading listings lead to disputes and negative reviews even when the underlying product is fine.",
          },
          {
            title: "Respond quickly to messages",
            description:
              "Try to respond to buyer messages within a few hours. Pexly shows your typical response time on your seller profile, and slow response times deter buyers.",
          },
        ],
      },
    ],
    related: ["shop-guide", "send-tokens", "security-tips"],
  },

  "send-tokens": {
    slug: "send-tokens",
    title: "Send tokens from Pexly",
    description: "A detailed guide to safely sending cryptocurrency from your Pexly wallet to another address, exchange, or person.",
    category: "Get started",
    categorySlug: "get-started",
    readTime: "6 min read",
    sections: [
      {
        heading: "Before you send: the most important checks",
        content:
          "Sending cryptocurrency is irreversible. Once your transaction is confirmed on the blockchain, it cannot be recalled, stopped, or reversed by anyone including Pexly. This is a fundamental property of blockchain technology and it's what makes crypto trustless and censorship-resistant — but it also means mistakes are permanent.\n\nBefore sending any amount, verify three things: the recipient's address is correct (character by character if possible), the network matches on both ends, and the amount is what you intend to send including any network fees. For large amounts, many experienced crypto users send a small test transaction first and confirm the recipient receives it before sending the remainder.",
        warning: "Never send funds based solely on a screenshot of a wallet address. Wallet addresses can be replaced by clipboard-hijacking malware. Always verify the address directly with the recipient through a trusted channel after pasting.",
      },
      {
        heading: "How to send tokens step by step",
        content:
          "Here's the complete process for sending any token from your Pexly wallet:",
        steps: [
          {
            title: "Open Wallet and select the token",
            description:
              "Go to the Wallet section from the main navigation. You'll see your full list of token balances. Tap the token you want to send — for example, tap on BTC if you're sending Bitcoin, or tap on ETH if you're sending Ethereum.",
          },
          {
            title: "Tap the 'Send' button",
            description:
              "On the token detail page, tap 'Send'. This opens the send form where you'll enter all the details of your transfer.",
          },
          {
            title: "Enter or paste the recipient's address",
            description:
              "Type or paste the recipient's wallet address into the address field. If you're pasting it, verify the first 6 and last 6 characters match the address the recipient shared with you. You can also tap the QR code icon to scan the recipient's QR code with your camera — this eliminates the risk of manual entry errors.",
          },
          {
            title: "Select the correct network",
            description:
              "For multi-chain tokens like USDT, USDC, or ETH, you must select which network you're sending on. Ask the recipient which network their wallet is set up to receive on and select that exact network. The address format can sometimes look similar across networks — don't assume the network from the address format alone.",
          },
          {
            title: "Enter the amount to send",
            description:
              "Type the amount you want to send. You can switch between entering the crypto amount and the fiat equivalent using the toggle. The 'Max' button will calculate the maximum sendable amount after accounting for network fees — useful when you want to completely empty a wallet balance.",
          },
          {
            title: "Review the estimated network fee",
            description:
              "Pexly will display the estimated network fee before you confirm. On Solana, this is typically less than $0.01. On Ethereum mainnet, fees can range from a few dollars to tens of dollars depending on network congestion. On Layer 2 networks like Arbitrum or Optimism, fees are typically under $0.10. You may have the option to choose between Standard and Fast transaction speeds — Fast costs more in fees but prioritizes your transaction.",
          },
          {
            title: "Double-check everything and confirm",
            description:
              "On the confirmation screen, verify the recipient address, network, amount, and fee one final time. If anything looks wrong, go back and correct it. Once you're satisfied everything is correct, tap 'Confirm Send'. The transaction is broadcast to the network immediately.",
          },
        ],
        tip: "Add frequently used addresses to your Pexly address book. This lets you send to trusted recipients without typing or pasting the address each time, reducing the risk of errors.",
      },
      {
        heading: "Understanding network fees",
        content:
          "Network fees (also called gas fees on Ethereum-based networks) are paid to the validators or miners who process and confirm your transaction. These fees don't go to Pexly — they go directly to the network participants securing the blockchain.\n\nFees vary significantly by network and by current network congestion. Solana fees are almost always negligible (under $0.01 per transaction regardless of amount). Ethereum mainnet fees fluctuate based on demand — during high activity periods like NFT mints or DeFi farming events, gas prices can spike dramatically. Layer 2 solutions like Arbitrum and Optimism offer Ethereum-compatible transactions at a fraction of the cost.\n\nYour fee is the same whether you send $10 or $10,000 worth of tokens. This is why crypto is especially efficient for large transfers — sending $100,000 via a bank wire might cost $50 in fees plus 1-3 business days, while the same transfer on Solana costs fractions of a cent and confirms in seconds.",
      },
      {
        heading: "What to do if a transaction is pending for a long time",
        content:
          "On Solana and most fast networks, a transaction that doesn't confirm within a minute has likely failed and you can try again. On Ethereum mainnet, transactions can remain pending for hours or even days if the gas fee you paid was too low relative to current demand.\n\nTo check your transaction status, find the transaction hash (TXID) in your Pexly transaction history and look it up using the built-in blockchain explorer. If the transaction is still shown as 'Pending', it's still in the mempool waiting to be picked up by a validator. If it's shown as 'Failed', your tokens were not sent and the gas fee may or may not have been consumed depending on the network.\n\nFor stuck Ethereum transactions specifically, some advanced options exist like 'speed up' (resending the same transaction with a higher gas fee) or 'cancel' (sending a zero-value transaction to yourself with a higher gas fee to overwrite the stuck transaction). Contact support if you're unsure how to proceed.",
        tip: "For urgent transfers, always select the 'Fast' speed option on networks that offer it. The slightly higher fee is almost always worth the certainty of timely confirmation.",
      },
      {
        heading: "Transaction arrived but showing incorrectly?",
        content:
          "If the recipient tells you they haven't received the funds even though your transaction shows as confirmed in Pexly, first check the transaction on the blockchain explorer to confirm it's genuinely confirmed (not just pending). If it's confirmed on-chain, the issue is on the receiving end — the recipient's wallet may need to refresh, or they may be looking at the wrong network.\n\nProvide the recipient with the transaction hash so they can look it up themselves. If they're using an exchange as their receiving wallet, it's possible the exchange hasn't credited the deposit yet due to their own internal processing time — some exchanges require multiple confirmations before crediting. In that case, they should contact that exchange's support team.",
      },
    ],
    related: ["receive-tokens", "buy-tokens", "scam-recovery"],
  },

  "buy-tokens": {
    slug: "buy-tokens",
    title: "Buy tokens in Pexly",
    description: "A complete guide to all the ways you can acquire cryptocurrency on Pexly — on-ramp, swap, and what to do when things go wrong.",
    category: "Buy and sell tokens",
    categorySlug: "buy-sell",
    readTime: "7 min read",
    sections: [
      {
        heading: "Ways to get crypto on Pexly",
        content:
          "There are several different ways to acquire cryptocurrency within Pexly, depending on your starting point and what you're looking to accomplish. Whether you're coming in fresh with only fiat money, or you already hold one token and want to convert it to another, Pexly has a path for you.",
        steps: [
          {
            title: "Card or Bank On-Ramp (easiest for beginners)",
            description:
              "The on-ramp is the fastest way to go from fiat (USD, EUR, GBP, etc.) to crypto. Navigate to 'Buy Crypto' from the main menu. Select the cryptocurrency you want, enter the amount in your local currency, and choose your payment method — debit card, credit card, or bank transfer. Card purchases are typically instant or settle within minutes. Bank transfers take 1-3 business days depending on your bank and region. Supported payment methods and available cryptocurrencies vary by country.",
          },
          {
            title: "Token Swap (best if you already have crypto)",
            description:
              "If you already hold any cryptocurrency in your Pexly wallet, you can swap it for any other supported token using the Swap feature. Navigate to 'Trade > Swap' and select the token pair you want to exchange. Pexly aggregates liquidity from multiple decentralized exchanges to find you the best available rate automatically. Swaps on Solana settle in under a second. Swaps on Ethereum networks take a few minutes and incur gas fees.",
          },
          {
            title: "Receive from someone else",
            description:
              "If a friend, family member, or employer is sending you crypto, share your receive address (see the 'Receive tokens' guide) and they can send directly to your Pexly wallet. This costs nothing on your side — you only need to pay a fee when you send, not when you receive.",
          },
          {
            title: "P2P Trading",
            description:
              "Pexly's peer-to-peer section connects you with other users who want to buy or sell crypto using local payment methods. This can give you access to payment options not available through the standard on-ramp, or better rates in some markets. P2P trading carries additional risk — only trade with verified, highly rated counterparties and always follow the platform's escrow process.",
          },
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        heading: "Using the on-ramp in detail",
        content:
          "The on-ramp is powered by Pexly's integrated third-party payment partners. Here's what to expect when you go through the process for the first time:",
        steps: [
          {
            title: "Navigate to Buy Crypto",
            description:
              "Click or tap 'Buy Crypto' from the main navigation. You'll see a rate calculator where you can select your fiat currency, your desired cryptocurrency, and the amount. The calculator shows you the estimated amount you'll receive after all fees are applied.",
          },
          {
            title: "Complete identity verification if required",
            description:
              "First-time on-ramp users may need to complete a brief KYC (Know Your Customer) verification for purchases above certain limits. This typically takes 2-5 minutes and requires a government-issued ID. This is a regulatory requirement for fiat-to-crypto transactions, not a Pexly-specific policy. Once verified, you won't need to repeat this step.",
          },
          {
            title: "Enter your payment details",
            description:
              "For card payments, enter your card number, expiry date, and CVV. Your card details are processed by our payment partners — Pexly never stores your card information. For bank transfers, you'll receive bank account details to initiate the transfer from your bank's app or website.",
          },
          {
            title: "Confirm the purchase",
            description:
              "Review the total cost including all fees before confirming. The fee structure is transparent and shown in full before you commit to the transaction. Once confirmed, your purchased crypto is sent directly to your Pexly wallet.",
          },
        ],
      },
      {
        heading: "Understanding fees when buying",
        content:
          "When buying crypto through the on-ramp, there are two types of fees to be aware of. The first is the on-ramp service fee, which covers payment processing and is charged by Pexly's payment partners. This fee varies by payment method — card payments typically have higher fees than bank transfers because of card processing costs. The second is the network fee, which is the tiny amount paid to the blockchain validators to process your incoming transaction. This fee is usually negligible but is shown separately so you can see the full cost.\n\nPexly always shows you the exact amount of crypto you'll receive before you confirm, accounting for all fees. There are no hidden charges.",
        tip: "Bank transfers almost always have lower fees than card purchases for the same amount. If you're buying a significant sum and can wait 1-3 business days, bank transfer is the more cost-effective option.",
      },
      {
        heading: "What to do if a purchase fails or is delayed",
        content:
          "Card and bank purchases occasionally fail for a variety of reasons. Here's how to handle the most common situations:",
        steps: [
          {
            title: "Card declined",
            description:
              "Your bank may block crypto purchases by default. Contact your bank and ask them to allow transactions from your card to crypto platforms. Some banks require you to confirm the transaction via their app in real-time. If one card is declined, trying a different card or switching to bank transfer usually resolves the issue.",
          },
          {
            title: "Charged but no crypto received",
            description:
              "If your card was charged but the crypto didn't arrive in your wallet within 30 minutes, contact support at support@pexly.app with your transaction reference number and the amount. Include your card statement as proof of the charge. Our team will investigate and either confirm delivery or initiate a refund process.",
          },
          {
            title: "Bank transfer not credited",
            description:
              "Bank transfers can take up to 3 business days to arrive and credit to your on-ramp account. If it's been more than 3 business days since you initiated the transfer, contact your bank first to confirm it was sent successfully, then contact Pexly support with your bank's transfer confirmation.",
          },
          {
            title: "Limits or restrictions",
            description:
              "New accounts may have lower purchase limits until identity verification is completed. Completing Level 2 verification significantly increases your daily and monthly purchase limits. Some restrictions may also apply based on your country of residence due to local regulations.",
          },
        ],
      },
      {
        heading: "Selling crypto and withdrawing to fiat",
        content:
          "To convert your crypto back to fiat currency and withdraw to your bank account, use the off-ramp option in the Buy Crypto section. Select 'Sell', choose the token you want to sell, enter the amount, and follow the steps to link your bank account for receiving the proceeds.\n\nOff-ramp withdrawals are processed during business hours and typically take 1-5 business days to arrive in your bank account depending on your bank and country. The exchange rate is locked at the time you confirm the sale. You'll receive an email confirmation with the expected arrival date once your withdrawal is initiated.\n\nMinimum withdrawal amounts and supported fiat currencies vary by region. If your local currency isn't directly supported, you may be able to withdraw in USD or EUR and your bank will handle the conversion at their standard exchange rate.",
        tip: "If you need to move funds quickly, consider using a stablecoin like USDC or USDT as an intermediate step — convert your crypto to a stablecoin first (instant, no fiat processing time), and then initiate the fiat withdrawal at a time that suits you.",
      },
    ],
    related: ["send-tokens", "receive-tokens", "swap-guide"],
  },

  "get-help": {
    slug: "get-help",
    title: "Get help from Pexly",
    description: "All the ways you can reach the Pexly support team, what information to include, and what to expect from each channel.",
    category: "Get started",
    categorySlug: "get-started",
    readTime: "5 min read",
    sections: [
      {
        heading: "How to contact the Pexly support team",
        content:
          "Pexly support is available 7 days a week. We aim to respond to all requests within 24-48 hours on business days, though complex issues involving identity verification or disputes may take longer. Here are all the ways to get in touch:",
        steps: [
          {
            title: "Submit a support request via the Contact page",
            description:
              "The best way to get help with account-specific issues, transaction problems, or anything requiring investigation is to submit a detailed support request through the Contact page (/contact). Fill in your email address, a clear subject line, and a detailed description of the issue. Include your transaction hash or ID if the issue involves a specific transaction, as this dramatically speeds up resolution. You'll receive an email confirmation immediately and a response from our team within 24-48 hours.",
          },
          {
            title: "Email support@pexly.app directly",
            description:
              "You can also email our support team directly for urgent or complex issues. Our inbox is monitored 7 days a week including weekends. For fastest response, use a clear subject line that describes the issue (e.g. 'Sent USDT to wrong network — transaction 0xABC123') rather than a generic subject like 'Help'. Include all relevant details in the body of the email.",
          },
          {
            title: "Search the Help Center first",
            description:
              "Many common questions are answered in detail right here in the Help Center. Use the search bar at the top of the Support page to search by keyword before submitting a ticket. Finding the answer in the Help Center is almost always faster than waiting for a support response, and many issues can be resolved immediately with the right guidance.",
          },
          {
            title: "Live chat",
            description:
              "For quick questions that don't require account access, the live chat widget (available at the bottom of every page) connects you with our support team. Live chat is best for general questions, how-to guidance, and quick clarifications. For anything requiring account verification or investigation of specific transactions, a support ticket is more appropriate.",
          },
        ],
      },
      {
        heading: "What to include in your support request",
        content:
          "The more information you provide upfront, the faster we can help you. Requests that include all relevant details are typically resolved in a single reply. Requests that are missing information require back-and-forth and take significantly longer. Here's what to include depending on your issue:",
        steps: [
          {
            title: "For transaction issues",
            description:
              "Include: the transaction hash (TXID) found in your transaction history, the amount and token involved, the network the transaction was on, the sender and recipient addresses, the date and time of the transaction, and a description of what went wrong (e.g. 'sent on wrong network', 'transaction shows confirmed but funds not received', 'pending for over 24 hours').",
          },
          {
            title: "For account access issues",
            description:
              "Include: your account email address, a description of what you're experiencing, when the issue started, and any error messages shown on screen. Do NOT include your password, recovery phrase, or private keys — we will never ask for these and including them would compromise your security.",
          },
          {
            title: "For purchase or payment issues",
            description:
              "Include: the date and approximate time of the purchase attempt, the amount and currency, the payment method used, your bank or card statement showing the charge (if applicable), any order reference number shown during the purchase process, and a description of what happened.",
          },
          {
            title: "For scam or fraud reports",
            description:
              "Include: screenshots of all communications with the suspected scammer, any wallet addresses they provided, transaction hashes of any funds sent, the platform or channel where you were contacted (Telegram, Discord, email, etc.), and the timeline of events. The more evidence you provide, the more we can do.",
          },
        ],
        tip: "Always take screenshots of any error messages at the time they occur. Error messages often disappear after refreshing and can be critical for diagnosing the issue.",
      },
      {
        heading: "Expected response times",
        content:
          "We aim to respond to all support requests within 24 to 48 hours on business days. Some issue types have different resolution timelines by nature. Simple questions (how do I find my receive address, how do I enable 2FA) are typically answered within a few hours. Billing and payment issues are typically resolved within 24-72 hours once we have all the necessary information. Identity verification reviews and dispute resolution can take 3-10 business days depending on the complexity and any third parties involved.\n\nYou'll always receive an email confirmation when your ticket is created, and you can follow up on any open ticket by replying to that email. We do not support following up via social media for account-specific issues, as we cannot verify your identity through those channels.",
      },
      {
        heading: "What Pexly support will never ask you",
        content:
          "This section is critically important for your security. Pexly support staff have tools and systems to assist you without ever needing access to your private credentials. We will never, under any circumstances, ask you for:",
        steps: [
          {
            title: "Your recovery phrase or seed phrase",
            description:
              "Your recovery phrase gives complete control of your wallet to whoever has it. No legitimate support agent, from any company, ever needs this. If anyone claiming to be Pexly support asks for your recovery phrase in any format, they are a scammer attempting to steal your funds. Do not share it, do not enter it into any website they link you to.",
          },
          {
            title: "Your wallet password",
            description:
              "Your password is your own private credential and encrypts your wallet locally on your device. We have no ability to see or reset it, and we never need it to help you.",
          },
          {
            title: "Remote access to your device",
            description:
              "We will never ask you to install software like TeamViewer, AnyDesk, or any similar remote access tool. Anyone asking you to install such software while claiming to be from Pexly is attempting to steal your funds or personal information.",
          },
          {
            title: "Payments or crypto transfers to resolve an issue",
            description:
              "Pexly support never asks you to send crypto to resolve a wallet issue, unlock funds, or pay taxes or fees on a withdrawal. Any such request is a scam.",
          },
        ],
        warning: "If you receive an unsolicited DM, email, or call from someone claiming to be Pexly support, do not engage further. Pexly support only responds — we never proactively contact users about account issues. Report suspicious contacts to support@pexly.app.",
      },
      {
        heading: "Community resources",
        content:
          "Beyond official support, the Pexly community is an excellent resource for general questions, tips, and discussions. Join the Pexly community on Discord and Telegram — links available on the main website. The community is monitored by Pexly moderators and many experienced users are happy to help with general questions. However, be cautious about advice regarding your private keys or recovery phrase from any community member, regardless of how trusted they appear.",
        tip: "Pexly staff in community channels will have a verified 'Pexly Team' badge. Anyone without this badge claiming to be from Pexly in DMs should be treated as a potential scammer.",
      },
    ],
    related: ["scam-recovery", "get-started-with-pexly", "create-wallet"],
  },

  "scam-recovery": {
    slug: "scam-recovery",
    title: "What to do if I was scammed",
    description: "If you believe you've been the victim of a crypto scam, here's exactly what to do immediately and how to protect yourself going forward.",
    category: "Security",
    categorySlug: "security",
    readTime: "8 min read",
    sections: [
      {
        heading: "Act immediately — time is critical",
        content:
          "If you believe you've been scammed or that your wallet has been compromised, every minute counts. Crypto transactions can be irreversible within seconds of confirmation, so taking immediate action gives you the best possible chance of limiting your losses and preventing further theft. Stop everything else and work through the following steps right now:",
        steps: [
          {
            title: "Stop all communication with the scammer",
            description:
              "Do not send any more funds. Do not click any links they send you. Do not respond to further messages trying to convince you the situation can be resolved with another payment. Scammers are trained to keep victims engaged and hopeful — disengage immediately. Block them on every platform and save all previous communications as screenshots before blocking.",
          },
          {
            title: "Secure your Pexly account right now",
            description:
              "Change your Pexly password immediately using a new, unique password you haven't used anywhere else. If you haven't already enabled 2FA, enable it now. If the scam involved you sharing your recovery phrase with anyone or entering it on any website, your wallet is fully compromised and you must create a brand new wallet immediately. Transfer all remaining funds to the new wallet before the scammer can sweep them.",
          },
          {
            title: "If you shared your recovery phrase",
            description:
              "This is the worst-case scenario and requires urgent action. Go to Wallet, create a new wallet, copy your new wallet's receive addresses, then immediately send all remaining tokens from the compromised wallet to the new wallet. Move fast — the scammer may attempt to sweep your funds as soon as they use your recovery phrase. After moving your funds, do not use the old wallet again for anything.",
          },
          {
            title: "Document everything before it disappears",
            description:
              "Take screenshots of all conversations with the scammer, every platform they used, their profile names and pictures, any wallet addresses they provided, transaction hashes of funds you sent, any websites they linked you to (screenshot the URL bar clearly), and any payment confirmations. This evidence is critical for filing reports and for any investigation. Do not delete any of it.",
          },
          {
            title: "Report to Pexly support immediately",
            description:
              "Contact us at support@pexly.app with all the evidence you've gathered. Include the scammer's wallet addresses, transaction hashes, the platform where you were contacted, and a full timeline of what happened. Reporting the scammer's addresses allows our team to flag them within our system and potentially warn other users.",
          },
          {
            title: "Report to law enforcement and financial authorities",
            description:
              "File a report with your local police department and your country's financial crime authority. In the United States, report to the FTC at reportfraud.ftc.gov and the FBI's IC3 at ic3.gov. In the UK, report to Action Fraud at actionfraud.police.uk. In Europe, contact your national financial regulator. These reports are important even if recovery seems unlikely — patterns across multiple reports help authorities track and shut down organized scam operations.",
          },
          {
            title: "Contact your bank if fiat money was involved",
            description:
              "If you sent money via bank transfer, wire, or debit card as part of the scam, contact your bank immediately. Banks can sometimes recall wire transfers if contacted quickly enough, and many banks have fraud teams specifically trained to handle crypto-related scams. Provide them with all the documentation you've gathered.",
          },
        ],
        warning: "Do not hire any 'crypto recovery service' that contacts you after you've been scammed, or that you find advertised online. These services are almost universally follow-on scams that will steal additional money from you with promises of recovering your lost funds. Blockchain transactions are technically irreversible — no service can truly 'recover' confirmed transactions.",
      },
      {
        heading: "The most common crypto scams and how to recognize them",
        content:
          "Understanding how scams work is the best protection against them. These are the most prevalent scam types affecting crypto users in 2024 and 2025:",
        steps: [
          {
            title: "Fake payment proof scams",
            description:
              "A buyer or seller shows you a doctored screenshot of a payment confirmation to convince you to release crypto or goods before you've actually received anything. The screenshot looks completely legitimate — modern image editing software can create convincing fakes in minutes. Rule: never release crypto or physical goods based solely on a screenshot. Verify in your actual bank app, your actual Pexly wallet, or your actual exchange account. If the payment exists, it will show up in the real system.",
          },
          {
            title: "Impersonation scams",
            description:
              "Scammers create accounts or profiles impersonating Pexly support staff, celebrity traders, government officials, or popular influencers. They reach out via DM on Twitter/X, Telegram, Discord, Instagram, or WhatsApp with an 'opportunity' or a claim that there's a problem with your account that requires urgent action. Pexly support never contacts you first through social media. Celebrity traders don't DM strangers with investment opportunities. If someone contacts you unsolicited about your crypto, assume it's a scam.",
          },
          {
            title: "Investment return scams (pig butchering)",
            description:
              "This is currently the most financially devastating scam in the crypto space. A scammer builds a relationship with you over days, weeks, or even months — sometimes romantic, sometimes as a mentor — and then introduces you to a 'high-return investment platform'. The platform shows impressive gains that you can withdraw in small amounts to build trust. Eventually they ask you to invest a large sum, then disappear, or find an excuse for why you can't withdraw (taxes owed, unlock fees, etc.). Any investment promising returns above 15-20% annually should raise immediate suspicion. Guaranteed daily returns are always fraudulent.",
          },
          {
            title: "Phishing websites and fake apps",
            description:
              "Scammers create websites that look pixel-for-pixel identical to Pexly or other crypto platforms but have slightly different URLs. They drive traffic to these sites through fake ads on Google, social media posts, or links in phishing emails. When you enter your login details or recovery phrase, those credentials go directly to the scammer. Always type pexly.app directly into your browser, bookmark it, and check the URL carefully every single time you log in. Never access Pexly through a link in an email or social media post.",
          },
          {
            title: "Giveaway and airdrop scams",
            description:
              "Posts claiming that Pexly, Elon Musk, or any other platform or celebrity is doing a crypto giveaway where you send 0.1 ETH and receive 0.2 ETH back, or where you need to connect your wallet to a site to claim free tokens. There are no legitimate crypto giveaways that work this way. Any giveaway requiring you to send funds first is a scam, and any airdrop claiming site should be approached with extreme skepticism.",
          },
          {
            title: "Recovery scam follow-ups",
            description:
              "After being scammed, victims are often targeted again almost immediately by 'crypto recovery experts' or 'blockchain investigation firms' who claim they can trace and recover your lost funds for an upfront fee or a percentage of the recovery. These are always scams. There is no legitimate service that can reverse confirmed blockchain transactions. Block and report anyone who approaches you claiming to offer fund recovery.",
          },
        ],
      },
      {
        heading: "Can stolen crypto be recovered?",
        content:
          "This is an important question, and we want to give you an honest answer. In the vast majority of cases, stolen cryptocurrency cannot be recovered. Once a transaction is confirmed on the blockchain, it is final and irreversible by design. There is no central authority, including Pexly, that can reverse or freeze a confirmed transaction.\n\nHowever, reporting scammer addresses to Pexly, exchanges, and authorities does serve a purpose. Many exchanges monitor known scammer addresses and freeze funds when they arrive at their platform. Law enforcement has had increasing success coordinating with major exchanges to recover funds in organized crime cases, especially when large amounts are involved and multiple victims have reported the same addresses.\n\nIf you lost significant funds, filing an official police report and reporting to the relevant financial crime authority is the highest-value action you can take. Recovery is rare but not impossible, particularly in organized fraud cases.",
        tip: "Keep all your evidence organized in a folder. Date-stamped screenshots, transaction hashes, and communication records all contribute to building a case. Even if your individual case isn't investigated, your evidence may contribute to a larger investigation.",
      },
      {
        heading: "How to protect yourself going forward",
        content:
          "After experiencing a scam, taking steps to harden your security makes you significantly less vulnerable in the future. Enable 2FA on every account using an authenticator app. Use a dedicated email address for your crypto accounts that you don't use for anything else. Be suspicious of any unsolicited communication about your crypto, regardless of who it appears to be from. Never share your screen with anyone claiming to be support. Use a hardware wallet for any significant holdings. Trust your instincts — if something feels wrong, it probably is.",
        tip: "Consider using a hardware wallet (like Ledger or Trezor) for storing larger amounts of crypto. Hardware wallets keep your private keys physically offline, making them immune to all software-based attacks. They can be used alongside Pexly by importing the wallet addresses.",
      },
    ],
    related: ["get-help", "security-tips", "get-started-with-pexly"],
  },

  "security-tips": {
    slug: "security-tips",
    title: "How to keep your wallet secure",
    description: "Essential security practices every Pexly user should follow to protect their funds from hackers, scammers, and phishing attacks.",
    category: "Security",
    categorySlug: "security",
    readTime: "7 min read",
    sections: [
      {
        heading: "Why crypto security is different",
        content:
          "Security in crypto works very differently from security in traditional finance. With a bank account, there are consumer protections, fraud departments, chargebacks, and the ability to reverse unauthorized transactions. If someone fraudulently accesses your bank account, you have legal recourse and the bank typically makes you whole.\n\nWith a self-custody crypto wallet, none of those safety nets exist. If someone gets access to your wallet — whether through your recovery phrase, your password, or malware on your device — any transfers they make are permanent and irreversible. There is no fraud department to call. This places the full responsibility for security on you.\n\nThe good news is that protecting your crypto wallet requires only a handful of practices, all of which are straightforward to implement. Following every point in this guide gives you an extremely high level of protection against the threats that actually affect real crypto users.",
      },
      {
        heading: "The non-negotiable security fundamentals",
        content:
          "These are the most important security measures. Think of these as the foundation — everything else builds on top of them.",
        steps: [
          {
            title: "Never share your recovery phrase with anyone",
            description:
              "Your 12 or 24-word recovery phrase gives complete, instant, and irrevocable access to your entire wallet from any device. There is no legitimate reason for any person, service, or website to ever ask for it. Pexly support does not need it. No wallet recovery service needs it. If anyone asks for it in any context, they are attempting to steal your funds. Store your phrase offline, on paper, in at least two physically separate locations.",
          },
          {
            title: "Enable two-factor authentication (2FA) using an authenticator app",
            description:
              "2FA means that even if someone learns your password, they cannot access your account without also having your authenticator app in their physical possession. Set it up in Account Settings under Security. Use Google Authenticator, Authy, or a similar app. Avoid SMS-based 2FA if possible — SIM swap attacks can compromise SMS-based 2FA. If your platform offers authenticator app 2FA, always choose that over SMS.",
          },
          {
            title: "Use a strong, unique password for your Pexly account",
            description:
              "Use a password manager (Bitwarden, 1Password, and Dashlane are all solid options) to generate a random, strong password of at least 16 characters for Pexly. Never use this password on any other website. Password reuse across sites means that a breach at any other website can expose your crypto account — hackers routinely try credentials from previous data breaches on crypto platforms.",
          },
          {
            title: "Verify you're on the real Pexly website before entering any credentials",
            description:
              "Look at the URL in your browser's address bar every time you log in. It should show pexly.app — nothing else. Bookmark the real URL and use only that bookmark to navigate to Pexly. Never access Pexly by clicking a link in an email, SMS, social media post, or search engine ad. Scammers run convincing paid ads that appear at the top of Google search results for 'Pexly' and lead to phishing sites.",
          },
          {
            title: "Keep your devices clean and up to date",
            description:
              "Keep your operating system and browser updated. Use reputable antivirus software, especially on Windows. Avoid installing browser extensions you don't need, as malicious extensions can read everything you type including passwords. Be especially cautious with cryptocurrency-related browser extensions — many are malicious. Only install extensions from developers you genuinely trust.",
          },
        ],
        tip: "Set up 2FA before you add any significant funds to your wallet. It takes about 5 minutes and dramatically reduces your risk profile.",
      },
      {
        heading: "Recognizing and avoiding phishing",
        content:
          "Phishing is the technique of impersonating a legitimate service to trick you into revealing your credentials. It's the most common way crypto wallets are compromised. Here's what to watch for:",
        steps: [
          {
            title: "Check the sender's email domain carefully",
            description:
              "Legitimate Pexly emails always come from @pexly.app addresses. Scammers often use domains like @pexly-support.com, @pexly.net, @pexly.io, or visually similar variants. Click or hover on the sender name to see the actual email address — the display name can say 'Pexly Support' even if it comes from a completely unrelated domain.",
          },
          {
            title: "Inspect links before clicking",
            description:
              "On desktop, hover your mouse over any link in an email before clicking to see the actual destination URL in your browser's status bar. The link text can say 'pexly.app' while the actual URL goes somewhere completely different. On mobile, press and hold a link to see a preview of the destination before opening it.",
          },
          {
            title: "Be suspicious of urgency",
            description:
              "Phishing messages almost always create artificial urgency: 'Your account will be suspended in 24 hours', 'Urgent: unauthorized access detected', 'Your withdrawal is on hold — verify now'. Urgency is a psychological technique to make you act before thinking. Pexly does not send emails demanding immediate action with account suspension threats. If you receive such a message, go directly to pexly.app by typing the URL yourself and check your account — don't click any links in the email.",
          },
          {
            title: "Verify unexpected communications through official channels",
            description:
              "If you receive a message claiming to be from Pexly about an account issue, ignore the message and instead go directly to pexly.app yourself and contact support through the official contact page if needed. This way, even a perfectly convincing phishing email can't trick you.",
          },
        ],
      },
      {
        heading: "Protecting yourself on public networks and shared devices",
        content:
          "Never access your Pexly wallet from a public or shared computer — library computers, hotel business centers, internet cafes, or a friend's machine. These devices may have keyloggers or other monitoring software installed that capture everything you type, including your password.\n\nIf you must use a public WiFi network, use a VPN to encrypt your connection. Free VPN services should be avoided — they often log and sell your browsing data. A reputable paid VPN (Mullvad, ProtonVPN, or ExpressVPN) provides meaningfully better protection.\n\nBe mindful of shoulder surfing in public places — someone watching over your shoulder while you access your wallet in a café or on public transport is a real threat, especially if they can see your phone screen and take note of your password.",
        warning: "If you ever suspect your device may be compromised (unusual behavior, unexpected software installed, account activity you don't recognize), change your Pexly password immediately from a different, clean device.",
      },
      {
        heading: "Protecting large holdings with a hardware wallet",
        content:
          "If you hold cryptocurrency worth more than a few hundred dollars, seriously consider using a hardware wallet (also called a cold wallet). Hardware wallets like Ledger, Trezor, and Coldcard store your private keys on a dedicated physical device that never connects to the internet. To sign a transaction, you physically confirm it on the device.\n\nThis means that even if your computer is completely compromised with malware, an attacker cannot steal your crypto without physical access to your hardware wallet. It's the gold standard for self-custody security and the approach used by experienced crypto holders worldwide.\n\nYou can use a hardware wallet alongside Pexly — your Pexly interface can connect to the hardware wallet addresses, letting you see your balances and initiate transactions, which then require physical confirmation on the device before broadcasting.",
        tip: "Purchase hardware wallets only directly from the manufacturer's official website. Never buy them second-hand or from third-party Amazon/eBay sellers — these can be pre-tampered with to steal your funds.",
      },
    ],
    related: ["scam-recovery", "get-help", "create-wallet"],
  },

  "two-factor-authentication": {
    slug: "two-factor-authentication",
    title: "Setting up two-factor authentication (2FA)",
    description: "How to enable and manage 2FA on your Pexly account for maximum security, and what to do if you lose access.",
    category: "Security",
    categorySlug: "security",
    readTime: "5 min read",
    sections: [
      {
        heading: "Why 2FA is essential",
        content:
          "Two-factor authentication adds a critical second layer of protection to your Pexly account. Even if someone learns your password through a data breach, phishing attempt, or by guessing it, they cannot log into your account without also having access to your authenticator app. Your authenticator app generates a new 6-digit code every 30 seconds that is cryptographically linked to your specific account. Without that code, the password alone is useless.\n\nStatistics consistently show that accounts with 2FA enabled are over 99% less likely to be compromised than accounts relying on passwords alone. For a crypto account where the stakes are your actual money, enabling 2FA is one of the most impactful single actions you can take. It takes about 5 minutes to set up and you only do it once.",
        tip: "Use an authenticator app rather than SMS 2FA wherever possible. SIM swap attacks (where a scammer convinces your mobile carrier to transfer your phone number to a SIM they control) can compromise SMS 2FA. Authenticator app codes are generated on your device and are immune to SIM swap attacks.",
      },
      {
        heading: "Setting up 2FA on Pexly",
        content:
          "You'll need an authenticator app on your phone before starting. We recommend Google Authenticator (iOS/Android), Authy (iOS/Android), or Microsoft Authenticator. Download and install one of these apps if you don't already have it. Then follow these steps:",
        steps: [
          {
            title: "Go to Account Settings",
            description:
              "From any page in Pexly, click your account avatar or initials in the top-right corner and select 'Account Settings'. On mobile, tap the profile icon in the navigation bar.",
          },
          {
            title: "Open the Security tab",
            description:
              "Inside Account Settings, navigate to the 'Security' tab. You'll see your current security status, including whether 2FA is enabled. Click 'Enable 2FA' or 'Set up two-factor authentication'.",
          },
          {
            title: "Scan the QR code with your authenticator app",
            description:
              "Pexly will display a QR code on screen. Open your authenticator app, tap the '+' or 'Add account' button, select 'Scan QR code', and point your phone's camera at the code. The app will create a new entry for your Pexly account and immediately start showing 6-digit codes that refresh every 30 seconds.",
          },
          {
            title: "Verify the setup with your first code",
            description:
              "Enter the 6-digit code currently showing in your authenticator app into the verification field in Pexly. The code changes every 30 seconds, so enter it while it's still valid. If the code is close to expiring (the countdown timer in your app is nearly done), wait for the next code to appear before entering.",
          },
          {
            title: "Save your backup codes immediately",
            description:
              "After verification, Pexly will show you a set of one-time backup codes. These are your emergency access keys if you ever lose your phone or lose access to your authenticator app. Write these down or print them and store them in a secure offline location — separate from your recovery phrase. Each backup code can only be used once. Treat them with the same level of care as your recovery phrase.",
          },
          {
            title: "Confirm and finish",
            description:
              "Confirm that you've saved your backup codes and click 'Finish setup'. 2FA is now active on your account. Going forward, every login will require both your password and the current code from your authenticator app.",
          },
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        heading: "What to do if you lose access to your authenticator",
        content:
          "If you lose your phone, get a new phone, or accidentally delete your authenticator app, use one of the backup codes you saved during setup to log in. On the 2FA prompt screen, look for the 'Use a backup code' link and enter one of your saved codes. Once logged in, immediately go to Account Settings and reconfigure 2FA on your new device.\n\nIf you've lost both your phone and your backup codes, the recovery process is significantly more complex and requires identity verification. Contact support at support@pexly.app with your account email, a clear government-issued photo ID, and a selfie holding the ID with today's date written on a piece of paper visible in the frame. This is the only way our team can verify your identity without 2FA access. The process typically takes 5-10 business days and may not be possible in all cases depending on how much account information you can provide.",
        warning: "Pexly support will never ask you to bypass 2FA through unofficial channels. The only legitimate 2FA recovery process goes through the official support ticket system with proper identity verification. Any other 'shortcut' offered through social media, DMs, or phone calls is a scam.",
      },
      {
        heading: "Transferring 2FA to a new phone",
        content:
          "If you're getting a new phone and want to move your 2FA setup before decommissioning your old phone, do the following while you still have access to your old phone. Open your authenticator app on the old phone and use the export or transfer feature (most authenticator apps have this). On Authy, for example, you can enable 'Multi-device' and add your new phone. On Google Authenticator, use the 'Transfer accounts' export function to generate a QR code that your new phone can scan.\n\nAlternatively, log into Pexly on your old phone while you still have it, go to Account Settings, disable 2FA, and then re-enable it by scanning a new QR code on your new phone. This approach is more reliable across different authenticator apps.",
        tip: "If you use Authy, enabling the 'Backups' feature in Authy's settings lets you restore all your 2FA accounts to a new phone by logging into your Authy account. This is the most convenient recovery option if you're already using Authy.",
      },
    ],
    related: ["security-tips", "scam-recovery", "get-help"],
  },

  "staking-guide": {
    slug: "staking-guide",
    title: "How staking works on Pexly",
    description: "A comprehensive guide to earning passive yield by staking your crypto on Pexly — what it is, how it works, and what to expect.",
    category: "Staking",
    categorySlug: "staking",
    readTime: "8 min read",
    sections: [
      {
        heading: "What is staking and how does it work?",
        content:
          "Staking is the process of locking up (or 'delegating') your cryptocurrency to help secure and validate a blockchain network. In return for providing this service, you earn staking rewards — typically a percentage of your staked amount paid out on a regular basis. Think of it as earning interest on a savings account, except instead of a bank using your money for loans, a blockchain is using your staked tokens to verify transactions.\n\nSolana, the primary staking network on Pexly, uses a Proof of Stake (PoS) consensus mechanism. Validators stake large amounts of SOL as collateral and take turns proposing and voting on new blocks. When you stake your SOL, you're delegating your tokens to a validator and earning a share of their rewards proportional to how much you staked. Your tokens never leave your control — you can unstake them at any time (subject to a short unbonding period).",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        heading: "Liquid staking vs. native staking",
        content:
          "Pexly offers two staking options, each with different trade-offs between liquidity and yield. Understanding both helps you choose the right approach for your situation:",
        steps: [
          {
            title: "Liquid Staking (pSOL)",
            description:
              "When you use liquid staking, you deposit SOL and receive pSOL tokens in return at a 1:1 ratio at the time of staking. pSOL automatically accrues staking rewards — its value relative to SOL increases over time as rewards accumulate. You can trade, swap, or use pSOL in DeFi protocols at any time without waiting. There's no lock-up period, no unbonding delay, and you can convert back to SOL whenever you want. The yield is slightly lower than native staking because of the protocol's liquid staking infrastructure fee, but the flexibility makes it the right choice for most users.",
          },
          {
            title: "Native Staking",
            description:
              "Native staking means delegating your SOL directly to a validator on the Solana network. This typically offers a higher APY than liquid staking because there are no protocol overhead fees. The trade-off is the unbonding period — when you decide to unstake, you have to wait for the current Solana epoch to complete (typically 2-3 days) before your SOL becomes liquid again. Native staking is better suited for long-term holders who don't need immediate access to their staked tokens.",
          },
        ],
        tip: "Not sure which to choose? Start with liquid staking. It lets you earn rewards while keeping full flexibility. You can always transition to native staking later once you're comfortable with the concept.",
      },
      {
        heading: "How to start staking on Pexly",
        content:
          "Staking is designed to be simple on Pexly. Here's the complete process from start to your first rewards:",
        steps: [
          {
            title: "Open Wallet and navigate to the Staking section",
            description:
              "From your Pexly wallet, look for the 'Stake' or 'Earn' tab. This section shows your current staking positions (if any), the current APY for each staking option, and the option to stake more.",
          },
          {
            title: "Choose your staking type",
            description:
              "Select 'Liquid Staking' if you want flexibility and immediate liquidity, or 'Native Staking' if you want the higher APY and are comfortable with the unbonding period. The current APY for each option is displayed — these rates fluctuate with network conditions and the total amount of SOL being staked across the network.",
          },
          {
            title: "For native staking: choose a validator",
            description:
              "If you've selected native staking, you'll be presented with a list of validators to delegate to. Look for validators with high uptime (aim for 98%+), reasonable commission rates (most are in the 5-10% range), and a good track record. A validator with 0% commission isn't automatically the best choice — very low commission validators sometimes have sustainability issues. Pexly shows recommended validators that meet our quality standards.",
          },
          {
            title: "Enter the amount to stake",
            description:
              "Enter how much SOL you want to stake. There's no minimum for liquid staking. For native staking, there's a small minimum to cover the rent for the stake account on Solana (typically around 0.002 SOL). Keep a small amount of SOL unstaked to cover network fees for future transactions.",
          },
          {
            title: "Confirm and start earning",
            description:
              "Review the details — amount, staking type, estimated APY, and any fees — and confirm. For liquid staking, your pSOL appears immediately and starts accruing value. For native staking, your delegation activates at the start of the next epoch (within 2-3 days) and you'll see your first rewards after the first full epoch completes.",
          },
        ],
      },
      {
        heading: "Understanding staking yields and APY",
        content:
          "APY (Annual Percentage Yield) represents how much you'd earn in one year if you leave your tokens staked and reinvest the rewards. On Pexly, staking rewards are calculated continuously and compounding happens automatically.\n\nSolana staking APY has historically ranged from approximately 5% to 8% annually, though this fluctuates based on network inflation rates, the total amount of SOL staked across the network, and individual validator performance. The figures displayed in Pexly are current estimates based on recent epochs and are not guaranteed future returns.\n\nAs an example: if you stake 100 SOL at 6% APY and leave it for a full year with rewards reinvested, you'd have approximately 106 SOL at the end of the year — before accounting for any change in the price of SOL itself. Staking rewards are denominated in the staked token, not in fiat.",
        tip: "Staking rewards are subject to tax in most jurisdictions — they're typically treated as ordinary income at the time of receipt. Keep records of your staking rewards for tax purposes. Pexly's transaction history section provides a downloadable report you can give to your accountant.",
      },
      {
        heading: "How to unstake",
        content:
          "Unstaking is straightforward, but the timeline varies between liquid and native staking. For liquid staking, go to your Staking dashboard, select your pSOL position, and choose 'Unstake'. Your pSOL is converted back to SOL immediately at the current exchange rate. The process is instant with no waiting period.\n\nFor native staking, the process involves a deactivation step followed by a waiting period. Go to your native staking position and click 'Unstake'. Your stake enters 'deactivating' status and will be released at the end of the current Solana epoch — this typically takes between a few hours and 3 days depending on where you are in the epoch cycle. Once released, the SOL is available in your wallet.",
      },
      {
        heading: "Staking risks to understand",
        content:
          "Staking is generally considered one of the lower-risk activities in crypto, but it's not risk-free. Here's what to be aware of:",
        steps: [
          {
            title: "Smart contract risk (liquid staking)",
            description:
              "Liquid staking protocols operate through smart contracts. While these are audited, all smart contracts carry some level of risk of bugs or vulnerabilities. Pexly uses established, battle-tested liquid staking protocols, but this risk cannot be eliminated entirely.",
          },
          {
            title: "Validator performance risk (native staking)",
            description:
              "If you choose a poor-performing validator with frequent downtime or who behaves dishonestly, your rewards for that period will be lower or zero. In Solana's current implementation, there is no 'slashing' (destruction of staked tokens) for downtime, but you'll miss out on rewards during periods the validator is offline.",
          },
          {
            title: "Market risk",
            description:
              "The fiat value of your staked tokens can go up or down regardless of the staking yield. If you stake 100 SOL worth $10,000 today and SOL's price falls by 20%, your 106 SOL earned from staking is worth $8,480 — a net fiat loss despite the positive staking yield. Staking is a long-term strategy that works best when you believe in the underlying asset.",
          },
          {
            title: "Liquidity risk (native staking)",
            description:
              "Your tokens are illiquid during the unbonding period after you unstake. If prices move significantly during those 2-3 days and you need to sell quickly, you may not be able to do so until unbonding completes. This is why liquid staking is often the better choice for users who might need quick access to their funds.",
          },
        ],
        warning: "Only stake crypto you're comfortable holding for the long term. Don't stake funds you may need access to urgently, especially through native staking with its unbonding delay.",
      },
    ],
    related: ["buy-tokens", "get-started-with-pexly", "security-tips"],
  },

  "swap-guide": {
    slug: "swap-guide",
    title: "How to swap tokens on Pexly",
    description: "A complete guide to swapping tokens on Pexly — how the aggregator works, understanding slippage and price impact, and what to do when swaps fail.",
    category: "Trading",
    categorySlug: "trading",
    readTime: "6 min read",
    sections: [
      {
        heading: "What is a token swap?",
        content:
          "A swap is the simplest form of decentralized trading. Instead of placing an order on an exchange and waiting for it to be matched, you tell the swap interface how much of Token A you want to exchange for Token B, and it executes the trade immediately at the current market rate. No order book, no counterparty to find, no waiting.\n\nPexly's swap feature connects to multiple decentralized exchanges (DEXs) simultaneously and uses an aggregation algorithm to find the optimal route for your trade. This means you typically get a better rate than you'd find on any single DEX, because the aggregator can split your order across multiple liquidity pools to minimize price impact and maximize the amount you receive.\n\nSwaps are executed on-chain, which means they're transparent, verifiable, and non-custodial. Pexly never holds your tokens during the swap process — the trade happens directly in a smart contract and the output tokens arrive in your wallet in the same transaction.",
      },
      {
        heading: "How to swap tokens step by step",
        content:
          "Swapping on Pexly is designed to be straightforward even for new users. Here's the complete process:",
        steps: [
          {
            title: "Navigate to Trade and then Swap",
            description:
              "Click or tap 'Trade' in the main navigation and select 'Swap'. You'll see the swap interface with two token selectors and an amount input field.",
          },
          {
            title: "Select the token you're swapping from",
            description:
              "Click the top token selector and choose the token you currently hold that you want to exchange. You'll see your current balance displayed below the selector. Only tokens you actually hold will appear with a balance — you can still select other tokens but you'll need to buy or receive them first.",
          },
          {
            title: "Select the token you're swapping to",
            description:
              "Click the bottom token selector and search for the token you want to receive. You can search by name (e.g. 'Solana') or by token symbol (e.g. 'SOL') or by contract address if it's a less well-known token. Be careful when swapping to lesser-known tokens — verify the contract address from the project's official website to avoid accidentally swapping into a scam token with the same name.",
          },
          {
            title: "Enter the amount",
            description:
              "Type the amount of the 'from' token you want to swap. You can also enter the amount in the 'to' field if you know exactly how much of the destination token you want to receive — Pexly will calculate the required input automatically. The exchange rate, price impact, and estimated output are shown in real-time as you type.",
          },
          {
            title: "Review the slippage setting",
            description:
              "Slippage is the maximum price movement you're willing to accept between when you submit the swap and when it executes. The default of 0.5% works for most stable pairs. For more volatile tokens or thin liquidity pairs, you may need to increase slippage to 1-3% to ensure the swap executes. If slippage is too low, the swap will fail if the price moves beyond your tolerance before confirmation.",
          },
          {
            title: "Review the summary and confirm",
            description:
              "The swap summary shows you the exchange rate, estimated output, price impact, slippage tolerance, and estimated network fee. Review these carefully, especially the price impact for larger trades. If everything looks correct, click 'Confirm Swap'. The transaction is broadcast immediately and typically confirms within seconds on Solana.",
          },
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        tip: "For large swaps, consider breaking the trade into 2-3 smaller swaps over a few minutes. This reduces price impact and often results in a better average rate.",
      },
      {
        heading: "Understanding price impact",
        content:
          "Price impact is the effect your swap has on the market price of the token. For small swaps in highly liquid pairs (like SOL/USDC), the price impact is negligible — often less than 0.01%. For larger swaps or tokens with thin liquidity (less total liquidity in the DEX pools), your trade itself can move the price significantly.\n\nFor example, if you're swapping a large amount of a low-cap token, your trade might consume a significant portion of the available liquidity at the current price, causing the remaining tokens to be purchased at progressively worse rates. This results in you receiving fewer tokens than the simple calculation of amount times price would suggest.\n\nPexly shows you the estimated price impact before you confirm. If the impact is above 5%, consider splitting your trade into smaller portions over time, or checking if there's better liquidity for this pair on a specific network.",
        warning: "A price impact above 15% is very high and typically indicates either very thin liquidity or that you've made an input error. Double-check your amounts before confirming a swap with high price impact.",
      },
      {
        heading: "Understanding slippage tolerance",
        content:
          "On busy networks, there can be a gap between when you submit your swap and when it's actually executed on-chain. During this time, the price can move. Slippage tolerance is your way of telling the smart contract how much price movement you're willing to accept.\n\nIf the price moves beyond your slippage tolerance before the transaction executes, the transaction will automatically revert (fail) and your tokens will be returned to your wallet. You'll still pay the network gas fee for the failed transaction attempt, but your tokens are safe.\n\nA slippage of 0.5% means if the price moves more than 0.5% against you between submission and execution, the swap fails. For stable pairs (USDC/USDT), 0.1% is usually sufficient. For ETH or SOL, 0.5-1% is standard. For smaller cap tokens with more volatility, 1-3% may be needed. For very small cap tokens, some users set 5%+ to ensure execution — but be aware that higher slippage also means you're more vulnerable to sandwich attacks by MEV bots.",
        tip: "If your swap keeps failing, try increasing slippage by 0.5% increments until it succeeds. If it still fails at 3%+, there may be insufficient liquidity for that pair at that size, or the token may have transfer restrictions.",
      },
      {
        heading: "What to do when a swap fails",
        content:
          "Swap failures are common and almost always non-damaging to your funds — your tokens stay in your wallet and only the network fee is consumed. Here's how to diagnose the most common failure reasons:",
        steps: [
          {
            title: "Price moved beyond slippage tolerance",
            description:
              "The most common reason for swap failures. Increase your slippage tolerance by 0.5-1% and try again. If the token is particularly volatile, you may need 2-3% slippage.",
          },
          {
            title: "Insufficient funds for gas",
            description:
              "You need the network's native token to pay gas fees — SOL for Solana transactions, ETH for Ethereum transactions, etc. If your gas balance is zero or very low, the transaction can't be broadcast. Make sure you always have a small reserve of the native token on any network you're swapping on.",
          },
          {
            title: "Token transfer restrictions",
            description:
              "Some tokens have built-in transfer taxes, maximum wallet holding limits, or trading restrictions. These can cause swaps to revert even when everything else looks correct. Check the token's documentation or official website to understand any restrictions before attempting the swap.",
          },
          {
            title: "Liquidity pool exhausted",
            description:
              "For very illiquid tokens, the liquidity pool may not have enough tokens to fill your order at any reasonable price. Try splitting your trade into smaller amounts, or check if the token has better liquidity on a different network or exchange.",
          },
        ],
      },
    ],
    related: ["buy-tokens", "send-tokens", "staking-guide"],
  },
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const supportCategories: Record<string, SupportCategory> = {
  "get-started": {
    slug: "get-started",
    title: "Get started",
    description: "Create your Pexly wallet, customize your accounts, and learn about the key features.",
    articleSlugs: [
      "get-started-with-pexly",
      "create-wallet",
      "receive-tokens",
      "send-tokens",
      "get-help",
    ],
  },
  "shop": {
    slug: "shop",
    title: "Shop",
    description: "Buy products with crypto or sell your own items in the Pexly marketplace.",
    articleSlugs: ["shop-guide", "sell-on-pexly", "buy-tokens", "send-tokens"],
  },
  "account-settings": {
    slug: "account-settings",
    title: "Account and settings",
    description: "Manage your wallets, account names, recovery phrases, privacy, and device settings.",
    articleSlugs: ["two-factor-authentication", "security-tips", "get-help"],
  },
  "buy-sell": {
    slug: "buy-sell",
    title: "Buy and sell tokens",
    description: "Use on-ramps and off-ramps to buy, sell, or withdraw tokens — and fix common purchase issues.",
    articleSlugs: ["buy-tokens", "send-tokens", "receive-tokens", "swap-guide"],
  },
  "apps": {
    slug: "apps",
    title: "Apps",
    description: "Connect Pexly to apps, manage your connection settings, and troubleshoot connections.",
    articleSlugs: ["get-started-with-pexly", "security-tips"],
  },
  "security": {
    slug: "security",
    title: "Security",
    description: "Protect your wallet from scams, phishing, and hacks — plus tips on staying safe.",
    articleSlugs: ["scam-recovery", "security-tips", "two-factor-authentication"],
  },
  "staking": {
    slug: "staking",
    title: "Staking",
    description: "Use liquid staking with PSOL or stake SOL natively to earn rewards.",
    articleSlugs: ["staking-guide", "get-started-with-pexly"],
  },
  "trading": {
    slug: "trading",
    title: "Trading",
    description: "Swap, bridge, or trade tokens — plus understand gas, slippage, and trade execution.",
    articleSlugs: ["swap-guide", "buy-tokens", "send-tokens"],
  },
};

export const promotedArticleSlugs = [
  "get-started-with-pexly",
  "create-wallet",
  "receive-tokens",
  "shop-guide",
  "send-tokens",
  "buy-tokens",
  "get-help",
  "scam-recovery",
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Is Pexly safe? Do you hold my funds?",
    answer:
      "Pexly is non-custodial, meaning we never hold your funds or have access to your private keys. Your private keys are generated locally on your device, encrypted with your password, and never transmitted to our servers. The only way to access your wallet is through your password and recovery phrase — both of which only you have. We strongly recommend enabling two-factor authentication and keeping a secure offline backup of your recovery phrase.",
  },
  {
    question: "What is a recovery phrase and why do I need it?",
    answer:
      "Your recovery phrase (also called a seed phrase) is a set of 12 or 24 words that acts as the master key to your wallet. It can restore full access to your wallet and all your funds on any compatible app if you lose your device, forget your password, or need to move your wallet. Write it down on paper and store it in a secure offline location. Never store it digitally — in photos, cloud storage, or messaging apps. Anyone who has your recovery phrase has complete access to your funds.",
  },
  {
    question: "How long does a deposit take to arrive?",
    answer:
      "It depends on the network. Solana transactions confirm in under 5 seconds. Ethereum transactions take 30 seconds to 3 minutes under normal conditions. Bitcoin transactions typically require 1 to 3 confirmations, which takes 10 to 40 minutes. If you're depositing from an exchange, the exchange itself adds processing time on top of the network confirmation time — this varies by exchange but is usually 10 to 60 minutes.",
  },
  {
    question: "Can I reverse or cancel a transaction?",
    answer:
      "No. Blockchain transactions are final once confirmed. This is a fundamental property of all blockchain networks and neither Pexly nor anyone else can reverse a confirmed transaction. Before sending any amount, always double-check the recipient address, the network, and the amount. For large transfers, send a small test amount first and confirm it arrives before sending the remainder.",
  },
  {
    question: "What should I do if I sent crypto to the wrong address?",
    answer:
      "If the transaction hasn't been broadcast yet, you can cancel it. If it's already confirmed on-chain, unfortunately the funds cannot be recovered through Pexly. If you sent to an address that belongs to an exchange, contact that exchange immediately with the transaction hash — they may be able to credit the funds to the correct account. If you sent to a random unknown address, the funds are most likely permanently inaccessible.",
  },
  {
    question: "Why is my on-ramp card payment being declined?",
    answer:
      "Most card declines for crypto purchases are initiated by your bank, not by Pexly. Banks often block crypto transactions by default as a fraud prevention measure. Contact your bank and ask them to allow crypto transactions from your card. Some banks require you to confirm the transaction via their mobile app in real-time. If you've confirmed with your bank and the card still doesn't work, try a different card or use a bank transfer instead.",
  },
  {
    question: "What is slippage and why did my swap fail?",
    answer:
      "Slippage is the maximum price movement you're willing to accept between when you submit a swap and when it executes on-chain. If the price moves beyond your slippage tolerance before the transaction confirms, the swap automatically fails and your tokens are returned safely to your wallet (you only lose the small network fee). To fix this, increase your slippage tolerance in the swap settings — try increasing by 0.5% at a time. For volatile tokens, 1-3% slippage is often needed.",
  },
  {
    question: "How do I report a scam or suspicious account?",
    answer:
      "If you've been scammed or encountered a suspicious user, contact us immediately at support@pexly.app with all evidence: screenshots of communications, wallet addresses, transaction hashes, and a timeline of what happened. The sooner you report, the better. Also file a report with your local financial crime authority. Remember: Pexly support will never contact you first through social media DMs, and will never ask for your recovery phrase, password, or remote access to your device.",
  },
  {
    question: "What are the fees on Pexly?",
    answer:
      "Pexly charges different fees depending on the service. Trading fees are shown in the order confirmation screen before you execute. Swap fees are typically 0.1-0.3% of the swap value and are included in the quoted rate. On-ramp (buying crypto with card/bank) fees vary by payment method and are shown before you confirm. Network gas fees are charged by the blockchain (not by Pexly) and vary by network and congestion. We always show the complete, all-in fee breakdown before you confirm any transaction.",
  },
  {
    question: "Can I use Pexly in my country?",
    answer:
      "Pexly is available in most countries worldwide. Some features — particularly the on-ramp (buying crypto with fiat), KYC verification, and certain trading pairs — may be restricted or unavailable in specific jurisdictions due to local regulations. The app will show you which features are available in your region when you sign up. If a feature you need is unavailable, contact support to understand your options.",
  },
];

// ─── Status data ──────────────────────────────────────────────────────────────

export type StatusLevel = "operational" | "degraded" | "outage";

export interface ServiceStatus {
  name: string;
  status: StatusLevel;
  note?: string;
}

export const platformStatus: {
  overall: StatusLevel;
  lastChecked: string;
  services: ServiceStatus[];
} = {
  overall: "operational",
  lastChecked: "Just now",
  services: [
    { name: "Wallet and balances", status: "operational" },
    { name: "Token swaps", status: "operational" },
    { name: "On-ramp (Buy Crypto)", status: "operational" },
    { name: "Staking", status: "operational" },
    { name: "Shop and marketplace", status: "operational" },
    { name: "Blockchain explorer", status: "operational" },
    { name: "Trading", status: "operational" },
  ],
};

// ─── Trending articles ────────────────────────────────────────────────────────

export const trendingArticles = [
  { slug: "scam-recovery",            title: "What to do if I was scammed",           views: "12.4k" },
  { slug: "create-wallet",            title: "Create a new Pexly wallet",              views: "9.8k"  },
  { slug: "two-factor-authentication",title: "Setting up two-factor authentication",   views: "8.1k"  },
  { slug: "send-tokens",              title: "Send tokens from Pexly",                 views: "7.3k"  },
  { slug: "swap-guide",               title: "How to swap tokens on Pexly",            views: "6.9k"  },
];
