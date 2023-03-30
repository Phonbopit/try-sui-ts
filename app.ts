import {
  JsonRpcProvider,
  TransactionBlock,
  Connection,
  RawSigner,
  Ed25519Keypair,
} from '@mysten/sui.js'

import dotenv from 'dotenv'
dotenv.config()

const addresses = {
  johnDoe: '0x03b67b6c52dac0f4c5e06c1b217476e0c08884e482c397377a765ad835d4477a',
  chuckNorris:
    '0x751d379edda810e5e27ff34e81c8fbb0fbc2e4ea143432ebf09360735e325600',
}

const MNEMONIC: string = process.env.MNEMONIC || ''

const getProvider = async () => {
  const testnetConnection = new Connection({
    fullnode: 'https://fullnode.testnet.sui.io',
  })

  const provider = new JsonRpcProvider(testnetConnection)
  return provider
}

const getOwnedObject = async () => {
  const provider = await getProvider()

  const objects = await provider.getOwnedObjects({
    owner: addresses.johnDoe,
  })

  console.log('objects', objects.data)

  const objectIds = objects.data.map((data) => data.data?.objectId)
  await getObjects(objectIds as string[])
}

const getObjects = async (ids: string[]) => {
  if (!ids) return null

  const provider = await getProvider()
  const txns = await provider.multiGetObjects({
    ids,
    options: { showType: true },
  })

  console.log('txns', txns)
}

const transfer = async (to: string) => {
  const provider = await getProvider()

  const keypair = Ed25519Keypair.deriveKeypair(MNEMONIC)

  const signer = new RawSigner(keypair, provider)
  const tx = new TransactionBlock()
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(100)])
  tx.transferObjects([coin], tx.pure(to))
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
  })
  console.log({ result })
}

const start = async () => {
  // await getOwnedObject()
  await transfer(addresses.chuckNorris)
}

start()
  .then()
  .catch((err) => console.log(err))
