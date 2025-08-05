# File Hash Verifier dApp - Demo Guide

## Overview

This dApp demonstrates a blockchain-based file integrity verification system using the Aptos network. It allows users to store file hashes on the blockchain and verify file integrity against those stored records.

## Features Demonstrated

### 1. File Hash Storage

- Upload any file type
- Calculate SHA-256 hash client-side
- Store hash immutably on Aptos blockchain
- Associate file metadata (name, uploader, timestamp)

### 2. File Integrity Verification

- Upload file for verification
- Compare against stored blockchain records
- Detect file tampering or corruption
- Track verification count

### 3. Blockchain Integration

- Move smart contracts on Aptos
- Wallet integration with multiple wallet types
- Real-time blockchain interaction
- Event emission for audit trail

## Smart Contract Functions

### Storage Functions

- `store_file_hash(file_name, file_hash)` - Store a new file hash
- `verify_file_hash(file_name, file_hash)` - Verify file against stored hash

### View Functions

- `get_all_files()` - Retrieve all stored file records
- `get_file_by_name(file_name)` - Get specific file record
- `file_exists(file_name)` - Check if file exists
- `get_total_files()` - Get count of stored files

## Demo Steps

### Prerequisites

1. Install an Aptos wallet (Petra, Martian, etc.)
2. Get testnet APT from faucet
3. Connect wallet to the dApp

### Demo Flow

#### Step 1: Store a File Hash

1. Click "Store File Hash" section
2. Select any file from your computer
3. Note the calculated SHA-256 hash
4. Click "Store Hash on Blockchain"
5. Approve the transaction in your wallet
6. Observe the file appears in "Stored Files" list

#### Step 2: Verify File Integrity

1. Click "Verify File Hash" section
2. Upload the SAME file you just stored
3. Enter the exact filename
4. Click "Verify File Integrity"
5. See success message confirming file authenticity

#### Step 3: Test Tampering Detection

1. Modify the original file (edit text, change image, etc.)
2. Try to verify the modified file
3. Observe failure message indicating tampering

#### Step 4: Explore Stored Files

1. View all stored files in the bottom section
2. See file metadata: hash, uploader, timestamp
3. Note verification counts increase with each check

## Technical Highlights

### Client-Side Security

- Files never leave your computer
- Only SHA-256 hashes are stored on blockchain
- Client-side hash calculation using Web Crypto API

### Blockchain Features

- Immutable storage using Aptos Move
- Event emission for audit trails
- Efficient vector-based storage
- Gas-optimized smart contracts

### User Experience

- Responsive design with Tailwind CSS
- Real-time feedback and notifications
- Wallet integration with multiple providers
- Error handling and user guidance

## Use Cases

### Document Integrity

- Legal documents
- Contracts and agreements
- Academic papers
- Software releases

### File Authenticity

- Digital certificates
- Software downloads
- Media files
- Configuration files

### Audit Trails

- Compliance documentation
- Version control
- Change tracking
- Forensic evidence

## Development Features

### Smart Contract

- Written in Move language
- Comprehensive unit tests
- Error handling and validations
- Event emission for logging

### Frontend

- React with TypeScript
- Aptos TS SDK integration
- Modern UI with shadcn/ui
- Responsive design

### DevOps

- Vite for fast development
- Automated deployment scripts
- Environment configuration
- Testing framework

## Testing the Smart Contract

The dApp includes comprehensive Move unit tests:

```bash
npm run move:test
```

Tests cover:

- File hash storage
- Verification logic
- Error conditions
- Edge cases

## Deployment

### Local Development

```bash
npm install
npm run dev
```

### Contract Deployment

```bash
npm run move:compile
npm run move:publish
```

### Production Deployment

```bash
npm run build
npm run deploy
```

## Security Considerations

### What's Secure

- Client-side hash calculation
- Immutable blockchain storage
- Wallet-signed transactions
- No file content exposure

### Limitations

- Filename privacy (stored as plaintext)
- Gas costs for storage
- Testnet reliability
- Wallet dependency

## Future Enhancements

### Technical

- IPFS integration for file storage
- Multiple hash algorithm support
- Batch operations
- Mobile app version

### Features

- File sharing permissions
- Timestamping services
- Multi-signature verification
- Integration APIs

## Conclusion

This dApp demonstrates the power of blockchain technology for file integrity verification. By combining client-side cryptography with immutable blockchain storage, it provides a trustworthy way to verify file authenticity without exposing sensitive content.

The Aptos blockchain provides fast, low-cost transactions with a modern smart contract language (Move) that enables safe and efficient implementation of such verification systems.
