# File Hash Verifier dApp

A blockchain-based file integrity verification system built on the Aptos network. This dApp allows users to store file hashes on the blockchain and verify file integrity by comparing uploaded files against stored hashes.

## Features

- **File Hash Storage**: Upload files and store their SHA-256 hashes on the Aptos blockchain
- **File Integrity Verification**: Verify files against stored blockchain records to detect tampering
- **Immutable Records**: All file hashes are stored immutably on the blockchain
- **Verification Tracking**: Track how many times each file has been verified
- **User-Friendly Interface**: Clean, responsive UI built with React and Tailwind CSS

## How It Works

1. **Store File Hash**: Users upload a file, the system calculates its SHA-256 hash, and stores it on the blockchain
2. **Verify File**: Users can upload a file and verify its integrity against stored blockchain records
3. **Immutable Audit Trail**: All storage and verification events are recorded on the blockchain

## Smart Contract Features

The Move smart contract (`file_hash_verifier.move`) provides:

- `store_file_hash()` - Store a file hash with metadata on the blockchain
- `verify_file_hash()` - Verify a file hash against stored records
- `get_all_files()` - Retrieve all stored file records
- `get_file_by_name()` - Get specific file record by name
- `get_total_files()` - Get total count of stored files

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Blockchain**: Aptos Move smart contracts
- **Wallet Integration**: Aptos Wallet Adapter
- **Development Tools**: Aptos TS SDK, Node.js
## Screenshots
<img width="1919" height="1085" alt="Screenshot 2025-08-05 154542" src="https://github.com/user-attachments/assets/07ee0819-51f2-4d98-bcd9-1d2e5fdb38c7" />

<img width="1914" height="1073" alt="Screenshot 2025-08-05 154639" src="https://github.com/user-attachments/assets/cacc1105-a5a2-4bd1-86ff-49eeb1b46f23" />

## Contract Address

0x1b9f6c6be32302f53ad0b8fa2c511929dbe1b9736f1ee97cf350382de99b8813

## GettingStarted

### Prerequisites

- Node.js (v16 or later)
- An Aptos wallet (Petra, Martian, etc.)
- Aptos CLI (optional, for contract development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/HarishRajavarapu/FileHashVerifier
cd filehashverifier
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file and set your configuration.

4. Compile and publish the Move contract:

```bash
npm run move:compile
npm run move:publish
```

5. Update the `VITE_MODULE_ADDRESS` in your `.env` file with the deployed contract address.

6. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run move:publish` - Publish the Move contract to the Aptos network
- `npm run move:test` - Run Move unit tests
- `npm run move:compile` - Compile the Move contract
- `npm run move:upgrade` - Upgrade the Move contract
- `npm run dev` - Start the frontend development server
- `npm run build` - Build the frontend for production
- `npm run deploy` - Deploy the dApp to Vercel

## Usage

1. **Connect Wallet**: Connect your Aptos wallet using the wallet selector
2. **Store File Hash**:
   - Click "Store File Hash"
   - Select a file to upload
   - The system will calculate the SHA-256 hash
   - Click "Store Hash on Blockchain" to save it
3. **Verify File**:
   - Click "Verify File Hash"
   - Select the file you want to verify
   - Enter the original filename
   - Click "Verify File Integrity"
   - The system will compare against blockchain records

## Security Considerations

- Files are not uploaded to the blockchain - only their SHA-256 hashes
- Hash calculations are performed client-side using the Web Crypto API
- All blockchain transactions are signed by the user's wallet
- Smart contract events provide an immutable audit trail

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
