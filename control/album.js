'use strict'

var path = require('path');
var fs = require('fs');
var mongosePaginate = require('mongoose-pagination');

var Artist = require('../model/artist');
var Album = require('../model/album');
var Song = require('../model/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!album) {
                res.status(404).send({message: 'No existe el album'});
            } else {
                res.status(200).send({album});
            }
        }
    });
}
function getAlbums(req, res) {
    var artistId = req.params.artist;
    var find;

    if (!artistId) {
        find = Album.find({}).sort('title');
    } else {
        find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!albums) {
                res.status(404).send({message: 'No hay ningún album'});
            } else {
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = paramos.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!albumStored) {
                res.status(404).send({message: 'No se ha guardado el álbum'});
            } else {
                res.status(200).send({album: albumStored});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        } else {
            if (!albumUpdated) {
                res.status(404).send({message: 'No se ha actualizado el álbum'});
            } else {
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum() {
    var albumId = req.params.id;

    Album.find({artist: albumId}).remove((err, albumRemoved) => {
        if (err){
            res.status(500).send({message:"Error al eliminar el album"});
        } else {
            if (!albumRemoved) {
                res.status(404).send({message: "El album no ha sido eliminado"});
            } else {
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err){
                        res.status(500).send({message:"Error al eliminar la canción"});
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message: "La canción no ha sido eliminada"});
                        } else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum
};