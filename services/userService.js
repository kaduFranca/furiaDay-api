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
                console.error('Erro do Supabase:', JSON.stringify(error, null, 2));
                throw new Error(`Erro do Supabase: ${error.message || 'Erro desconhecido'}`);
            }

            console.log('Usuário criado com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro detalhado ao criar usuário:', error.stack);
            throw new Error(`Erro ao criar usuário: ${error.message}`);
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
                console.error('Erro do Supabase:', JSON.stringify(error, null, 2));
                throw new Error(`Erro do Supabase: ${error.message || 'Erro desconhecido'}`);
            }

            console.log('Usuário encontrado:', data);
            return data;
        } catch (error) {
            console.error('Erro detalhado ao buscar usuário:', error.stack);
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
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
                console.error('Erro do Supabase:', JSON.stringify(error, null, 2));
                throw new Error(`Erro do Supabase: ${error.message || 'Erro desconhecido'}`);
            }

            console.log('Time atualizado com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro detalhado ao atualizar time:', error.stack);
            throw new Error(`Erro ao atualizar time: ${error.message}`);
        }
    }
};

module.exports = userService; 