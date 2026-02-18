import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GuestbookService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    // This is the clean way to get variables in NestJS
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    // We check if they exist here so the app doesn't crash later
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is missing in .env file');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Supabase Error:', error.message);
    return data || [];
  }

  async create(dto: { name: string; message: string }) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([dto])
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return data;
  }
}