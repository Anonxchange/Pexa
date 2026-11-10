
import { createClient } from '../supabase';

const supabase = createClient();

export interface DeviceFingerprint {
  id: string;
  user_id: string;
  fingerprint_hash: string;
  device_info: {
    platform?: string;
    userAgent?: string;
    screen?: string;
    language?: string;
    timezone?: string;
    plugins?: string[];
    device_type?: 'mobile' | 'tablet' | 'laptop' | 'desktop';
  };
  ip_address: string | null;
  trusted: boolean;
  last_seen_at: string;
  created_at: string;
}

export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';

class DeviceFingerprintManager {
  private async generateFingerprint(): Promise<string> {
    const components = [];

    components.push(navigator.platform);
    components.push(navigator.language);
    
    components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
    
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    components.push(screen.availWidth.toString());
    components.push(screen.availHeight.toString());
    components.push(navigator.hardwareConcurrency?.toString() || 'unknown');
    components.push((navigator as any).deviceMemory?.toString() || 'unknown');
    components.push(navigator.maxTouchPoints?.toString() || '0');

    const fingerprint = components.join('|||');
    return await this.hashString(fingerprint);
  }

  private async generateBrowserAwareFingerprint(): Promise<string> {
    const components = [];

    components.push(navigator.userAgent);
    components.push(navigator.platform);
    components.push(navigator.language);
    
    components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
    
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      components.push(canvas.toDataURL());
    }

