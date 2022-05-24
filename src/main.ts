import { AnchorProvider, Program } from '@project-serum/anchor'
import { Wallet } from '@project-serum/anchor'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

const HEDGE_ADDRESS = new PublicKey(
  'HedgeEohwU6RqokrvPU4Hb6XKPub8NuKbnPmY7FoMMtN',
)

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
  const program = await Program.at(HEDGE_ADDRESS, provider)

  program.addEventListener('DepositVaultEvent', (event) => {
    console.log('Hey Notifi, this vault had a deposit:', event)
    console.log(JSON.stringify(event))
  })
  program.addEventListener('LiquidateVaultEvent', (event) => {
    console.log('Hey Notifi, this vault was liquidated:', event)
    console.log(JSON.stringify(event))
  })
}

hello()
attach()
