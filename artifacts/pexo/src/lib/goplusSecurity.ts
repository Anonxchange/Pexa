import { supabase } from "./supabase";
// Chain ID mapping for GoPlus API
export const GOPLUS_CHAINS: Record<string, string> = {
  ethereum: '1',
  bsc: '56',
  polygon: '137',
  avalanche: '43114',
  arbitrum: '42161',
  optimism: '10',
  base: '8453',
  solana: 'solana',
  fantom: '250',
  cronos: '25',
  gnosis: '100',
  linea: '59144',
  scroll: '534352',
  zksync: '324',
  tron: 'tron',
};

export interface TokenSecurityResult {
  isOpenSource: boolean;
  isProxy: boolean;
  isMintable: boolean;
  isHoneypot: boolean;
  buyTax: string;
  sellTax: string;
  transferPausable: boolean;
  isBlacklisted: boolean;
  canTakeBackOwnership: boolean;
  ownerChangeBalance: boolean;
  hiddenOwner: boolean;
  selfDestruct: boolean;
  slippageModifiable: boolean;
  tokenName: string;
  tokenSymbol: string;
  holderCount: string;
  totalSupply: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  risks: string[];
}

export interface AddressSecurityResult {
  isMaliciousAddress: boolean;
  maliciousType: string | null;
  isContract: boolean;
  riskLevel: 'safe' | 'warning' | 'danger';
  details: Record<string, unknown>;
}

export interface ApprovalSecurityResult {
  riskLevel: 'low' | 'medium' | 'high';
  risks: string[];
  details: Record<string, unknown>;
}

async function invokeGoPlus(payload: Record<string, string | undefined>) {
  const { data, error } = await supabase.functions.invoke('goplus-security', {
    body: payload,
  });

  if (error) throw new Error(error.message || 'GoPlus API call failed');
  if (data?.error) throw new Error(data.error);
  return data?.data;
}

// Analyze token risks
function assessTokenRisks(tokenData: Record<string, string>): { riskLevel: TokenSecurityResult['riskLevel']; risks: string[] } {
  const risks: string[] = [];

  if (tokenData.is_honeypot === '1') risks.push('🚨 Honeypot detected – cannot sell');
  if (tokenData.is_open_source === '0') risks.push('⚠️ Contract is not open source');
  if (tokenData.is_proxy === '1') risks.push('⚠️ Proxy contract – can be modified');
  if (tokenData.is_mintable === '1') risks.push('⚠️ Tokens can be minted');
  if (tokenData.can_take_back_ownership === '1') risks.push('⚠️ Ownership can be reclaimed');
  if (tokenData.owner_change_balance === '1') risks.push('🚨 Owner can change balances');
  if (tokenData.hidden_owner === '1') risks.push('🚨 Hidden owner detected');
  if (tokenData.selfdestruct === '1') risks.push('🚨 Contract can self-destruct');
  if (tokenData.transfer_pausable === '1') risks.push('⚠️ Transfers can be paused');
  if (tokenData.is_blacklisted === '1') risks.push('⚠️ Blacklist function exists');
  if (tokenData.slippage_modifiable === '1') risks.push('⚠️ Tax rate can be modified');
  if (tokenData.personal_slippage_modifiable === '1') risks.push('⚠️ Per-address tax can be set');
  if (tokenData.trading_cooldown === '1') risks.push('ℹ️ Trading cooldown enabled');
  if (tokenData.cannot_buy === '1') risks.push('🚨 Token cannot be bought');
  if (tokenData.cannot_sell_all === '1') risks.push('⚠️ Cannot sell all tokens at once');
  if (tokenData.gas_abuse === '1') risks.push('🚨 Gas abuse detected');

  const buyTax = parseFloat(tokenData.buy_tax || '0');
  const sellTax = parseFloat(tokenData.sell_tax || '0');
  if (buyTax > 0.1) risks.push(`⚠️ High buy tax: ${(buyTax * 100).toFixed(1)}%`);
  if (sellTax > 0.1) risks.push(`⚠️ High sell tax: ${(sellTax * 100).toFixed(1)}%`);

  let riskLevel: TokenSecurityResult['riskLevel'] = 'low';
  const criticalRisks = risks.filter(r => r.startsWith('🚨')).length;
  const warningRisks = risks.filter(r => r.startsWith('⚠️')).length;

  if (criticalRisks > 0) riskLevel = 'critical';
  else if (warningRisks >= 3) riskLevel = 'high';
  else if (warningRisks >= 1) riskLevel = 'medium';

  return { riskLevel, risks };
}

