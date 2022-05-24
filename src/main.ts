import { AnchorProvider, Program } from '@project-serum/anchor'
import { Wallet } from '@project-serum/anchor'
import { Connection, Keypair } from '@solana/web3.js'
import { HEDGE_PROGRAM_PUBLICKEY, IDL, Vault } from 'hedge-web3'

import base58 from 'bs58'

async function hello() {
  console.log('Hello Notifi')
}
async function attach() {
  const finalizeConnection = new Connection(
    'https://api.mainnet-beta.solana.com',
    'confirmed',
  )
  const wallet = new Wallet(Keypair.generate())
  const provider = new AnchorProvider(finalizeConnection, wallet, {
    commitment: 'confirmed',
  })
  const program = new Program<Vault>(IDL, HEDGE_PROGRAM_PUBLICKEY, provider)

  program.addEventListener('DepositVaultEvent', (event) => {
    console.log('Hey Notifi, this vault had a deposit:', event)
    console.log(JSON.stringify(event))
    fetchOpenStabilityPoolPositions(program).then((positions) => {
      positions.forEach((position) => {
        console.log(
          'Send a notification to:',
          position.account.ownerAccount.toString(),
        )
      })
      console.log(`Attempted to notifi ${positions.length} people.`)
    })
  })
  program.addEventListener('LiquidateVaultEvent', (event) => {
    console.log('Hey Notifi, this vault was liquidated:', event)
    console.log(JSON.stringify(event))
  })
}

async function fetchOpenStabilityPoolPositions(program: Program<Vault>) {
  const positions = await program.account.liquidationPosition.all([
    // Filter on Open positions: 1_u64
    {
      memcmp: {
        bytes: base58.encode(Buffer.from([0])),
        offset: 8 + 32 * 2 + (16 * (128 * 2 + 3) + 8 * 4),
      },
    },
  ])
  return positions
}
hello()
attach()
