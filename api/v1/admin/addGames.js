const express = require('express');
const multer  = require('multer')
const upload = multer()

const { getConnection, getGame, addGame } = require("../../../libs/mysql.js")

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file.buffer.toString().replace(/"/g, "");
    const lines = file.split("\n");
    const fields = lines[0].split(";");

    const assoc = {
        'ID': 'id',
        'Titre': 'title',
        'Sous-titre': 'subtitle',
        'Édition': 'edition',
        'Type': 'type',
        'Joueur(s)': 'players',
        'Durée': 'duration',
        'Age(s)': 'ages',
        'Langues': 'language',
        'Univers': 'universe',
        'Gamme(s)': 'ranges',
        'Catégorie(s)': "categories",
        'Thème(s)': 'themes',
        'Mécanisme(s)': 'mecanisms',
        'Éditeur(s)': 'editor',
        'Auteur(s)': 'authors',
        'Illustrateur(s)': 'illustrators'
    }

    const positions = {}
    for (i = 0; i < fields.length; i++) {
        if (assoc[fields[i]]) {
            positions[assoc[fields[i]]] = i;
        }
    }

    const games = []
    for (i = 1; i < lines.length; i++) {
        games.push(lines[i].split(";"))
    }

    const connection = await getConnection();
    games.forEach(async game => {
        const game_db = await getGame(connection, game[positions['id']]);

        if (!game_db[0]) {
            addGame(connection, 
                    game[positions['id']], 
                    game[positions['title']], 
                    game[positions['subtitle']] ? game[positions['subtitle']] : "NULL", 
                    game[positions['edition']] ? game[positions['edition']] : "NULL", 
                    game[positions['type']] ? game[positions['type']] : "NULL", 
                    game[positions['players']] ? game[positions['players']] : "NULL", 
                    game[positions['duration']] ? game[positions['duration']] : "NULL", 
                    game[positions['ages']] ? game[positions['ages']] : "NULL", 
                    game[positions['language']] ? game[positions['language']] : "NULL", 
                    game[positions['universe']] ? game[positions['universe']] : "NULL", 
                    game[positions['ranges']] ? game[positions['ranges']] : "NULL", 
                    game[positions['categories']] ? game[positions['categories']] : "NULL", 
                    game[positions['themes']] ? game[positions['themes']] : "NULL", 
                    game[positions['mecanisms']] ? game[positions['mecanisms']] : "NULL", 
                    game[positions['editor']], 
                    game[positions['authors']], 
                    game[positions['illustrators']])
        }
    })
    //connection.end();

    res.status(200).send({message: "success"});
});

module.exports = router;