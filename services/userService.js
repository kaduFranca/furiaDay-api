const supabase = require('../supabase/client');

const userService = {
    async createUser(username, password) {
        try {
            console.log('Tentando criar usuário:', username);
            
            const { data, error } = await supabase
                .from('users')
                .insert({
                    username: username,
                    password: password
                })
                .select()
                .single();

            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }

            console.log('Usuário criado com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro detalhado ao criar usuário:', error);
            throw error;
        }
    },

    async getUserByUsername(username) {
        try {
            console.log('Buscando usuário:', username);
            
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }

            console.log('Usuário encontrado:', data);
            return data;
        } catch (error) {
            console.error('Erro detalhado ao buscar usuário:', error);
            throw error;
        }
    },

    async updateUserTeam(userId, team) {
        try {
            console.log('Atualizando time do usuário:', userId, team);
            
            const { data, error } = await supabase
                .from('users')
                .update({
                    selected_team: team
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }

            console.log('Time atualizado com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro detalhado ao atualizar time:', error);
            throw error;
        }
    }
};

module.exports = userService; 