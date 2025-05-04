const supabase = require('../supabase/client');

const userService = {
    async createUser(username, password, selected_team) {
        try {
            console.log('Tentando criar usuário:', username);
            
            // Verifica se o usuário já existe
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 é o código de "não encontrado"
                throw new Error(`Erro ao verificar usuário existente: ${checkError.message}`);
            }

            if (existingUser) {
                throw new Error('Nome de usuário já está em uso');
            }
            
            const { data, error } = await supabase
                .from('users')
                .insert({
                    username: username,
                    password: password,
                    selected_team: selected_team || 'FURIA Ma'
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
            
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username);

            if (error) {
                console.error('Erro do Supabase:', JSON.stringify(error, null, 2));
                throw new Error(`Erro do Supabase: ${error.message || 'Erro desconhecido'}`);
            }

            if (!users || users.length === 0) {
                return null;
            }

            console.log('Usuário encontrado:', users[0]);
            return users[0];
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
    },

    async verifyCredentials(username, password) {
        try {
            console.log('Verificando credenciais para:', username);
            
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .eq('password', password);

            if (error) {
                throw new Error(`Erro ao verificar credenciais: ${error.message}`);
            }

            // Se não encontrou nenhum usuário ou a senha não confere
            if (!users || users.length === 0) {
                return null;
            }

            const user = users[0];
            
            // Se o selected_team for null, define como FURIA Ma
            if (!user.selected_team) {
                user.selected_team = 'FURIA Ma';
                await this.updateUserTeam(user.id, 'FURIA Ma');
            } 
            // Se o selected_team for diferente de FURIA Ma, atualiza para FURIA Ma
            else if (user.selected_team !== 'FURIA Ma') {
                user.selected_team = 'FURIA Ma';
                await this.updateUserTeam(user.id, 'FURIA Ma');
            }

            return user;
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            throw error;
        }
    }
};

module.exports = userService; 