    const fingerprint = components.join('|||');
    return await this.hashString(fingerprint);
  }

  private async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async getCurrentFingerprint(): Promise<string> {
    return await this.generateFingerprint();
  }

  private detectDeviceType(): DeviceType {
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    if (ua.includes('ipad') || ua.includes('tablet')) {
      return 'tablet';
    }
    if (platform.includes('mac') || ua.includes('macintosh')) {
      return 'laptop';
    }
    if (ua.includes('windows') || ua.includes('linux')) {
      // Could be laptop or desktop, check screen size as hint
      if (screen.width <= 1920 && screen.height <= 1080 && window.matchMedia('(pointer: coarse)').matches) {
        return 'laptop';
      }
      return 'desktop';
    }
    return 'desktop';
  }

  async registerDevice(userId: string): Promise<DeviceFingerprint> {
    if (!userId) {
      throw new Error('User ID is required to register a device');
    }

    const fingerprint = await this.generateFingerprint();
    
    let ip = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const data = await ipResponse.json();
      ip = data.ip;
    } catch (error) {
      console.warn('Could not fetch IP address:', error);
    }

    const deviceInfo = {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      device_type: this.detectDeviceType(),
    };

    const now = new Date().toISOString();

    // First check if the device already exists
    const { data: existingDevice } = await supabase
      .from('device_fingerprints')
      .select('*')
      .eq('user_id', userId)
      .eq('fingerprint_hash', fingerprint)
      .maybeSingle();

    if (existingDevice) {
      // Device already exists, update it
      const { data, error } = await supabase
        .from('device_fingerprints')
        .update({
          device_info: deviceInfo,
          ip_address: ip,
          last_seen_at: now,
        })
        .eq('id', existingDevice.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating existing device:', error);
        throw error;
      }
      return data;
    }

    // Device doesn't exist, insert new one
    const { data, error } = await supabase
      .from('device_fingerprints')
      .insert({
        user_id: userId,
        fingerprint_hash: fingerprint,
        device_info: deviceInfo,
        ip_address: ip,
        trusted: false,
        last_seen_at: now,
        created_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering device:', error);
      throw error;
    }
    return data;
  }

  async getDevices(userId: string): Promise<DeviceFingerprint[]> {
    if (!userId) {
      throw new Error('User ID is required to get devices');
    }

    const { data, error } = await supabase
      .from('device_fingerprints')
      .select('*')
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async trustDevice(userId: string, deviceId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required to trust a device');
    }

    const { error } = await supabase
      .from('device_fingerprints')
      .update({ trusted: true })
      .eq('id', deviceId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async revokeDevice(userId: string, deviceId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required to revoke a device');
    }

    const { error } = await supabase
      .from('device_fingerprints')
      .delete()
      .eq('id', deviceId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async trustDevicesByType(userId: string, deviceTypes: DeviceType[]): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required to trust devices by type');
    }

    const devices = await this.getDevices(userId);
    const deviceIdsToTrust = devices
      .filter(device => deviceTypes.includes(device.device_info.device_type as DeviceType))
      .map(device => device.id);

    if (deviceIdsToTrust.length === 0) return;

    const { error } = await supabase
      .from('device_fingerprints')
      .update({ trusted: true })
      .in('id', deviceIdsToTrust)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getDevicesByType(userId: string, deviceType: DeviceType): Promise<DeviceFingerprint[]> {
    if (!userId) {
      throw new Error('User ID is required to get devices by type');
    }

    const devices = await this.getDevices(userId);
    return devices.filter(device => device.device_info.device_type === deviceType);
  }

  async isDeviceTrusted(userId: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const fingerprint = await this.generateFingerprint();

    const { data, error } = await supabase
      .from('device_fingerprints')
      .select('trusted')
      .eq('user_id', userId)
      .eq('fingerprint_hash', fingerprint)
      .single();

    if (error || !data) return false;
    return data.trusted;
  }

  async checkDeviceStatus(userId: string): Promise<{ exists: boolean; trusted: boolean; device: DeviceFingerprint | null }> {
    console.log('[DeviceFingerprint] checkDeviceStatus called for userId:', userId);
    
    if (!userId) {
      console.log('[DeviceFingerprint] No userId provided, returning untrusted');
      return { exists: false, trusted: false, device: null };
    }

    const fingerprint = await this.generateFingerprint();
    console.log('[DeviceFingerprint] Generated fingerprint:', fingerprint.substring(0, 16) + '...');

    const { data, error } = await supabase
      .from('device_fingerprints')
      .select('*')
      .eq('user_id', userId)
      .eq('fingerprint_hash', fingerprint)
      .maybeSingle();

    console.log('[DeviceFingerprint] Query result - data:', data, 'error:', error);

    if (error) {
      console.log('[DeviceFingerprint] Error querying device_fingerprints table:', error.message);
      return { exists: false, trusted: false, device: null };
    }
    
    if (!data) {
      console.log('[DeviceFingerprint] No device found with this fingerprint - device is NEW');
      return { exists: false, trusted: false, device: null };
    }

    console.log('[DeviceFingerprint] Device found - trusted:', data.trusted);
    return { exists: true, trusted: data.trusted, device: data };
  }

  async sendDeviceVerificationEmail(email: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });
    return { error };
  }

  async verifyDeviceOTP(email: string, token: string): Promise<{ error: any; data: any }> {
    const { error, data } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return { error, data };
  }

  async updateLastSeen(userId: string): Promise<void> {
    if (!userId) return;

    const fingerprint = await this.generateFingerprint();

    await supabase
      .from('device_fingerprints')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('fingerprint_hash', fingerprint);
  }

  async registerDeviceAsTrusted(userId: string): Promise<DeviceFingerprint> {
    if (!userId) {
      throw new Error('User ID is required to register a device');
    }

    const fingerprint = await this.generateFingerprint();
    
    let ip = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const data = await ipResponse.json();
      ip = data.ip;
    } catch (error) {
      console.warn('Could not fetch IP address:', error);
    }

    const deviceInfo = {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      device_type: this.detectDeviceType(),
    };

    const now = new Date().toISOString();

    const { data: existingDevice } = await supabase
      .from('device_fingerprints')
      .select('*')
      .eq('user_id', userId)
      .eq('fingerprint_hash', fingerprint)
      .maybeSingle();

    if (existingDevice) {
      const { data, error } = await supabase
        .from('device_fingerprints')
        .update({
          device_info: deviceInfo,
          ip_address: ip,
          last_seen_at: now,
          trusted: true,
        })
        .eq('id', existingDevice.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating existing device:', error);
        throw error;
      }
      return data;
    }

    const { data, error } = await supabase
      .from('device_fingerprints')
      .insert({
        user_id: userId,
        fingerprint_hash: fingerprint,
        device_info: deviceInfo,
        ip_address: ip,
        trusted: true,
        last_seen_at: now,
        created_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering device as trusted:', error);
      throw error;
    }
    return data;
  }

  async registerOrUpdateDevice(userId: string): Promise<DeviceFingerprint | null> {
    if (!userId) return null;

    try {
      const fingerprint = await this.generateFingerprint();
      
      let ip = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const data = await ipResponse.json();
        ip = data.ip;
      } catch (error) {
        console.warn('Could not fetch IP address:', error);
      }

      const deviceInfo = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        device_type: this.detectDeviceType(),
      };

      const now = new Date().toISOString();

      const { data: existingDevice } = await supabase
        .from('device_fingerprints')
        .select('*')
        .eq('user_id', userId)
        .eq('fingerprint_hash', fingerprint)
        .maybeSingle();

      if (existingDevice) {
        const { data, error } = await supabase
          .from('device_fingerprints')
          .update({
            device_info: deviceInfo,
            ip_address: ip,
            last_seen_at: now,
          })
          .eq('id', existingDevice.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating existing device:', error);
          return null;
        }
        return data;
      }

      const { data, error } = await supabase
        .from('device_fingerprints')
        .insert({
          user_id: userId,
          fingerprint_hash: fingerprint,
          device_info: deviceInfo,
          ip_address: ip,
          trusted: false,
          last_seen_at: now,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error('Error registering device:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error in registerOrUpdateDevice:', error);
      return null;
    }
  }
}

export const deviceFingerprint = new DeviceFingerprintManager();
