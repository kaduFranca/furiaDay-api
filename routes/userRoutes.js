const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Rota para criar um novo usuário
router.post('/create', async (req, res) => {
    try {
        const { username, password, selected_team } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Nome de usuário e senha são obrigatórios' 
            });
        }

        const user = await userService.createUser(username, password, selected_team);
        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: user.id,
                username: user.username,
                selected_team: user.selected_team
            }
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        
        if (error.message === 'Nome de usuário já está em uso') {
            return res.status(409).json({ 
                error: 'Nome de usuário já está em uso'
            });
        }
        
        res.status(500).json({ 
            error: 'Erro ao criar usuário',
            details: error.message 
        });
    }
});

// Rota para buscar um usuário
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userService.getUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ 
                error: 'Usuário não encontrado' 
            });
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                selected_team: user.selected_team
            }
        });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar usuário',
            details: error.message 
        });
    }
});

// Rota para login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Nome de usuário e senha são obrigatórios' 
            });
        }

        const user = await userService.verifyCredentials(username, password);
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Credenciais inválidas' 
            });
        }

        // Retorna os dados do usuário (sem a senha) para o frontend
        res.json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                username: user.username,
                selected_team: user.selected_team
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ 
            error: 'Erro ao fazer login',
            details: error.message 
        });
    }
});

module.exports = router; 