import { supabase } from './supabase';

export interface Note {
    id: number;
    title: string;
    user_id: string;
    created_at?: string;
}

export const notesService = {
    async getNotes(userId: string) {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('id', { ascending: false });

        if (error) throw error;
        return data as Note[];
    },

    async addNote(title: string, userId: string) {
        const { data, error } = await supabase
            .from('notes')
            .insert([{ title, user_id: userId }])
            .select();

        if (error) throw error;
        return data[0] as Note;
    },

    async deleteNote(id: number, userId: string) {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
    }
};
