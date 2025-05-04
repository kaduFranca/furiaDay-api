const supabase = require('../supabase/client');

const userService = {
    async createUser(username, password) {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert({
                    username: username,
                    password: password,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    },

    async getUserByUsername(username) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    },

    async updateUserTeam(userId, team) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({
                    selected_team: team,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao atualizar time do usuário:', error);
            throw error;
        }
    }
};

module.exports = userService; 