export async function checkTokenSecurity(chainId: string, contractAddress: string): Promise<TokenSecurityResult> {
  const response = await invokeGoPlus({
    action: 'token_security',
    chainId,
    contractAddress: contractAddress.toLowerCase(),
  });

  const result = response?.result;
  const tokenData = result?.[contractAddress.toLowerCase()] || result?.[contractAddress] || {};

  const { riskLevel, risks } = assessTokenRisks(tokenData);

  return {
    isOpenSource: tokenData.is_open_source === '1',
    isProxy: tokenData.is_proxy === '1',
    isMintable: tokenData.is_mintable === '1',
    isHoneypot: tokenData.is_honeypot === '1',
    buyTax: tokenData.buy_tax || '0',
    sellTax: tokenData.sell_tax || '0',
    transferPausable: tokenData.transfer_pausable === '1',
    isBlacklisted: tokenData.is_blacklisted === '1',
    canTakeBackOwnership: tokenData.can_take_back_ownership === '1',
    ownerChangeBalance: tokenData.owner_change_balance === '1',
    hiddenOwner: tokenData.hidden_owner === '1',
    selfDestruct: tokenData.selfdestruct === '1',
    slippageModifiable: tokenData.slippage_modifiable === '1',
    tokenName: tokenData.token_name || '',
    tokenSymbol: tokenData.token_symbol || '',
    holderCount: tokenData.holder_count || '0',
    totalSupply: tokenData.total_supply || '0',
    riskLevel,
    risks,
  };
}

export async function checkAddressSecurity(address: string, chainId?: string): Promise<AddressSecurityResult> {
  const response = await invokeGoPlus({
    action: 'address_security',
    address,
    chainId,
  });

  const result = response?.result || {};

  const isMalicious =
    result.cybercrime === '1' ||
    result.money_laundering === '1' ||
    result.number_of_malicious_contracts_created > 0 ||
    result.financial_crime === '1' ||
    result.darkweb_transactions === '1' ||
    result.phishing_activities === '1' ||
    result.fake_kyc === '1' ||
    result.blacklist_doubt === '1' ||
    result.stealing_attack === '1' ||
    result.blackmail_activities === '1' ||
    result.sanctioned === '1' ||
    result.malicious_mining_activities === '1' ||
    result.mixer === '1' ||
    result.honeypot_related_address === '1';

  let maliciousType: string | null = null;
  if (result.cybercrime === '1') maliciousType = 'cybercrime';
  else if (result.money_laundering === '1') maliciousType = 'money_laundering';
  else if (result.phishing_activities === '1') maliciousType = 'phishing';
  else if (result.stealing_attack === '1') maliciousType = 'stealing_attack';
  else if (result.sanctioned === '1') maliciousType = 'sanctioned';
  else if (result.honeypot_related_address === '1') maliciousType = 'honeypot_related';

  return {
    isMaliciousAddress: isMalicious,
    maliciousType,
    isContract: result.contract_address === '1',
    riskLevel: isMalicious ? 'danger' : 'safe',
    details: result,
  };
}

export async function checkApprovalSecurity(chainId: string, contractAddress: string): Promise<ApprovalSecurityResult> {
  const response = await invokeGoPlus({
    action: 'approval_security',
    chainId,
    contractAddress: contractAddress.toLowerCase(),
  });

  const result = response?.result || {};
  const risks: string[] = [];

  // Parse approval-specific risks from result
  if (result.is_contract === '0') risks.push('⚠️ Not a contract address');
  if (result.doubt_list === '1') risks.push('🚨 Address is on doubt list');
  if (result.is_open_source === '0') risks.push('⚠️ Contract is not open source');

  let riskLevel: ApprovalSecurityResult['riskLevel'] = 'low';
  if (risks.some(r => r.startsWith('🚨'))) riskLevel = 'high';
  else if (risks.length > 0) riskLevel = 'medium';

  return { riskLevel, risks, details: result };
}

// Combined pre-transaction security check
export async function preTransactionCheck(params: {
  chainId: string;
  toAddress: string;
  contractAddress?: string;
}): Promise<{
  safe: boolean;
  addressCheck: AddressSecurityResult;
  tokenCheck?: TokenSecurityResult;
  warnings: string[];
}> {
  const warnings: string[] = [];

  // Always check destination address
  const addressCheck = await checkAddressSecurity(params.toAddress, params.chainId);
  if (addressCheck.isMaliciousAddress) {
    warnings.push(`🚨 Destination address flagged: ${addressCheck.maliciousType || 'malicious'}`);
  }

  // Check token if contract address provided
  let tokenCheck: TokenSecurityResult | undefined;
  if (params.contractAddress) {
    tokenCheck = await checkTokenSecurity(params.chainId, params.contractAddress);
    warnings.push(...tokenCheck.risks);
  }

  const safe = !addressCheck.isMaliciousAddress &&
    (!tokenCheck || tokenCheck.riskLevel !== 'critical');

  return { safe, addressCheck, tokenCheck, warnings };
}
