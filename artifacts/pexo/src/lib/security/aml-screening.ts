import { createClient } from '../supabase';

const supabase = createClient();

export interface SanctionsMatch {
  list_name: string;
  entity_name: string;
  entity_type: string;
  country: string;
  match_score: number;
}

export interface ChainAnalysisResult {
  address: string;
  crypto_symbol: string;
  risk_score: number;
  risk_category: 'low' | 'medium' | 'high' | 'severe';
  exposure_to: string[];
  analyzed_at: string;
}

class AMLScreening {
  async screenUser(userId: string, fullName: string, country: string): Promise<SanctionsMatch[]> {
    // Screening now runs server-side inside screen_user_for_signup (SECURITY
    // DEFINER), so this works for logged-out signup (anon role) without
    // needing direct SELECT on sanctions_lists — which anon/authenticated no
    // longer have, to stop the raw list from being scraped via dev tools.
    const { data, error } = await supabase.rpc('screen_user_for_signup', {
      p_full_name: fullName,
      p_country: country,
    });

    if (error) throw error;

    return (data as SanctionsMatch[]) || [];
  }

  async screenAddress(
    address: string,
    crypto_symbol: string
  ): Promise<ChainAnalysisResult | null> {
    const { data, error } = await supabase
      .from('chain_analysis')
      .select('*')
      .eq('address', address)
      .eq('crypto_symbol', crypto_symbol)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async checkStructuredDeposits(userId: string): Promise<boolean> {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { data: deposits, error } = await supabase
      .from('wallet_transactions')
      .select('amount, created_at')
      .eq('user_id', userId)
      .eq('type', 'deposit')
      .gte('created_at', oneDayAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!deposits || deposits.length < 3) return false;

    // Check for structured deposits (multiple deposits just under reporting threshold)
    const THRESHOLD = 10000;
    const structuredPattern = deposits.filter(
      (d) => d.amount > THRESHOLD * 0.8 && d.amount < THRESHOLD
    );

    return structuredPattern.length >= 3;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private getEditDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  async getCountryFromIP(): Promise<string> {
    try {
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_code || 'US';
    } catch (error) {
      console.error('Failed to get country from IP:', error);
      return 'US'; // Default to US if detection fails
    }
  }

  async logAMLEvent(
    userId: string,
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any
  ): Promise<void> {
    try {
      await supabase.from('security_logs').insert({
        user_id: userId,
        event_type: eventType,
        severity,
        details,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log AML event:', error);
    }
  }
}

export const amlScreening = new AMLScreening();
