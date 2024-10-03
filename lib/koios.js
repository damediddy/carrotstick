import axios from 'axios';

const koiosUrl = process.env.KOIOS_URL;

const api = axios.create({
  baseURL: koiosUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getAddressUtxos(address) {
  const response = await api.post('/address_info', { _addresses: [address] });
  return response.data[0].utxo_set;
}

export async function getTxMetadata(txHash) {
  const response = await api.get(`/tx_metadata?_tx_hashes=${txHash}`);
  return response.data[0];
}

export async function getScriptUtxos(scriptAddress) {
  const response = await api.post('/address_info', { _addresses: [scriptAddress] });
  return response.data[0].utxo_set;
}

export async function getLatestBlock() {
  const response = await api.get('/tip');
  return response.data[0];
}